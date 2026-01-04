import { useState, useMemo } from 'react';
import { StockItem, SystemStore } from '@/lib/azureDefaults';

interface RegionalComparisonProps {
  inventory: StockItem[];
  stores: SystemStore[];
}

export function RegionalComparison({ inventory, stores }: RegionalComparisonProps) {
  const [showMapModal, setShowMapModal] = useState(false);

  const stats = useMemo(() => {
    // 1. Group items by store
    const storeHealth: Record<string, { total: number, low: number, out: number }> = {};

    // Initialize for all known stores
    stores.forEach(store => {
      storeHealth[store.id] = { total: 0, low: 0, out: 0 };
    });

    // Aggregate inventory
    inventory.forEach(item => {
      if (!item.ownerId) return;

      // If we encounter items for a store not in 'stores' list (shouldn't happen ideally but possible), init it
      if (!storeHealth[item.ownerId]) {
        storeHealth[item.ownerId] = { total: 0, low: 0, out: 0 };
      }

      storeHealth[item.ownerId].total++;
      if (item.status === 'Out of Stock') storeHealth[item.ownerId].out++;
      else if (item.status === 'Low Stock') storeHealth[item.ownerId].low++;
    });

    // 2. Categorize Stores
    let stable = 0;
    let critical = 0;
    let lowStock = 0;

    Object.values(storeHealth).forEach(metrics => {
      // Simple logic: 
      // Critical if > 20% items are out of stock OR > 50% are low/out
      // Low Stock if > 20% items are low stock
      // Else Stable

      if (metrics.total === 0) {
        stable++; // Empty store is technically stable (no issues)
        return;
      }

      const outRatio = metrics.out / metrics.total;
      const lowRatio = metrics.low / metrics.total;
      const combinedRatio = (metrics.out + metrics.low) / metrics.total;

      if (outRatio > 0.2 || combinedRatio > 0.5) {
        critical++;
      } else if (lowRatio > 0.2 || metrics.low > 5) { // Absolute number check specifically for small stores
        lowStock++;
      } else {
        stable++;
      }
    });

    return { stable, critical, lowStock, total: stores.length };
  }, [inventory, stores]);

  return (
    <>
      <div className="lg:col-span-2 flex flex-col gap-4">
        <h3 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">Regional Comparison</h3>
        <div className="bg-white dark:bg-[#23220f] p-1 rounded-[2rem] border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden h-96 relative">
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-neutral-100 dark:border-neutral-700 flex items-center gap-2 text-neutral-dark dark:text-white">
              <span className="size-2 bg-red-500 rounded-full"></span> {stats.critical} Critical Zones
            </div>
            <div className="bg-white/90 dark:bg-black/80 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border border-neutral-100 dark:border-neutral-700 flex items-center gap-2 text-neutral-dark dark:text-white">
              <span className="size-2 bg-green-500 rounded-full"></span> {stats.stable} Stable Zones
            </div>
          </div>
          <div className="w-full h-full bg-cover bg-center rounded-[1.8rem]" data-alt="Map showing regional distribution of supplies with heatmap overlay" style={{ backgroundImage: "url('/regional-map.png')" }}></div>
          <button
            onClick={() => setShowMapModal(true)}
            className="absolute bottom-4 right-4 bg-primary text-black px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:brightness-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">map</span> Open Interactive Map
          </button>
        </div>
      </div>

      {/* Interactive Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowMapModal(false)}>
          <div className="bg-white dark:bg-[#1f1e0b] w-full max-w-6xl rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-neutral-dark dark:text-white">Regional Status Map</h2>
                <p className="text-sm text-neutral-500 mt-1">Real-time inventory status across {stats.total} locations</p>
              </div>
              <button onClick={() => setShowMapModal(false)} className="size-10 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
              <iframe
                src="https://www.google.com/maps/d/embed?mid=1h3bB3W6Mf0mWlTR4nRi_nJxQ6vU5Sw8&ehbc=2E312F"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                className="w-full h-full"
              />
            </div>

            <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{stats.stable}</p>
                  <p className="text-xs text-neutral-500">Stable Regions</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-600">{stats.lowStock}</p>
                  <p className="text-xs text-neutral-500">Low Stock</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
                  <p className="text-xs text-neutral-500">Critical</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                  <p className="text-xs text-neutral-500">Total Locations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
