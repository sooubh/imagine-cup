'use client';

import React from 'react';
import { Download, FileText } from 'lucide-react';

export default function TemplateDownloader() {
    const headers = [
        'name',
        'category',
        'quantity',
        'price',
        'unit',
        'minQuantity',
        'batchNumber',
        'expiryDate',
        'manufacturingDate',
        'supplier',
        'description'
    ];

    const sampleData = [
        {
            name: 'Surgical Masks (Pack of 50)',
            category: 'PPE',
            quantity: 100,
            price: 15.99,
            unit: 'pack',
            minQuantity: 20,
            batchNumber: 'MASK-2024-001',
            expiryDate: '2026-12-31',
            manufacturingDate: '2024-01-15',
            supplier: 'MedSupply Inc.',
            description: 'High-quality disposable surgical masks'
        }
    ];

    const downloadCSV = () => {
        // Create CSV content
        const csvContent = [
            headers.join(','),
            sampleData.map(row =>
                headers.map(header => {
                    const value = row[header as keyof typeof row];
                    // Escape commas and quotes in values
                    return typeof value === 'string' && value.includes(',')
                        ? `"${value}"`
                        : value;
                }).join(',')
            ).join('\n')
        ].join('\n');

        // Download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'inventory_template.csv';
        link.click();
    };

    return (
        <button
            type="button"
            onClick={downloadCSV}
            className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 hover:border-primary rounded-lg transition-all text-sm font-medium text-white shadow-sm"
        >
            <FileText className="w-5 h-5" />
            Download CSV Template
        </button>
    );
}
