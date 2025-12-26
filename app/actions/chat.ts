'use server';

import OpenAI from 'openai';
import { azureService } from '@/lib/azureDefaults';
import { getInventoryContext, SYSTEM_PROMPT } from '@/lib/aiContext';
import { cookies } from 'next/headers';
import { getUser } from '@/lib/auth';

// Initialize OpenAI Client
// Supports both Standard OpenAI and Azure OpenAI based on env vars
const openai = new OpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "dummy",
    baseURL: process.env.AZURE_OPENAI_ENDPOINT ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-35-turbo'}` : undefined,
    defaultQuery: process.env.AZURE_OPENAI_ENDPOINT ? { 'api-version': '2023-05-15' } : undefined,
    defaultHeaders: process.env.AZURE_OPENAI_ENDPOINT ? { 'api-key': process.env.AZURE_OPENAI_API_KEY } : undefined,
});

export async function chatWithLedgerBot(userMessage: string) {
    try {
        // 1. Get User Context (to know which section's data to fetch)
        const cookieStore = await cookies();
        const userId = cookieStore.get('simulated_user_id')?.value;
        const user = userId ? getUser(userId) : null;
        const section = user?.section || 'Hospital'; // Default to Hospital if unknown

        // 2. Fetch Real-time Data
        // Optimization: In a real app, maybe don't fetch *everything* every chat. 
        // But for this prototype, having full context is impressive.
        const [items, activities] = await Promise.all([
            azureService.getAllItems(section),
            azureService.getRecentActivities(section, 10)
        ]);

        // 3. Build Context String
        const contextData = getInventoryContext(items, activities);

        // 4. Call AI
        // 4. Call AI with Fallback
        // If no key, return simulation to prevent crash
        const hasKeys = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY;

        if (!hasKeys) {
            console.warn("LedgerBot: No API keys found. Defaulting to Simulation Mode.");
            return generateSimulationResponse(items, section, userMessage);
        }

        try {
            const completion = await openai.chat.completions.create({
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "system", content: `CURRENT USER: ${user?.name || 'Guest'} (${user?.role || 'Viewer'}). SECTION: ${section}` },
                    { role: "system", content: contextData },
                    { role: "user", content: userMessage }
                ],
                model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME || process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-35-turbo",
                temperature: 0.7,
                max_tokens: 300
            } as any);

            return { reply: completion.choices[0].message.content || "I'm not sure how to answer that." };
        } catch (apiError) {
            console.error("LedgerBot API Error (Falling back to simulation):", apiError);
            // Fallback to simulation if API fails (e.g. invalid key, rate limit, network)
            return generateSimulationResponse(items, section, userMessage);
        }

    } catch (error) {
        console.error("LedgerBot Critical Error:", error);
        return { reply: "I'm having trouble retrieving data right now. Please try again later." };
    }
}

// Helper: Generate a "Simulated" but data-aware response
function generateSimulationResponse(items: any[], section: string, query: string) {
    const lowerQuery = query.toLowerCase();
    const criticalCount = items.filter((i: any) => i.quantity <= 10).length;
    const lowCount = items.filter((i: any) => i.quantity <= 50 && i.quantity > 10).length;

    // Default Fallback
    let reply = `I'm currently in **Offline Mode** (no AI connection), but I can still check your local data for **${section}**.\n\n`;

    // 1. Stock / Inventory Status
    if (lowerQuery.includes('stock') || lowerQuery.includes('inventory') || lowerQuery.includes('count') || lowerQuery.includes('how many')) {
        reply += `Here is your current inventory summary:\n\n` +
            `- **Total Items:** ${items.length}\n` +
            `- **Critical Low:** ${criticalCount} items (Need attention)\n` +
            `- **Running Low:** ${lowCount} items\n\n` +
            `You can view the full details in the **Reports** tab.`;
    }
    // 2. Greetings
    else if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
        reply = `Hi there! 👋 I'm **LedgerBot**.\n\nI'm running in offline mode right now, but I can still help you check your **stock levels** or summarize **critical items**. Just ask!`;
    }
    // 3. Help / Capabilities
    else if (lowerQuery.includes('help') || lowerQuery.includes('what can you do')) {
        reply += `Since I'm offline, I can't answer complex questions, but I can:\n` +
            `- Summarize your stock status\n` +
            `- Count critical items\n` +
            `- Guide you to reports`;
    }
    // 4. Waste / Expiry
    else if (lowerQuery.includes('waste') || lowerQuery.includes('expiry') || lowerQuery.includes('expired')) {
        const expiredCount = items.filter((i: any) => i.status === 'EXPIRED').length; // Assuming status check or date check logic exists
        reply += `**Waste Analysis (Offline):**\n\n` +
            `- **Expired Items:** ${expiredCount} (Check Waste Report)\n` +
            `- **Overstocked:** ${items.filter((i: any) => i.quantity > 500).length} items\n\n` +
            `I recommend reviewing the **Critical Reports > Waste Reduction** tab to minimize losses.`;
    }
    // 5. Reorder / Procurement
    else if (lowerQuery.includes('reorder') || lowerQuery.includes('buy') || lowerQuery.includes('purchase')) {
        reply += `**Reorder Recommendations:**\n\n` +
            `You have **${criticalCount} critical items** that need immediate reordering.\n` +
            `Go to the **Reorder** page to generate automated Purchase Orders for these items.`;
    }
    // 6. Unknown / Fallback
    else {
        reply += `I found **${items.length} items** in your records.\n\n` +
            `**Quick Stats:**\n` +
            `- **Critical:** ${criticalCount} items\n` +
            `- **Low Stock:** ${lowCount} items\n\n` +
            `**Status:** ${criticalCount > 0 ? '⚠️ High Risk (Stock Protection Needed)' : '✅ Healthy'}\n\n` +
            `*(Note: Connect an OpenAI API Key in .env.local for full AI chat capabilities)*`;
    }

    return { reply };
}
