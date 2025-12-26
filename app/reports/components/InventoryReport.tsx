"use client";

import { StockItem } from '@/lib/azureDefaults';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Doughnut } from 'react-chartjs-2';

interface InventoryReportProps {
    items: StockItem[];
    isLoading: boolean;
}

export function InventoryReport({ items, isLoading }: InventoryReportProps) {
    const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
    const totalValue = items.reduce((sum, i) => sum + (i.quantity * i.price), 0);
    const lowStockCount = items.filter(i => i.quantity <= (i.minQuantity || 20)).length;

    // Dead Stock (assume no movement implies dead stock, but for now just oldest updated?)
    // Or just quantity > 100 and no update recently?
    // Let's list top value items.
    const topValueItems = [...items].sort((a,b) => (b.quantity * b.price) - (a.quantity * a.price)).slice(0, 5);

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Inventory Valuation Report", 14, 22);
        doc.text(`Total Value: $${totalValue.toFixed(2)}`, 14, 30);
        
        const tableBody = items.map(i => [
            i.name,
            i.category,
            i.quantity.toString(),
            `$${i.price}`,
            `$${(i.quantity * i.price).toFixed(2)}`,
            i.section
        ]);

        autoTable(doc, {
            head: [['Item', 'Category', 'Qty', 'Unit Price', 'Total Value', 'Section']],
            body: tableBody,
            startY: 40,
        });
        doc.save('inventory_report.pdf');
    };

     const handleExportCSV = () => {
        const headers = ['Item', 'Category', 'Qty', 'Unit Price', 'Total Value', 'Section'];
        const rows = items.map(i => `${i.name},${i.category},${i.quantity},${i.price},${(i.quantity * i.price).toFixed(2)},${i.section}`);
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "inventory_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <div className="p-10 text-center">Loading Inventory Data...</div>;

    return (
        <div className="space-y-6">
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
                    <div className="flex gap-2">
                        <button onClick={handleExportPDF} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500">
                             <span className="material-symbols-outlined">picture_as_pdf</span>
                        </button>
                        <button onClick={handleExportCSV} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500">
                             <span className="material-symbols-outlined">csv</span>
                        </button>
                    </div>
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
                                     <div className="font-mono font-bold">
                                         ${(item.quantity * item.price).toFixed(2)}
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                     {/* Placeholder for Categorization Chart */}
                     <div className="flex items-center justify-center p-6 bg-neutral-50/50 dark:bg-black/10 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800">
                         <p className="text-neutral-400 text-sm text-center">Chart visualization coming soon</p>
                     </div>
                </div>
            </div>
        </div>
    );
}
