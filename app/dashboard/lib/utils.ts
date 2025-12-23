// Define the interface matching the JSON structure
export interface StockItem {
    location_id: string;
    location_name: string;
    item_id: string;
    item_name: string;
    category: string;
    opening_stock: number;
    received: number;
    issued: number;
    closing_stock: number;
    avg_daily_issue: number;
    lead_time_days: number;
    unit: string;
    last_updated: string;
}

// Remove the import from json file as we defined the type here
// import { StockItem } from "@/data/sampleStockData";

export type StockStatus = 'critical' | 'low' | 'good';

export function getStockStatus(current: number, opening: number): StockStatus {
    const ratio = current / opening;
    if (ratio <= 0.2) return 'critical';
    if (ratio <= 0.5) return 'low';
    return 'good';
}

export interface FilterState {
    dateRange: string;
    category: string;
    status: string;
    location: string;
    view?: string; // 'district' | 'hospital' | 'ngo'
    search?: string;
    criticalOnly?: boolean;
    lowLeadTime?: boolean;
    lifeSaving?: boolean;
}

export function isLifeSaving(item: StockItem): boolean {
    const lifeSavingKeywords = ['insulin', 'amoxicillin', 'epinephrine', 'vaccine', 'oxygen'];
    return lifeSavingKeywords.some(keyword => item.item_name.toLowerCase().includes(keyword)) || item.category === 'Medicine';
}

export function isLowLeadTime(item: StockItem): boolean {
    return item.lead_time_days <= 3;
}

function classifyLocationType(name: string): 'hospital' | 'ngo' | 'other' {
    const lower = name.toLowerCase();
    if (lower.includes('hospital') || lower.includes('clinic') || lower.includes('phc') || lower.includes('health')) {
        return 'hospital';
    }
    if (lower.includes('ngo') || lower.includes('shelter') || lower.includes('camp')) {
        return 'ngo';
    }
    return 'other';
}

export function filterStockData(data: StockItem[], filters: FilterState) {
    return data.filter(item => {
        // 0. View Filtering
        if (filters.view && filters.view !== 'district') {
            const type = classifyLocationType(item.location_name);
            if (filters.view === 'hospital' && type !== 'hospital') return false;
            if (filters.view === 'ngo' && type !== 'ngo') return false;
        }

        // 1. Category
        if (filters.category !== 'all' && item.category !== filters.category) {
            return false;
        }

        // 2. Location
        if (filters.location !== 'all' && item.location_name !== filters.location) {
            return false;
        }

        // 3. Status
        if (filters.status !== 'all') {
            const status = getStockStatus(item.closing_stock, item.opening_stock);
            if (status !== filters.status) return false;
        }

        // 5. Search
        if (filters.search) {
            const query = filters.search.toLowerCase();
            const matches =
                item.item_name.toLowerCase().includes(query) ||
                item.item_id.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.location_name.toLowerCase().includes(query);
            if (!matches) return false;
        }

        // 6. Advanced Filters
        if (filters.criticalOnly) {
            if (getStockStatus(item.closing_stock, item.opening_stock) !== 'critical') return false;
        }
        if (filters.lowLeadTime) {
            if (!isLowLeadTime(item)) return false;
        }
        if (filters.lifeSaving) {
            if (!isLifeSaving(item)) return false;
        }

        return true;
    });
}

// ADAPTER: Convert simple Azure/User items to the complex Dashboard format
export function adaptAzureItems(azureItems: any[]): StockItem[] {
    return azureItems.map(item => ({
        location_id: "LOC-USER-001",
        location_name: "My Stock (Azure)",
        item_id: item.id || Math.random().toString(36),
        item_name: item.name,
        category: item.category || "General",
        opening_stock: Number(item.quantity) + 10, // Simulated opening
        received: 10,
        issued: 0,
        closing_stock: Number(item.quantity),
        avg_daily_issue: Math.floor(Math.random() * 5),
        lead_time_days: 2,
        unit: "units",
        last_updated: item.lastUpdated || new Date().toISOString()
    }));
}

