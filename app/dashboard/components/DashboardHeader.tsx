'use client';

import { ExportOptions } from '@/app/dashboard/components/ExportOptions';
import { FilterPopover } from '@/app/dashboard/components/FilterPopover';

export function DashboardHeader() {

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-neutral-dark dark:text-white">Inventory Overview</h1>
      </div>
      <div className="flex items-center gap-2">
        <FilterPopover />
        <ExportOptions />
      </div>
    </div>
  );
}
