'use client';

import { useEffect, useState } from 'react';
import { StockInsight } from '@/services/AzureAIService';
import { getWasteAnalysisAction } from '@/app/actions/ai';
import { StockItem } from '@/lib/azureDefaults';

interface WasteReductionPanelProps {
    items: StockItem[];
}

export function WasteReductionPanel({ items }: WasteReductionPanelProps) {
    const [insight, setInsight] = useState<StockInsight | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalysis() {
            try {
                setLoading(true);
                // Only send necessary fields to save bandwidth/tokens
                const minimalItems = items.map(i => ({
                    name: i.name,
                    quantity: i.quantity,
                    expiryDate: i.expiryDate
                })) as StockItem[]; // Cast back for type compatibility if needed, or adjust action signature (taking any[] is fine)

                const response = await getWasteAnalysisAction(minimalItems);
                setInsight(response);
            } catch (e) {
                console.error("Waste Analysis Failed", e);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalysis();
    }, [items]);

    if (loading) return (
        <div className="bg-white dark:bg-[#23220f] border border-neutral-100 dark:border-neutral-800 p-6 rounded-3xl space-y-4">
            <div className="h-6 w-1/3 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded"></div>
            <div className="h-20 w-full bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded"></div>
        </div>
    );

    if (!insight) return null;

    const isCritical = insight.sentiment === 'critical' || insight.sentiment === 'warning';

    return (
        <div className={`p-6 rounded-3xl border ${isCritical ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900' : 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900'}`}>
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl shrink-0 ${isCritical ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    <span className="material-symbols-outlined">recycling</span>
                </div>
                <div>
                    <h3 className={`text-lg font-bold mb-1 ${isCritical ? 'text-red-900 dark:text-red-200' : 'text-green-900 dark:text-green-200'}`}>
                        Waste Reduction Assistant
                    </h3>
                    <p className={`font-medium mb-3 ${isCritical ? 'text-red-800 dark:text-red-300' : 'text-green-800 dark:text-green-300'}`}>
                        {insight.summary}
                    </p>
                    <div className="bg-white/80 dark:bg-black/20 p-3 rounded-lg flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                        <span className="text-sm font-semibold">{insight.actionableSuggestion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
