interface ReportsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function ReportsTabs({ activeTab, onTabChange }: ReportsTabsProps) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sales', label: 'Sales Report' },
    { id: 'inventory', label: 'Inventory Valuation' },
    { id: 'procurement', label: 'Procurement' },
    { id: 'team', label: 'Team Activity' },
  ];

  return (
    <div className="w-full border-b border-neutral-100 dark:border-neutral-700 mb-8">
      <nav aria-label="Tabs" className="flex gap-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
            <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="group relative flex flex-col items-center pb-4 min-w-[100px] outline-none"
            >
                <span className={`text-sm font-bold transition-colors ${
                    activeTab === tab.id 
                    ? 'text-neutral-dark dark:text-white' 
                    : 'text-neutral-500 hover:text-neutral-dark dark:hover:text-white'
                }`}>
                    {tab.label}
                </span>
                <span className={`absolute bottom-0 h-[3px] rounded-t-full bg-primary transition-all duration-300 ${
                    activeTab === tab.id ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></span>
            </button>
        ))}
      </nav>
    </div>
  );
}
