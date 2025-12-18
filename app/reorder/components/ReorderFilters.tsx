export function ReorderFilters() {
  return (
    <div className="bg-white dark:bg-[#23220f] rounded-2xl border border-neutral-100 dark:border-neutral-700 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between sticky top-[73px] z-20 mb-6">
      {/* Search */}
      <div className="relative w-full md:w-96 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="material-symbols-outlined text-neutral-500">search</span>
        </div>
        <input 
          className="block w-full pl-10 pr-3 py-2.5 border-none rounded-xl bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white placeholder-neutral-500 focus:ring-2 focus:ring-primary transition-all" 
          placeholder="Search by SKU, Item Name, or Location..." 
          type="text"
        />
      </div>
      {/* Chips Filters */}
      <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-black font-semibold text-sm whitespace-nowrap shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-white dark:ring-offset-neutral-900">
          <span className="material-symbols-outlined text-lg filled">dangerous</span>
          Critical Only
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-background-light dark:bg-background-dark hover:bg-white dark:hover:bg-black border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 text-neutral-dark dark:text-white font-medium text-sm whitespace-nowrap transition-all">
          <span className="material-symbols-outlined text-lg">medical_services</span>
          Life-saving Drugs
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-background-light dark:bg-background-dark hover:bg-white dark:hover:bg-black border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 text-neutral-dark dark:text-white font-medium text-sm whitespace-nowrap transition-all">
          <span className="material-symbols-outlined text-lg">timelapse</span>
          Low Lead-time
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-background-light dark:bg-background-dark hover:bg-white dark:hover:bg-black border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 text-neutral-dark dark:text-white font-medium text-sm whitespace-nowrap transition-all">
          <span className="material-symbols-outlined text-lg">filter_list</span>
          More Filters
        </button>
      </div>
    </div>
  );
}
