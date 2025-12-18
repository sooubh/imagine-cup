'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Package, AlertTriangle, FileText, Settings, BarChart3, RefreshCw } from 'lucide-react';
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
    <div className="flex h-full w-64 flex-col bg-slate-50 border-r border-slate-200 text-slate-700 hidden md:flex">
      <div className="flex h-16 items-center justify-center border-b border-slate-200 px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-indigo-600">
          <BarChart3 className="h-6 w-6" />
          <span>StockHealth AI</span>
        </div>
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
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              )}
            >
              <item.icon
                className={clsx(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-200 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-indigo-600 p-3 text-white shadow-md">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="text-xs">
            <p className="font-semibold">John Doe</p>
            <p className="text-indigo-200">Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}
