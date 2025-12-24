'use server';

import { azureAIService } from '@/services/AzureAIService';

// Start a chat with data
export async function chatWithDataAction(userMessage: string, context: string) {
    try {
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
