'use client';

import { useState } from 'react';
import { AlertsFilterBar } from './components/AlertsFilterBar';
import { AlertsTimeline } from './components/AlertsTimeline';
import { NotificationChannelsWidget } from './components/NotificationChannelsWidget';
import { ImpactMapWidget } from './components/ImpactMapWidget';
import { AIInsightPanel } from './components/AIInsightPanel';

export type AlertFilter = 'critical' | 'warning' | 'unread';
export type RegionFilter = 'All' | 'North' | 'South' | 'East' | 'West';

export default function AlertsPage() {
  const [activeFilters, setActiveFilters] = useState<AlertFilter[]>(['critical', 'warning', 'unread']);
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('All');

  const handleFilterChange = (filter: AlertFilter) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const setAllFilters = (active: boolean) => {
    if (active) {
      setActiveFilters(['critical', 'warning', 'unread']);
    } else {
      setActiveFilters([]);
    }
  };

  const handleRegionChange = (region: RegionFilter) => {
    setRegionFilter(region);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em] text-neutral-dark dark:text-white">Alerts & Notifications Center</h1>
          <p className="text-neutral-500 dark:text-gray-400 text-base max-w-2xl">Monitor critical stock levels and supply chain disruptions in real-time across all regions.</p>
        </div>

        {/* AI Insight Action Panel */}
        <AIInsightPanel />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filter & Feed (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <AlertsFilterBar
              activeFilters={activeFilters}
              onFilterChange={handleFilterChange}
              onSetAll={setAllFilters}
              regionFilter={regionFilter}
              onRegionChange={handleRegionChange}
            />
            <AlertsTimeline activeFilters={activeFilters} regionFilter={regionFilter} />
          </div>

          {/* Right Column: Channels & Widgets (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
            <NotificationChannelsWidget />
            <ImpactMapWidget />

            {/* Quick Support */}
            <div className="bg-primary/10 rounded-2xl p-4 flex items-center gap-3">
              <div className="size-8 bg-primary rounded-full flex items-center justify-center text-black">
                <span className="material-symbols-outlined text-[20px]">support_agent</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-neutral-dark dark:text-white">Need help resolving?</span>
                <a className="text-xs underline text-neutral-500 hover:text-text-main" href="#">Contact Supply Chain HQ</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
