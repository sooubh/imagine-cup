'use client';

import { useState, useEffect } from 'react';
import { getComprehensiveInsightsAction } from '@/app/actions/ai';

interface PredictiveAnalyticsProps {
  items: any[];
}

export function PredictiveAnalytics({ items }: PredictiveAnalyticsProps) {
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
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-16 bg-neutral-100 dark:bg-neutral-900 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!insights || !insights.predictions || insights.predictions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-black text-neutral-dark dark:text-white">
          Demand Predictions
        </h2>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
          AI FORECAST
        </span>
      </div>

      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Predicted demand for next 30 days based on historical patterns and trends
      </p>

      <div className="space-y-3">
        {insights.predictions.slice(0, 8).map((prediction: any, idx: number) => {
          const confidencePercent = Math.round(prediction.confidence * 100);
          const confidenceColor = 
            confidencePercent >= 80 ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' :
            confidencePercent >= 60 ? 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
            'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20';

          return (
            <div 
              key={idx}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <div className="font-bold text-neutral-dark dark:text-white mb-1">
                  {prediction.item}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Predicted: <span className="font-bold text-neutral-600 dark:text-neutral-300">{prediction.predictedDemand} units</span>
                  </span>
                  <span className="text-xs text-neutral-300 dark:text-neutral-600">•</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${confidenceColor}`}>
                    {confidencePercent}% confidence
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-purple-500">
                  trending_up
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10 border border-purple-200 dark:border-purple-900/30">
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">
            info
          </span>
          <div>
            <p className="text-sm font-bold text-neutral-dark dark:text-white mb-1">
              About AI Predictions
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-300">
              These predictions are generated using AI analysis of historical inventory patterns, seasonal trends, and usage rates. Use them to optimize your reorder quantities and prevent stockouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
