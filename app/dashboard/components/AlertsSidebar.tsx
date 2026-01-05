'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { StockItem } from '@/lib/azureDefaults';
import { SIMULATED_USERS } from '@/lib/auth';
import { getSmartAlertsAction } from '@/app/actions/ai';
import { StockInsight } from '@/services/AzureAIService';

interface AlertsSidebarProps {
    alerts?: StockItem[];
}

export function AlertsSidebar({ alerts = [] }: AlertsSidebarProps) {
  const [showAll, setShowAll] = useState(false);
  const [aiAlerts, setAiAlerts] = useState<StockInsight[]>([]);
  const [loading, setLoading] = useState(true);
  
  const getLocationName = (id: string) => SIMULATED_USERS.find(u => u.id === id)?.name || "Unknown Store";

  useEffect(() => {
    async function fetchAIAlerts() {
      if (!alerts || alerts.length === 0) {
        setLoading(false);
        return;
      }
      try {
        const smartAlerts = await getSmartAlertsAction(alerts);
        setAiAlerts(smartAlerts);
      } catch (error) {
        console.error('Failed to fetch AI alerts:', error);
        // Fallback to basic alerts if AI fails
        setAiAlerts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchAIAlerts();
  }, [alerts]);

  const displayedAlerts = showAll ? alerts : alerts.slice(0, 3);
  const hiddenCount = alerts.length - 3;

  // Map AI alerts to items
  const getAIAlertForItem = (itemName: string) => {
    return aiAlerts.find(alert => 
      alert.affectedItems?.some(name => name.toLowerCase().includes(itemName.toLowerCase()))
    );
  };

  return (
    <div className="w-full lg:w-[360px] flex flex-col gap-6 shrink-0">
      
      {/* Urgent Action Sidebar */}
      <div className="bg-white dark:bg-[#1f1e0b] rounded-3xl p-5 shadow-sm border border-transparent dark:border-neutral-800 flex-1">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-neutral-dark dark:text-white">Critical Alerts</h3>
            {alerts.length > 0 && <span className="size-2 rounded-full bg-red-500 animate-pulse"></span>}
            {!loading && aiAlerts.length > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">auto_awesome</span>
                AI
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
            {alerts.length} Issues
          </span>
        </div>

        {loading && alerts.length > 0 && (
          <div className="mb-4 p-3 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-900/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-sm animate-spin">autorenew</span>
            <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
              AI analyzing critical items...
            </span>
          </div>
        )}

        <div className="space-y-3">
            {displayedAlerts.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-sm bg-neutral-50 dark:bg-white/5 rounded-2xl">
                    <span className="material-symbols-outlined text-3xl mb-2 text-green-500">check_circle</span>
                    <p>All stats are healthy.</p>
                </div>
            ) : (
                displayedAlerts.map(item => {
                  const aiAlert = getAIAlertForItem(item.name);
                  const isCritical = aiAlert?.sentiment === 'critical' || item.quantity === 0;
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`p-4 rounded-2xl ${
                        isCritical 
                          ? 'bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20' 
                          : 'bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20'
                      } group hover:scale-[1.02] transition-transform cursor-pointer`}
                    >
                        <div className="flex items-start gap-3">
                        <span className={`material-symbols-outlined text-xl ${
                          isCritical ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {isCritical ? 'error' : 'warning'}
                        </span>
                        <div className="w-full">
                            <h4 className="text-sm font-bold text-neutral-dark dark:text-white mb-1">
                                {aiAlert?.summary || (item.quantity === 0 ? "Stock Depleted" : "Low Stock")}
                            </h4>
                            
                            {/* AI-Generated Suggestion */}
                            {aiAlert ? (
                              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                                <span className="font-bold flex items-center gap-1">
                                  <span className="material-symbols-outlined text-[14px] text-purple-500">auto_awesome</span>
                                  AI Recommendation:
                                </span>
                                {aiAlert.actionableSuggestion}
                              </p>
                            ) : (
                              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed mb-3">
                                <span className="font-bold">{item.name}</span> is down to <span className="font-mono font-bold text-red-600">{item.quantity} {item.unit}</span> at {getLocationName(item.ownerId)}.
                              </p>
                            )}
                            
                            <Link 
                                href={`/reorder`}
                                className={`block w-full text-center py-2 ${
                                  isCritical 
                                    ? 'bg-red-600 hover:bg-red-700' 
                                    : 'bg-orange-600 hover:bg-orange-700'
                                } text-white rounded-lg text-xs font-bold shadow-sm transition-colors`}
                            >
                                {aiAlert ? 'Take Action' : 'Restock Immediately'}
                            </Link>
                        </div>
                        </div>
                    </div>
                  );
                })
            )}
        </div>

        {alerts.length > 3 && (
            <button 
                onClick={() => setShowAll(!showAll)}
                className="w-full mt-4 py-2 text-center text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-white/5 rounded-xl transition-colors flex items-center justify-center gap-1"
            >
                {showAll ? (
                    <>
                        <span>Show Less</span>
                        <span className="material-symbols-outlined text-[16px]">expand_less</span>
                    </>
                ) : (
                    <>
                        <span>View {hiddenCount} More Alerts</span>
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </>
                )}
            </button>
        )}
      </div>
    </div>
  );
}
