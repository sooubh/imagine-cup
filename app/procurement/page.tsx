'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { PurchaseOrder } from '@/lib/azureDefaults';
import { fetchItemsForProcurement, createPurchaseOrder, getPurchaseOrders, receiveOrderItems, cancelPurchaseOrder } from '@/app/actions/procurement';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to wrap search params
function ProcurementContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'draft' | 'history'>('draft');
    const [draftItems, setDraftItems] = useState<any[]>([]); // Items to be ordered
    const [orders, setOrders] = useState<PurchaseOrder[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load Draft Items from URL
    useEffect(() => {
        const loadDraft = async () => {
             const itemsParam = searchParams.get('items');
             if (itemsParam) {
                 const uniqueIds = Array.from(new Set(itemsParam.split(',')));
                 
                 try {
                     const selected = await fetchItemsForProcurement(uniqueIds);
                     
                     // Transform into Order Items
                     const orderItems = selected.map(item => ({
                         itemId: item.id,
                         name: item.name,
                         currentStock: item.quantity,
                         requestedQuantity: (item.minQuantity || 20) * 2,
                         unit: item.unit || 'units',
                         section: item.section,
                         price: item.price || 0
                     }));
                     
                     setDraftItems(orderItems);
                 } catch (error) {
                     console.error("Failed to load draft items", error);
                 }
             }
        };
        loadDraft();
    }, [searchParams]);

    // Load Order History
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const fetched = await getPurchaseOrders();
                setOrders(fetched);
            } catch (e) {
                console.error("Failed to fetch orders", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handlePlaceOrder = async () => {
        if (draftItems.length === 0) return;
        
        const newOrder = {
            poNumber: `PO-${Date.now()}`, // Simple ID
            dateCreated: new Date().toISOString(),
            status: 'PENDING',
            items: draftItems,
            createdBy: 'System User', // Mock
            totalEstimatedCost: draftItems.reduce((sum, i) => sum + (i.requestedQuantity * i.price), 0)
        };

        try {
            const created = await createPurchaseOrder(newOrder);
            if (created) {
                setOrders([created, ...orders]);
                setDraftItems([]);
                setActiveTab('history');
                alert('Order Placed Successfully!');
            }
        } catch (e) {
            console.error("Failed to place order", e);
            alert("Failed to place order. Please try again.");
        }
    };

    const handleReceiveOrder = async (order: PurchaseOrder) => {
        if(confirm('Mark this order as received and update stock levels?')) {
            const success = await receiveOrderItems(order);
            if (success) {
                // Refresh local state
                const updated = await getPurchaseOrders();
                setOrders(updated);
            } else {
                alert("Failed to update some stock items. Please check logs.");
            }
        }
    };

    const handleCancelOrder = async (order: PurchaseOrder) => {
        if(confirm('Are you sure you want to cancel this order?')) {
            try {
                await cancelPurchaseOrder(order.id, order.status);
                // Refresh local state
                const updated = await getPurchaseOrders();
                setOrders(updated);
            } catch (e) {
                console.error("Failed to cancel order", e);
                alert("Failed to cancel order.");
            }
        }
    };
    
    const handleExportPDF = (order: PurchaseOrder) => {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text("Purchase Order", 14, 22);
        
        doc.setFontSize(10);
        doc.text(`PO Number: ${order.poNumber}`, 14, 30);
        doc.text(`Date: ${new Date(order.dateCreated).toLocaleDateString()}`, 14, 35);
        doc.text(`Status: ${order.status}`, 14, 40);
        
        const tableBody = order.items.map(item => [
            item.name,
            item.itemId,
            item.requestedQuantity.toString(),
            item.unit,
            item.section
        ]);

        autoTable(doc, {
            head: [['Item Name', 'SKU', 'Qty', 'Unit', 'Section']],
            body: tableBody,
            startY: 45,
        });
        
        doc.save(`PO-${order.poNumber}.pdf`);
    };

    const handleExportCSV = (order: PurchaseOrder) => {
        const headers = ['Item Name', 'SKU', 'Qty', 'Unit', 'Section', 'Est Cost'];
        const rows = order.items.map(item => [
            item.name,
            item.itemId,
            item.requestedQuantity,
            item.unit,
            item.section,
            (item.requestedQuantity * (item.price || 0)).toFixed(2) // Assuming price exists on item interface locally or mapped
        ]);

        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `PO-${order.poNumber}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-dark dark:text-white">Procurement</h1>
                    <p className="text-neutral-500">Manage purchase orders and stock replenishment</p>
                </div>
                <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab('draft')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'draft' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-500'}`}
                    >
                        New Order {draftItems.length > 0 && `(${draftItems.length})`}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white' : 'text-neutral-500'}`}
                    >
                        Order History
                    </button>
                </div>
            </div>

            {/* DRAFT TAB */}
            {activeTab === 'draft' && (
                <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm">
                    {draftItems.length === 0 ? (
                        <div className="text-center py-12 text-neutral-400">
                             <span className="material-symbols-outlined text-4xl mb-2 block">shopping_cart_off</span>
                             <p>No items selected for order.</p>
                             <p className="text-sm mt-2">Go to <button onClick={() => router.push('/reorder')} className="text-primary hover:underline">Reorder Page</button> to select items.</p>
                        </div>
                    ) : (
                        <div>
                             <table className="w-full text-left mb-8">
                                <thead className="text-xs uppercase text-neutral-400 border-b border-gray-100 dark:border-neutral-800">
                                    <tr>
                                        <th className="pb-3 pl-4">Item</th>
                                        <th className="pb-3">Current Stock</th>
                                        <th className="pb-3 w-32">Order Qty</th>
                                        <th className="pb-3">Section</th>
                                        <th className="pb-3 text-right pr-4">Est. Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                                    {draftItems.map((item, idx) => (
                                        <tr key={item.itemId}>
                                            <td className="py-4 pl-4 font-medium">{item.name}</td>
                                            <td className="py-4 text-neutral-500">{item.currentStock} {item.unit}</td>
                                            <td className="py-4">
                                                <input 
                                                    type="number" 
                                                    value={item.requestedQuantity}
                                                    onChange={(e) => {
                                                        const newVal = parseInt(e.target.value) || 0;
                                                        const newItems = [...draftItems];
                                                        newItems[idx].requestedQuantity = newVal;
                                                        setDraftItems(newItems);
                                                    }}
                                                    className="w-24 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent"
                                                />
                                            </td>
                                            <td className="py-4 text-sm">{item.section}</td>
                                            <td className="py-4 pr-4 text-right font-mono">
                                                ${(item.requestedQuantity * item.price).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                             </table>
                             
                             <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-neutral-800">
                                 <button 
                                    onClick={handlePlaceOrder}
                                    className="px-8 py-3 bg-primary hover:bg-[#eae605] text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                                 >
                                     <span className="material-symbols-outlined">shopping_cart_checkout</span>
                                     Place Order
                                 </button>
                             </div>
                        </div>
                    )}
                </div>
            )}

            {/* HISTORY TAB */}
            {activeTab === 'history' && (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white dark:bg-[#1f1e0b] rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold">{order.poNumber}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                            order.status === 'RECEIVED' ? 'bg-green-100 text-green-700 border-green-200' : 
                                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-700 border-red-200' :
                                            'bg-gray-100 text-gray-700 border-gray-200'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-neutral-500">Created {new Date(order.dateCreated).toLocaleDateString()} by {order.createdBy}</p>
                                </div>
                                <div className="flex gap-2">
                                     <button 
                                        onClick={() => handleExportPDF(order)}
                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-neutral-500"
                                        title="Download PDF"
                                     >
                                         <span className="material-symbols-outlined">picture_as_pdf</span>
                                     </button>
                                     <button 
                                        onClick={() => handleExportCSV(order)}
                                        className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full text-neutral-500"
                                        title="Download CSV"
                                     >
                                         <span className="material-symbols-outlined">csv</span>
                                     </button>
                                     {order.status === 'PENDING' && (
                                         <button 
                                            onClick={() => handleReceiveOrder(order)}
                                            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition-colors"
                                         >
                                             Mark Received
                                         </button>
                                     )}
                                     {order.status === 'PENDING' && (
                                         <button 
                                            onClick={() => handleCancelOrder(order)}
                                            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-bold rounded-lg transition-colors border border-red-200"
                                         >
                                             Cancel
                                         </button>
                                     )}
                                </div>
                            </div>
                            
                            <div className="bg-neutral-50 dark:bg-black/20 rounded-xl p-4">
                                <ul className="space-y-2">
                                    {order.items.slice(0, 3).map((item, i) => (
                                        <li key={i} className="flex justify-between text-sm">
                                            <span>{item.requestedQuantity}x <span className="font-medium">{item.name}</span></span>
                                            <span className="text-neutral-500 font-mono">{item.section}</span>
                                        </li>
                                    ))}
                                    {order.items.length > 3 && (
                                        <li className="text-xs text-neutral-400 italic pt-1">
                                            + {order.items.length - 3} more items...
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                    {orders.length === 0 && !isLoading && (
                        <div className="text-center py-12 text-neutral-400">No past orders found.</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function ProcurementPage() {
    return (
        <div className="w-full max-w-[1440px] mx-auto pb-12 px-4 md:px-6 py-8">
            <Suspense fallback={<div className="text-center p-12">Loading...</div>}>
                <ProcurementContent />
            </Suspense>
        </div>
    );
}
