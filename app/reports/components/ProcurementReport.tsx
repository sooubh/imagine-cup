"use client";

import { PurchaseOrder } from '@/lib/azureDefaults';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ReportAIInsight } from './ReportAIInsight';

interface ProcurementReportProps {
    orders: PurchaseOrder[];
    isLoading: boolean;
}

export function ProcurementReport({ orders, isLoading }: ProcurementReportProps) {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'PENDING').length;
    const receivedOrders = orders.filter(o => o.status === 'RECEIVED').length;
    
    const totalSpend = orders.reduce((sum, order) => {
        if (order.totalEstimatedCost) return sum + order.totalEstimatedCost;
        return sum + order.items.reduce((isum, item) => isum + ((item.price || 0) * item.requestedQuantity), 0);
    }, 0);

    const contextData = orders.slice(0, 20).map(o => 
        `PO #${o.poNumber}: Status ${o.status}, Vendor ${o.vendor || 'Unknown'}, Total $${(o.totalEstimatedCost || 0).toFixed(2)}`
    ).join('\n');

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Procurement Report", 14, 22);
        doc.text(`Total Spend (Est): $${totalSpend.toFixed(2)}`, 14, 30);
        
        const tableBody: any[] = [];
        orders.forEach(o => {
            o.items.forEach(item => {
                tableBody.push([
                    new Date(o.dateCreated).toLocaleDateString(),
                    o.poNumber,
                     o.status,
                    item.name,
                    item.requestedQuantity,
                    `$${(item.price || 0).toFixed(2)}`,
                    o.vendor || 'N/A'
                ]);
            });
        });

        autoTable(doc, {
            head: [['Date', 'PO #', 'Status', 'Item', 'Qty', 'Unit Price', 'Vendor']],
            body: tableBody,
            startY: 40,
        });
        doc.save('procurement_report.pdf');
    };

    const handleExportCSV = () => {
        const headers = ['Date', 'PO Number', 'Status', 'Item', 'Quantity', 'Unit Price', 'Vendor', 'Total Cost'];
        const rows: string[] = [];
        orders.forEach(o => {
             o.items.forEach(item => {
                 rows.push(`${o.dateCreated},${o.poNumber},${o.status},${item.name},${item.requestedQuantity},${item.price || 0},${o.vendor || ''},${((item.price||0)*item.requestedQuantity).toFixed(2)}`);
             });
        });
        
        const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "procurement_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <div className="p-10 text-center animate-pulse">Loading Procurement Data...</div>;

    return (
        <div className="space-y-6">
            <ReportAIInsight contextData={contextData} type="procurement" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Total Orders Placed</p>
                     <h3 className="text-3xl font-black text-neutral-dark dark:text-white">{totalOrders}</h3>
                 </div>
                  <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Pending Receiving</p>
                     <h3 className="text-3xl font-black text-orange-500">{pendingOrders}</h3>
                 </div>
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Completed Orders</p>
                     <h3 className="text-3xl font-black text-green-600">{receivedOrders}</h3>
                 </div>
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Total Spend (Est)</p>
                     <h3 className="text-3xl font-black text-neutral-dark dark:text-white">${totalSpend.toFixed(2)}</h3>
                 </div>
            </div>

            <div className="bg-white dark:bg-[#23220f] p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Procurement History</h2>
                     <div className="flex gap-2">
                        <button onClick={handleExportPDF} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500" title="PDF">
                             <span className="material-symbols-outlined">picture_as_pdf</span>
                        </button>
                        <button onClick={handleExportCSV} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg text-neutral-500" title="CSV">
                             <span className="material-symbols-outlined">csv</span>
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-neutral-500 text-xs uppercase border-b border-neutral-100 dark:border-neutral-800">
                            <tr>
                                <th className="pb-3 px-4">Date</th>
                                <th className="pb-3 px-4">PO Number</th>
                                <th className="pb-3 px-4">Status</th>
                                <th className="pb-3 px-4">Items Summary</th>
                                <th className="pb-3 px-4 text-right">Batch Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-white/5">
                                    <td className="py-3 px-4 text-sm">{new Date(o.dateCreated).toLocaleDateString()}</td>
                                    <td className="py-3 px-4 font-mono text-sm">{o.poNumber}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            o.status === 'RECEIVED' ? 'bg-green-100 text-green-700' :
                                            o.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                            o.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                            'bg-neutral-100 text-neutral-500'
                                        }`}>{o.status}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-neutral-500">
                                        {o.items.length} items ({o.items.slice(0,2).map(i => i.name).join(", ")}{o.items.length>2?'...':''})
                                    </td>
                                    <td className="py-3 px-4 text-right font-bold">
                                        ${(o.totalEstimatedCost || o.items.reduce((s,i) => s + (i.price||0)*i.requestedQuantity, 0)).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
