import Link from 'next/link';
import Image from 'next/image';

export function AlertsSidebar() {
  return (
    <div className="w-full lg:w-[320px] xl:w-[360px] flex flex-col gap-6 shrink-0">
      {/* Urgent Action Stack */}
      <div className="bg-white dark:bg-[#2a2912] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-neutral-dark dark:text-white">AI Alerts & Actions</h3>
            <span className="material-symbols-outlined text-primary text-sm animate-pulse">auto_awesome</span>
          </div>
          <span className="bg-red-100 text-red-600 text-xs font-bold px-2.5 py-1 rounded-full">3 New</span>
        </div>
        <div className="space-y-3">
          {/* Action Card 1 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#323118] border border-neutral-100 dark:border-neutral-700 group hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-red-100 text-red-600 p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">priority_high</span>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1 group-hover:text-primary-dark transition-colors text-neutral-dark dark:text-white">Impending Expiry</h4>
                <p className="text-xs text-neutral-500 mb-3">200 units of Insulin expiring in 15 days at PHC 04.</p>
                <Link href="/reorder?mode=redistribute" className="block w-full text-center py-2 px-3 rounded-full bg-white dark:bg-[#2a2912] border border-neutral-200 dark:border-neutral-600 text-xs font-bold hover:bg-primary hover:border-primary hover:text-neutral-900 transition-colors text-neutral-dark dark:text-white">
                  Review & Redistribute
                </Link>
              </div>
            </div>
          </div>
          {/* Action Card 2 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-[#323118] border border-neutral-100 dark:border-neutral-700 group hover:border-primary/50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 bg-yellow-100 text-yellow-700 p-1.5 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              </div>
              <div>
                <h4 className="text-sm font-bold mb-1 text-neutral-dark dark:text-white">Delayed Shipment</h4>
                <p className="text-xs text-neutral-500 mb-3">Shipment #4023 to Shelter B is delayed by 48h.</p>
                <div className="flex gap-2">
                  <Link href="/reports" className="flex-1 text-center py-2 px-3 rounded-full bg-white dark:bg-[#2a2912] border border-neutral-200 dark:border-neutral-600 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-dark dark:text-white">
                    Track
                  </Link>
                  <button className="flex-1 py-2 px-3 rounded-full bg-white dark:bg-[#2a2912] border border-neutral-200 dark:border-neutral-600 text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-dark dark:text-white">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Link href="/alerts" className="block w-full text-center mt-4 py-2 text-sm font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
          View All Alerts
        </Link>
      </div>

      {/* Map Summary Widget */}
      <div className="bg-white dark:bg-[#2a2912] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm p-1 overflow-hidden">
        <div className="relative w-full h-48 rounded-xl bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          {/* Placeholder for Map Image */}
          <Image
            alt="Map of distribution area"
            className="w-full h-full object-cover opacity-80"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4ljwks1wYl2OKb5aHDEgmfKnT6oIlQNGBkOlP7bSu5dHDisveh8VJ2s5pI7JLGJzxpf8VB-IbJLS1sGWFLbJ1OPDhflz4QeSs05PlEXXxUYqXdaU2YEtbROoATyKPi8QsyC1JWg0YHi8YwONfr7nbcBT04bgYQirn0GmBanzvAqMt44Lo0ziQEgviVkssTNsEOLzFfoR4Ldm3nRuwfun5cI4xeXvafDfWhmaozCCBaPVzZ13KfGEUo0KMctqdXNTwzznlyEHKxCo"
            fill
            unoptimized
          />
          {/* Overlay Markers */}
          <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"></div>
          <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold shadow-sm text-neutral-dark dark:text-white">
            Region Overview
          </div>
        </div>
        <div className="p-4">
          <h4 className="text-sm font-bold mb-2 text-neutral-dark dark:text-white">Location Status</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                <span className="text-neutral-600 dark:text-neutral-400">Operational</span>
              </div>
              <span className="font-bold text-neutral-dark dark:text-white">14</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                <span className="text-neutral-600 dark:text-neutral-400">Critically Low Stock</span>
              </div>
              <span className="font-bold text-neutral-dark dark:text-white">3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
