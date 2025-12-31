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
    <div className="flex flex-col xl:flex-row gap-6 h-[calc(100vh-2rem)]">
      {/* Left Column: Main Dashboard Content */}
      <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto pr-2 scrollbar-hide">
        {/* Simplified professional header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-display font-black text-neutral-dark dark:text-white tracking-tight">Dashboard</h1>
                <p className="text-neutral-500 font-medium">Overview for {user.section}</p>
             </div>
             
             <div className="flex items-center gap-3">
                 <div className="bg-white dark:bg-[#1f1e0b] px-4 py-2 rounded-full border border-transparent dark:border-neutral-800 shadow-sm flex items-center gap-3">
                     <div className="size-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center font-bold text-neutral-600 dark:text-neutral-300">
                         {user.name.charAt(0)}
                     </div>
                     <div className="flex flex-col">
                         <span className="text-sm font-bold text-neutral-dark dark:text-white leading-none">{user.name}</span>
                         <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{user.role}</span>
                     </div>
                 </div>
             </div>
        </div>

        <AIInsightsBanner />
        
        <Suspense fallback={<div className="h-40 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-3xl" />}>
          <StatsGrid items={myItems} />
        </Suspense>
        
        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-3xl" />}>
          <StockHeatmapTable limit={20} items={myItems} />
        </Suspense>
      </div>

      {/* Right Column: Sidebar (Alerts & Actions) */}
      <div className="w-full xl:w-[360px] shrink-0 overflow-y-auto scrollbar-hide">
         <AlertsSidebar />
         <div className="mt-8">
             <RecentActivityFeed activities={recentActivities} />
         </div>
      </div>
    </div>
  );
}
