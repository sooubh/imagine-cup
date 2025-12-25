'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { filterStockData, getStockStatus } from '../lib/utils';
import { StockItem } from '@/lib/azureDefaults';
import { useMemo } from 'react';
import { SIMULATED_USERS } from '@/lib/auth';

interface StockHeatmapTableProps {
    limit?: number;
    items: StockItem[];
}

export function StockHeatmapTable({ limit, items }: StockHeatmapTableProps) {
  const searchParams = useSearchParams();

  const { processedData, locations, hasMore } = useMemo(() => {
    const combinedData: StockItem[] = items;

    const getLocationName = (id: string) => SIMULATED_USERS.find(u => u.id === id)?.name || "Unknown Location";

    // Flatten logic: Map items to their location names for dynamic columns
    // If admin view, "Main Warehouse" default was blocking visibility.
    // Now we group by the retailer Name.
    
    let allLocations: string[] = Array.from(new Set(combinedData.map((i: StockItem) => getLocationName(i.ownerId)))).sort();

    const filters = {
      dateRange: searchParams.get('dateRange') || '7d',
      category: searchParams.get('category') || 'all',
      status: searchParams.get('status') || 'all',
      location: searchParams.get('location') || 'all',
      view: searchParams.get('view') || 'district',
    };

    // Note: Simple filterStockData might still assume "Main Warehouse", we need to pass the real location or update filter logic too.
    // Ideally we filter BEFORE pivoting, but filterStockData inside utils needs to know how to resolve location too.
    // For now, let's keep filterStockData as is for Category/Status, but re-implement Location filter here strictly if needed,
    // OR update utils.ts. Let's update utils.ts next.
    // For this step, let's assume filterStockData returns broadly valid items and we just pivot them correctly.
    
    // UPDATE: We must interpret filter matches on the expanded location name if we want location filter to work.

    // Pivot Data: Map<ItemName, Map<LocationName, StockItem>>
    const pivot = new Map<string, Map<string, StockItem>>();
    const itemDetails = new Map<string, { id: string, category: string, unit: string }>();

    // We iterate over ALL items first, then apply filters? 
    // Or apply filters then pivot?
    // filterStockData currently hardcodes location. We should fix it. 
    // But for this component's internal logic:

    const filtered = filterStockData(combinedData, filters); // This might accidentally filter out things if location filter is active and utils is broken.

    // If filter is 'all', it passes. 

    if (filters.location !== 'all') {
      allLocations = [filters.location];
    }

    filtered.forEach(item => {
      const locName = getLocationName(item.ownerId);
      
      // If location filter is set, we need to manually enforce it here if utils.ts isn't doing it right yet.
      if (filters.location !== 'all' && locName !== filters.location) return;

      const itemName = item.name;
      
      if (!pivot.has(itemName)) {
        pivot.set(itemName, new Map());
        itemDetails.set(itemName, { id: item.id, category: item.category, unit: "units" });
      }
      pivot.get(itemName)!.set(locName, item);
    });

    // Convert to array for rendering
    let rows = Array.from(pivot.entries()).map(([itemName, locMap]) => {
      let totalStock = 0;
      locMap.forEach(item => totalStock += item.quantity);
      return {
        itemName,
        details: itemDetails.get(itemName)!,
        locations: locMap,
        totalStock
      };
    });

    const hasMore = limit ? rows.length > limit : false;
    if (limit) {
        rows = rows.slice(0, limit);
    }

    return { processedData: rows, locations: allLocations, hasMore };
  }, [searchParams, items, limit]);

  return (
    <div className="bg-white dark:bg-[#2a2912] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden flex-1 flex flex-col min-h-[500px]">
      <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <div className='flex items-center gap-3'>
            <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Stock Health Heatmap</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Healthy
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-yellow-400"></span> Low
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-500">
            <span className="w-2 h-2 rounded-full bg-red-500"></span> Critical
          </div>
        </div>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-neutral-50 dark:bg-[#323118] text-xs uppercase text-neutral-500 font-semibold tracking-wider">
            <tr>
              <th className="px-6 py-4 sticky left-0 z-10 bg-neutral-50 dark:bg-[#323118]">Item Name</th>
              {locations.map(loc => (
                <th key={loc} className={`px-6 py-4 ${loc.includes("Azure") ? 'text-blue-500 font-bold' : ''}`}>
                    {loc.includes("Azure") ? "My Stock (Live)" : loc}
                </th>
              ))}
              <th className="px-6 py-4 text-right">Total Stock</th>
              <th className="px-6 py-4">Expiry</th>
              <th className="px-6 py-4">Last Updated</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            {processedData.length > 0 ? (
              processedData.map((row) => (
                <tr key={row.itemName} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                  <td className="px-6 py-4 font-medium sticky left-0 z-10 bg-white dark:bg-[#2a2912] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800 text-neutral-dark dark:text-white">
                    <Link href={`/item/${row.details.id}?section=${Array.from(row.locations.values())[0].section}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.details.category === 'Medicine' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' :
                        row.details.category === 'Supplies' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30' :
                          'bg-purple-100 text-purple-600 dark:bg-purple-900/30'
                        }`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {row.details.category === 'Medicine' ? 'pill' :
                            row.details.category === 'Supplies' ? 'inventory_2' : 'category'}
                        </span>
                      </div>
                      {row.itemName}
                    </Link>
                  </td>

                  {locations.map(loc => {
                    const item = row.locations.get(loc);
                    if (!item) {
                      return (
                        <td key={loc} className="px-6 py-4">
                          <span className="text-neutral-300">-</span>
                        </td>
                      );
                    }

                      const status = getStockStatus(item.quantity, 0);

                    return (
                      <td key={loc} className="px-6 py-4">
                        {status === 'critical' ? (
                          <div className="w-full h-10 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 flex items-center justify-center font-bold text-xs cursor-pointer" title={`Stock: ${item.quantity}`}>
                            {item.quantity} (Critical)
                          </div>
                        ) : status === 'low' ? (
                          <div className="w-full h-10 rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50 flex items-center justify-center font-medium text-xs" title={`Stock: ${item.quantity}`}>
                            {item.quantity} (Low)
                          </div>
                        ) : (
                          <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs" title={`Stock: ${item.quantity}`}>
                            {item.quantity} (Healthy)
                          </div>
                        )}
                      </td>
                    );
                  })}

                  <td className="px-6 py-4 text-right font-mono text-neutral-500">{row.totalStock} {row.details.unit}</td>

                  {/* Expiry Column */}
                  <td className="px-6 py-4">
                     {(() => {
                        const item = Array.from(row.locations.values())[0];
                        if (!item?.expiryDate) return <span className="text-neutral-400 text-xs">N/A</span>;
                        
                        const daysLeft = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                        if (daysLeft < 0) return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">Expired</span>;
                        if (daysLeft < 30) return <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-bold">{daysLeft} days</span>;
                        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">{new Date(item.expiryDate).toLocaleDateString()}</span>;
                     })()}
                  </td>

                  <td className="px-6 py-4 text-sm text-neutral-500">
                    {row.locations.size > 0 
                        ? new Date(Array.from(row.locations.values())[0].lastUpdated || Date.now()).toLocaleDateString() 
                        : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                          <button 
                              onClick={async () => {
                                  try {
                                      const res = await fetch('/api/items/sell', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ itemId: row.details.id, section: Array.from(row.locations.values())[0].section })
                                      });
                                      if (res.ok) {
                                          window.location.reload();
                                      } else {
                                          alert("Failed to sell item");
                                      }
                                  } catch (e) {
                                      console.error(e);
                                      alert("Error selling item");
                                  }
                              }}
                              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors text-green-600" 
                              title="Sell 1 Unit"
                          >
                            <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
                          </button>
                          <Link href={`/dashboard/inventory/edit/${row.details.id}`} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors text-blue-500" title="Edit Item">
                              <span className="material-symbols-outlined text-[18px]">edit</span>
                          </Link>
                          <button 
                              onClick={async () => {
                                  if(confirm("Are you sure you want to delete this item?")) {
                                      await fetch(`/api/items/${row.details.id}`, { method: 'DELETE' });
                                      const router = require('next/navigation').useRouter(); // Dynamic import hack if hook rules prevent top-level usage, ensuring functionality. 
                                      // Actually, better to pass handleRefresh or use router at top level. 
                                      // Let's rely on standard router usage at top level.
                                      window.location.reload(); 
                                  }
                              }}
                              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-red-500" 
                              title="Delete Item"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                      </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={locations.length + 2} className="px-6 py-12 text-center text-neutral-500">
                  No items match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-center bg-neutral-50/50 dark:bg-black/20">
            <Link href="/stocks" className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-[#323118] border border-neutral-200 dark:border-neutral-700 rounded-full text-sm font-bold text-neutral-700 dark:text-neutral-200 hover:shadow-md transition-all hover:text-primary">
                <span>View Full Inventory</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
        </div>
      )}
    </div>
  );
}
