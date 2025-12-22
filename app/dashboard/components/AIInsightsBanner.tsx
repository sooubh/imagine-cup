import Link from 'next/link';

export function AIInsightsBanner() {
  return (
    <div className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent dark:from-primary/10 rounded-2xl p-6 border-l-4 border-primary flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-primary-dark">
        <span className="material-symbols-outlined animate-pulse">auto_awesome</span>
      </div>
      <div className="flex-1">
        <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400 uppercase tracking-wide mb-1 flex items-center gap-2">
          StockHealth AI Insight
          <span className="px-1.5 py-0.5 rounded bg-primary text-[10px] text-neutral-dark font-black">NEW</span>
        </p>
        <h3 className="text-lg md:text-xl font-medium text-neutral-dark dark:text-white leading-relaxed">
          <span className="font-bold text-red-600 dark:text-red-400">⚠️ Critical Alert:</span> 5 critical medicines likely to run out in <span className="underline decoration-primary decoration-2 underline-offset-2 font-bold">6 days</span> across 3 locations.
        </h3>
        <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">Recommended action: Re-route stock from District Warehouse A to cover the deficit.</p>
      </div>
      <Link href="/reorder" className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-neutral-dark dark:bg-white text-white dark:text-neutral-dark rounded-full text-sm font-bold shadow-lg hover:transform hover:scale-105 transition-all whitespace-nowrap">
        <span>Take Action</span>
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </Link>
    </div>
  );
}
