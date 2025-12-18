export function AlertsTimeline() {
  return (
    <div className="flex flex-col gap-4 relative">
      <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-neutral-100 dark:bg-neutral-800 -z-10"></div>
      {/* Date Header */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-background-light dark:bg-background-dark py-1 pr-2">Today</span>
        <div className="h-px bg-neutral-100 dark:bg-neutral-800 flex-1"></div>
      </div>
      {/* Alert Card: Critical */}
      <div className="flex gap-4 group">
        <div className="mt-4 relative shrink-0">
          <div className="size-12 rounded-full bg-white dark:bg-[#2c2b13] border-4 border-background-light dark:border-background-dark flex items-center justify-center shadow-sm relative z-10">
            <span className="material-symbols-outlined text-red-500 filled">dangerous</span>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-[#23220f] border-l-4 border-primary rounded-xl rounded-l-md shadow-sm p-5 hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
            <span className="text-xs font-medium text-neutral-500">Just now</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Amoxicillin 500mg</h3>
                <span className="px-2 py-0.5 rounded-md bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold uppercase tracking-wide">Critical</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-500 text-sm">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Downtown Hospital, Ward 3
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-bold text-sm">
                <span className="material-symbols-outlined text-[18px]">timer</span>
                24h Left
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-3">
            <button className="h-9 px-5 rounded-full bg-primary text-black text-sm font-bold hover:bg-[#e6e205] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              Approve Transfer
            </button>
            <button className="h-9 px-5 rounded-full bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-dark dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Contact Admin
            </button>
          </div>
        </div>
      </div>
      {/* Alert Card: Warning */}
      <div className="flex gap-4 group">
        <div className="mt-4 relative shrink-0">
          <div className="size-12 rounded-full bg-white dark:bg-[#2c2b13] border-4 border-background-light dark:border-background-dark flex items-center justify-center shadow-sm relative z-10">
            <span className="material-symbols-outlined text-orange-400 filled">warning</span>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-[#23220f] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow">
          <div className="absolute top-5 right-5">
            <span className="text-xs font-medium text-neutral-500">09:00 AM</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Rice Supply (Sacks)</h3>
                <span className="px-2 py-0.5 rounded-md bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs font-bold uppercase tracking-wide">Low Stock</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-500 text-sm">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Sector 4 Relief Camp
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 text-orange-600 dark:text-orange-400 font-bold text-sm">
                <span className="material-symbols-outlined text-[18px]">hourglass_bottom</span>
                2 Days
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-3">
            <button className="h-9 px-5 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-bold hover:bg-black/80 dark:hover:bg-white/90 transition-colors">
              Reorder
            </button>
            <button className="h-9 px-5 rounded-full bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-dark dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              Snooze (1h)
            </button>
          </div>
        </div>
      </div>
      {/* Date Header */}
      <div className="flex items-center gap-4 mt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 bg-background-light dark:bg-background-dark py-1 pr-2">Yesterday</span>
        <div className="h-px bg-neutral-100 dark:bg-neutral-800 flex-1"></div>
      </div>
      {/* Alert Card: Info/Expired */}
      <div className="flex gap-4 group opacity-75 hover:opacity-100 transition-opacity">
        <div className="mt-4 relative shrink-0">
          <div className="size-12 rounded-full bg-white dark:bg-[#2c2b13] border-4 border-background-light dark:border-background-dark flex items-center justify-center shadow-sm relative z-10">
            <span className="material-symbols-outlined text-gray-400">inventory_2</span>
          </div>
        </div>
        <div className="flex-1 bg-white dark:bg-[#23220f] border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Tetanus Toxoid</h3>
                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold uppercase tracking-wide">Expired</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-500 text-sm">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                Central Warehouse, Shelf B2
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-3">
            <button className="h-9 px-5 rounded-full bg-transparent border border-neutral-200 dark:border-neutral-700 text-neutral-500 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              Mark Resolved
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
