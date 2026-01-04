"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Save, CheckCircle, AlertCircle, RefreshCw, Upload, X, FileText, Plus, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import TemplateDownloader from "@/components/TemplateDownloader";
import BulkUploadPreview from "@/components/BulkUploadPreview";
import { useToast } from "@/app/context/ToastContext";

interface FormData {
  name: string;
  category: string;
  quantity: string;
  price: string;
  unit: string;
  minQuantity: string;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate: string;
  supplier: string;
  description: string;
}

interface PreviewRow {
  data: any;
  rowNumber: number;
  errors: { field: string; message: string }[];
  status: 'valid' | 'error' | 'warning';
}

export default function AddItemPage() {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');

  // Bulk Upload State
  const [previewRows, setPreviewRows] = useState<PreviewRow[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    category: "General",
    quantity: "",
    price: "",
    unit: "piece",
    minQuantity: "",
    batchNumber: "",
    expiryDate: "",
    manufacturingDate: "",
    supplier: "",
    description: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validation function
  const validateRow = (row: any, rowNum: number): PreviewRow => {
    const errors: { field: string; message: string }[] = [];

    if (!row.name || String(row.name).trim() === '') {
      errors.push({ field: 'name', message: 'Name is required' });
    }
    if (!row.quantity || isNaN(Number(row.quantity)) || Number(row.quantity) < 0) {
      errors.push({ field: 'quantity', message: 'Valid quantity required' });
    }
    if (!row.price || isNaN(Number(row.price)) || Number(row.price) < 0) {
      errors.push({ field: 'price', message: 'Valid price required' });
    }

    const status = errors.length > 0 ? 'error' : 'valid';

    return {
      data: row,
      rowNumber: rowNum,
      errors,
      status
    };
  };

  // CSV Upload
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map((row, idx) => validateRow(row, idx + 1));
        setPreviewRows(rows);
        setShowPreview(true);
      },
      error: () => {
        toast.error('CSV Parse Error', 'Failed to parse CSV file');
      }
    });

    // Reset input
    e.target.value = '';
  };

  // Confirm Bulk Upload
  const handleBulkUpload = async () => {
    const validRows = previewRows.filter(r => r.status === 'valid');
    if (validRows.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < validRows.length; i++) {
      const row = validRows[i].data;
      try {
        await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: row.name,
            category: row.category || "General",
            quantity: Number(row.quantity),
            price: Number(row.price),
            unit: row.unit || "piece",
            minQuantity: row.minQuantity ? Number(row.minQuantity) : undefined,
            batchNumber: row.batchNumber || undefined,
            expiryDate: row.expiryDate || undefined,
            manufacturingDate: row.manufacturingDate || undefined,
            supplier: row.supplier || undefined,
            description: row.description || undefined
          }),
        });
        successCount++;
      } catch (err) {
        failCount++;
      }
      setUploadProgress(Math.round(((i + 1) / validRows.length) * 100));
    }

    setIsUploading(false);
    setShowPreview(false);
    setPreviewRows([]);

    if (successCount > 0) {
      toast.success('Bulk Upload Complete', `${successCount} items added${failCount > 0 ? `, ${failCount} failed` : ''}`);
    } else {
      toast.error('Upload Failed', 'No items were added');
    }
  };

  // Single Item Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const payload: any = {
        name: formData.name,
        category: formData.category,
        quantity: Number(formData.quantity),
        price: Number(formData.price),
        unit: formData.unit,
      };

      // Add optional fields if provided
      if (formData.minQuantity) payload.minQuantity = Number(formData.minQuantity);
      if (formData.batchNumber) payload.batchNumber = formData.batchNumber;
      if (formData.expiryDate) payload.expiryDate = formData.expiryDate;
      if (formData.manufacturingDate) payload.manufacturingDate = formData.manufacturingDate;
      if (formData.supplier) payload.supplier = formData.supplier;
      if (formData.description) payload.description = formData.description;

      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to add item");

      setSuccess(true);
      toast.success('Item Added', formData.name);

      // Reset form
      setFormData({
        name: "",
        category: "General",
        quantity: "",
        price: "",
        unit: "piece",
        minQuantity: "",
        batchNumber: "",
        expiryDate: "",
        manufacturingDate: "",
        supplier: "",
        description: ""
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to save item. Please check your connection.");
      toast.error('Save Failed', 'Could not add item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans flex flex-col items-center relative overflow-y-auto">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-[#1a1a1a] border border-neutral-700 rounded-3xl relative z-10 shadow-2xl mb-8 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-neutral-700 bg-neutral-900">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-primary/30 rounded-2xl">
              <Server className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Add Inventory
              </h1>
              <p className="text-gray-400 text-sm mt-1">Add items individually or upload in bulk</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-700 bg-black/30">
          <button
            onClick={() => setActiveTab('single')}
            className={`flex-1 py-4 px-6 font-semibold transition-all relative ${activeTab === 'single'
              ? 'text-primary'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Single Item
            {activeTab === 'single' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex-1 py-4 px-6 font-semibold transition-all relative ${activeTab === 'bulk'
              ? 'text-primary'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <Upload className="w-4 h-4 inline mr-2" />
            Bulk Upload
            {activeTab === 'bulk' && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'single' ? (
            <motion.div
              key="single"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 md:p-8"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-primary rounded-full" />
                    Basic Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">Item Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Surgical Masks (Pack of 50)"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                        <option value="General" className="bg-[#1a1a24]">General</option>
                        <option value="PPE" className="bg-[#1a1a24]">PPE</option>
                        <option value="Medication" className="bg-[#1a1a24]">Medication</option>
                        <option value="Equipment" className="bg-[#1a1a24]">Equipment</option>
                        <option value="Supplies" className="bg-[#1a1a24]">Supplies</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">Unit</label>
                      <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                        <option value="piece" className="bg-[#1a1a24]">Piece</option>
                        <option value="box" className="bg-[#1a1a24]">Box</option>
                        <option value="pack" className="bg-[#1a1a24]">Pack</option>
                        <option value="vial" className="bg-[#1a1a24]">Vial</option>
                        <option value="bottle" className="bg-[#1a1a24]">Bottle</option>
                        <option value="kg" className="bg-[#1a1a24]">Kilogram</option>
                        <option value="liter" className="bg-[#1a1a24]">Liter</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Inventory Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-blue-500 rounded-full" />
                    Inventory Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">Quantity *</label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        min="0"
                        placeholder="0"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">Price per Unit ($) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">
                        Minimum Quantity
                        <span className="text-xs text-gray-500 ml-2">(Reorder Alert)</span>
                      </label>
                      <input
                        type="number"
                        name="minQuantity"
                        value={formData.minQuantity}
                        onChange={handleChange}
                        min="0"
                        placeholder="Optional"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">Batch Number</label>
                      <input
                        type="text"
                        name="batchNumber"
                        value={formData.batchNumber}
                        onChange={handleChange}
                        placeholder="e.g. BATCH-2024-001"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Product Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-green-500 rounded-full" />
                    Product Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        Expiry Date
                      </label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        Manufacturing Date
                      </label>
                      <input
                        type="date"
                        name="manufacturingDate"
                        value={formData.manufacturingDate}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm text-gray-400 font-medium ml-1">Supplier</label>
                      <input
                        type="text"
                        name="supplier"
                        value={formData.supplier}
                        onChange={handleChange}
                        placeholder="e.g. MedSupply Inc."
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <div className="w-1 h-5 bg-purple-500 rounded-full" />
                    Additional Details
                  </h3>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 font-medium ml-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Add any additional notes or description..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
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
                    Item added successfully!
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
                    className="flex-[2] py-4 rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-black font-bold shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Item
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="bulk"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 md:p-8"
            >
              <div className="space-y-6">
                {/* Template Download */}
                <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Step 1: Download Template</h3>
                  <p className="text-sm text-neutral-600 dark:text-gray-400 mb-4">
                    Download a template file to see the required format for bulk upload
                  </p>
                  <TemplateDownloader />
                </div>

                {/* File Upload */}
                <div className="bg-neutral-50 dark:bg-white/5 border border-neutral-200 dark:border-white/10 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-3">Step 2: Upload Your File</h3>
                  <p className="text-sm text-neutral-600 dark:text-gray-400 mb-4">
                    Upload a CSV file with your inventory data
                  </p>


                  <div className="relative group max-w-md mx-auto">
                    <div className="border-2 border-dashed border-neutral-600 group-hover:border-primary rounded-xl p-12 text-center cursor-pointer transition-all bg-neutral-800/50 group-hover:bg-neutral-800">
                      <FileText className="w-16 h-16 text-primary mx-auto mb-4" />
                      <p className="font-semibold text-white mb-2 text-lg">Upload CSV File</p>
                      <p className="text-sm text-gray-400">Click to browse or drag and drop</p>
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleCSVUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <p className="text-sm text-blue-300">
                    <strong>Required fields:</strong> name, category, quantity, price<br />
                    <strong>Optional fields:</strong> unit, minQuantity, batchNumber, expiryDate, manufacturingDate, supplier, description
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bulk Upload Preview Modal */}
      {showPreview && (
        <BulkUploadPreview
          rows={previewRows}
          onConfirm={handleBulkUpload}
          onCancel={() => {
            setShowPreview(false);
            setPreviewRows([]);
          }}
          isUploading={isUploading}
        />
      )}
    </div>
  );
}
