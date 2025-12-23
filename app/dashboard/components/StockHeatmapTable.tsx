'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import stockData from '@/data/sampleStockData.json';
import { filterStockData, getStockStatus, StockItem } from '../lib/utils';
import { useMemo } from 'react';

export function StockHeatmapTable() {
  const searchParams = useSearchParams();

  const { processedData, locations } = useMemo(() => {
    const filters = {
      dateRange: searchParams.get('dateRange') || '7d',
      category: searchParams.get('category') || 'all',
      status: searchParams.get('status') || 'all',
      location: searchParams.get('location') || 'all',
      view: searchParams.get('view') || 'district',
    };

    // We filter data first.
    // However, for the pivot table, if we filter by Location, we only want to show that column?
    // Or if we filter by Status, we show rows that match that status?
    // The `filterStockData` helper filters ROWS (StockItem).
    // If we filter by 'Critical' status, we will get only items that are critical in specific locations.

    const filtered = filterStockData(stockData as StockItem[], filters);

    // Get all unique locations from the FULL dataset to keep columns stable, 
    // UNLESS location filter is applied.
    let allLocations = Array.from(new Set((stockData as StockItem[]).map(i => i.location_name))).sort();

    if (filters.location !== 'all') {
      allLocations = [filters.location];
    }

    // Pivot Data: Map<ItemName, Map<LocationName, StockItem>>
    const pivot = new Map<string, Map<string, StockItem>>();
    const itemDetails = new Map<string, { id: string, category: string, unit: string }>();

    filtered.forEach(item => {
      if (!pivot.has(item.item_name)) {
        pivot.set(item.item_name, new Map());
        itemDetails.set(item.item_name, { id: item.item_id, category: item.category, unit: item.unit });
      }
      pivot.get(item.item_name)!.set(item.location_name, item);
    });

    // Convert to array for rendering
    const rows = Array.from(pivot.entries()).map(([itemName, locMap]) => {
      let totalStock = 0;
      locMap.forEach(item => totalStock += item.closing_stock);
      return {
        itemName,
        details: itemDetails.get(itemName)!,
        locations: locMap,
        totalStock
      };
    });

    return { processedData: rows, locations: allLocations };
  }, [searchParams]);

  return (
    <div className="bg-white dark:bg-[#2a2912] rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden flex-1 flex flex-col">
      <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Stock Health Heatmap</h3>
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
                <th key={loc} className="px-6 py-4">{loc}</th>
              ))}
              <th className="px-6 py-4 text-right">Total Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-sm">
            {processedData.length > 0 ? (
              processedData.map((row) => (
                <tr key={row.itemName} className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group">
                  <td className="px-6 py-4 font-medium sticky left-0 z-10 bg-white dark:bg-[#2a2912] group-hover:bg-neutral-50 dark:group-hover:bg-neutral-800 text-neutral-dark dark:text-white">
                    <Link href={`/item/${row.details.id}`} className="flex items-center gap-3 hover:text-primary transition-colors">
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

                    const status = getStockStatus(item.closing_stock, item.opening_stock);

                    return (
                      <td key={loc} className="px-6 py-4">
                        {status === 'critical' ? (
                          <div className="group/tooltip relative">
                            <div className="w-full h-10 rounded-lg bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border border-red-200 dark:border-red-800/50 flex items-center justify-center font-bold text-xs cursor-pointer">
                              Critical Low
                            </div>
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block w-48 p-3 bg-neutral-900 text-white text-xs rounded-xl shadow-xl z-20">
                              <p className="font-bold mb-1">Stock: {item.closing_stock} {item.unit}</p>
                              <p className="opacity-80">Burn rate: {item.avg_daily_issue}/day</p>
                              <p className="opacity-80">Last supply: {item.lead_time_days} days lead</p>
                            </div>
                          </div>
                        ) : status === 'low' ? (
                          <div className="w-full h-10 rounded-lg bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800/50 flex items-center justify-center font-medium text-xs">
                            Low
                          </div>
                        ) : (
                          <div className="w-full h-10 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-800/50 flex items-center justify-center font-medium text-xs">
                            Healthy
                          </div>
                        )}
                      </td>
                    );
                  })}

                  <td className="px-6 py-4 text-right font-mono text-neutral-500">{row.totalStock} {row.details.unit}</td>
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
    </div>
  );
}
