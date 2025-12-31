"use client";

import { useState, useEffect } from "react";
import { SIMULATED_USERS, UserProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Store, User, Mail, Shield, Settings, CheckCircle, Plus, Trash2, X } from "lucide-react";
import Link from 'next/link';
import { getStoresAction, addStoreAction, deleteStoreAction } from "@/app/actions/admin";
import { SystemStore } from "@/lib/azureDefaults";

export default function StoresManagementPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [stores, setStores] = useState<SystemStore[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form State
    const [newStoreName, setNewStoreName] = useState("");
    const [newStoreSection, setNewStoreSection] = useState("Hospital");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // 1. Get Logged In User
        const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(';').shift();
        }
        const userId = getCookie('simulated_user_id');
        
        if (!userId) {
            router.push('/');
            return;
        }

        const user = SIMULATED_USERS.find(u => u.id === userId);
        if (!user || user.role !== 'admin') {
            router.push('/dashboard');
            return;
        }
        setCurrentUser(user);

        // 2. Fetch Stores
        fetchStores();

    }, [router]);

    const fetchStores = async () => {
        setLoading(true);
        const data = await getStoresAction();
        setStores(data);
        setLoading(false);
    };

    const handleAddStore = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await addStoreAction(newStoreName, newStoreSection);
        if (res.success) {
            setIsAddModalOpen(false);
            setNewStoreName("");
            fetchStores(); // Refresh
        } else {
            alert(res.error || "Failed to add store");
        }
        setSubmitting(false);
    };

    const handleDeleteStore = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete store "${name}"? This will DELETE all stock in it.`)) return;
        
        const res = await deleteStoreAction(id);
        if (res.success) {
            fetchStores();
        } else {
            alert(res.error || "Failed to delete store");
        }
    };

    if (!currentUser) return <div className="p-8 text-white">Checking permissions...</div>;

    return (
        <div className="p-6 md:p-8 space-y-8 relative">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <Store className="w-8 h-8 text-indigo-500" />
                        Stores Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Manage active retailers and sections.
                    </p>
                </div>
                <button 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    <Plus size={18} /> Add New Store
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-slate-500">Loading stores...</div>
            ) : (
                <div className="bg-white dark:bg-[#1f1e0b] rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 dark:bg-[#323118] border-b border-slate-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Store Name</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Container</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                                {stores.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-400">No stores found. Add one to get started.</td>
                                    </tr>
                                )}
                                {stores.map((store) => (
                                    <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                                    {store.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-800 dark:text-slate-200">{store.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                                                        <Shield className="w-3 h-3" /> {store.section}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <code className="px-2 py-1 bg-slate-100 dark:bg-black/30 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
                                                {store.containerName}
                                            </code>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                                                <CheckCircle className="w-3 h-3" />
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right flex justify-end gap-2">
                                            <Link 
                                                href={`/dashboard/stores/${store.name}`} // Using Name as ID for now because createStore generates random ID but backend uses name/container map
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors border border-slate-200 dark:border-neutral-700"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Manage
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteStore(store.id, store.name)}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors border border-transparent hover:border-red-200"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Simple Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1f1e0b] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/10">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Add New Store</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddStore} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Store Name</label>
                                <input 
                                    type="text" 
                                    value={newStoreName}
                                    onChange={e => setNewStoreName(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                    placeholder="e.g. Downtown Pharmacy"
                                    required
                                    minLength={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Section</label>
                                <select 
                                    value={newStoreSection}
                                    onChange={e => setNewStoreSection(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                >
                                    <option value="Hospital">Hospital</option>
                                    <option value="PSD">PSD</option>
                                    <option value="NGO">NGO</option>
                                    <option value="General">General</option>
                                </select>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="flex-1 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={submitting}
                                    className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-lg transition-all disabled:opacity-50"
                                >
                                    {submitting ? "Creating..." : "Create Store"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
