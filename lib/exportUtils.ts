import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';
import { StockItem, Transaction, Activity, PurchaseOrder } from './azureDefaults';

// Type for generic data objects
type DataItem = Record<string, any>;

// ==================== CSV Export ====================
export const exportToCSV = (data: DataItem[], filename: string) => {
    if (!data || data.length === 0) {
        throw new Error('No data to export');
    }

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// ==================== Alternative Excel Export (Using CSV) ====================
// Note: This exports as CSV for security reasons (xlsx library removed)
// Modern Excel and Google Sheets can open CSV files without issues
export const exportToExcel = async (data: DataItem[], filename: string, sheetName: string = 'Sheet1') => {
    if (!data || data.length === 0) {
        throw new Error('No data to export');
    }

    // Export as CSV instead of Excel for security
    // Modern spreadsheet applications handle CSV files well
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        // Use .csv extension for better compatibility
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// ==================== PDF Export ====================
export const exportToPDF = (
    title: string,
    headers: string[],
    data: (string | number)[][],
    filename: string
) => {
    const doc = new jsPDF();

    // ==================== Header / Letterhead ====================

    // Logo / Brand Name (Top Left)
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(41, 128, 185); // Primary Blue
    doc.text('LedgerShield', 14, 20);

    // Tagline
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Advanced Inventory & Resource Management', 14, 26);

    // Company Details (Top Right)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(80, 80, 80);
    const companyDetails = [
        '123 Innovation Drive',
        'Tech City, TC 90210',
        'support@ledgershield.com',
        '+1 (555) 123-4567'
    ];
    // Right align items
    companyDetails.forEach((line, i) => {
        doc.text(line, 200, 18 + (i * 4), { align: 'right' });
    });

    // Divider Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, 32, 196, 32);

    // ==================== Document Info ====================

    // Report Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text(title, 14, 45);

    // Timestamp
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 51);

    // ==================== Table ====================
    autoTable(doc, {
        startY: 58,
        head: [headers],
        body: data,
        theme: 'grid',
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold',
            halign: 'center'
        },
        styles: {
            fontSize: 9,
            cellPadding: 4,
            overflow: 'linebreak',
            valign: 'middle'
        },
        alternateRowStyles: {
            fillColor: [245, 248, 250]
        },
        // Footer: Page Numbers
        didDrawPage: function (data) {
            // Footer Branding
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            const pageSize = doc.internal.pageSize;
            const pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
            doc.text('Confidential - LedgerShield Internal Report', 14, pageHeight - 10);

            // Page Number
            const pageCount = doc.getNumberOfPages();
            doc.text(`Page ${pageCount}`, 196, pageHeight - 10, { align: 'right' });
        }
    });

    doc.save(`${filename}.pdf`);
};

// ==================== Data Formatters ====================

export function formatInventoryForExport(items: StockItem[]) {
    return items.map(item => ({
        'Item Name': item.name,
        'Category': item.category,
        'Quantity': item.quantity,
        'Unit': item.unit || 'units',
        'Price': `$${item.price.toFixed(2)}`,
        'Status': item.status,
        'Owner': item.ownerId,
        'Section': item.section,
        'Last Updated': new Date(item.lastUpdated).toLocaleString(),
        'Expiry Date': item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'
    }));
}

export function formatSalesForExport(transactions: Transaction[]) {
    return transactions.map(tx => ({
        'Invoice Number': tx.invoiceNumber,
        'Date': new Date(tx.date).toLocaleString(),
        'Type': tx.type,
        'Items Count': tx.items.length,
        'Total Amount': `$${tx.totalAmount.toFixed(2)}`,
        'Payment Method': tx.paymentMethod,
        'Customer': tx.customerName || 'Walk-in',
        'Section': tx.section,
        'Performed By': tx.performedBy
    }));
}

export function formatActivitiesForExport(activities: Activity[]) {
    return activities.map(activity => ({
        'User': activity.user,
        'Action': activity.action,
        'Target': activity.target,
        'Type': activity.type,
        'Section': activity.section,
        'Time': new Date(activity.time).toLocaleString()
    }));
}

export function formatOrdersForExport(orders: PurchaseOrder[]) {
    return orders.map(order => ({
        'PO Number': order.poNumber,
        'Date Created': new Date(order.dateCreated).toLocaleDateString(),
        'Status': order.status,
        'Items Count': order.items.length,
        'Vendor': order.vendor || 'N/A',
        'Estimated Cost': order.totalEstimatedCost ? `$${order.totalEstimatedCost.toFixed(2)}` : 'N/A',
        'Created By': order.createdBy,
        'Approved By': order.approvedBy || 'Pending'
    }));
}
