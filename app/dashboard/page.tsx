import { Suspense } from 'react';
import { DashboardHeader } from './components/DashboardHeader';
import { AIInsightsBanner } from './components/AIInsightsBanner';
import { StatsGrid } from './components/StatsGrid';
import { StockHeatmapTable } from './components/StockHeatmapTable';
import { AlertsSidebar } from './components/AlertsSidebar';

import { RecentActivityFeed } from './components/RecentActivityFeed';

import { azureService } from '@/lib/azureDefaults';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('simulated_user_id')?.value;
  
  if (!userId) {
      redirect('/');
  }

  const user = getUser(userId);
  if (!user) redirect('/');

  // Fetch ALL items then filter (Server-side filtering simulation)
  // In production, we would pass userId/section to the DB query directly
  const allItems = await azureService.getAllItems(user.section);
  
  let myItems = [];
  
  if (user.role === 'admin') {
      // Admin sees ALL items in their Section
      myItems = allItems.filter(i => i.section === user.section);
  } else {
      // Retailer sees ONLY their own items
      myItems = allItems.filter(i => i.ownerId === user.id);
  }

  // Fetch Activities
  const recentActivities = await azureService.getRecentActivities(user.section);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left Column: Main Dashboard */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <div className="bg-blue-600/10 border border-blue-600/20 text-blue-400 px-6 py-4 rounded-2xl flex items-center justify-between">
            <span className="font-bold flex items-center gap-2">
                <span className="material-symbols-outlined">badge</span>
                {user.name} ({user.role.toUpperCase()})
            </span>
            <span className="text-sm bg-blue-600/20 px-3 py-1 rounded-full">{user.section} Section</span>
        </div>

        <Suspense fallback={<div className="h-20 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />}>
          <DashboardHeader />
        </Suspense>
        <AIInsightsBanner />
        <Suspense fallback={<div className="h-40 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />}>
          <StatsGrid items={myItems} />
        </Suspense>
        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl" />}>
          <StockHeatmapTable limit={20} items={myItems} />
        </Suspense>
      </div>

      {/* Right Column: Sidebar (Alerts & Actions) */}
      <div className="flex flex-col gap-8 shrink-0 w-full lg:w-[320px] xl:w-[360px]">
        <AlertsSidebar />
        <RecentActivityFeed activities={recentActivities} />
      </div>

      {/* Floating AI Chat - Removed in favor of global LedgerBot */}
    </div>
  );
}
