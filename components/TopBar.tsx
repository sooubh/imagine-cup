'use client';

import { GlobalSearch } from './GlobalSearch';
import { NotificationsDropdown } from './NotificationsDropdown';

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-sm dark:border-neutral-800 dark:bg-[#1f1e0b]/80">
      <div className="flex items-center gap-4">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-600 dark:text-slate-200"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
      </div>

      <div className="flex items-center gap-4">
        <GlobalSearch />
        <NotificationsDropdown />
      </div>
    </header>
  );
}
