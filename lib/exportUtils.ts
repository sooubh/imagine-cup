import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

// Type for generic data objects
type DataItem = Record<string, any>;

export const exportToCSV = (data: DataItem[], filename: string) => {
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

export const exportToPDF = (
    title: string,
    headers: string[],
    data: (string | number)[][],
    filename: string
) => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    // Add table
    autoTable(doc, {
        startY: 40,
        head: [headers],
        body: data,
        theme: 'striped',
        headStyles: { fillColor: [66, 66, 66] },
    });

    doc.save(`${filename}.pdf`);
};
