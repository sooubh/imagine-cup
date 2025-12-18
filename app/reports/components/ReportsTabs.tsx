export function ReportsTabs() {
  return (
    <div className="w-full border-b border-neutral-100 dark:border-neutral-700 mb-8">
      <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto scrollbar-hide">
        <a className="group relative flex flex-col items-center pb-4 min-w-[80px]" href="#">
          <span className="text-sm font-bold text-neutral-dark dark:text-white">Reports</span>
          <span className="absolute bottom-0 h-[3px] w-full rounded-t-full bg-primary"></span>
        </a>
        <a className="group relative flex flex-col items-center pb-4 min-w-[100px]" href="#">
          <span className="text-sm font-bold text-neutral-500 hover:text-neutral-dark dark:hover:text-white transition-colors">Data Sources</span>
          <span className="absolute bottom-0 h-[3px] w-0 rounded-t-full bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a className="group relative flex flex-col items-center pb-4 min-w-[100px]" href="#">
          <span className="text-sm font-bold text-neutral-500 hover:text-neutral-dark dark:hover:text-white transition-colors">Users & Roles</span>
          <span className="absolute bottom-0 h-[3px] w-0 rounded-t-full bg-primary transition-all group-hover:w-full"></span>
        </a>
        <a className="group relative flex flex-col items-center pb-4 min-w-[120px]" href="#">
          <span className="text-sm font-bold text-neutral-500 hover:text-neutral-dark dark:hover:text-white transition-colors">System Settings</span>
          <span className="absolute bottom-0 h-[3px] w-0 rounded-t-full bg-primary transition-all group-hover:w-full"></span>
        </a>
      </nav>
    </div>
  );
}
