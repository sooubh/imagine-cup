'use client';

import { useState, useEffect } from 'react';
import { getComprehensiveInsightsAction } from '@/app/actions/ai';

interface RecommendationsPanelProps {
  items: any[];
}

export function RecommendationsPanel({ items }: RecommendationsPanelProps) {
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
        console.error('Failed to fetch insights:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchInsights();
  }, [items]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-neutral-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!insights || !insights.recommendations || insights.recommendations.length === 0) {
    return null;
  }

  const categoryConfig = {
    'cost-saving': {
      icon: 'savings',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10',
      borderColor: 'border-green-200 dark:border-green-900/30',
      iconColor: 'text-green-600 dark:text-green-400'
    },
    'efficiency': {
      icon: 'speed',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10',
      borderColor: 'border-blue-200 dark:border-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    'risk-mitigation': {
      icon: 'shield',
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10',
      borderColor: 'border-orange-200 dark:border-orange-900/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    }
  };

  const impactColors = {
    'High': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'Medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Low': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-black text-neutral-dark dark:text-white">
          AI Recommendations
        </h2>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
          ACTIONABLE
        </span>
      </div>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Strategic recommendations to optimize your inventory operations
      </p>

      <div className="space-y-4">
        {insights.recommendations.map((rec: any, idx: number) => {
          const config = categoryConfig[rec.category as keyof typeof categoryConfig] || {
            icon: 'tips_and_updates',
            color: 'from-purple-500 to-pink-500',
            bgColor: 'from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10',
            borderColor: 'border-purple-200 dark:border-purple-900/30',
            iconColor: 'text-purple-600 dark:text-purple-400'
          };
          
          return (
            <div 
              key={idx}
              className={`relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br ${config.bgColor} border ${config.borderColor} hover:shadow-md transition-all group`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${config.color} bg-opacity-10`}>
                  <span className={`material-symbols-outlined text-2xl ${config.iconColor}`}>
                    {config.icon}
                  </span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-neutral-dark dark:text-white">
                      {rec.title}
                    </h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${impactColors[rec.impact as keyof typeof impactColors] || impactColors['Medium']}`}>
                      {rec.impact} Impact
                    </span>
                  </div>
                  
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                    {rec.description}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-neutral-400 uppercase font-bold">
                      {rec.category.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
