'use client';

import { useState, useEffect } from 'react';
import { getTipsAndSuggestionsAction } from '@/app/actions/ai';
import { StockInsight } from '@/services/AzureAIService';

interface TipsAndSuggestionsProps {
  items: any[];
}

export function TipsAndSuggestions({ items }: TipsAndSuggestionsProps) {
  const [tips, setTips] = useState<StockInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTips() {
      if (!items || items.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const aiTips = await getTipsAndSuggestionsAction(items);
        setTips(aiTips);
      } catch (error) {
        console.error('Failed to fetch AI tips:', error);
        // Fallback tips if AI fails
        setTips([
          {
            sentiment: 'positive',
            summary: 'AI Insights Available',
            actionableSuggestion: 'Configure Azure OpenAI to get personalized recommendations.',
            affectedItems: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchTips();
  }, [items]);

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
          <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-neutral-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (tips.length === 0) return null;

  const typeColors: Record<string, string> = {
    positive: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
    warning: 'from-orange-500/10 to-red-500/10 border-orange-500/20',
    neutral: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    critical: 'from-red-500/10 to-pink-500/10 border-red-500/20',
  };

  const iconColors: Record<string, string> = {
    positive: 'text-green-600 dark:text-green-400',
    warning: 'text-orange-600 dark:text-orange-400',
    neutral: 'text-blue-600 dark:text-blue-400',
    critical: 'text-red-600 dark:text-red-400',
  };

  const sentimentIcons: Record<string, string> = {
    positive: '💡',
    warning: '⚠️',
    neutral: '📊',
    critical: '🔴',
  };

  return (
    <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-display font-black text-neutral-dark dark:text-white">
            AI Tips & Suggestions
          </h2>
          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
            AI-POWERED
          </span>
        </div>
        <span className="text-sm text-neutral-500 font-medium">
          Personalized for you
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.slice(0, 4).map((tip, index) => (
          <div
            key={index}
            className={`relative rounded-2xl bg-gradient-to-br ${typeColors[tip.sentiment] || typeColors.neutral} border p-5 hover:shadow-md transition-all duration-300`}
          >
            <div className="flex items-start gap-4">
              <div className={`text-3xl ${iconColors[tip.sentiment] || iconColors.neutral}`}>
                {sentimentIcons[tip.sentiment] || '📋'}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-neutral-dark dark:text-white mb-2">
                  {tip.summary}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-3">
                  {tip.actionableSuggestion}
                </p>
                {tip.affectedItems && tip.affectedItems.length > 0 && (
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    Affects: {tip.affectedItems.slice(0, 2).join(', ')}
                    {tip.affectedItems.length > 2 && ` +${tip.affectedItems.length - 2} more`}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
