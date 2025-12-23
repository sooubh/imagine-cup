'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, AlertTriangle, FileText, Settings, BarChart3, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Reorder', href: '/reorder', icon: RefreshCw },
  { name: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-50 dark:bg-[#1f1e0b] border-r border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 hidden md:flex">
      <div className="flex h-16 items-center justify-center border-b border-slate-200 dark:border-neutral-800 px-6">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-primary hover:opacity-80 transition-opacity">
          <BarChart3 className="h-6 w-6" />
          <span>StockHealth AI</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 dark:bg-primary/10 text-indigo-700 dark:text-primary'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-indigo-600 dark:text-primary' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 dark:border-neutral-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-indigo-600 dark:bg-primary/20 p-3 text-white dark:text-primary-light shadow-md">
          <div className="h-8 w-8 rounded-full bg-indigo-500 dark:bg-primary/30 flex items-center justify-center text-xs font-bold text-white dark:text-primary">
            JD
          </div>
          <div className="text-xs">
            <p className="font-semibold text-white dark:text-primary">John Doe</p>
            <p className="text-indigo-200 dark:text-primary/70">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
