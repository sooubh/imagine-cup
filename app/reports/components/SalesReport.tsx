"use client";

import { Transaction } from '@/lib/azureDefaults';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { ReportAIInsight } from './ReportAIInsight';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SalesReportProps {
    transactions: Transaction[];
    isLoading: boolean;
}

export function SalesReport({ transactions, isLoading }: SalesReportProps) {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.totalAmount, 0);
    const totalOrders = transactions.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Process data for charts
    const salesByMethod = transactions.reduce((acc, t) => {
        acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Prepare AI Context
    const contextData = transactions.slice(0, 20).map(t => 
        `Transaction ${t.id}: ${t.type} of $${t.totalAmount} via ${t.paymentMethod}`
    ).join('\n');

    // Chart Data
    const methodChartData = {
        labels: Object.keys(salesByMethod),
        datasets: [{
            label: 'Transactions by Method',
            data: Object.values(salesByMethod),
            backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'],
            borderRadius: 6,
            borderWidth: 0,
        }]
    };

    // Export PDF
    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text("Sales Report", 14, 22);
        
        doc.setFontSize(10);
        doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, 14, 30);
        doc.text(`Total Orders: ${totalOrders}`, 14, 35);
        
        const tableBody = transactions.map(t => [
            new Date(t.date).toLocaleDateString(),
            t.id,
            t.type,
            t.paymentMethod,
            `$${t.totalAmount.toFixed(2)}`
        ]);

        autoTable(doc, {
            head: [['Date', 'Transaction ID', 'Type', 'Payment', 'Amount']],
            body: tableBody,
            startY: 45,
        });
        
        doc.save('sales_report.pdf');
    };

    const handleExportCSV = () => {
        const headers = ['Date', 'ID', 'Type', 'Payment', 'Amount'];
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + transactions.map(t => `${t.date},${t.id},${t.type},${t.paymentMethod},${t.totalAmount}`).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "sales_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) return <div className="p-10 text-center animate-pulse">Loading Sales Data...</div>;

    return (
        <div className="space-y-6">
            <ReportAIInsight contextData={contextData} type="sales" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Total Revenue</p>
                     <h3 className="text-3xl font-black text-neutral-dark dark:text-white">${totalRevenue.toFixed(2)}</h3>
                 </div>
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Total Orders</p>
                     <h3 className="text-3xl font-black text-neutral-dark dark:text-white">{totalOrders}</h3>
                 </div>
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                     <p className="text-neutral-500 text-sm mb-1">Avg. Order Value</p>
                     <h3 className="text-3xl font-black text-neutral-dark dark:text-white">${avgOrderValue.toFixed(2)}</h3>
                 </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                    <h3 className="font-bold text-neutral-500 mb-4">Payment Methods</h3>
                    <div className="h-64 flex justify-center">
                         <Doughnut data={methodChartData} options={{ maintainAspectRatio: true, plugins: { legend: { position: 'right' } } }} />
                    </div>
                </div>
                 <div className="bg-white dark:bg-[#23220f] p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center justify-center">
                    <p className="text-neutral-400 text-sm">Revenue Trend Chart (Coming Soon)</p>
                </div>
            </div>

            <div className="bg-white dark:bg-[#23220f] p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold">Transaction History</h2>
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
                                <th className="pb-3 px-4">Type</th>
                                <th className="pb-3 px-4">Items</th>
                                <th className="pb-3 px-4">Method</th>
                                <th className="pb-3 px-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {transactions.slice(0, 10).map(t => (
                                <tr key={t.id} className="hover:bg-neutral-50 dark:hover:bg-white/5">
                                    <td className="py-3 px-4 text-sm">{new Date(t.date).toLocaleDateString()}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                            t.type === 'SALE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>{t.type}</span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-neutral-500">{t.items.length} items</td>
                                    <td className="py-3 px-4 text-sm">{t.paymentMethod}</td>
                                    <td className="py-3 px-4 text-right font-bold">${t.totalAmount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
