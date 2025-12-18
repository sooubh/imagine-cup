export function AlertsFilterBar() {
  return (
    <div className="flex flex-wrap gap-3 items-center pb-2 border-b border-neutral-100 dark:border-neutral-700">
      <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium text-sm transition-transform active:scale-95 shadow-lg">
        All Alerts
      </button>
      <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-[#f4f4e6] dark:bg-[#2c2b13] hover:bg-[#e9e8ce] dark:hover:bg-[#444320] text-neutral-dark dark:text-white font-medium text-sm transition-colors border border-transparent hover:border-[#d4d3b5]">
        <span className="size-2 rounded-full bg-red-500"></span>
        Critical
      </button>
      <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-[#f4f4e6] dark:bg-[#2c2b13] hover:bg-[#e9e8ce] dark:hover:bg-[#444320] text-neutral-dark dark:text-white font-medium text-sm transition-colors border border-transparent hover:border-[#d4d3b5]">
        <span className="size-2 rounded-full bg-orange-400"></span>
        Warning
      </button>
      <button className="flex items-center gap-2 h-9 px-4 rounded-full bg-[#f4f4e6] dark:bg-[#2c2b13] hover:bg-[#e9e8ce] dark:hover:bg-[#444320] text-neutral-dark dark:text-white font-medium text-sm transition-colors border border-transparent hover:border-[#d4d3b5]">
        Unread Only
      </button>
      <div className="w-px h-6 bg-[#e9e8ce] dark:bg-[#444320] mx-1"></div>
      <button className="flex items-center gap-2 h-9 pl-4 pr-3 rounded-full bg-[#f4f4e6] dark:bg-[#2c2b13] text-neutral-dark dark:text-white font-medium text-sm transition-colors group">
        Region: All
        <span className="material-symbols-outlined text-[18px] text-neutral-500 group-hover:text-neutral-dark dark:group-hover:text-white">keyboard_arrow_down</span>
      </button>
    </div>
  );
}
