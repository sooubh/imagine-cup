'use client';

export function DataSourcesWidget() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">Data Sources</h3>
        <button className="text-primary text-sm font-bold">Manage</button>
      </div>
      <div className="bg-white dark:bg-[#23220f] p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-700 shadow-sm flex flex-col gap-4 h-full">
        {/* Source Item 1 */}
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-700">
          <div className="size-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined">api</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-neutral-dark dark:text-white">National Health API</p>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500"></span>
              <p className="text-xs text-neutral-500">Connected • Synced 2m ago</p>
            </div>
          </div>
        </div>
        {/* Source Item 2 */}
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-700">
          <div className="size-10 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <span className="material-symbols-outlined">upload_file</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-neutral-dark dark:text-white">Q3 Manual Logs</p>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-gray-300"></span>
              <p className="text-xs text-neutral-500">Uploaded yesterday</p>
            </div>
          </div>
        </div>
        {/* Source Item 3 */}
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-neutral-dark dark:text-white">District 4 Portal</p>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-500"></span>
              <p className="text-xs text-neutral-500">Auth Error • Retry needed</p>
            </div>
          </div>
          <button className="text-xs font-bold text-neutral-dark dark:text-white underline">Fix</button>
        </div>
        <div className="mt-auto pt-4">
          <button className="w-full h-10 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center gap-2 text-neutral-500 text-sm font-bold hover:border-primary hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">add</span> Add New Source
          </button>
        </div>
      </div>
    </div>
  );
}
