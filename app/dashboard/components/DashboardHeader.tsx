'use client';

import { useState } from 'react';
import { ExportOptions } from '@/app/dashboard/components/ExportOptions';

export function DashboardHeader() {
  const [activeView, setActiveView] = useState('district');

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-2 bg-white dark:bg-[#2a2912] p-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <button
          onClick={() => setActiveView('district')}
          className={`px-5 py-2 rounded-full text-sm font-bold shadow-sm transition-all ${activeView === 'district' ? 'bg-primary text-neutral-dark' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#3a391a]'}`}
        >
          District View
        </button>
        <button
          onClick={() => setActiveView('hospital')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeView === 'hospital' ? 'bg-primary text-neutral-dark shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#3a391a]'}`}
        >
          Hospital View
        </button>
        <button
          onClick={() => setActiveView('ngo')}
          className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeView === 'ngo' ? 'bg-primary text-neutral-dark shadow-sm' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#3a391a]'}`}
        >
          NGO View
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-[#2a2912] border border-neutral-200 dark:border-neutral-700 text-sm font-medium hover:bg-neutral-50 dark:hover:bg-[#323118] transition-colors shadow-sm hover:shadow active:scale-95">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Filter
        </button>
        <ExportOptions />
      </div>
    </div>
  );
}
