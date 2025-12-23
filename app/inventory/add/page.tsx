"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Save, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    quantity: "",
    price: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add item");

      setSuccess(true);
      setFormData({ name: "", category: "General", quantity: "", price: "" });
      
      // Optional: Refresh data elsewhere or redirect
      // router.refresh(); 
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save item. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a12] text-white p-6 md:p-12 font-sans flex items-center justify-center relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative z-10 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-blue-500/20 rounded-2xl">
                <Server className="w-8 h-8 text-blue-400" />
            </div>
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Add Inventory
                </h1>
                <p className="text-gray-400 text-sm">New entry for Azure Database</p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium ml-1">Item Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Surgical Masks"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium ml-1">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
              >
                <option value="General" className="bg-[#1a1a24]">General</option>
                <option value="PPE" className="bg-[#1a1a24]">PPE</option>
                <option value="Medication" className="bg-[#1a1a24]">Medication</option>
                <option value="Equipment" className="bg-[#1a1a24]">Equipment</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium ml-1">Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="0"
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium ml-1">Price per Unit ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          {/* Status Messages */}
          {error && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl flex items-center gap-2"
            >
                <AlertCircle className="w-5 h-5" />
                {error}
            </motion.div>
          )}

          {success && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-xl flex items-center gap-2"
            >
                <CheckCircle className="w-5 h-5" />
                Item added successfully to database!
            </motion.div>
          )}

          {/* Actions */}
          <div className="pt-4 flex gap-4">
            <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-all"
            >
                Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save to Azure
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
