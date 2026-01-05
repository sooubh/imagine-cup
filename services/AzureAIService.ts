import OpenAI from "openai";
import { SYSTEM_PROMPT } from "@/lib/aiContext";

// Interface for AI response
export interface StockInsight {
    sentiment: "positive" | "negative" | "neutral" | "critical" | "warning";
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
                    defaultQuery: { "api-version": "2025-01-01-preview" },
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
    async getDashboardInsight(inventoryCtx: string | any[]): Promise<StockInsight> {
        if (!this.client) this.initializeClient();

        let contextString = "";
        if (Array.isArray(inventoryCtx)) {
            contextString = inventoryCtx.map(i => {
                let statusTag = '';
                if (i.quantity <= (i.minQuantity || 10)) statusTag = '[CRITICAL]';
                else if (i.quantity < 50) statusTag = '[Low]';
                if (i.expiryDate && new Date(i.expiryDate) < new Date()) statusTag += ' [EXPIRED]';
                return `- ${i.name}: ${i.quantity} units ${statusTag}`;
            }).join('\n');
        } else {
            contextString = inventoryCtx;
        }

        if (!this.client) {
            return this.generateOfflineInsight(contextString);
        }

        try {
            // Enhanced prompt for "AI-First" decision making
            const prompt = `
            You are an expert AI Supply Chain Manager. Your goal is to optimize inventory and prevent stockouts.
            
            Analyze the following inventory snapshot and Identify the SINGLE most critical action.
            Prioritize: 
            1. "Critical" stock (< 10 units) -> Suggest Reorder.
            2. "Expired" items -> Suggest Removal.
            3. "Overstock" -> Suggest Sale/Promotion.
            
            Data Snapshot:
            ${contextString.substring(0, 5000)} ... (truncated if long)

            Return JSON:
            {
                "sentiment": "critical" | "warning" | "positive" | "neutral",
                "summary": "Urgent: [Item] is critically low",
                "actionableSuggestion": "Create PO for 50 units from [Vendor]",
                "affectedItems": ["Item Name"]
            }
            `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a precise JSON-only inventory assistant." },
                    { role: "user", content: prompt }
                ],
                model: this.deploymentName,
                response_format: { type: "json_object" },
                temperature: 0.2, // Lower temp for more deterministic actions
            });

            const content = completion.choices[0].message.content;
            if (content) {
                return JSON.parse(content) as StockInsight;
            }
            throw new Error("Empty response from AI");

        } catch (error) {
            console.error("Azure AI Error:", error);
            return this.generateOfflineInsight(contextString);
        }
    }

    async getWasteAnalysis(inventoryItems: any[]): Promise<StockInsight> {
        if (!this.client) this.initializeClient();

        // Filter for risky items to save tokens
        const riskyItems = inventoryItems.filter(i => {
            if (!i.expiryDate) return false;
            const daysToExpiry = Math.ceil((new Date(i.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return daysToExpiry < 60; // Check items expiring in next 60 days or already expired
        }).map(i => `${i.name} (${i.quantity} units) - Expires in ${Math.ceil((new Date(i.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days`);

        if (riskyItems.length === 0) {
            return {
                sentiment: "positive",
                summary: "No immediate waste risks detected.",
                actionableSuggestion: "Continue monitoring expiry dates safely.",
                affectedItems: []
            };
        }

        const contextString = riskyItems.join('\n');

        if (!this.client) {
            return {
                sentiment: "warning",
                summary: `${riskyItems.length} items are nearing expiry or expired.`,
                actionableSuggestion: "Review the expiry list and discount items expiring soon.",
                affectedItems: [] // Can't easily parse back in offline mode without logic
            };
        }

        try {
            const prompt = `
            You are a Sustainability & Waste Reduction Expert.
            Analyze these items nearing expiry and suggest the best waste reduction strategy.
            
            Options:
            - "Discount" for items expiring in 30-60 days.
            - "Donate" for items expiring in 7-30 days.
            - "Dispose" for expired items.

            Items:
            ${contextString}

            Return JSON:
            {
                "sentiment": "warning" | "critical",
                "summary": "Key insight about wastage risk (e.g. 'High risk of medicine wastage')",
                "actionableSuggestion": "Specific action (e.g. 'Run 50% off sale for [Item]')",
                "affectedItems": ["Item 1", "Item 2"]
            }
            `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a waste management expert. JSON output only." },
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
            console.error("Azure AI Waste Analysis Error:", error);
            return {
                sentiment: "neutral",
                summary: "Ai Service Unavailable for Waste Analysis",
                actionableSuggestion: "Manually review expiring items.",
                affectedItems: []
            };
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
                    { role: "system", content: `${SYSTEM_PROMPT}\n\nData Context:\n${context}` },
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


    // Generate AI-powered tips and suggestions
    async getTipsAndSuggestions(inventoryItems: any[]): Promise<StockInsight[]> {
        if (!this.client) this.initializeClient();

        const contextString = inventoryItems.slice(0, 30).map(i => {
            let statusTag = '';
            if (i.quantity <= (i.minQuantity || 10)) statusTag = '[CRITICAL]';
            else if (i.quantity < 50) statusTag = '[Low]';
            if (i.expiryDate && new Date(i.expiryDate) < new Date()) statusTag += ' [EXPIRED]';
            return `- ${i.name}: ${i.quantity} units, Price: $${i.price} ${statusTag}`;
        }).join('\n');

        const lowStockCount = inventoryItems.filter(i => i.quantity < 10).length;
        const totalValue = inventoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (!this.client) {
            // Offline fallback tips
            return [
                {
                    sentiment: "positive",
                    summary: "Use AI Insights for Better Decisions",
                    actionableSuggestion: "Enable AI to get predictive analytics and automated reorder suggestions based on usage patterns.",
                    affectedItems: []
                },
                lowStockCount > 5 ? {
                    sentiment: "warning",
                    summary: `${lowStockCount} Items Running Low`,
                    actionableSuggestion: "Consider bulk reordering to save time and potentially get volume discounts.",
                    affectedItems: []
                } : null,
                {
                    sentiment: "neutral",
                    summary: "Track Weekly Trends",
                    actionableSuggestion: "Monitor inventory patterns to identify seasonal demands and optimize stock levels.",
                    affectedItems: []
                },
                totalValue > 50000 ? {
                    sentiment: "neutral",
                    summary: `High-Value Inventory: ₹${totalValue.toLocaleString()}`,
                    actionableSuggestion: "Monitor premium items closely to prevent stockouts and maintain customer satisfaction.",
                    affectedItems: []
                } : null
            ].filter(Boolean) as StockInsight[];
        }

        try {
            const prompt = `
            You are a retail optimization expert. Analyze this inventory and provide 4 different actionable tips.
            
            Categories for tips:
            1. "Efficiency" - Process improvements
            2. "Cost Saving" - Financial optimization
            3. "Waste Reduction" - Sustainability
            4. "Customer Service" - Availability improvements
            
            Inventory Data:
            ${contextString}
            
            Summary: ${inventoryItems.length} items, Total Value: ₹${totalValue}, Low Stock Items: ${lowStockCount}
            
            Return JSON array with 4 tips:
            [
                {
                    "sentiment": "positive" | "warning" | "neutral",
                    "summary": "Brief tip title (max 60 chars)",
                    "actionableSuggestion": "Specific action to take (max 120 chars)",
                    "affectedItems": ["relevant item names if any"]
                }
            ]
            `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a retail operations expert. Return JSON array only." },
                    { role: "user", content: prompt }
                ],
                model: this.deploymentName,
                response_format: { type: "json_object" },
                temperature: 0.6,
            });

            const content = completion.choices[0].message.content;
            if (content) {
                const result = JSON.parse(content);
                // Handle both array and object with tips property
                return Array.isArray(result) ? result : (result.tips || [result]);
            }
            throw new Error("Empty response from AI");

        } catch (error) {
            console.error("Azure AI Tips Error:", error);
            // Return offline fallback
            return this.getTipsAndSuggestions(inventoryItems);
        }
    }

    // Generate AI-powered smart alerts with priority
    async getSmartAlerts(criticalItems: any[]): Promise<StockInsight[]> {
        if (!this.client) this.initializeClient();

        if (criticalItems.length === 0) {
            return [];
        }

        const contextString = criticalItems.map(i =>
            `- ${i.name}: ${i.quantity} units (${i.category || 'General'}), Price: $${i.price}`
        ).join('\n');

        if (!this.client) {
            // Offline fallback
            return criticalItems.slice(0, 5).map(item => ({
                sentiment: "critical" as const,
                summary: `${item.name} is critically low`,
                actionableSuggestion: `Reorder ${Math.max(50, item.quantity * 5)} units immediately to prevent stockout.`,
                affectedItems: [item.name]
            }));
        }

        try {
            const prompt = `
            You are a supply chain expert. Analyze these critical/low stock items and create smart alerts.
            
            For each item, provide:
            - Priority assessment (critical vs warning)
            - Specific reorder suggestion with quantity
            - Business impact if not addressed
            
            Critical Items:
            ${contextString}
            
            Return JSON array (max 5 alerts, prioritized by urgency):
            [
                {
                    "sentiment": "critical" | "warning",
                    "summary": "Item name and issue (max 50 chars)",
                    "actionableSuggestion": "Specific action with quantity and urgency",
                    "affectedItems": ["item name"]
                }
            ]
            `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a supply chain expert. Return JSON array only." },
                    { role: "user", content: prompt }
                ],
                model: this.deploymentName,
                response_format: { type: "json_object" },
                temperature: 0.3,
            });

            const content = completion.choices[0].message.content;
            if (content) {
                const result = JSON.parse(content);
                return Array.isArray(result) ? result : (result.alerts || [result]);
            }
            throw new Error("Empty response from AI");

        } catch (error) {
            console.error("Azure AI Alerts Error:", error);
            return this.getSmartAlerts(criticalItems);
        }
    }

    // Generate comprehensive insights for insights page
    async getComprehensiveInsights(inventoryItems: any[], storeData?: any[]): Promise<{
        healthScore: number;
        criticalIssues: string[];
        opportunities: string[];
        topPerformers?: string[];
        needsAttention?: string[];
        predictions: {
            item: string;
            predictedDemand: number;
            confidence: number;
        }[];
        recommendations: {
            category: 'cost-saving' | 'efficiency' | 'risk-mitigation';
            title: string;
            description: string;
            impact: string;
        }[];
    }> {
        if (!this.client) this.initializeClient();

        const totalValue = inventoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const lowStockCount = inventoryItems.filter(i => i.quantity < 10).length;
        const expiringCount = inventoryItems.filter(i => {
            if (!i.expiryDate) return false;
            const days = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            return days >= 0 && days <= 30;
        }).length;

        // Offline fallback
        if (!this.client) {
            return {
                healthScore: lowStockCount > 10 ? 60 : 85,
                criticalIssues: [
                    lowStockCount > 0 ? `${lowStockCount} items critically low` : '',
                    expiringCount > 0 ? `${expiringCount} items expiring soon` : ''
                ].filter(Boolean),
                opportunities: [
                    'Implement automated reordering',
                    'Optimize stock levels based on demand'
                ],
                predictions: inventoryItems.slice(0, 5).map(i => ({
                    item: i.name,
                    predictedDemand: Math.round(i.quantity * 0.3),
                    confidence: 0.75
                })),
                recommendations: [
                    {
                        category: 'efficiency',
                        title: 'Enable AI Insights',
                        description: 'Configure Azure OpenAI for personalized recommendations',
                        impact: 'High'
                    }
                ]
            };
        }

        try {
            const contextString = inventoryItems.slice(0, 50).map(i => {
                let tags = [];
                if (i.quantity <= 10) tags.push('[LOW]');
                if (i.expiryDate) {
                    const days = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                    if (days <= 7) tags.push('[EXPIRING]');
                }
                return `${i.name}: ${i.quantity} units, $${i.price} ${tags.join(' ')}`;
            }).join('\n');

            const prompt = `
            You are an inventory optimization expert. Analyze this comprehensive inventory data and provide strategic insights.
            
            Inventory Summary:
            - Total Items: ${inventoryItems.length}
            - Total Value: $${totalValue}
            - Low Stock Items: ${lowStockCount}
            - Items Expiring (30 days): ${expiringCount}
            ${storeData ? `- Number of Stores: ${storeData.length}` : ''}
            
            Sample Items:
            ${contextString}
            
            Provide analysis in JSON format:
            {
                "healthScore": 0-100 (overall inventory health),
                "criticalIssues": ["issue 1", "issue 2", "issue 3"],
                "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3"],
                ${storeData ? '"topPerformers": ["store 1", "store 2"],' : ''}
                ${storeData ? '"needsAttention": ["store 1"],' : ''}
                "predictions": [
                    {
                        "item": "item name",
                        "predictedDemand": estimated units needed next 30 days,
                        "confidence": 0.0-1.0
                    }
                ],
                "recommendations": [
                    {
                        "category": "cost-saving" | "efficiency" | "risk-mitigation",
                        "title": "brief title",
                        "description": "actionable description",
                        "impact": "Low" | "Medium" | "High"
                    }
                ]
            }
            
            Focus on: cost optimization, waste reduction, stockout prevention, and efficiency improvements.
            `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are an inventory optimization expert. Return JSON only." },
                    { role: "user", content: prompt }
                ],
                model: this.deploymentName,
                response_format: { type: "json_object" },
                temperature: 0.4,
            });

            const content = completion.choices[0].message.content;
            if (content) {
                return JSON.parse(content);
            }
            throw new Error("Empty response from AI");

        } catch (error) {
            console.error("Azure AI Comprehensive Insights Error:", error);
            return this.getComprehensiveInsights(inventoryItems, storeData);
        }
    }

    // Generate predictive insights for metrics
    async getPredictiveInsights(inventoryItems: any[]): Promise<{
        inventoryValue: { trend: string; prediction: string };
        stockCoverage: { trend: string; prediction: string };
        topRisks: string[];
    }> {
        if (!this.client) this.initializeClient();

        const totalValue = inventoryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const lowStockCount = inventoryItems.filter(i => i.quantity < 10).length;
        const healthyPercent = Math.round((inventoryItems.filter(i => i.quantity > 10).length / inventoryItems.length) * 100);

        if (!this.client) {
            // Offline fallback
            return {
                inventoryValue: {
                    trend: "stable",
                    prediction: "Maintain current levels"
                },
                stockCoverage: {
                    trend: healthyPercent > 70 ? "positive" : "concerning",
                    prediction: healthyPercent > 70 ? "Good coverage" : "Need restocking"
                },
                topRisks: lowStockCount > 5 ? [`${lowStockCount} items critically low`] : ["No major risks"]
            };
        }

        try {
            const prompt = `
            Analyze this inventory and predict trends:
            
            Total Items: ${inventoryItems.length}
            Total Value: ₹${totalValue}
            Low Stock Items: ${lowStockCount}
            Stock Coverage: ${healthyPercent}%
            
            Provide predictions for:
            1. Inventory value trend (increasing/decreasing/stable)
            2. Stock coverage forecast
            3. Top 2-3 risks to watch
            
            Return JSON:
            {
                "inventoryValue": {
                    "trend": "increasing" | "decreasing" | "stable",
                    "prediction": "Brief forecast (max 40 chars)"
                },
                "stockCoverage": {
                    "trend": "improving" | "declining" | "stable",
                    "prediction": "Brief forecast (max 40 chars)"
                },
                "topRisks": ["risk 1", "risk 2"]
            }
            `;

            const completion = await this.client.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a predictive analytics expert. Return JSON only." },
                    { role: "user", content: prompt }
                ],
                model: this.deploymentName,
                response_format: { type: "json_object" },
                temperature: 0.4,
            });

            const content = completion.choices[0].message.content;
            if (content) {
                return JSON.parse(content);
            }
            throw new Error("Empty response from AI");

        } catch (error) {
            console.error("Azure AI Predictions Error:", error);
            return this.getPredictiveInsights(inventoryItems);
        }
    }

    private generateOfflineInsight(context: string): StockInsight {
        // Parsing context. Context might be JSON or plain text depending on caller.
        // We need to detect what KIND of data this is.
        // Sales data usually has "Transaction" or "Revenue". Inventory has "Stock" or "Quantity".

        let sentiment: StockInsight['sentiment'] = 'neutral';
        let summary = " Analyzing local data...";
        let suggestion = "Review the detailed table below.";

        try {
            const lowerCtx = context.toLowerCase();

            // --- SALES DATA ANALYSIS ---
            if (lowerCtx.includes('transaction') || lowerCtx.includes('revenue') || lowerCtx.includes('sale')) {
                // Mock analysis for Sales strings
                const salesCount = (context.match(/Sale/gi) || []).length + (context.match(/Transaction/gi) || []).length;
                if (salesCount > 5) {
                    sentiment = 'positive';
                    summary = `High Activity: ~${salesCount} transactions recorded recently.`;
                    suggestion = "Ensure top-selling items are restocked immediately.";
                } else {
                    sentiment = 'neutral';
                    summary = `Steady Sales Activity.`;
                    suggestion = "Consider running a promotion to boost sales.";
                }
                return { sentiment, summary, actionableSuggestion: suggestion, affectedItems: [] };
            }

            // --- INVENTORY DATA ANALYSIS (Default) ---
            // Look for [CRITICAL], [Low], [EXPIRED] markers
            let criticalCount = 0;
            let warningCount = 0;
            let expiredCount = 0;
            let totalItems = 0;
            const criticalItems: string[] = [];

            const lines = context.split('\n');
            lines.forEach(line => {
                if (line.includes('[CRITICAL')) {
                    criticalCount++;
                    const match = line.match(/- (.*?):/);
                    if (match && match[1]) criticalItems.push(match[1]);
                } else if (line.includes('[Low]') || line.includes('[EXPIRING SOON]')) {
                    warningCount++;
                } else if (line.includes('[EXPIRED]')) {
                    expiredCount++;
                }
                if (line.trim().startsWith('- ')) {
                    totalItems++;
                }
            });

            if (criticalCount > 0) {
                return {
                    sentiment: "critical",
                    summary: `⚠️ Attention: ${criticalCount} items are critically low.`,
                    actionableSuggestion: `Reorder: ${criticalItems.slice(0, 3).join(', ')}...`,
                    affectedItems: criticalItems
                };
            } else if (expiredCount > 0) {
                return {
                    sentiment: "critical",
                    summary: `Waste Alert: ${expiredCount} items have expired.`,
                    actionableSuggestion: "Remove expired stock immediately.",
                    affectedItems: []
                };
            } else {
                return {
                    sentiment: "positive",
                    summary: `Inventory Health is Good (${totalItems} items).`,
                    actionableSuggestion: "Maintain current stock levels.",
                    affectedItems: []
                };
            }

        } catch (e) {
            console.warn("Failed to parse offline context", e);
            return {
                sentiment: "neutral",
                summary: "System Online. Data available.",
                actionableSuggestion: "Check reports for details.",
                affectedItems: []
            };
        }
    }
}

export const azureAIService = new AzureAIService();
