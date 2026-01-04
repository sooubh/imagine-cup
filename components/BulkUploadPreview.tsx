'use client';

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface BulkUploadItem {
    name: string;
    category: string;
    quantity: number;
    price: number;
    unit?: string;
    minQuantity?: number;
    batchNumber?: string;
    expiryDate?: string;
    manufacturingDate?: string;
    supplier?: string;
    description?: string;
}

interface ValidationError {
    field: string;
    message: string;
}

interface PreviewRow {
    data: BulkUploadItem;
    rowNumber: number;
    errors: ValidationError[];
    status: 'valid' | 'error' | 'warning';
}

interface BulkUploadPreviewProps {
    rows: PreviewRow[];
    onConfirm: () => void;
    onCancel: () => void;
    isUploading: boolean;
}

export default function BulkUploadPreview({ rows, onConfirm, onCancel, isUploading }: BulkUploadPreviewProps) {
    const validRows = rows.filter(r => r.status === 'valid').length;
    const errorRows = rows.filter(r => r.status === 'error').length;
    const warningRows = rows.filter(r => r.status === 'warning').length;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-neutral-900 border border-neutral-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-neutral-800 p-6 border-b border-neutral-700">
                    <h2 className="text-2xl font-bold text-white mb-2">Preview Bulk Upload</h2>
                    <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            <span>{validRows} Valid</span>
                        </div>
                        {warningRows > 0 && (
                            <div className="flex items-center gap-2 text-yellow-400">
                                <AlertTriangle className="w-4 h-4" />
                                <span>{warningRows} Warnings</span>
                            </div>
                        )}
                        {errorRows > 0 && (
                            <div className="flex items-center gap-2 text-red-400">
                                <XCircle className="w-4 h-4" />
                                <span>{errorRows} Errors</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Content - Scrollable Table */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="sticky top-0 bg-neutral-800 z-10">
                                <tr className="border-b border-neutral-700">
                                    <th className="text-left p-3 text-gray-400 font-medium">#</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Name</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Category</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Qty</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Price</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Unit</th>
                                    <th className="text-left p-3 text-gray-400 font-medium">Errors</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row) => (
                                    <tr
                                        key={row.rowNumber}
                                        className={`border-b border-neutral-800 ${row.status === 'error' ? 'bg-red-900/10' :
                                                row.status === 'warning' ? 'bg-yellow-900/10' :
                                                    'hover:bg-white/5'
                                            }`}
                                    >
                                        <td className="p-3 text-gray-400">{row.rowNumber}</td>
                                        <td className="p-3">
                                            {row.status === 'valid' && <CheckCircle className="w-4 h-4 text-green-400" />}
                                            {row.status === 'warning' && <AlertTriangle className="w-4 h-4 text-yellow-400" />}
                                            {row.status === 'error' && <XCircle className="w-4 h-4 text-red-400" />}
                                        </td>
                                        <td className="p-3 text-white">{row.data.name}</td>
                                        <td className="p-3 text-gray-300">{row.data.category}</td>
                                        <td className="p-3 text-gray-300">{row.data.quantity}</td>
                                        <td className="p-3 text-gray-300">${row.data.price}</td>
                                        <td className="p-3 text-gray-300">{row.data.unit || '-'}</td>
                                        <td className="p-3">
                                            {row.errors.length > 0 ? (
                                                <div className="text-xs text-red-400">
                                                    {row.errors.map((err, idx) => (
                                                        <div key={idx}>{err.field}: {err.message}</div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-neutral-800 border-t border-neutral-700 flex justify-between items-center">
                    <p className="text-sm text-gray-400">
                        {errorRows > 0 ? (
                            <span className="text-red-400 font-medium">Please fix errors before uploading</span>
                        ) : (
                            <span>Ready to upload {validRows} items</span>
                        )}
                    </p>
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={isUploading}
                            className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={errorRows > 0 || isUploading}
                            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                <>Confirm Upload</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
