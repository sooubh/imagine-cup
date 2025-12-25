"use client";

import { useState, useEffect } from "react";
import { SIMULATED_USERS, UserProfile } from "@/lib/auth";
import { Database, Server } from "lucide-react";

export default function DummyDataGenerator() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Client-side cookie reading to get current user
    const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift();
    }
    const userId = getCookie('simulated_user_id');
    if (userId) {
        const foundUser = SIMULATED_USERS.find(u => u.id === userId);
        if (foundUser) setUser(foundUser);
    }
  }, []);

  const generateItemsForUser = (targetUser: UserProfile) => {
    const categories = ['Medicine', 'PPE', 'Equipment', 'Supplies'];
    const items = [];
    
    for (let i = 0; i < 15; i++) {
        const cat = categories[Math.floor(Math.random() * categories.length)];
        const names = cat === 'Medicine' ? ['Paracetamol', 'Insulin', 'Antibiotics', 'Vaccine', 'Syrup'] :
                      cat === 'PPE' ? ['Masks', 'Gloves', 'Gowns', 'Shields'] :
                      cat === 'Equipment' ? ['Stethoscope', 'BP Monitor', 'Thermometer'] : ['Bandages', 'Cotton', 'Syringes'];
        
        const name = names[Math.floor(Math.random() * names.length)] + ` (${targetUser.section} - ${i+1})`;
        
        items.push({
            name: name,
            category: cat,
            quantity: Math.floor(Math.random() * 500),
            price: Number((Math.random() * 50 + 1).toFixed(2)),
            ownerId: targetUser.id,
            section: targetUser.section
        });
    }
    return items;
  };

  const handleSeed = async () => {
    if (!user) return;
    setLoading(true);
    setStatus("Generating data...");

    try {
        let targets: UserProfile[] = [];

        // If on Add Item Page, we usually just want to populate data for THIS logged in user context
        // regardless of if they are admin or retailer? 
        // Admin likely wants to add data to their *own* logical view or manage.
        // Let's stick to the consistent logic: Admin seeds for all, Retailer for self.
        
        if (user.role === 'admin') {
            targets = SIMULATED_USERS.filter(u => u.role === 'retailer' && u.section === user.section);
        } else {
            targets = [user];
        }

        let totalAdded = 0;
        for (const target of targets) {
            const items = generateItemsForUser(target);
            for (const item of items) {
                await fetch("/api/items", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(item),
                });
            }
            totalAdded += items.length;
        }
        
        setStatus(`Successfully added ${totalAdded} items!`);
        setTimeout(() => setStatus(""), 5000);
        // Optional: refresh page to see items? but this is an add page.
    } catch (err) {
        console.error(err);
        setStatus("Error generating data.");
    } finally {
        setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mt-8 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-semibold text-gray-300">Quick Actions</h3>
                <p className="text-sm text-gray-500">Helpers for development</p>
            </div>
        </div>
        
        <button 
            type="button"
            onClick={handleSeed}
            disabled={loading}
            className="w-full py-4 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20 transition-all flex items-center justify-center gap-2 group"
        >
            {loading ? <Server className="animate-pulse w-5 h-5" /> : <Database className="w-5 h-5 group-hover:scale-110 transition-transform" />}
            {loading ? "Adding Dummy Data..." : `Generate Safe Dummy Data for ${user.section}`}
        </button>
        {status && <p className="text-center text-green-400 mt-2 text-sm">{status}</p>}
    </div>
  );
}
