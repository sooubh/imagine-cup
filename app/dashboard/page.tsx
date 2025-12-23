import { Suspense } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { AIInsightsBanner } from './components/AIInsightsBanner';
import { StatsGrid } from './components/StatsGrid';
import { StockHeatmapTable } from './components/StockHeatmapTable';
import { AlertsSidebar } from './components/AlertsSidebar';

export default function DashboardPage() {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Main Dashboard */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <Suspense fallback={<div className="h-20 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />}>
          <DashboardHeader />
        </Suspense>
        <AIInsightsBanner />
        <Suspense fallback={<div className="h-40 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />}>
          <StatsGrid />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />}>
          <StockHeatmapTable />
        </Suspense>
      </div>

      {/* Right Column: Sidebar (Alerts & Actions) */}
      <AlertsSidebar />
    </div>
  );
}
