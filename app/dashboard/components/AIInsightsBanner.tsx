'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StockInsight } from '@/services/AzureAIService'; // Type only
import { getDashboardInsightAction } from '@/app/actions/ai';

export function AIInsightsBanner() {
  const [insight, setInsight] = useState<StockInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsight() {
      try {
        // AI Action now handles data fetching securely
        const aiResponse = await getDashboardInsightAction();
        if (aiResponse) setInsight(aiResponse);
      } catch (e) {
        console.error("Failed to load insight", e);
      } finally {
        setLoading(false);
      }
    }
    fetchInsight();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse bg-white/50 dark:bg-neutral-800/50 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-700 h-32 flex items-center justify-center">
        <span className="text-neutral-400 text-sm flex items-center gap-2">
           <span className="material-symbols-outlined animate-spin">sync</span>
           Generating AI Insights...
        </span>
      </div>
    );
  }

  if (!insight) return null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-white to-white dark:from-primary/10 dark:via-[#1e1e1e] dark:to-[#1e1e1e] rounded-2xl p-1 border border-primary/20 shadow-sm hover:shadow-md transition-shadow">
       <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary opacity-50"></div>
       <div className="flex flex-col md:flex-row items-start md:items-center gap-4 p-5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary animate-pulse">
                <span className="material-symbols-outlined">auto_awesome</span>
            </div>
            
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-500">AI Analysis</span>
                    {insight.sentiment === 'critical' && <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 rounded">CRITICAL</span>}
                </div>
                <h3 className="text-base md:text-lg font-medium text-neutral-800 dark:text-neutral-100 leading-snug">
                     {insight.summary}
                </h3>
                <div className="flex items-center gap-2 mt-2">
                    <span className="material-symbols-outlined text-sm text-green-500">lightbulb</span>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                       Tip: {insight.actionableSuggestion}
                    </p>
                </div>
            </div>

            <Link href="/reorder?source=ai_insight" className="hidden md:flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg text-sm font-bold shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all whitespace-nowrap">
                <span>Review Action</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            
            <button onClick={() => setInsight(null)} className="absolute top-2 right-2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
            </button>
       </div>
    </div>
  );
}
