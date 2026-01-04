'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StockItem } from '@/lib/azureDefaults';
import { getDashboardInsightAction } from '@/app/actions/ai';
import { StockInsight } from '@/services/AzureAIService';

interface AIInsightsBannerProps {
    items?: StockItem[];
}

export function AIInsightsBanner({ items = [] }: AIInsightsBannerProps) {
    const [insight, setInsight] = useState<StockInsight | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchInsight() {
            if (!items || items.length === 0) {
                setLoading(false);
                return;
            }
            try {
                // Prepare context for AI
                const contextData = items.slice(0, 50).map(i => {
                    let statusTag = '';
                    if (i.quantity <= (i.minQuantity || 10)) statusTag = '[CRITICAL]';
                    else if (i.quantity < 50) statusTag = '[Low]';
                    if (i.expiryDate && new Date(i.expiryDate) < new Date()) statusTag += ' [EXPIRED]';
                    return `- ${i.name}: ${i.quantity} units ${statusTag}`;
                }).join('\n');

                const result = await getDashboardInsightAction(contextData);
                setInsight(result);
            } catch (e) {
                console.error("Failed to fetch dashboard insight", e);
            } finally {
                setLoading(false);
            }
        }
        fetchInsight();
    }, [items]);

    if (loading) return (
        <div className="w-full h-32 bg-white dark:bg-[#1f1e0b] rounded-3xl animate-pulse border border-neutral-100 dark:border-neutral-800"></div>
    );

    if (!insight) return null;

    const isCritical = insight.sentiment === 'critical';

    return (
        <div className={`relative overflow-hidden bg-white dark:bg-[#1f1e0b] rounded-3xl p-6 shadow-sm border ${isCritical ? 'border-red-100 dark:border-red-900/50' : 'border-transparent'} dark:border-neutral-800 hover:shadow-md transition-all group`}>
            {/* Decorative Gradient Line */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${isCritical ? 'from-red-500 via-orange-500 to-red-500' : 'from-primary via-orange-400 to-primary'}`}></div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className={`size-12 rounded-2xl ${isCritical ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                    <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400">AI Forecast</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${isCritical ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                            {insight.sentiment} Impact
                        </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-neutral-dark dark:text-white mb-1">
                        {insight.summary}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-2xl">
                        {insight.actionableSuggestion}
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                    <button
                        onClick={() => setInsight(null)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Dismiss
                    </button>
                    {/* Fallback link to inventory if no specific items, or if affected items exist, maybe filter link */}
                    <Link
                        href="/dashboard/inventory"
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        <span>Take Action</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
