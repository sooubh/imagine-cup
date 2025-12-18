import Link from 'next/link';

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Link href="/reports" className="group bg-white dark:bg-[#2a2912] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 block">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-500 group-hover:text-primary transition-colors">Total Items Tracked</span>
          <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors">inventory_2</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">1,240</span>
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
          <span className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">12</span>
          <span className="text-xs font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 px-2 py-0.5 rounded-full">+2 items</span>
        </div>
      </Link>

      <div className="bg-white dark:bg-[#2a2912] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-500">Avg Days Stock</span>
          <span className="material-symbols-outlined text-neutral-400">calendar_today</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">18 <span className="text-lg font-normal text-neutral-500">Days</span></span>
          <span className="text-xs font-bold text-red-600 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded-full">-2 days</span>
        </div>
      </div>

      <div className="bg-white dark:bg-[#2a2912] p-5 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-neutral-500">Est. Waste Prevented</span>
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
