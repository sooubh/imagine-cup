'use server';

import { azureAIService, StockInsight } from '@/services/AzureAIService';
import { StockItem } from '@/lib/azureDefaults';

export async function getDashboardInsightAction(inventoryCtx: string | StockItem[]): Promise<StockInsight> {
    return await azureAIService.getDashboardInsight(inventoryCtx);
}

export async function getWasteAnalysisAction(items: StockItem[]): Promise<StockInsight> {
    const analysis = await azureAIService.getWasteAnalysis(items);
    return analysis;
}

export async function chatWithDataAction(message: string, context: string): Promise<string> {
    return await azureAIService.chatWithData(message, context);
}
