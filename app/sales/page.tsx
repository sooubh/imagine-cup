'use client';

import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Save, RefreshCw } from 'lucide-react';
import { StockItem, Transaction } from '@/lib/azureDefaults';
import InvoiceModal from '@/components/InvoiceModal';

interface CartItem {
    item: StockItem;
    quantity: number;
}

export default function SalesPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory, setInventory] = useState<StockItem[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [transactionType, setTransactionType] = useState('SALE');
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [latestTransaction, setLatestTransaction] = useState<Transaction | null>(null);
    const [showInvoice, setShowInvoice] = useState(false);

    // Simulate fetching inventory (replace with actual API call)
    useEffect(() => {
        // In a real scenario, you'd fetch this from /api/items?section=...
        // For now, let's just initialize an empty state or fetch from API if possible.
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/items'); // This returns ALL items (default behavior needs adjustment in real app maybe)
            const data = await res.json();
            if (Array.isArray(data)) {
                setInventory(data);
            }
        } catch (error) {
            console.error("Failed to fetch inventory", error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (item: StockItem) => {
        setCart(prev => {
            const existing = prev.find(c => c.item.id === item.id);
            if (existing) {
                if (existing.quantity >= item.quantity) return prev; // Validating stock limit
                return prev.map(c => c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
            }
            return [...prev, { item, quantity: 1 }];
        });
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(c => c.item.id !== itemId));
    };

    const updateQuantity = (itemId: string, delta: number) => {
        setCart(prev => prev.map(c => {
            if (c.item.id === itemId) {
                const newQty = c.quantity + delta;
                if (newQty < 1) return c;
                if (newQty > c.item.quantity) return c;
                return { ...c, quantity: newQty };
            }
            return c;
        }));
    };

    const calculateTotal = () => {
        const subtotal = cart.reduce((acc, curr) => acc + (curr.item.price * curr.quantity), 0);
        const tax = subtotal * 0.18;
        return { subtotal, tax, total: subtotal + tax };
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        // Construct payload
        const payload = {
            items: cart.map(c => ({
                itemId: c.item.id,
                price: c.item.price,
                quantity: c.quantity
            })),
            section: cart[0].item.section, // Assuming single section for now or handle mixed
            transactionType,
            paymentMethod,
            customerName: "Walk-in", // Placeholder
            operatorId: "System"
        };
        
        try {
            const res = await fetch('/api/items/sell', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            if (res.ok) {
                // alert(`Transaction Successful! Invoice: ${data.invoiceNumber}`);
                setLatestTransaction(data);
                setShowInvoice(true);
                setCart([]);
                fetchInventory(); // Refresh stock
            } else {
                alert(`Transaction Failed: ${data.error}`);
            }
        } catch (e) {
            console.error(e);
            alert("Error processing transaction");
        }
    };

    const { subtotal, tax, total } = calculateTotal();

    return (
        <div className="flex h-screen bg-background-light dark:bg-black font-sans overflow-hidden">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col md:flex-row h-full">
                
                {/* Left: Product Catalog */}
                <div className="md:w-2/3 p-4 md:p-6 flex flex-col h-full">
                    {/* Header Section */}
                    <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-display font-bold text-neutral-dark dark:text-white tracking-tight">
                                Point of Sale
                            </h1>
                            <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">
                                Process transactions and manage sales
                            </p>
                        </div>
                        
                        <div className="relative group w-full sm:w-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                            <input 
                                type="text"
                                placeholder="Search inventory..."
                                className="w-full sm:w-80 bg-white dark:bg-[#1f1e0b] rounded-2xl pl-12 pr-4 py-3 border border-neutral-200 dark:border-neutral-800 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </header>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                         {isLoading ? (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-400">
                                <span className="material-symbols-outlined text-4xl mb-4 animate-spin">progress_activity</span>
                                <p>Loading inventory...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20 md:pb-0">
                                {filteredInventory.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => item.quantity > 0 && addToCart(item)}
                                        className={`group bg-white dark:bg-[#1f1e0b] p-5 rounded-[2rem] border border-neutral-100 dark:border-neutral-800 hover:border-primary dark:hover:border-primary/50 cursor-pointer transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col justify-between h-56 ${item.quantity <= 0 ? 'opacity-60 grayscale cursor-not-allowed' : ''}`}
                                    >
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-start">
                                                <span className="inline-flex items-center justify-center size-10 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:bg-primary group-hover:text-black transition-colors">
                                                    <span className="material-symbols-outlined text-xl">
                                                        {item.category === 'Medication' ? 'pill' : 'inventory_2'}
                                                    </span>
                                                </span>
                                                {item.quantity <= 0 && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                                        Out of Stock
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-neutral-dark dark:text-white leading-tight line-clamp-2" title={item.name}>
                                                    {item.name}
                                                </h3>
                                                <p className="text-xs text-neutral-400 font-medium mt-1 uppercase tracking-wide">
                                                    {item.category}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-end justify-between pt-4 border-t border-neutral-50 dark:border-neutral-800/50">
                                            <div>
                                                <p className="text-xs text-neutral-400 font-mono mb-0.5">Price</p>
                                                <p className="font-display font-bold text-xl text-neutral-dark dark:text-white">
                                                    ${item.price}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                 <p className="text-xs text-neutral-400 font-mono mb-0.5">Stock</p>
                                                 <span className={`font-mono font-bold text-sm ${item.quantity < 10 && item.quantity > 0 ? 'text-orange-500' : 'text-neutral-500'}`}>
                                                    {item.quantity}
                                                 </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Cart & Checkout Panel */}
                <div className="md:w-1/3 bg-white dark:bg-[#1f1e0b] flex flex-col border-l border-neutral-100 dark:border-neutral-800 shadow-2xl z-20">
                    <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-black/20 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-display font-bold text-neutral-dark dark:text-white flex items-center gap-3">
                                <span className="flex items-center justify-center size-8 rounded-xl bg-primary text-black">
                                    <ShoppingCart className="w-4 h-4" />
                                </span>
                                Current Order
                            </h2>
                            <span className="px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-500">
                                {cart.reduce((a,c) => a+c.quantity, 0)} Items
                            </span>
                        </div>
                        
                        {/* Transaction Controls */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider ml-1">Type</label>
                                <div className="relative">
                                    <select 
                                        value={transactionType}
                                        onChange={(e) => setTransactionType(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-neutral-800 rounded-xl px-4 py-2.5 text-sm font-bold border border-neutral-200 dark:border-neutral-700 text-neutral-dark dark:text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="SALE">Sale</option>
                                        <option value="INTERNAL_USAGE">Usage</option>
                                        <option value="DAMAGE">Damage</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                        <span className="material-symbols-outlined text-sm">unfold_more</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider ml-1">Payment</label>
                                <div className="relative">
                                    <select 
                                        value={paymentMethod}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-full appearance-none bg-white dark:bg-neutral-800 rounded-xl px-4 py-2.5 text-sm font-bold border border-neutral-200 dark:border-neutral-700 text-neutral-dark dark:text-white focus:outline-none focus:border-primary"
                                    >
                                        <option value="CASH">Cash</option>
                                        <option value="UPI">UPI</option>
                                        <option value="CARD">Card</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                        <span className="material-symbols-outlined text-sm">unfold_more</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/30 dark:bg-black/10">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-neutral-400 space-y-4 opacity-50">
                                <div className="size-24 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                                    <ShoppingCart className="w-10 h-10" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-lg">Cart is Empty</p>
                                    <p className="text-sm">Scan or select items to begin</p>
                                </div>
                            </div>
                        ) : (
                            cart.map(c => (
                                <div key={c.item.id} className="group bg-white dark:bg-[#23220f] p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex gap-4 transition-all hover:border-neutral-300 dark:hover:border-neutral-700">
                                    {/* Qty Controls */}
                                    <div className="flex flex-col items-center justify-center bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 gap-1">
                                        <button 
                                            onClick={() => updateQuantity(c.item.id, 1)} 
                                            className="p-1 hover:bg-white dark:hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-green-600 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                        <span className="text-xs font-mono font-bold w-6 text-center">{c.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(c.item.id, -1)} 
                                            className="p-1 hover:bg-white dark:hover:bg-neutral-700 rounded-lg text-neutral-500 hover:text-red-500 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                    </div>

                                    <div className="flex-1 flex flex-col justify-center min-w-0">
                                        <h4 className="font-bold text-neutral-dark dark:text-white truncate" title={c.item.name}>{c.item.name}</h4>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-neutral-400 font-mono">
                                                ${c.item.price} / {c.item.unit}
                                            </p>
                                            <p className="font-bold text-neutral-dark dark:text-white font-mono">
                                                ${(c.item.price * c.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => removeFromCart(c.item.id)} 
                                        className="self-center p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Checkout */}
                    <div className="p-6 bg-white dark:bg-[#1f1e0b] border-t border-neutral-100 dark:border-neutral-800 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm text-neutral-500">
                                <span>Subtotal</span>
                                <span className="font-mono">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm text-neutral-500">
                                <span>Tax (18%)</span>
                                <span className="font-mono">${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-end border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-4 mt-2">
                                <span className="font-bold text-xl text-neutral-dark dark:text-white">Total</span>
                                <span className="font-display font-bold text-3xl text-neutral-dark dark:text-white">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleCheckout}
                            disabled={cart.length === 0}
                            className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] ${
                                cart.length > 0 
                                ? 'bg-primary hover:bg-[#eae605] text-black shadow-lg hover:shadow-xl hover:shadow-primary/20' 
                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed'
                            }`}
                        >
                            <CreditCard className="w-5 h-5" />
                            {cart.length > 0 ? "Generate Invoice" : "Add Items to Cart"}
                        </button>
                    </div>
                </div>
            </div>
            
            <InvoiceModal 
                transaction={latestTransaction} 
                isOpen={showInvoice} 
                onClose={() => setShowInvoice(false)} 
            />
        </div>
    );
}
