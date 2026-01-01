"use client";

import { StockItem } from '@/lib/azureDefaults';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ReportAIInsight } from './ReportAIInsight';
import { ExportButton } from '@/components/ExportButton';
import { formatInventoryForExport } from '@/lib/exportUtils';

ChartJS.register(ArcElement, Tooltip, Legend);

interface InventoryReportProps {
    items: StockItem[];
    isLoading: boolean;
}

export function InventoryReport({ items, isLoading }: InventoryReportProps) {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
    const lowStockCount = items.filter(i => i.quantity <= (i.minQuantity || 20)).length;

    const topValueItems = [...items].sort((a,b) => (b.quantity * b.price) - (a.quantity * a.price)).slice(0, 5);

    // Prepare Context for AI
    const contextData = items.slice(0, 30).map(i => {
        let statusTag = '';
        if (i.quantity <= (i.minQuantity || 10)) statusTag = '[CRITICAL]';
        else if (i.quantity < 50) statusTag = '[Low]';
        if (i.expiryDate && new Date(i.expiryDate) < new Date()) statusTag += ' [EXPIRED]';
        return `- ${i.name}: ${i.quantity} units ${statusTag}`;
    }).join('\n');

    // Chart Data
    const chartData = {
        labels: ['In Stock', 'Low Stock', 'Out of Stock'],
        datasets: [
            {
                data: [
                    items.filter(i => i.status === 'In Stock').length,
                    items.filter(i => i.status === 'Low Stock').length,
                    items.filter(i => i.status === 'Out of Stock').length,
                ],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0,
            },
        ],
    };



    if (isLoading) return <div className="p-10 text-center animate-pulse">Loading Inventory Analysis...</div>;

    return (
        <div className="space-y-6">
             <ReportAIInsight contextData={contextData} type="inventory" />

             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Total Inventory Value</p>
                     <h3 className="text-3xl font-black text-neutral-dark dark:text-white">${totalValue.toFixed(2)}</h3>
                 </div>
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Total Items in Stock</p>
                     <h3 className="text-3xl font-black text-neutral-dark dark:text-white">{totalItems}</h3>
                 </div>
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Low Stock Alerts</p>
                     <h3 className="text-3xl font-black text-red-500">{lowStockCount}</h3>
                 </div>
            </div>

            <div className="bg-white dark:bg-[#23220f] p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Inventory Valuation</h2>
                    <ExportButton 
                        data={formatInventoryForExport(items)}
                        filename="inventory_report"
                        reportTitle="Inventory Valuation Report"
                    />
                 </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div>
                         <h4 className="font-bold text-sm text-neutral-500 uppercase mb-4">Top 5 Highest Value Items</h4>
                         <div className="space-y-3">
                             {topValueItems.map(item => (
                                 <div key={item.id} className="flex justify-between items-center p-3 bg-neutral-50 dark:bg-black/20 rounded-xl">
                                     <div>
                                         <p className="font-bold text-sm">{item.name}</p>
                                         <p className="text-xs text-neutral-400">{item.quantity} units @ ${item.price}</p>
                                     </div>
                                     <div className="font-mono font-bold">${(item.quantity * item.price).toFixed(2)}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                     <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-[#1e1e1e] rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                         <h4 className="font-bold text-sm text-neutral-500 uppercase mb-4 self-start">Stock Status Distribution</h4>
                         <div className="w-64 h-64">
                            <Doughnut data={chartData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'bottom' } } }} />
                         </div>
                     </div>
                </div>
            </div>
        </div>
    );
}
