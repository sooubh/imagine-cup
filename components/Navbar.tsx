'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GlobalSearch } from './GlobalSearch';
import { NotificationsDropdown } from './NotificationsDropdown';

export function Navbar() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <header className="w-full bg-white dark:bg-[#2a2912] border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-50">
      <div className="px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 max-w-[1600px] mx-auto w-full">
        {/* Brand & Mobile Menu */}
        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-start">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 text-primary bg-neutral-dark rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">health_metrics</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">LedgerShield</h1>
          </Link>
          <button className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-neutral-100 dark:bg-[#23220f] p-1 rounded-full">
          <Link href="/dashboard" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/dashboard') ? 'bg-white dark:bg-[#2a2912] text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'}`}>
            Dashboard
          </Link>
          <Link href="/sales" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/sales') ? 'bg-white dark:bg-[#2a2912] text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'}`}>
            Sales
          </Link>
          <Link href="/reorder" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/reorder') ? 'bg-white dark:bg-[#2a2912] text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'}`}>
            Reorder
          </Link>
          <Link href="/inventory/add" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/inventory') ? 'bg-white dark:bg-[#2a2912] text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'}`}>
            Add Stock
          </Link>
          <Link href="/alerts" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/alerts') ? 'bg-white dark:bg-[#2a2912] text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'}`}>
            Alerts
          </Link>
          <Link href="/reports" className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${isActive('/reports') ? 'bg-white dark:bg-[#2a2912] text-neutral-dark dark:text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'}`}>
            Reports
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <GlobalSearch />
          <NotificationsDropdown />
          <Link href="/dashboard/settings" className="flex items-center justify-center w-10 h-10 rounded-full bg-background-light dark:bg-[#323118] hover:bg-neutral-200 dark:hover:bg-[#403e20] transition-colors">
            <span className="material-symbols-outlined text-[20px] text-neutral-600 dark:text-neutral-400">settings</span>
          </Link>
          <Link href="/dashboard/settings" className="w-10 h-10 rounded-full bg-cover bg-center border-2 border-white dark:border-[#323118] shadow-sm ml-2 cursor-pointer bg-neutral-200" style={{ backgroundImage: "url('https://i.pravatar.cc/150?img=11')" }}></Link>
        </div>
      </div>
    </header>
  );
}
