'use client';

import { NotificationsDropdown } from './NotificationsDropdown';

interface TopBarProps {
  onMenuClick?: () => void;
  onSearchClick?: () => void;
}

export function TopBar({ onMenuClick, onSearchClick }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md dark:border-neutral-800 dark:bg-[#1f1e0b]/95 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Modern Hamburger Menu Button */}
        <button
          onClick={onMenuClick}
          className="group relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95 dark:from-neutral-800 dark:to-neutral-900 dark:hover:from-neutral-700 dark:hover:to-neutral-800"
          aria-label="Toggle menu"
        >
          <div className="flex flex-col items-center justify-center gap-1.5">
            {/* Top line */}
            <span className="block h-0.5 w-5 rounded-full bg-slate-700 transition-all duration-300 group-hover:w-6 group-hover:bg-indigo-600 dark:bg-slate-300 dark:group-hover:bg-primary"></span>
            {/* Middle line */}
            <span className="block h-0.5 w-5 rounded-full bg-slate-700 transition-all duration-300 group-hover:w-4 group-hover:bg-indigo-600 dark:bg-slate-300 dark:group-hover:bg-primary"></span>
            {/* Bottom line */}
            <span className="block h-0.5 w-5 rounded-full bg-slate-700 transition-all duration-300 group-hover:w-6 group-hover:bg-indigo-600 dark:bg-slate-300 dark:group-hover:bg-primary"></span>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search Button */}
        <button
          onClick={onSearchClick}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-200 group hover:shadow-md"
          title="Search stocks (Ctrl+K)"
        >
          <span className="material-symbols-outlined text-neutral-600 dark:text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-primary transition-colors">search</span>
          <span className="text-sm text-neutral-600 dark:text-neutral-400 hidden lg:inline">Search...</span>
          <kbd className="hidden lg:inline-flex px-2 py-0.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded">⌘K</kbd>
        </button>
        <NotificationsDropdown />
      </div>
    </header>
  );
}
