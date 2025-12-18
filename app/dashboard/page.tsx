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
        <DashboardHeader />
        <AIInsightsBanner />
        <StatsGrid />
        <StockHeatmapTable />
      </div>

      {/* Right Column: Sidebar (Alerts & Actions) */}
      <AlertsSidebar />
    </div>
  );
}
