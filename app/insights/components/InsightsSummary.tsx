'use client';

import { useState, useEffect } from 'react';
import { getComprehensiveInsightsAction } from '@/app/actions/ai';

interface InsightsSummaryProps {
  items: any[];
}

export function InsightsSummary({ items }: InsightsSummaryProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInsights() {
      if (!items || items.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const result = await getComprehensiveInsightsAction(items);
        setInsights(result);
      } catch (error) {
        console.error('Failed to fetch comprehensive insights:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [items]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-neutral-100 dark:bg-neutral-900 rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (!insights) return null;

  const healthColor = 
    insights.healthScore >= 80 ? 'from-green-500 to-emerald-500' :
    insights.healthScore >= 60 ? 'from-yellow-500 to-orange-500' :
    'from-red-500 to-pink-500';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Health Score Card */}
      <div className="relative overflow-hidden bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6 hover:shadow-md transition-all">
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${healthColor} opacity-10 rounded-full -mr-16 -mt-16`} />
        
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-2xl text-purple-600 dark:text-purple-400">
              health_and_safety
            </span>
            <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
              Health Score
            </h3>
          </div>
          
          <div className="flex items-end gap-2 mb-2">
            <div className="text-5xl font-black text-neutral-dark dark:text-white">
              {insights.healthScore}
            </div>
            <div className="text-2xl font-bold text-neutral-400 mb-1">/100</div>
          </div>
          
          <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${healthColor} transition-all duration-1000`}
              style={{ width: `${insights.healthScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Critical Issues Card */}
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-2xl text-red-600 dark:text-red-400">
            warning
          </span>
          <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            Critical Issues
          </h3>
        </div>
        
        <div className="text-3xl font-black text-neutral-dark dark:text-white mb-3">
          {insights.criticalIssues.length}
        </div>
        
        <ul className="space-y-2">
          {insights.criticalIssues.slice(0, 2).map((issue: string, idx: number) => (
            <li key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">•</span>
              <span>{issue}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Opportunities Card */}
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-2xl text-green-600 dark:text-green-400">
            lightbulb
          </span>
          <h3 className="text-sm font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">
            Opportunities
          </h3>
        </div>
        
        <div className="text-3xl font-black text-neutral-dark dark:text-white mb-3">
          {insights.opportunities.length}
        </div>
        
        <ul className="space-y-2">
          {insights.opportunities.slice(0, 2).map((opp: string, idx: number) => (
            <li key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
              <span className="text-green-500 mt-0.5">•</span>
              <span>{opp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
