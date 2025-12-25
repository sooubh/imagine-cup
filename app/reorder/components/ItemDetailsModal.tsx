'use client';

import { StockItem } from '@/lib/azureDefaults';

interface ItemDetailsModalProps {
    item: StockItem;
    onClose: () => void;
}

export function ItemDetailsModal({ item, onClose }: ItemDetailsModalProps) {
    const openingStock = 100; // Mock Max Capacity for visualization
    const currentStock = item.quantity;
    const stockLevelPercent = Math.round((currentStock / openingStock) * 100);
    const status = currentStock <= 10 ? 'critical' : currentStock <= 30 ? 'low' : 'good';
    const consumption = openingStock - currentStock;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div
                className="bg-white dark:bg-[#1a1a10] w-full max-w-2xl rounded-3xl shadow-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-start bg-neutral-50/50 dark:bg-black/20">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-2xl font-black text-neutral-dark dark:text-white uppercase tracking-tight">{item.name}</h2>
                            <span className="text-xs font-mono bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500 uppercase">#{item.id}</span>
                        </div>
                        <p className="text-sm text-neutral-500 flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">category</span>
                            {item.category}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="size-10 flex items-center justify-center rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left: Stats */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest font-black text-neutral-400 block mb-3">Live Stock Status</label>
                                <div className="flex items-end gap-3 mb-2">
                                    <span className="text-4xl font-black text-neutral-dark dark:text-white leading-none">{currentStock.toLocaleString()}</span>
                                    <span className="text-neutral-500 font-bold mb-1">units remaining</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-3 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-2">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${status === 'critical' ? 'bg-red-500' : status === 'low' ? 'bg-orange-500' : 'bg-primary'
                                            }`}
                                        style={{ width: `${stockLevelPercent}%` }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase">
                                    <span className="text-neutral-400">Total Capacity: {openingStock.toLocaleString()}</span>
                                    <span className={status === 'critical' ? 'text-red-500' : status === 'low' ? 'text-orange-500' : 'text-primary'}>
                                        {stockLevelPercent}% Available
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-neutral-100 dark:border-neutral-800">
                                    <span className="text-[10px] uppercase font-black text-neutral-400 block mb-1">Consumption</span>
                                    <span className="text-lg font-bold text-neutral-dark dark:text-white">{consumption.toLocaleString()}</span>
                                </div>
                                <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-black/20 border border-neutral-100 dark:border-neutral-800">
                                    <span className="text-[10px] uppercase font-black text-neutral-400 block mb-1">Batch ID</span>
                                    <span className="text-lg font-bold text-neutral-dark dark:text-white font-mono">BT-4921</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Location & Urgency */}
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-widest font-black text-neutral-400 block mb-3">Facility Information</label>
                                <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                                    <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                                    <div>
                                        <h4 className="font-bold text-neutral-dark dark:text-white leading-tight mb-1">{item.section}</h4>
                                        <p className="text-xs text-neutral-500 leading-relaxed italic">Last updated: 45 minutes ago at 14:30 PM (Local Time)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-widest font-black text-neutral-400 block mb-3">Risk Assessment</label>
                                <div className={`p-4 rounded-2xl border ${status === 'critical'
                                        ? 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/30'
                                        : 'bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-900/30'
                                    }`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`material-symbols-outlined ${status === 'critical' ? 'text-red-500' : 'text-green-500'}`}>
                                            {status === 'critical' ? 'warning' : 'check_circle'}
                                        </span>
                                        <span className={`font-bold uppercase text-xs ${status === 'critical' ? 'text-red-700 dark:text-red-400' : 'text-green-700 dark:text-green-400'}`}>
                                            {status === 'critical' ? 'Critical Attention Required' : 'Stock Levels Stable'}
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
                                        {status === 'critical'
                                            ? 'Stock level is below 20%. Please ensure a reorder is processed immediately to avoid service interruption.'
                                            : 'Stock levels are within safe operating range. No immediate action required.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-neutral-50/50 dark:bg-black/20 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full text-sm font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                    >
                        Close
                    </button>
                    <button
                        className="px-8 py-2.5 rounded-full bg-primary text-black text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Export Detailed Report
                    </button>
                </div>
            </div>
        </div>
    );
}
