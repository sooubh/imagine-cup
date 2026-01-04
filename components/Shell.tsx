'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

export function Shell({ children, onSearchClick }: { children: React.ReactNode; onSearchClick?: () => void }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // If on login page, don't show shell layout
  if (pathname === '/') {
    return <main className="min-h-screen bg-[#05050A] text-white">{children}</main>;
  }

  const handleMenuClick = () => {
    // On mobile (< 768px): Open sidebar overlay
    // On desktop: Toggle collapse state
    if (window.innerWidth < 768) {
      setIsSidebarOpen(true);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f0f12] overflow-hidden">
      {/* Sidebar - Desktop */}
      <div
        className={`hidden md:block shadow-xl transition-all duration-500 ease-in-out bg-white dark:bg-[#1f1e0b] ${isCollapsed ? 'w-20' : 'w-64'
          }`}
      >
        <Sidebar isCollapsed={isCollapsed} />
      </div>

      {/* Sidebar - Mobile Wrapper */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-[#1f1e0b] shadow-2xl transition-transform duration-300 ease-out md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar onMenuClick={handleMenuClick} onSearchClick={onSearchClick} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6">
          <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
