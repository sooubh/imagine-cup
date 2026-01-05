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

export async function getTipsAndSuggestionsAction(items: StockItem[]): Promise<StockInsight[]> {
    return await azureAIService.getTipsAndSuggestions(items);
}

export async function getSmartAlertsAction(criticalItems: StockItem[]): Promise<StockInsight[]> {
    return await azureAIService.getSmartAlerts(criticalItems);
}

export async function getPredictiveInsightsAction(items: StockItem[]): Promise<{
    inventoryValue: { trend: string; prediction: string };
    stockCoverage: { trend: string; prediction: string };
    topRisks: string[];
}> {
    return await azureAIService.getPredictiveInsights(items);
}

export async function getComprehensiveInsightsAction(
    items: StockItem[],
    storeData?: any[]
): Promise<{
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
    return await azureAIService.getComprehensiveInsights(items, storeData);
}
