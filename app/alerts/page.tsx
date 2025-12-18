import { AlertsFilterBar } from './components/AlertsFilterBar';
import { AlertsTimeline } from './components/AlertsTimeline';
import { NotificationChannelsWidget } from './components/NotificationChannelsWidget';
import { ImpactMapWidget } from './components/ImpactMapWidget';

export default function AlertsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-6">
        {/* Page Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black tracking-[-0.033em] text-neutral-dark dark:text-white">Alerts & Notifications Center</h1>
          <p className="text-neutral-500 dark:text-gray-400 text-base max-w-2xl">Monitor critical stock levels and supply chain disruptions in real-time across all regions.</p>
        </div>
        
        {/* AI Insight Action Panel */}
        <div className="rounded-2xl border border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/50 dark:bg-yellow-900/10 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-4 items-start">
            <div className="p-2.5 rounded-xl bg-primary text-black shrink-0">
              <span className="material-symbols-outlined filled">auto_awesome</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="font-bold text-lg leading-tight text-neutral-dark dark:text-white">AI Insight: 3 Critical Stock-outs Predicted</h3>
              <p className="text-neutral-500 dark:text-gray-300 text-sm">Predictive analysis suggests shortages within 48h at <span className="font-medium text-neutral-dark dark:text-white">Downtown Hospital</span> based on current consumption rates.</p>
            </div>
          </div>
          <button className="shrink-0 h-10 px-6 rounded-full bg-primary text-black text-sm font-bold hover:bg-[#e6e205] transition-colors flex items-center gap-2">
            <span>View Analysis</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Filter & Feed (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <AlertsFilterBar />
            <AlertsTimeline />
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
