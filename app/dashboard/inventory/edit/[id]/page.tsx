"use client";

import { useState, useEffect } from "react";
import { use } from "react"; // For unwrapping params
import { motion } from "framer-motion";
import { Server, Save, ArrowLeft, Building2, Package, Calendar } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { StockItem } from "@/lib/azureDefaults";

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSection = searchParams.get('section');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [section, setSection] = useState(initialSection || "");
  const [userRole, setUserRole] = useState<"admin" | "retailer">("retailer");
  const [stores, setStores] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedOwnerId, setSelectedOwnerId] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "General",
    quantity: "",
    price: "",
    unit: "",
    supplier: "",
    description: "",
    batchNumber: "",
    minQuantity: "",
    expiryDate: "",
    manufacturingDate: "",
  });

  // Fetch Existing Data
  useEffect(() => {
    async function fetchItem() {
      try {
        const cookies = document.cookie.split(';');
        const userIdCookie = cookies.find(c => c.trim().startsWith('simulated_user_id='));
        if (!userIdCookie) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const userId = userIdCookie.split('=')[1];
        const { getUser, SIMULATED_USERS } = await import('@/lib/auth');
        const user = getUser(userId);

        if (!user) {
          setError("User not found");
          setLoading(false);
          return;
        }

        const targetSection = initialSection || user.section;
        setSection(targetSection);
        setUserRole(user.role);

        if (user.role === 'admin') {
          const sectionStores = SIMULATED_USERS
            .filter(u => u.section === user.section)
            .map(u => ({ id: u.id, name: u.name }));
          setStores(sectionStores);
        }

        const res = await fetch(`/api/items?section=${targetSection}`);
        if (res.ok) {
          const items: StockItem[] = await res.json();
          const item = items.find(i => i.id === id);
          if (item) {
            setSelectedOwnerId(item.ownerId);
            setFormData({
              name: item.name,
              category: item.category,
              quantity: item.quantity.toString(),
              price: item.price.toString(),
              unit: item.unit || "",
              supplier: item.supplier || "",
              description: item.description || "",
              batchNumber: item.batchNumber || "",
              minQuantity: item.minQuantity?.toString() || "",
              expiryDate: item.expiryDate ? new Date(item.expiryDate).toISOString().split('T')[0] : "",
              manufacturingDate: item.manufacturingDate ? new Date(item.manufacturingDate).toISOString().split('T')[0] : "",
            });
          } else {
            setError("Item not found");
          }
        } else {
          setError("Failed to fetch items");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load item details");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id, initialSection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        price: parseFloat(formData.price),
        unit: formData.unit,
        supplier: formData.supplier,
        description: formData.description,
        batchNumber: formData.batchNumber,
        minQuantity: formData.minQuantity ? parseInt(formData.minQuantity) : undefined,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : undefined,
        manufacturingDate: formData.manufacturingDate ? new Date(formData.manufacturingDate).toISOString() : undefined,
        ownerId: selectedOwnerId,
      };

      const res = await fetch(`/api/items/${id}?section=${section}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to update item");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update item.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Find store name for display
  const currentStoreName = stores.find(s => s.id === selectedOwnerId)?.name || "Current Store";

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Edit Item</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Update inventory details</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#1f1e0b] rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* General Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Package className="size-5" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">General Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Item Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  placeholder="Product Name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                >
                  <option value="General">General</option>
                  <option value="PPE">PPE</option>
                  <option value="Medicines">Medicines</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Food">Food</option>
                </select>
              </div>

              {/* Read-only Store Field */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Associated Store</label>
                <div className="relative">
                  <input
                    type="text"
                    value={currentStoreName}
                    readOnly
                    className="w-full px-4 py-2.5 pl-10 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 cursor-not-allowed outline-none"
                  />
                  <Building2 className="absolute left-3 top-2.5 w-5 h-5 text-neutral-400" />
                </div>
                <p className="text-xs text-neutral-400 mt-1">Store location cannot be changed.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                  placeholder="Add product description..."
                />
              </div>
            </div>
          </section>

          {/* Stock & Pricing */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="size-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center">
                <Server className="size-5" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Stock & Pricing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Unit Type</label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  placeholder="e.g. box, pcs, kg"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Alert Threshold</label>
                <input
                  type="number"
                  name="minQuantity"
                  value={formData.minQuantity}
                  onChange={handleChange}
                  min="0"
                  placeholder="50"
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {/* Additional Details */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b border-neutral-100 dark:border-neutral-800">
              <div className="size-8 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Calendar className="size-5" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Tracking Details</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Supplier</label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Batch Number</label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Manufacturing Date</label>
                <input
                  type="date"
                  name="manufacturingDate"
                  value={formData.manufacturingDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-[#2a2912] focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
            </div>
          </section>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg border border-red-100 dark:border-red-900/50">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="pt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-yellow-400 font-medium shadow-lg shadow-primary/25 transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              {saving ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
