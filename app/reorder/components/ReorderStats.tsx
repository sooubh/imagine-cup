export function ReorderStats() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight text-neutral-dark dark:text-white">Reorder & Priority Recommendations</h1>
        <p className="text-neutral-500 text-base flex items-center gap-2">
          <span className="material-symbols-outlined text-lg">schedule</span>
          Last updated: Today, 09:41 AM
        </p>
      </div>
      {/* Key Metrics Cards */}
      <div className="flex flex-wrap gap-4 w-full lg:w-auto">
        <div className="flex-1 lg:flex-none min-w-[160px] bg-white dark:bg-[#23220f] rounded-xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-neutral-500 text-sm font-medium">Items at Risk</p>
            <span className="material-symbols-outlined text-red-500 text-xl">warning</span>
          </div>
          <p className="text-3xl font-bold text-neutral-dark dark:text-white">142</p>
          <p className="text-xs text-red-600 font-medium mt-1">+12 since yesterday</p>
        </div>
        <div className="flex-1 lg:flex-none min-w-[160px] bg-white dark:bg-[#23220f] rounded-xl p-4 border border-neutral-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-neutral-500 text-sm font-medium">Est. Stock-out Value</p>
            <span className="material-symbols-outlined text-neutral-500 text-xl">payments</span>
          </div>
          <p className="text-3xl font-bold text-neutral-dark dark:text-white">$45,200</p>
          <p className="text-xs text-neutral-500 mt-1">Potential loss prevention</p>
        </div>
      </div>
    </div>
  );
}
