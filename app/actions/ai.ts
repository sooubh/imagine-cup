'use server';

import { azureAIService } from '@/services/AzureAIService';
import { azureService } from '@/lib/azureDefaults';
import { getInventoryContext } from '@/lib/aiContext';

import { cookies } from 'next/headers';
import { getUser } from '@/lib/auth';

// Start a chat with data
// Context is now auto-generated server-side for security and freshness
export async function chatWithDataAction(userMessage: string) {
    try {
        const cookieStore = await cookies();
        const userId = cookieStore.get('simulated_user_id')?.value;
        const user = userId ? getUser(userId) : null;

        let section = "Hospital"; // Default fallback
        if (user) {
            section = user.section;
        }

        // Fetch scoped data
        const items = await azureService.getAllItems(section);
        const activities = await azureService.getRecentActivities(section);

        const context = getInventoryContext(items, activities);
        const response = await azureAIService.chatWithData(userMessage, context);
        return response;
    } catch (error) {
        console.error("Action Error:", error);
        return "Sorry, I encountered an error processing your request.";
    }
}

// Get dashboard insight
export async function getDashboardInsightAction(context: string) {
    try {
        const response = await azureAIService.getDashboardInsight(context);
        return response;
    } catch (error) {
        console.error("Action Error:", error);
        return null;
    }
}
