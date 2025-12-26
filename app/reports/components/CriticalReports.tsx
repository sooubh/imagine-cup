'use client';

import { StockItem } from '@/lib/azureDefaults';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface CriticalReportsProps {
    items?: StockItem[];
    isLoading?: boolean;
}

export function CriticalReports({ items = [], isLoading = false }: CriticalReportsProps) {
    
    // Logic: Low Stock ( < minQuantity or < 20 )
    const lowStockItems = items.filter(i => i.quantity <= (i.minQuantity || 20));
    const lowStockCount = lowStockItems.length;

    // Logic: Dead Stock / Waste (For now, just random logic or 0 if no Dates)
    // Real app would verify expiryDate. Let's assume high stock > 100 with no movement is "Risk"
    const wasteRiskItems = items.filter(i => i.quantity > 500); 
    const wasteRiskCount = wasteRiskItems.length;

    const generateStockOutReport = () => {
        const doc = new jsPDF();
        doc.text("Critical Stock-out Risk Report", 14, 22);
        const rows = lowStockItems.map(i => [i.name, i.category, i.quantity.toString(), (i.minQuantity||20).toString(), i.section]);
        autoTable(doc, {
            head: [['Item', 'Category', 'Current Qty', 'Threshold', 'Section']],
            body: rows,
            startY: 30
        });
        doc.save('stock_out_risk_report.pdf');
    };

    const generateWasteReport = () => {
        const doc = new jsPDF();
        doc.text("Waste Reduction Analysis", 14, 22);
        doc.text("Items with excessive stock levels (> 500 units)", 14, 28);
        const rows = wasteRiskItems.map(i => [i.name, i.category, i.quantity.toString(), i.price.toString(), i.section]);
        autoTable(doc, {
            head: [['Item', 'Category', 'Qty', 'Unit Price', 'Section']],
            body: rows,
            startY: 35
        });
        doc.save('waste_reduction_report.pdf');
    };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">Critical Reports</h3>
        <span className="text-sm font-bold text-neutral-500 flex items-center gap-1">
          {isLoading ? 'Scanning inventory...' : `Analyzed ${items.length} items`}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Stock-out Prevention */}
        <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-[2rem] bg-white dark:bg-[#23220f] shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-bold mb-2">
                <span className="size-2 rounded-full bg-red-600 animate-pulse"></span>
                {lowStockCount} Items At Risk
              </div>
              <h4 className="text-lg font-bold text-neutral-dark dark:text-white mb-1">Stock-out Prevention</h4>
              <p className="text-neutral-500 text-sm leading-relaxed">Items below reorder threshold requires immediate action. <br/><span className="font-semibold text-neutral-dark dark:text-white">Urgency: High</span></p>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={generateStockOutReport} className="flex-1 h-9 rounded-full bg-primary text-black text-xs font-bold flex items-center justify-center gap-2 hover:brightness-95 transition-colors">
                <span className="material-symbols-outlined text-[16px]">download</span> Download PDF
              </button>
            </div>
          </div>
          <div className="w-full sm:w-40 aspect-video sm:aspect-square bg-cover bg-center rounded-2xl" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZt14DoI4725sG9ch5xEHngnnVz3Hfa4W-TXvccJFD1LLOCm8lB-Z4wkQXN41uZustRtXNdBjUhloeK0HhifUBpD42Z-G5pnKZkMSM7xmMretWvHT5pYRH82uyUt-GVMeistgFiQVvwWFcp98bJYNQdr0hCduMI1QhPguU_TnCpR7p4lD83lnS8tydqfq5EolIg1o6qhi32lnh0MApkE9UKw8uufBVTqyyOtaBJFx6qyWvXSfAuUQmdswgWgXS1Kz62yoKyG30I-g')"}}></div>
        </div>
        {/* Card 2: Waste Reduction */}
        <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-[2rem] bg-white dark:bg-[#23220f] shadow-sm border border-neutral-100 dark:border-neutral-700">
          <div className="flex-1 flex flex-col justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold mb-2">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {wasteRiskCount} Overstocked
              </div>
              <h4 className="text-lg font-bold text-neutral-dark dark:text-white mb-1">Waste Reduction Summary</h4>
              <p className="text-neutral-500 text-sm leading-relaxed">Items with excessive stock levels (&gt;500 units). Consider sales or redistribution.</p>
            </div>
            <div className="flex gap-3 mt-2">
              <button onClick={generateWasteReport} className="flex-1 h-9 rounded-full bg-primary text-black text-xs font-bold flex items-center justify-center gap-2 hover:brightness-95 transition-colors">
                <span className="material-symbols-outlined text-[16px]">download</span> Download PDF
              </button>
            </div>
          </div>
          <div className="w-full sm:w-40 aspect-video sm:aspect-square bg-cover bg-center rounded-2xl" style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBA1EysNfUbZIvZTJEULR6fcrtQoavuY96gEnYR9NrTO0Fvgeijxh538--YuMshBXKHiFlVqlWEbNcgcbNc15wEIsC4kGFwzbS8Luo1Z9-LuRgo83blm3TC0-nBtnAEcoaJnh3kc1R-5jZSeiS2QWlMtg-SOdoNASDuf-4CNJwxILkL97WEyNSHBTgYQwAF3pG39DngJ5BX5tfaulWuxrldw0kYSC4qEt9rhqURv0g9Gy3nybtWUnxARxv1MAsG9ERmkknnKeto1LY')"}}></div>
        </div>
      </div>
    </section>
  );
}
