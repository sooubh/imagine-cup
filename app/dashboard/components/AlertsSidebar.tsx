import Link from 'next/link';
import Image from 'next/image';

export function AlertsSidebar() {
  return (
    <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
      
      {/* Location Status Widget (New Feature) */}
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl p-1 shadow-sm border border-transparent dark:border-neutral-800">
        <div className="relative w-full h-56 rounded-2xl bg-neutral-100 dark:bg-[#2a2912] overflow-hidden group">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-60 dark:opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image
                    alt="Map of distribution area"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4ljwks1wYl2OKb5aHDEgmfKnT6oIlQNGBkOlP7bSu5dHDisveh8VJ2s5pI7JLGJzxpf8VB-IbJLS1sGWFLbJ1OPDhflz4QeSs05PlEXXxUYqXdaU2YEtbROoATyKPi8QsyC1JWg0YHi8YwONfr7nbcBT04bgYQirn0GmBanzvAqMt44Lo0ziQEgviVkssTNsEOLzFfoR4Ldm3nRuwfun5cI4xeXvafDfWhmaozCCBaPVzZ13KfGEUo0KMctqdXNTwzznlyEHKxCo"
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
            
            {/* Live Status Overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                <div className="flex justify-between items-end">
                    <div>
                        <h4 className="text-white font-bold text-sm">Live Location Status</h4>
                        <p className="text-neutral-300 text-[10px]">17 Stores Active • Updated 2m ago</p>
                    </div>
                    <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg p-2 text-white transition-colors">
                        <span className="material-symbols-outlined text-lg">fullscreen</span>
                    </button>
                </div>
            </div>

            {/* Simulated Pins */}
             <div className="absolute top-1/3 left-1/4 group/pin cursor-pointer">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white dark:border-[#2a2912]"></span>
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-white dark:bg-black rounded-lg text-[10px] font-bold shadow-lg opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Main Hub: OK
                </div>
            </div>

            <div className="absolute bottom-1/3 right-1/3 group/pin cursor-pointer">
                <span className="relative flex h-3 w-3">
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white dark:border-[#2a2912]"></span>
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-white dark:bg-black rounded-lg text-[10px] font-bold shadow-lg opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap z-10">
                    East Wing: 3 Alerts
                </div>
            </div>

             <div className="absolute top-1/2 right-1/4 group/pin cursor-pointer">
                <span className="relative flex h-3 w-3">
                   <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-white dark:border-[#2a2912]"></span>
                </span>
                 <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-1 bg-white dark:bg-black rounded-lg text-[10px] font-bold shadow-lg opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap z-10">
                    North Unit: Low Stock
                </div>
            </div>
        </div>

        {/* List View of Locations */}
        <div className="p-4 space-y-3">
             <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-white/5 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-green-100 text-green-700 font-bold text-xs flex items-center justify-center">MH</div>
                    <div>
                        <h5 className="text-xs font-bold text-neutral-dark dark:text-white">Main Hub</h5>
                        <p className="text-[10px] text-neutral-500">Normal Operations</p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary text-sm">chevron_right</span>
            </div>
             <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-white/5 border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700 transition-all cursor-pointer group">
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-red-100 text-red-700 font-bold text-xs flex items-center justify-center">EW</div>
                    <div>
                        <h5 className="text-xs font-bold text-neutral-dark dark:text-white">East Wing</h5>
                        <p className="text-[10px] text-red-500 font-bold">Critically Low: Insulin</p>
                    </div>
                </div>
                <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary text-sm">chevron_right</span>
            </div>
        </div>
      </div>

      {/* Urgent Action Sidebar */}
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl p-5 shadow-sm border border-transparent dark:border-neutral-800">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Critical Alerts</h3>
            <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>
          </div>
          <Link href="/alerts" className="text-[10px] font-bold text-neutral-400 hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors">
            View All
          </Link>
        </div>

        <div className="space-y-3">
          {/* Alert 1 */}
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 group hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">error</span>
              <div>
                <h4 className="text-sm font-bold text-neutral-dark dark:text-white mb-1">Stock Depleted</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                    <span className="font-bold">Amoxicillin (500mg)</span> has reached 0 stock at East Wing.
                </p>
                <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors">
                    Restock Immediately
                </button>
              </div>
            </div>
          </div>

          {/* Alert 2 */}
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 group hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-orange-600 dark:text-orange-400 text-xl">warning</span>
              <div>
                <h4 className="text-sm font-bold text-neutral-dark dark:text-white mb-1">Expiry Risk</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                    25 kits expiring in <span className="font-bold">3 days</span>. Consider redistribution.
                </p>
              </div>
            </div>
          </div>

          {/* Alert 3 */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 group hover:scale-[1.02] transition-transform cursor-pointer">
             <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">local_shipping</span>
              <div>
                <h4 className="text-sm font-bold text-neutral-dark dark:text-white mb-1">In Transit</h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                   Shipment #8823 is out for delivery. ETA: 2 hrs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
