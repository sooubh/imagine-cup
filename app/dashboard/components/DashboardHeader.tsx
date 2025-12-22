'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExportOptions } from '@/app/dashboard/components/ExportOptions';
import { FilterPopover } from '@/app/dashboard/components/FilterPopover';

export function DashboardHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'district';

  const setView = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (view === 'district') {
      params.delete('view'); // Default view
    } else {
      params.set('view', view);
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 bg-white dark:bg-[#2a2912] p-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <button
          onClick={() => setView('district')}
          className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all ${currentView === 'district' ? 'bg-primary text-neutral-dark' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#3a391a]'}`}
        >
          District View
        </button>
        <button
          onClick={() => setView('hospital')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'hospital' ? 'bg-primary text-neutral-dark shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#3a391a]'}`}
        >
          Hospital View
        </button>
        <button
          onClick={() => setView('ngo')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${currentView === 'ngo' ? 'bg-primary text-neutral-dark shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#3a391a]'}`}
        >
          NGO View
        </button>
      </div>
      <div className="flex items-center gap-2">
        <FilterPopover />
        <ExportOptions />
      </div>
    </div>
  );
}
