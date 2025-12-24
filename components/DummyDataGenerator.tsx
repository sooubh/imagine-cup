"use client";

import { useState } from "react";
import { Server, Database, CheckCircle, Loader2 } from "lucide-react";

export default function DummyDataGenerator() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [progress, setProgress] = useState(0);

  const categories = ["PPE", "Medication", "Equipment", "General"];
  const ITEMS_PER_CATEGORY = 100;

  const generateRandomItem = (category: string, index: number) => {
    const prefixes = ["Premium", "Standard", "Basic", "Advanced", "Ultra"];
    const baseNames: Record<string, string[]> = {
      PPE: ["Mask", "Gloves", "Gown", "Face Shield", "Hazmat Suit", "Boot Covers"],
      Medication: ["Antibiotics", "Painkillers", "Insulin", "Vaccine", "Antiviral", "Vitamins"],
      Equipment: ["Ventilator", "Monitor", "Stethoscope", "Thermometer", "BP Cuff", "Syringe Pump"],
      General: ["Bandages", "Gauze", "Sanitizer", "Disinfectant", "Bed Sheets", "Towels"]
    };
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const base = baseNames[category][Math.floor(Math.random() * baseNames[category].length)];
    
    return {
      name: `${prefix} ${base} type-${Math.floor(Math.random() * 1000)}`,
      category,
      quantity: Math.floor(Math.random() * 500),
      price: Number((Math.random() * 100 + 1).toFixed(2)),
    };
  };

  const handleGenerate = async () => {
    if (!confirm("This will add 400+ items to your database. Continue?")) return;
    
    setLoading(true);
    setStatus("Starting generation...");
    setProgress(0);
    
    let successCount = 0;
    const totalItems = categories.length * ITEMS_PER_CATEGORY;

    try {
      for (const category of categories) {
        for (let i = 0; i < ITEMS_PER_CATEGORY; i++) {
          const item = generateRandomItem(category, i);
          
          try {
            const res = await fetch("/api/items", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(item),
            });
            
            if (res.ok) successCount++;
          } catch (e) {
            console.error("Failed to add dummy item", e);
          }

          const currentProgress = ((successCount / totalItems) * 100);
          setProgress(Math.round(currentProgress));
          setStatus(`Generated ${successCount} / ${totalItems} items...`);
        }
      }
      setStatus(`Completed! Added ${successCount} items.`);
    } catch (error) {
      setStatus("Error during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mt-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <Database className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Developer Tools</h3>
          <p className="text-gray-400 text-sm">Populate database for testing</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between bg-black/20 p-4 rounded-lg">
          <div className="text-sm text-gray-300">
            <span className="font-bold text-white">Batch Generator:</span> Adds 100 items for each category (PPE, Medication, Equipment, General).
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Server className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Dummy Data"}
          </button>
        </div>

        {loading && (
          <div className="w-full bg-gray-700 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
            <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
        )}
        
        {status && (
          <p className={`text-sm ${status.includes("Error") ? "text-red-400" : "text-green-400"} flex items-center gap-2`}>
             {status.includes("Completed") && <CheckCircle className="w-4 h-4" />}
             {status}
          </p>
        )}
      </div>
    </div>
  );
}
