'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getStockStatus } from '../lib/utils';
import { StockItem } from '@/lib/azureDefaults';
import { useMemo, useState } from 'react';
import { SIMULATED_USERS } from '@/lib/auth';

interface InventoryListProps {
    items: StockItem[];
}

export function InventoryList({ items }: InventoryListProps) {
    const router = useRouter();
    const [selectedStore, setSelectedStore] = useState<string>('all');
    const [selectedCategories, setSelectedCategories] = useState<Record<string, string>>({}); // storeId -> category

    const toggleCategory = (storeId: string, category: string) => {
        setSelectedCategories(prev => ({
            ...prev,
            [storeId]: prev[storeId] === category ? 'all' : category
        }));
    };

    const groupedData = useMemo(() => {
        // 1. Group by Store (Owner ID)
        const storesMap = new Map<string, StockItem[]>();

        items.forEach(item => {
            const storeId = item.ownerId;
            if (!storesMap.has(storeId)) {
                storesMap.set(storeId, []);
            }
            storesMap.get(storeId)!.push(item);
        });

        // 2. Sort Stores (Admin First, then Alphabetical)
        const sortedStoreIds = Array.from(storesMap.keys()).sort((a, b) => {
            const userA = SIMULATED_USERS.find(u => u.id === a);
            const userB = SIMULATED_USERS.find(u => u.id === b);

            // Prioritize Admin
            if (userA?.role === 'admin' && userB?.role !== 'admin') return -1;
            if (userA?.role !== 'admin' && userB?.role === 'admin') return 1;

            // Then Alphabetical by Name
            return (userA?.name || a).localeCompare(userB?.name || b);
        });

        // 3. Process each store: Group by Category -> Sort Items
        return sortedStoreIds.map(storeId => {
            const storeItems = storesMap.get(storeId)!;
            const storeUser = SIMULATED_USERS.find(u => u.id === storeId);
            const storeName = storeUser?.name || "Unknown Store";
            const isStoreAdmin = storeUser?.role === 'admin';

            const currentCategoryFilter = selectedCategories[storeId] || 'all';

            // Filter Items by Category
            const filteredStoreItems = currentCategoryFilter === 'all'
                ? storeItems
                : storeItems.filter(i => i.category === currentCategoryFilter);

            // Re-group filtered items by Category for display
            const categoryMap = new Map<string, StockItem[]>();
            filteredStoreItems.forEach(item => {
                if (!categoryMap.has(item.category)) {
                    categoryMap.set(item.category, []);
                }
                categoryMap.get(item.category)!.push(item);
            });

            const sortedCategories = Array.from(categoryMap.keys()).sort();

            const categories = sortedCategories.map(cat => {
                const catItems = categoryMap.get(cat)!.sort((a, b) => a.name.localeCompare(b.name));
                return {
                    name: cat,
                    items: catItems
                };
            });

            // Get all unique categories available in this store (for filter buttons)
            const allAvailableCategories = Array.from(new Set(storeItems.map(i => i.category))).sort();

            return {
                storeId,
                storeName,
                isAdmin: isStoreAdmin,
                categories,
                allAvailableCategories,
                currentCategoryFilter
            };
        }).filter(store => selectedStore === 'all' || store.storeId === selectedStore);

    }, [items, selectedStore, selectedCategories]);

    // Extract all unique stores for the main dropdown
    const uniqueStores = useMemo(() => {
        const stores = new Map<string, string>();
        items.forEach(item => {
            const user = SIMULATED_USERS.find(u => u.id === item.ownerId);
            if (user) stores.set(user.id, user.name);
        });
        return Array.from(stores.entries()).map(([id, name]) => ({ id, name }));
    }, [items]);

    return (
        <div className="flex flex-col gap-8">
            {/* Page Header with Store Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-dark dark:text-white">Full Inventory</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">View and manage stock across all locations.</p>
                </div>
                <div>
                    <select
                        value={selectedStore}
                        onChange={(e) => setSelectedStore(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#1f1e0b] text-neutral-dark dark:text-white font-medium focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                    >
                        <option value="all">All Stores</option>
                        {uniqueStores.map(store => (
                            <option key={store.id} value={store.id}>{store.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {groupedData.map(store => (
                <div key={store.storeId} className="bg-white dark:bg-[#1f1e0b] rounded-3xl shadow-sm overflow-hidden border border-neutral-100 dark:border-neutral-800">
                    {/* Store Header */}
                    <div className={`px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 ${store.isAdmin ? 'bg-indigo-50 dark:bg-indigo-900/20' : 'bg-neutral-50 dark:bg-neutral-900/50'}`}>
                        <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-full flex items-center justify-center ${store.isAdmin ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-white dark:bg-neutral-800 text-neutral-500'}`}>
                                <span className="material-symbols-outlined">{store.isAdmin ? 'admin_panel_settings' : 'store'}</span>
                            </div>
                            <div>
                                <h2 className="font-bold text-lg text-neutral-dark dark:text-white leading-tight">{store.storeName}</h2>
                                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">{store.isAdmin ? 'Central Inventory' : 'Store Inventory'}</p>
                            </div>
                        </div>

                        {/* Category Filters for this Store */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                onClick={() => toggleCategory(store.storeId, 'all')}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${store.currentCategoryFilter === 'all'
                                    ? 'bg-white dark:bg-neutral-800 text-neutral-dark dark:text-white shadow-sm ring-1 ring-neutral-200 dark:ring-neutral-700'
                                    : 'text-neutral-500 hover:bg-white/50 dark:hover:bg-neutral-800/50'}`}
                            >
                                All
                            </button>
                            {store.allAvailableCategories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => toggleCategory(store.storeId, cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${store.currentCategoryFilter === cat
                                        ? (cat === 'Medicine' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' :
                                            cat === 'Supplies' ? 'bg-orange-50 text-orange-600 ring-1 ring-orange-100' :
                                                'bg-purple-50 text-purple-600 ring-1 ring-purple-100')
                                        : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                            <div className="ml-2 px-3 py-1 bg-white dark:bg-black/20 rounded-full text-xs font-bold text-neutral-500 shadow-sm border border-neutral-100 dark:border-neutral-800">
                                {store.categories.reduce((acc, cat) => acc + cat.items.length, 0)} Items
                            </div>
                        </div>
                    </div>

                    {/* Inventory List */}
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {store.categories.map(category => (
                            <div key={category.name}>
                                {/* Category Header */}
                                <div className="bg-neutral-50/50 dark:bg-neutral-900/20 px-6 py-2 border-b border-neutral-100 dark:border-neutral-800">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                        <span className={`w-2 h-2 rounded-full ${category.name === 'Medicine' ? 'bg-blue-400' : category.name === 'Supplies' ? 'bg-orange-400' : 'bg-purple-400'}`}></span>
                                        {category.name}
                                    </h3>
                                </div>

                                {/* Items Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead className="text-xs text-neutral-400 font-medium bg-white dark:bg-[#1f1e0b]">
                                            <tr>
                                                <th className="px-6 py-3 font-normal">Item Name</th>
                                                <th className="px-6 py-3 font-normal text-right">Stock</th>
                                                <th className="px-6 py-3 font-normal text-center">Status</th>
                                                <th className="px-6 py-3 font-normal">Expiry</th>
                                                <th className="px-6 py-3 font-normal text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
                                            {category.items.map(item => {
                                                const status = getStockStatus(item.quantity, 0);
                                                return (
                                                    <tr key={item.id} className="group hover:bg-neutral-50/50 dark:hover:bg-neutral-800/20 transition-colors">
                                                        <td className="px-6 py-3 font-medium text-neutral-dark dark:text-white">
                                                            <Link href={`/item/${item.id}?section=${encodeURIComponent(item.section)}`} className="hover:text-primary transition-colors flex items-center gap-2">
                                                                {item.name}
                                                            </Link>
                                                        </td>
                                                        <td className="px-6 py-3 text-right font-mono text-neutral-600 dark:text-neutral-400">
                                                            {item.quantity} <span className="text-[10px] text-neutral-400">{item.unit}</span>
                                                        </td>
                                                        <td className="px-6 py-3 text-center">
                                                            {status === 'critical' ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400 border border-red-100 dark:border-red-900/50">Critical BO</span>
                                                            ) : status === 'low' ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 border border-orange-100 dark:border-orange-900/50">Low Stock</span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400 border border-green-100 dark:border-green-900/50">Healthy</span>
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-3 text-neutral-500">
                                                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : '-'}
                                                        </td>
                                                        <td className="px-6 py-3 text-right">
                                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Link href={`/dashboard/inventory/edit/${item.id}?section=${encodeURIComponent(item.section)}`} className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-blue-500 transition-colors">
                                                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                                                </Link>
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm("Are you sure you want to delete this item?")) {
                                                                            await fetch(`/api/items/${item.id}`, { method: 'DELETE' });
                                                                            router.refresh();
                                                                            window.location.reload();
                                                                        }
                                                                    }}
                                                                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-md text-neutral-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
