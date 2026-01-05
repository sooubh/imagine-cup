'use client';

import { useState, useEffect } from 'react';
import { getComprehensiveInsightsAction } from '@/app/actions/ai';

interface InventoryHealthPanelProps {
  items: any[];
}

export function InventoryHealthPanel({ items }: InventoryHealthPanelProps) {
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

  // Calculate additional metrics
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStockItems = items.filter(i => i.quantity < 10);
  const expiringItems = items.filter(i => {
    if (!i.expiryDate) return false;
    const days = Math.ceil((new Date(i.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days >= 0 && days <= 30;
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
        <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-800 rounded mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-neutral-100 dark:bg-neutral-900 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-transparent dark:border-neutral-800 shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-black text-neutral-dark dark:text-white">
          Inventory Health Analysis
        </h2>
        <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
          <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
          AI ANALYSIS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 border border-blue-200 dark:border-blue-900/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              inventory_2
            </span>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase">Total Items</span>
          </div>
          <div className="text-3xl font-black text-neutral-dark dark:text-white">{items.length}</div>
          <div className="text-xs text-neutral-500 mt-1">Total Value: ${totalValue.toLocaleString()}</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10 border border-orange-200 dark:border-orange-900/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-orange-600 dark:text-orange-400">
              warning
            </span>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase">Low Stock</span>
          </div>
          <div className="text-3xl font-black text-neutral-dark dark:text-white">{lowStockItems.length}</div>
          <div className="text-xs text-neutral-500 mt-1">Items below minimum</div>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-200 dark:border-yellow-900/30">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400">
              schedule
            </span>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 uppercase">Expiring Soon</span>
          </div>
          <div className="text-3xl font-black text-neutral-dark dark:text-white">{expiringItems.length}</div>
          <div className="text-xs text-neutral-500 mt-1">Within 30 days</div>
        </div>
      </div>

      {insights && (
        <>
          {/* Critical Issues */}
          {insights.criticalIssues.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase mb-3">
                Critical Issues
              </h3>
              <div className="space-y-2">
                {insights.criticalIssues.map((issue: string, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30"
                  >
                    <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl mt-0.5">
                      error
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-700 dark:text-neutral-200 font-medium">{issue}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Opportunities */}
          {insights.opportunities.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-neutral-600 dark:text-neutral-400 uppercase mb-3">
                Optimization Opportunities
              </h3>
              <div className="space-y-2">
                {insights.opportunities.map((opp: string, idx: number) => (
                  <div 
                    key={idx}
                    className="flex items-start gap-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30"
                  >
                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl mt-0.5">
                      lightbulb
                    </span>
                    <div className="flex-1">
                      <p className="text-sm text-neutral-700 dark:text-neutral-200 font-medium">{opp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
