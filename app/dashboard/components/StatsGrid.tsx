'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { filterStockData, getStockStatus } from '../lib/utils';
import { useMemo } from 'react';
import { StockItem } from '@/lib/azureDefaults';

interface StatsGridProps {
  items: StockItem[];
}

export function StatsGrid({ items }: StatsGridProps) {
  const searchParams = useSearchParams();

  const stats = useMemo(() => {
    const filters = {
      dateRange: searchParams.get('dateRange') || '7d',
      category: searchParams.get('category') || 'all',
      status: searchParams.get('status') || 'all',
      location: searchParams.get('location') || 'all',
      view: searchParams.get('view') || 'district',
    };

    const filtered = filterStockData(items, filters);

    // Metrics calculation
    const totalItems = filtered.length;
    const itemsAtRisk = filtered.filter(i => {
      const s = getStockStatus(i.quantity, 0); // Simplified status check if opening stock missing
      return s === 'critical' || s === 'low';
    }).length;

    // Calculate generic stock level for "Avg Days" proxy
    const avgDaysStock = useMemo(() => {
        if (totalItems === 0) return 0;
        
        let totalDays = 0;
        filtered.forEach(item => {
            // Heuristic: Estimate daily usage based on category
            let dailyUsage = 2; // Default
            const cat = (item.category || "").toLowerCase();
            if (cat.includes('medicine')) dailyUsage = 10;
            else if (cat.includes('ppe')) dailyUsage = 50;
            else if (cat.includes('device') || cat.includes('machine')) dailyUsage = 0.5;
            else if (cat.includes('consumable')) dailyUsage = 20;

            const days = item.quantity / dailyUsage;
            totalDays += days;
        });

        return Math.round(totalDays / totalItems);
    }, [filtered, totalItems]);

    const stockDiff = avgDaysStock - 30; // Compare to 30-day baseline
    const stockTrend = stockDiff > 0 ? `+${stockDiff} days` : `${stockDiff} days`;
    const stockTrendColor = stockDiff < 0 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : 'text-green-600 bg-green-100 dark:bg-green-900/30';

    return {
      totalItems,
      itemsAtRisk,
      avgDaysStock,
      stockTrend,
      stockTrendColor
    };
  }, [searchParams, items]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Link href="/reports" className="group bg-white dark:bg-[#2a2912] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 block">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-500 group-hover:text-primary transition-colors">Total Items Tracked</span>
          <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">inventory_2</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">{stats.totalItems.toLocaleString()}</span>
          <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">+5%</span>
        </div>
      </Link>

      <Link href="/alerts" className="group bg-white dark:bg-[#2a2912] p-5 rounded-2xl border border-primary dark:border-primary/50 shadow-sm relative overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 block">
        <div className="absolute right-0 top-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-primary transition-colors">Items at Risk</span>
          <span className="material-symbols-outlined text-orange-500">warning</span>
        </div>
        <div className="flex items-baseline gap-2 relative z-10">
          <span className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">{stats.itemsAtRisk}</span>
          <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">+2 items</span>
        </div>
      </Link>

      <div className="bg-white dark:bg-[#2a2912] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-500">Avg Days Stock</span>
          <span className="material-symbols-outlined text-neutral-400">calendar_today</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">{stats.avgDaysStock} <span className="text-lg font-normal text-neutral-500">Days</span></span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${stats.stockTrendColor}`}>{stats.stockTrend}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#2a2912] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-500 flex items-center gap-1">
             Est. Waste Prevented
             <span className="bg-gradient-to-r from-blue-500 to-primary text-white text-[9px] px-1.5 py-0.5 rounded font-bold">AI</span>
          </span>
          <span className="material-symbols-outlined text-neutral-400">savings</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">$45k</span>
          <span className="text-xs font-bold text-green-600 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">+12%</span>
        </div>
      </div>
    </div>
  );
}

