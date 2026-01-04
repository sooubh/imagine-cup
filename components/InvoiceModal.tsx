'use client';

import React, { useEffect } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/lib/azureDefaults';
import { X, Download, Printer } from 'lucide-react';

interface InvoiceModalProps {
    transaction: Transaction | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function InvoiceModal({ transaction, isOpen, onClose }: InvoiceModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.documentElement.classList.add('modal-open');
        } else {
            document.documentElement.classList.remove('modal-open');
        }

        return () => {
            document.documentElement.classList.remove('modal-open');
        };
    }, [isOpen]);

    if (!isOpen || !transaction) return null;

    const generatePDF = () => {
        const doc = new jsPDF();

        // Header - Ledger Shield Branding
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text("LEDGER SHIELD", 105, 15, { align: "center" });

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text("Medical Inventory Management System", 105, 22, { align: "center" });

        // Divider
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 26, 190, 26);

        // Store Info - Left Side
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("STORE INFORMATION", 20, 35);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Store: ${transaction.performedBy}`, 20, 42);
        doc.text(`Store ID: ${transaction.section}`, 20, 48);

        // Invoice Details - Right Side
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("INVOICE", 140, 35);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`#${transaction.invoiceNumber}`, 140, 42);
        doc.text(`Date: ${new Date(transaction.date).toLocaleDateString()}`, 140, 48);
        doc.text(`Type: ${transaction.type}`, 140, 54);
        doc.text(`Bill To: ${transaction.customerName || 'Walk-in'}`, 140, 60);

        // Table
        const tableColumn = ["Item", "Qty", "Price", "Subtotal"];
        const tableRows: any[] = [];

        transaction.items.forEach(item => {
            const itemData = [
                item.name,
                item.quantity,
                `${item.unitPrice.toFixed(2)}`,
                `${item.subtotal.toFixed(2)}`
            ];
            tableRows.push(itemData);
        });

        // @ts-ignore
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 68,
        });

        // Totals
        // @ts-ignore
        const finalY = doc.lastAutoTable.finalY || 100;

        doc.text(`Total Amount: $${transaction.totalAmount.toFixed(2)}`, 140, finalY + 20);
        doc.text(`Payment Method: ${transaction.paymentMethod}`, 20, finalY + 20);

        // Footer
        doc.setFontSize(10);
        doc.text("Thank you for your business!", 105, finalY + 40, { align: "center" });

        return doc;
    };

    const handleDownload = () => {
        const doc = generatePDF();
        doc.save(`${transaction.invoiceNumber}.pdf`);
    };

    const handlePrint = () => {
        const doc = generatePDF();
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-neutral-900 border border-neutral-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="bg-neutral-800 p-4 flex justify-between items-center border-b border-neutral-700">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Invoice Generated
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">{transaction.invoiceNumber}</span>
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content - Visual Preview */}
                <div className="p-8 text-neutral-300 font-mono text-sm max-h-[60vh] overflow-y-auto">
                    <div className="border-b border-neutral-700 pb-6 mb-6">
                        <h3 className="text-3xl font-bold text-primary mb-2">LEDGER SHIELD</h3>
                        <p className="text-xs text-neutral-400 mb-4">Medical Inventory Management System</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-neutral-500 text-xs mb-1">STORE INFORMATION</p>
                                <p className="font-semibold text-white">{transaction.performedBy}</p>
                                <p className="text-neutral-400 text-xs">Store ID: {transaction.section}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-neutral-500 text-xs mb-1">INVOICE DETAILS</p>
                                <p className="font-semibold text-white">#{transaction.invoiceNumber}</p>
                                <p className="text-neutral-400 text-xs">Date: {new Date(transaction.date).toLocaleDateString()}</p>
                                <p className="text-neutral-400 text-xs">Bill To: {transaction.customerName || 'Walk-in'}</p>
                            </div>
                        </div>
                    </div>

                    <table className="w-full mb-8">
                        <thead>
                            <tr className="border-b border-neutral-700 text-left text-gray-400">
                                <th className="py-2">Item</th>
                                <th className="py-2 text-center">Qty</th>
                                <th className="py-2 text-right">Price</th>
                                <th className="py-2 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction.items.map((item, idx) => (
                                <tr key={idx} className="border-b border-neutral-800/50">
                                    <td className="py-2">{item.name}</td>
                                    <td className="py-2 text-center">{item.quantity}</td>
                                    <td className="py-2 text-right">${item.unitPrice.toFixed(2)}</td>
                                    <td className="py-2 text-right">${item.subtotal.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex justify-end border-t border-neutral-700 pt-4">
                        <div className="w-1/2 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>$ {transaction.items.reduce((acc, i) => acc + i.subtotal, 0).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-white">
                                <span>Total</span>
                                <span>${transaction.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 bg-neutral-800 border-t border-neutral-700 flex justify-end gap-3">
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 rounded-lg bg-neutral-700 text-white hover:bg-neutral-600 transition-colors flex items-center gap-2"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button
                        onClick={handleDownload}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors flex items-center gap-2 font-bold"
                    >
                        <Download className="w-4 h-4" /> Download PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
