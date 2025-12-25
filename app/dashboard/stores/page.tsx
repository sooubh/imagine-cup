"use client";

import { useState, useEffect } from "react";
import { SIMULATED_USERS, UserProfile } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { Store, User, Mail, Shield, Settings, CheckCircle } from "lucide-react";
import Link from 'next/link';

export default function StoresManagementPage() {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
    const [stores, setStores] = useState<UserProfile[]>([]);

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
        if (!user) {
            router.push('/');
            return;
        }
        setCurrentUser(user);

        // 2. Filter Stores (Retailers in same section)
        if (user.role === 'admin') {
            const sectionStores = SIMULATED_USERS.filter(u => u.role === 'retailer' && u.section === user.section);
            setStores(sectionStores);
        } else {
            // If a retailer accesses this by URL hacking, just show themselves? Or redirect?
            // Let's redirect non-admins.
            router.push('/dashboard');
        }

    }, [router]);

    if (!currentUser) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-6 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                        <Store className="w-8 h-8 text-indigo-500" />
                        Stores Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">
                        Manage active retailers and stores in the <strong>{currentUser.section} Section</strong>.
                    </p>
                </div>
                <button 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md transition-colors"
                    onClick={() => alert("Add New Store functionality coming soon!")}
                >
                    + Add New Store
                </button>
            </div>

            <div className="bg-white dark:bg-[#1f1e0b] rounded-xl border border-slate-200 dark:border-neutral-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 dark:bg-[#323118] border-b border-slate-200 dark:border-neutral-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Store Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Store ID</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Email</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-neutral-800">
                            {stores.map((store) => (
                                <tr key={store.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                                {store.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800 dark:text-slate-200">{store.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
                                                    <Shield className="w-3 h-3" /> Retailer
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <code className="px-2 py-1 bg-slate-100 dark:bg-black/30 rounded text-xs font-mono text-slate-600 dark:text-slate-400">
                                            {store.id}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                                            <Mail className="w-4 h-4" />
                                            {store.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-900/50">
                                            <CheckCircle className="w-3 h-3" />
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link 
                                            href={`/dashboard/stores/${store.id}`}
                                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors border border-slate-200 dark:border-neutral-700"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Configure
                                        </Link>
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
