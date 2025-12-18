export function ReorderTable() {
  return (
    <div className="bg-white dark:bg-[#23220f] rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light/50 dark:bg-black/20 border-b border-neutral-100 dark:border-neutral-700 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6 w-12">
                <input className="rounded border-gray-300 text-primary focus:ring-primary size-4" type="checkbox" />
              </th>
              <th className="p-4 min-w-[200px]">Item Details</th>
              <th className="p-4 min-w-[180px]">Location</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4 text-right">Suggested Qty</th>
              <th className="p-4 w-[200px]">Urgency Score</th>
              <th className="p-4 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
            {/* Row 1: Critical */}
            <tr className="group hover:bg-primary/5 transition-colors">
              <td className="p-4 pl-6">
                <input defaultChecked className="rounded border-gray-300 text-primary focus:ring-primary size-4" type="checkbox" />
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-dark dark:text-white">Amoxicillin 500mg</span>
                  <span className="text-xs text-neutral-500 font-mono">SKU: AMX-500-TAB</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-neutral-500 text-lg">location_on</span>
                  <span className="text-sm text-neutral-dark dark:text-white">District Hospital - Alpha</span>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-black border border-black/10">
                  <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                  CRITICAL
                </span>
              </td>
              <td className="p-4 text-right font-mono font-medium text-neutral-dark dark:text-white">5,000</td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-red-600">98/100</span>
                    <span className="text-neutral-500">Very High</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-yellow-400 to-red-500 w-[98%] rounded-full"></div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-center">
                <button className="size-8 inline-flex items-center justify-center rounded-full hover:bg-background-light dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </td>
            </tr>
            {/* Row 2: Warning */}
            <tr className="group hover:bg-primary/5 transition-colors">
              <td className="p-4 pl-6">
                <input className="rounded border-gray-300 text-primary focus:ring-primary size-4" type="checkbox" />
              </td>
              <td className="p-4">
                <div className="flex flex-col">
                  <span className="font-bold text-neutral-dark dark:text-white">Surgical Gloves (M)</span>
                  <span className="text-xs text-neutral-500 font-mono">SKU: GLV-SUR-MED</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-neutral-500 text-lg">location_on</span>
                  <span className="text-sm text-neutral-dark dark:text-white">Disaster Relief Camp 4</span>
                </div>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                  <span className="size-1.5 rounded-full bg-orange-500"></span>
                  WARNING
                </span>
              </td>
              <td className="p-4 text-right font-mono font-medium text-neutral-dark dark:text-white">10,000</td>
              <td className="p-4">
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-orange-600 dark:text-orange-400">75/100</span>
                    <span className="text-neutral-500">Moderate</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 w-[75%] rounded-full"></div>
                  </div>
                </div>
              </td>
              <td className="p-4 text-center">
                <button className="size-8 inline-flex items-center justify-center rounded-full hover:bg-background-light dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors">
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="border-t border-neutral-100 dark:border-neutral-700 p-4 bg-background-light/30 dark:bg-black/10 flex items-center justify-between">
        <span className="text-sm text-neutral-500">Showing <span className="font-bold text-neutral-dark dark:text-white">1-2</span> of <span className="font-bold text-neutral-dark dark:text-white">142</span> items</span>
        <div className="flex items-center gap-2">
          <button className="size-8 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#23220f] text-neutral-500 hover:bg-background-light disabled:opacity-50">
            <span className="material-symbols-outlined text-sm">chevron_left</span>
          </button>
          <button className="size-8 flex items-center justify-center rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#23220f] text-neutral-500 hover:bg-background-light">
            <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
}
