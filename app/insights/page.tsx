import { Suspense } from 'react';
import { getUser } from '@/lib/auth';
import { azureService } from '@/lib/azureDefaults';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { InsightsSummary } from './components/InsightsSummary';
import { InventoryHealthPanel } from './components/InventoryHealthPanel';
import { PredictiveAnalytics } from './components/PredictiveAnalytics';
import { RecommendationsPanel } from './components/RecommendationsPanel';

export default async function InsightsPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('simulated_user_id')?.value;

  if (!userId) {
    redirect('/');
  }

  const user = getUser(userId);
  if (!user) redirect('/');

  // Fetch all data for comprehensive analysis
  const allItems = await azureService.getAllItems(user.section);
  const myItems = user.role === 'admin'
    ? (Array.isArray(allItems) ? allItems.filter(i => i.section === user.section) : [])
    : (Array.isArray(allItems) ? allItems.filter(i => i.ownerId === user.id) : []);

  console.log(`📊 Insights Page: Loaded ${myItems.length} items for analysis`);

  return (
    <div className="min-h-screen p-4 md:p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-display font-black text-neutral-dark dark:text-white tracking-tight">
              AI Insights
            </h1>
            <span className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-bold flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              POWERED BY AI
            </span>
          </div>
          <p className="text-neutral-500 font-medium">
            Comprehensive analysis of {myItems.length} items across {user.section}
          </p>
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

      {/* AI Insights Summary Cards */}
      <Suspense fallback={<div className="h-64 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-3xl" />}>
        <InsightsSummary items={myItems} />
      </Suspense>

      {/* Inventory Health Analysis */}
      <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-3xl" />}>
        <InventoryHealthPanel items={myItems} />
      </Suspense>

      {/* Two Column Layout: Predictions + Recommendations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-3xl" />}>
          <PredictiveAnalytics items={myItems} />
        </Suspense>

        <Suspense fallback={<div className="h-96 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-3xl" />}>
          <RecommendationsPanel items={myItems} />
        </Suspense>
      </div>
    </div>
  );
}
