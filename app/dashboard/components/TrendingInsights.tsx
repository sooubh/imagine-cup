'use client';

import { useState, useEffect } from 'react';
import { getPredictiveInsightsAction } from '@/app/actions/ai';

interface TrendingInsightsProps {
  items: any[];
}

export function TrendingInsights({ items }: TrendingInsightsProps) {
  const [predictions, setPredictions] = useState<{
    inventoryValue: { trend: string; prediction: string };
    stockCoverage: { trend: string; prediction: string };
    topRisks: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate metrics
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStockCount = items.filter(item => item.quantity < 10).length;
  const averagePrice = items.length > 0 ? totalValue / items.reduce((sum, item) => sum + item.quantity, 0) : 0;
  const stockCoverage = Math.min(100, Math.round((items.filter(i => i.quantity > 10).length / items.length) * 100)) || 0;

  useEffect(() => {
    async function fetchPredictions() {
      if (!items || items.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const aiPredictions = await getPredictiveInsightsAction(items);
        setPredictions(aiPredictions);
      } catch (error) {
        console.error('Failed to fetch AI predictions:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPredictions();
  }, [items]);

  const insights = [
    {
      icon: '💰',
      label: 'Total Inventory Value',
      value: `$${totalValue.toLocaleString()}`,
      trend: predictions?.inventoryValue.prediction || 'Calculating...',
      trendUp: predictions?.inventoryValue.trend === 'increasing' || predictions?.inventoryValue.trend === 'stable',
      aiPowered: true,
    },
    {
      icon: '⚠️',
      label: 'Items Needing Attention',
      value: lowStockCount.toString(),
      trend: lowStockCount > 5 ? 'Action required' : 'Under control',
      trendUp: lowStockCount <= 5,
      aiPowered: false,
    },
    {
      icon: '📈',
      label: 'Avg. Product Price',
      value: `$${averagePrice.toFixed(2)}`,
      trend: '+5% from last week',
      trendUp: true,
      aiPowered: false,
    },
    {
      icon: '🎯',
      label: 'Stock Coverage',
      value: `${stockCoverage}%`,
      trend: predictions?.stockCoverage.prediction || 'Healthy level',
      trendUp: predictions?.stockCoverage.trend === 'improving' || predictions?.stockCoverage.trend === 'stable',
      aiPowered: true,
    },
  ];

  return (
    <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-display font-black text-neutral-dark dark:text-white">
            Key Metrics
          </h2>
          {!loading && predictions && (
            <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              AI PREDICTIONS
            </span>
          )}
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-bold">
          LIVE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((insight, index) => (
          <div
            key={index}
            className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 p-5 hover:shadow-md transition-all duration-300"
          >
            {loading && insight.aiPowered && (
              <div className="absolute inset-0 bg-white/50 dark:bg-black/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-600 dark:text-neutral-300">
                  <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                  AI Analyzing
                </div>
              </div>
            )}
            
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl">{insight.icon}</div>
              <div className="flex items-center gap-1">
                {insight.trendUp ? (
                  <div className="text-green-500 text-xs font-bold">↗</div>
                ) : (
                  <div className="text-orange-500 text-xs font-bold">↘</div>
                )}
                {insight.aiPowered && !loading && (
                  <span className="material-symbols-outlined text-[14px] text-purple-500" title="AI Prediction">
                    auto_awesome
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col gap-1">
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium uppercase tracking-wide">
                {insight.label}
              </span>
              <div className="text-2xl font-black text-neutral-dark dark:text-white">
                {insight.value}
              </div>
              <span className={`text-xs font-medium ${
                insight.trendUp 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-orange-600 dark:text-orange-400'
              }`}>
                {insight.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Risk Alerts */}
      {predictions && predictions.topRisks.length > 0 && (
        <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border border-orange-200 dark:border-orange-900/30">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-xl">
              warning
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-neutral-dark dark:text-white mb-2">
                AI-Detected Risks
              </h3>
              <ul className="space-y-1">
                {predictions.topRisks.map((risk, idx) => (
                  <li key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
