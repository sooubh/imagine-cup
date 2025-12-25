'use client';

import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { StockItem } from '@/lib/azureDefaults';

export function ReorderStats() {
  const searchParams = useSearchParams();

  // Placeholder for real data fetching
  const stats = useMemo(() => {
    // TODO: Fetch real items from Context or API for stats
    const filtered: StockItem[] = []; 
    
    // Mock calculation for demonstration until data is wired up
    const atRisk = 12; 
    const totalValue = 15420;

    return { atRisk, totalValue };
  }, [searchParams]);

  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-neutral-dark dark:text-white">Reorder & Priority Recommendations</h1>
        <p className="text-neutral-500 text-base flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">schedule</span>
          Last updated: Today, 09:41 AM
        </p>
      </div>
      {/* Key Metrics Cards */}
      <div className="flex flex-wrap gap-4 w-full lg:w-auto">
        <div className="flex-1 lg:flex-none min-w-[170px] bg-white dark:bg-[#23220f] rounded-xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-neutral-500 text-sm font-medium">Items at Risk</p>
            <span className="material-symbols-outlined text-red-500 text-xl">warning</span>
          </div>
          <p className="text-3xl font-bold text-neutral-dark dark:text-white">{stats.atRisk}</p>
          <p className="text-xs text-red-600 font-medium mt-1">Requiring immediate action</p>
        </div>
        <div className="flex-1 lg:flex-none min-w-[170px] bg-white dark:bg-[#23220f] rounded-xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-neutral-500 text-sm font-medium">Est. Value</p>
            <span className="material-symbols-outlined text-neutral-500 text-xl">payments</span>
          </div>
          <p className="text-3xl font-bold text-neutral-dark dark:text-white">${stats.totalValue.toLocaleString()}</p>
          <p className="text-xs text-neutral-500 mt-1">Potential replenishment cost</p>
        </div>
      </div>
    </div>
  );
}

