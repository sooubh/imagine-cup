"use client";
import { useState, useEffect } from 'react';
import { ReportsTabs } from './components/ReportsTabs';
import { CriticalReports } from './components/CriticalReports';
import { RegionalComparison } from './components/RegionalComparison';
import { DataSourcesWidget } from './components/DataSourcesWidget';
import { UserManagementTable } from './components/UserManagementTable';

// New Components
import { SalesReport } from './components/SalesReport';
import { InventoryReport } from './components/InventoryReport';
import { TeamReport } from './components/TeamReport';
import { ProcurementReport } from './components/ProcurementReport';

// Actions
import { getGlobalSalesData, getGlobalInventoryData, getGlobalTeamData, getGlobalProcurementData } from '@/app/actions/reports';
import { Transaction, StockItem, Activity, PurchaseOrder } from '@/lib/azureDefaults';

import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer';
import { AnimatePresence } from 'framer-motion';

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState('overview');
  // ... state declarations ...
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [inventory, setInventory] = useState<StockItem[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // ... useEffect logic ...
  useEffect(() => {
     // ... (keep existing fetch logic)
     const fetchData = async () => {
        setIsLoading(true);
        try {
            // Overview needs Inventory data for Critical Reports
            if (activeTab === 'overview' && inventory.length === 0) {
                 const data = await getGlobalInventoryData();
                 setInventory(data);
            } else if (activeTab === 'sales' && transactions.length === 0) {
                const data = await getGlobalSalesData();
                setTransactions(data);
            } else if (activeTab === 'inventory' && inventory.length === 0) {
                const data = await getGlobalInventoryData();
                setInventory(data);
            } else if (activeTab === 'team' && activities.length === 0) {
                const data = await getGlobalTeamData();
                setActivities(data);
            } else if (activeTab === 'procurement' && orders.length === 0) {
                const data = await getGlobalProcurementData();
                setOrders(data);
            }
        } catch (error) {
            console.error("Failed to fetch report data", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchData();
  }, [activeTab]);


  return (
    <div className="flex-1 flex flex-col items-center py-8 px-4 md:px-10 lg:px-20 max-w-[1600px] mx-auto w-full">
      <div className="w-full flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter text-neutral-dark dark:text-white">Administration Console</h1>
            <p className="text-neutral-500 text-lg max-w-2xl">Manage critical reports, data integrations, and system access controls for your organization.</p>
          </div>
          {/* Global Buttons if needed later */}
        </div>
        
        {/* Tabs Navigation */}
        <ReportsTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        {/* Content Area */}
        <AnimatePresence mode="wait">
            <StaggerContainer key={activeTab} className="flex flex-col gap-8">
                
                {/* OVERVIEW TAB (Legacy + Dashboardy stuff) */}
                {activeTab === 'overview' && (
                    <>
                    <StaggerItem>
                       <CriticalReports items={inventory} isLoading={isLoading} />
                    </StaggerItem>
                    <StaggerItem>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <RegionalComparison />
                        <DataSourcesWidget />
                      </div>
                    </StaggerItem>
                    <StaggerItem>
                      <UserManagementTable />
                    </StaggerItem>
                    </>
                )}

                {/* SALES TAB */}
                {activeTab === 'sales' && (
                    <StaggerItem>
                        <SalesReport transactions={transactions} isLoading={isLoading} />
                    </StaggerItem>
                )}

                {/* INVENTORY TAB */}
                {activeTab === 'inventory' && (
                    <StaggerItem>
                        <InventoryReport items={inventory} isLoading={isLoading} />
                    </StaggerItem>
                )}

                {/* PROCUREMENT TAB */}
                {activeTab === 'procurement' && (
                    <StaggerItem>
                        <ProcurementReport orders={orders} isLoading={isLoading} />
                    </StaggerItem>
                )}

                {/* TEAM TAB */}
                {activeTab === 'team' && (
                    <StaggerItem>
                        <TeamReport activities={activities} isLoading={isLoading} />
                    </StaggerItem>
                )}
            </StaggerContainer>
        </AnimatePresence>
      </div>
    </div>
  );
}
