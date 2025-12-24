import OpenAI from "openai";

// Interface for AI response
export interface StockInsight {
    sentiment: "positive" | "negative" | "neutral" | "critical";
    summary: string;
    actionableSuggestion: string;
    affectedItems?: string[];
}

export class AzureAIService {
    private client: OpenAI | null = null;
    private deploymentName: string = "";

    constructor() {
        this.initializeClient();
    }

    private initializeClient() {
        const endpoint = process.env.AZURE_OPENAI_ENDPOINT?.replace(/\/+$/, ""); // Remove trailing slash
        const apiKey = process.env.AZURE_OPENAI_API_KEY;
        this.deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "";

        if (endpoint && apiKey && this.deploymentName) {
            // Check for placeholders
            if (endpoint.includes("YOUR_") || apiKey.includes("your_") || this.deploymentName.includes("your_")) {
                console.warn("⚠️ Azure OpenAI Credentials appear to be placeholders. Please update .env.local with your actual keys.");
                return;
            }

            try {
                this.client = new OpenAI({
                    apiKey: apiKey,
                    baseURL: `${endpoint}/openai/deployments/${this.deploymentName}`,
                    defaultQuery: { "api-version": "2024-02-15-preview" },
                    defaultHeaders: { "api-key": apiKey },
                });
                console.log("✅ Azure OpenAI Client Initialized");
            } catch (error) {
                console.error("❌ Failed to initialize Azure OpenAI Client", error);
            }
        } else {
            console.warn("⚠️ Azure OpenAI Credentials missing. AI features will use mock data.");
        }
    }

    // Generate a quick insight for the dashboard banner
    async getDashboardInsight(inventoryCtx: string): Promise<StockInsight> {
        if (!this.client) this.initializeClient();

        if (!this.client) {
            return this.getMockInsight();
        }

        try {
            const prompt = `
            You are an AI inventory analyst. Analyze the following inventory data summary and provide a SINGLE, critical insight.
            Data: ${inventoryCtx}
            
            Return JSON only:
            {
                "sentiment": "critical" | "warning" | "positive",
                "summary": "Short headline description",
                "actionableSuggestion": "One clear action to take",
                "affectedItems": ["List", "Of", "Items"]
            }
            `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a helpful inventory assistant that outputs JSON only." },
                    { role: "user", content: prompt }
                ],
                model: this.deploymentName,
                response_format: { type: "json_object" },
                temperature: 0.3,
            });

            const content = completion.choices[0].message.content;
            if (content) {
                return JSON.parse(content) as StockInsight;
            }
            throw new Error("Empty response from AI");

        } catch (error) {
            console.error("Azure AI Error:", error);
            return this.getMockInsight();
        }
    }

    // Chat with data
    async chatWithData(userMessage: string, context: string): Promise<string> {
        if (!this.client) this.initializeClient();

        if (!this.client) {
            return "I am currently in offline mode. Please configure Azure OpenAI credentials to chat with your real data.";
        }

        try {
            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: `You are a helpful inventory assistant. Answer based on this data: ${context}. Keep answers brief and professional.` },
                    { role: "user", content: userMessage }
                ],
                model: this.deploymentName,
                temperature: 0.5,
            });
            return completion.choices[0].message.content || "I couldn't process that.";
        } catch (error: any) {
            console.error("Chat Error:", error);
            return `Connection Error: ${error.message || "Unknown error"}. Check your .env.local configuration.`;
        }
    }

    private getMockInsight(): StockInsight {
        return {
            sentiment: "critical",
            summary: "5 critical medicines likely to run out in 6 days across 3 locations.",
            actionableSuggestion: "Re-route stock from District Warehouse A to cover the deficit.",
            affectedItems: ["Surgical Masks", "Antibiotics"]
        };
    }
}

export const azureAIService = new AzureAIService();
