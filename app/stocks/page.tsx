import { Suspense } from 'react';
import { StockHeatmapTable } from '@/app/dashboard/components/StockHeatmapTable';

export default function StocksPage() {
  return (
    <div className="flex flex-col gap-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">Full Inventory</h1>
        <p className="text-neutral-500 dark:text-neutral-400">View and manage stock across all locations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />}>
             <StockHeatmapTable />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
