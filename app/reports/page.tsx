import { ReportsTabs } from './components/ReportsTabs';
import { CriticalReports } from './components/CriticalReports';
import { RegionalComparison } from './components/RegionalComparison';
import { DataSourcesWidget } from './components/DataSourcesWidget';
import { UserManagementTable } from './components/UserManagementTable';

export default function ReportsPage() {
  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full">
      <div className="w-full flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter text-neutral-dark dark:text-white">Administration Console</h1>
            <p className="text-neutral-500 text-lg max-w-2xl">Manage critical reports, data integrations, and system access controls for your organization.</p>
          </div>
          <div className="flex gap-3">
            <button className="h-10 px-6 rounded-full bg-white dark:bg-[#23220f] border border-neutral-200 dark:border-neutral-700 text-sm font-bold hover:bg-neutral-100 dark:hover:bg-[#2c2b13] transition-colors text-neutral-dark dark:text-white">Documentation</button>
            <button className="h-10 px-6 rounded-full bg-primary text-black text-sm font-bold hover:brightness-95 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Audit Log
            </button>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <ReportsTabs />
        
        {/* Content Area: Reports Tab Active */}
        <div className="flex flex-col gap-8">
          {/* Critical Reports Section */}
          <CriticalReports />
          
          {/* Location & Data Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RegionalComparison />
            <DataSourcesWidget />
          </div>
          
          {/* User Management Preview */}
          <UserManagementTable />
        </div>
      </div>
    </div>
  );
}
