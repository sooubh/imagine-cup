'use client';

import { useSearchParams } from 'next/navigation';
import stockData from '@/data/sampleStockData.json';
import { filterStockData, getStockStatus, isLifeSaving, isLowLeadTime, StockItem } from '../../dashboard/lib/utils';
import { useMemo } from 'react';
import { ActionMenu } from './ActionMenu';

interface ReorderTableProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onViewItem?: (item: StockItem) => void;
  onEditItem?: (item: StockItem) => void;
}

export function ReorderTable({ selectedIds, onSelectionChange, onViewItem, onEditItem }: ReorderTableProps) {
  const searchParams = useSearchParams();

  const filteredItems = useMemo(() => {
    const filters = {
      search: searchParams.get('search') || '',
      criticalOnly: searchParams.get('criticalOnly') === 'true',
      lowLeadTime: searchParams.get('lowLeadTime') === 'true',
      lifeSaving: searchParams.get('lifeSaving') === 'true',
      dateRange: 'all', // Not used here but required by interface
      category: 'all',
      status: 'all',
      location: 'all'
    };

    return filterStockData(stockData as StockItem[], filters);
  }, [searchParams]);

  const allItemIds = useMemo(() => filteredItems.map(i => `${i.item_id}-${i.location_id}`), [filteredItems]);
  const isAllSelected = allItemIds.length > 0 && allItemIds.every(id => selectedIds.includes(id));
  const isSomeSelected = selectedIds.length > 0 && !isAllSelected;

  const toggleAll = () => {
    if (isAllSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(allItemIds);
    }
  };

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(i => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  return (
    <div className="bg-white dark:bg-[#23220f] rounded-3xl border border-neutral-100 dark:border-neutral-700 shadow-sm overflow-hidden mb-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-background-light/50 dark:bg-black/20 border-b border-neutral-100 dark:border-neutral-700 text-neutral-500 text-xs uppercase tracking-wider font-semibold">
              <th className="p-4 pl-6 w-12 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={el => { if (el) el.indeterminate = isSomeSelected; }}
                  onChange={toggleAll}
                  className="rounded border-gray-300 text-primary focus:ring-primary size-4 cursor-pointer"
                />
              </th>
              <th className="p-4 min-w-[200px]">Item Details</th>
              <th className="p-4 min-w-[180px]">Location</th>
              <th className="p-4">Risk Level</th>
              <th className="p-4 text-right">Suggested Qty</th>
              <th className="p-4 w-[200px]">Urgency Score</th>
              <th className="p-4 w-20 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-700">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const id = `${item.item_id}-${item.location_id}`;
                const isSelected = selectedIds.includes(id);
                const status = getStockStatus(item.closing_stock, item.opening_stock);
                const urgencyScore = Math.min(100, Math.round((1 - (item.closing_stock / item.opening_stock)) * 100));

                return (
                  <tr
                    key={id}
                    className={`group hover:bg-primary/5 transition-colors cursor-pointer ${isSelected ? 'bg-primary/5' : ''}`}
                    onClick={() => toggleItem(id)}
                  >
                    <td className="p-4 pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItem(id)}
                        className="rounded border-gray-300 text-primary focus:ring-primary size-4 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-dark dark:text-white group-hover:text-primary transition-colors">{item.item_name}</span>
                        <span className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                          SKU: {item.item_id}
                          {isLifeSaving(item) && (
                            <span className="inline-flex items-center text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded ring-1 ring-blue-500/20">LIFE-SAVING</span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-neutral-500 text-lg">location_on</span>
                        <span className="text-sm text-neutral-dark dark:text-white">{item.location_name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {status === 'critical' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary text-black border border-black/10">
                          <span className="size-1.5 rounded-full bg-red-600 animate-pulse"></span>
                          CRITICAL
                        </span>
                      ) : status === 'low' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                          <span className="size-1.5 rounded-full bg-orange-500"></span>
                          WARNING
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                          <span className="size-1.5 rounded-full bg-green-500"></span>
                          STABLE
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right font-mono font-medium text-neutral-dark dark:text-white">
                      {(item.opening_stock - item.closing_stock).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-bold">
                          <span className={urgencyScore > 80 ? 'text-red-600' : urgencyScore > 50 ? 'text-orange-600' : 'text-green-600'}>
                            {urgencyScore}/100
                          </span>
                          <span className="text-neutral-500">
                            {urgencyScore > 80 ? 'Very High' : urgencyScore > 50 ? 'Moderate' : 'Low'}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${urgencyScore > 80 ? 'bg-gradient-to-r from-yellow-400 to-red-500' :
                              urgencyScore > 50 ? 'bg-orange-400' :
                                'bg-green-500'
                              }`}
                            style={{ width: `${urgencyScore}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        onViewDetails={() => onViewItem?.(item)}
                        onEdit={() => onEditItem?.(item)}
                      />
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-12 text-center text-neutral-500">
                  <span className="material-symbols-outlined text-4xl mb-2 block">search_off</span>
                  No items found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
