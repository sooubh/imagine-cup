import Link from 'next/link';

export function StockHeatmapTable() {
  return (
    <div className="bg-white dark:bg-[#2a2912] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden flex-1 flex flex-col">
      <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Stock Health Heatmap</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Healthy
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Low
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
          </div>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-50 dark:bg-[#323118] text-xs uppercase text-neutral-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 sticky left-0 z-10 bg-neutral-50 dark:bg-[#323118]">Item Name</th>
              <th className="px-6 py-4">North District Hospital</th>
              <th className="px-6 py-4">Rural PHC 04</th>
              <th className="px-6 py-4">Shelter B</th>
              <th className="px-6 py-4">South NGO Camp</th>
              <th className="px-6 py-4 text-right">Total Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            {/* Row 1 */}
            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
              <td className="px-6 py-4 font-medium sticky left-0 z-10 bg-white dark:bg-[#2a2912] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800 text-neutral-dark dark:text-white">
                <Link href="/item/1" className="flex items-center gap-3 hover:text-primary transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-[18px]">pill</span>
                  </div>
                  Amoxicillin
                </Link>
              </td>
              <td className="px-6 py-4">
                <div className="group/tooltip relative">
                  <div className="w-full h-10 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 flex items-center justify-center font-bold text-xs cursor-pointer">
                    Critical Low
                  </div>
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-3 bg-neutral-900 text-white text-xs rounded-xl shadow-xl z-20">
                    <p className="font-bold mb-1">Stock: 12 Units</p>
                    <p className="opacity-80">Burn rate: 5/day</p>
                    <p className="opacity-80">Last supply: 14 days ago</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                  Healthy
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50 flex items-center justify-center font-medium text-xs">
                  Low
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                  Healthy
                </div>
              </td>
              <td className="px-6 py-4 text-right font-mono text-neutral-500">120 units</td>
            </tr>
            {/* Row 2 */}
            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
              <td className="px-6 py-4 font-medium sticky left-0 z-10 bg-white dark:bg-[#2a2912] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800 text-neutral-dark dark:text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                    <span className="material-symbols-outlined text-[18px]">vaccines</span>
                  </div>
                  Insulin
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                  Healthy
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 flex items-center justify-center font-bold text-xs cursor-pointer">
                  Critical Low
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                  Healthy
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50 flex items-center justify-center font-medium text-xs">
                  Low
                </div>
              </td>
              <td className="px-6 py-4 text-right font-mono text-neutral-500">50 units</td>
            </tr>
             {/* Row 3 */}
            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
              <td className="px-6 py-4 font-medium sticky left-0 z-10 bg-white dark:bg-[#2a2912] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800 text-neutral-dark dark:text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                    <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
                  </div>
                  Rice Bags
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                  Healthy
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                   Healthy
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 flex items-center justify-center font-bold text-xs cursor-pointer">
                  Critical Low
                </div>
              </td>
               <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 flex items-center justify-center font-bold text-xs cursor-pointer">
                  Critical Low
                </div>
              </td>
              <td className="px-6 py-4 text-right font-mono text-neutral-500">400 kg</td>
            </tr>
             {/* Row 4 */}
            <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
              <td className="px-6 py-4 font-medium sticky left-0 z-10 bg-white dark:bg-[#2a2912] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800 text-neutral-dark dark:text-white">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                    <span className="material-symbols-outlined text-[18px]">bed</span>
                  </div>
                  Blankets
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50 flex items-center justify-center font-medium text-xs">
                  Low
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                   Healthy
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                  Healthy
                </div>
              </td>
               <td className="px-6 py-4">
                <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                  Healthy
                </div>
              </td>
              <td className="px-6 py-4 text-right font-mono text-neutral-500">85 units</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
