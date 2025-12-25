import { CosmosClient } from "@azure/cosmos";

// Interfaces for our data
export interface StockItem {
    id: string;
    name: string;
    category: string;
    quantity: number;
    price: number;
    status: "In Stock" | "Low Stock" | "Out of Stock";
    lastUpdated: string;
    expiryDate?: string; // ISO Date String
    manufacturingDate?: string; // ISO Date String
    batchNumber?: string;
    supplier?: string;
    description?: string;
    unit?: string;       // e.g., 'box', 'vial', 'kg'
    minQuantity?: number; // Threshold for reorder alert
    ownerId: string;
    section: 'PSD' | 'Hospital' | 'NGO';
}

// Configuration
const ENDPOINT = process.env.AZURE_COSMOS_ENDPOINT;
const KEY = process.env.AZURE_COSMOS_KEY;
const DATABASE_NAME = "InventoryDB";

// Map Sections to Container Names
const CONTAINERS = {
    PSD: "Items_PSD",
    Hospital: "Items_Hospital",
    NGO: "Items_NGO"
};
const ACTIVITIES_CONTAINER = "Activities";

export interface Activity {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
    type: 'update' | 'create' | 'delete' | 'alert';
    section: string;
}

// Mock data fallback (simplified)
let mockItems: StockItem[] = [];

class AzureInventoryService {
    private client: CosmosClient | null = null;
    private isConnected: boolean = false;

    constructor() {
        if (ENDPOINT && KEY) {
            try {
                this.client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
                this.isConnected = true;
                console.log("✅ Azure Cosmos DB Client Initialized");
                this.initContainers(); // Fire and forget initialization
            } catch (error) {
                console.error("❌ Failed to initialize Azure Client", error);
            }
        }
    }

    private async initContainers() {
        if (!this.client || !this.isConnected) return;
        try {
            const db = this.client.database(DATABASE_NAME);
            await db.read(); // Ensure DB exists (or create manually)

            // Create Stock Containers
            for (const [key, containerName] of Object.entries(CONTAINERS)) {
                await db.containers.createIfNotExists({ id: containerName, partitionKey: "/category" });
                console.log(`Verified Container: ${containerName}`);
            }
            // Create Activities Container
            await db.containers.createIfNotExists({ id: ACTIVITIES_CONTAINER, partitionKey: "/section" });
            console.log(`Verified Container: ${ACTIVITIES_CONTAINER}`);
        } catch (e) {
            console.error("Error initializing containers:", e);
        }
    }

    private getContainer(section: string) {
        if (!this.client) {
            console.error("❌ getContainer: Client is null");
            return null;
        }
        // Access strictly via mapping, default to Hospital if unknown to prevent crash
        const rawName = CONTAINERS[section as keyof typeof CONTAINERS];
        if (!rawName) {
            console.warn(`⚠️ Warning: Unknown section '${section}', defaulting to Hospital`);
        }
        const containerName = rawName || CONTAINERS.Hospital;

        console.log(`🔍 getContainer: Resolving '${section}' -> '${containerName}'`);
        return this.client.database(DATABASE_NAME).container(containerName);
    }

    // --- ACTIVITY LOGGING ---
    async logActivity(user: string, action: string, target: string, type: Activity['type'], section: string) {
        if (!this.isConnected || !this.client) return;
        try {
            const container = this.client.database(DATABASE_NAME).container(ACTIVITIES_CONTAINER);
            const activity: Activity = {
                id: Math.random().toString(36).substring(7),
                user,
                action,
                target,
                time: new Date().toISOString(),
                type,
                section
            };
            await container.items.create(activity);
        } catch (e) {
            console.error("Failed to log activity:", e);
        }
    }

    async getRecentActivities(section: string, limit: number = 5): Promise<Activity[]> {
        if (!this.isConnected || !this.client) return [];
        try {
            const container = this.client.database(DATABASE_NAME).container(ACTIVITIES_CONTAINER);
            const { resources } = await container.items
                .query({
                    query: "SELECT * FROM c WHERE c.section = @section ORDER BY c.time DESC OFFSET 0 LIMIT @limit",
                    parameters: [
                        { name: "@section", value: section },
                        { name: "@limit", value: limit }
                    ]
                })
                .fetchAll();
            return resources as Activity[];
        } catch (e) {
            console.error("Failed to fetch activities:", e);
            return [];
        }
    }

    // ALL ITEMS now requires knowing the SECTION (Container)
    async getAllItems(section?: string): Promise<StockItem[]> {
        console.log(`🚀 getAllItems: Started for section '${section}'`);

        if (!section) {
            console.warn("⚠️ getAllItems: No section provided. Returning empty.");
            return [];
        }

        if (this.isConnected && this.client) {
            try {
                const container = this.getContainer(section);
                if (container) {
                    console.log(`⚡ Querying Cosmos container: ${container.id}...`);
                    const { resources } = await container.items.query("SELECT * from c").fetchAll();
                    console.log(`✅ getAllItems: Found ${resources.length} items in ${container.id}`);
                    return resources as StockItem[];
                } else {
                    console.error("❌ getAllItems: Container not found/initialized");
                }
            } catch (error) {
                console.error(`❌ getAllItems Error fetching from ${section}:`, error);
                return [];
            }
        } else {
            console.warn("⚠️ getAllItems: Azure not connected");
        }
        return [];
    }

    // FETCH ALL across ALL containers (For Super Admin or initial Debug)
    async getGlobalItems(): Promise<StockItem[]> {
        if (!this.isConnected || !this.client) return [];
        let all: StockItem[] = [];
        for (const section of Object.keys(CONTAINERS)) {
            const items = await this.getAllItems(section);
            all = [...all, ...items];
        }
        return all;
    }

    async getItem(id: string, section: string): Promise<StockItem | null> {
        if (!this.isConnected || !this.client) return null;
        try {
            const container = this.getContainer(section);
            if (!container) return null;

            const { resources } = await container.items.query({
                query: "SELECT * from c WHERE c.id = @id",
                parameters: [{ name: "@id", value: id }]
            }).fetchAll();

            if (resources.length === 0) return null;
            return resources[0] as StockItem;
        } catch (error) {
            console.error("Failed to get item from Azure:", error);
            return null;
        }
    }

    async addItem(item: Omit<StockItem, "id" | "lastUpdated">): Promise<StockItem> {
        const newItem: StockItem = {
            ...item,
            id: Math.random().toString(36).substring(7),
            lastUpdated: new Date().toISOString(),
        };

        if (this.isConnected && this.client) {
            try {
                // Determine container from item.section
                const container = this.getContainer(newItem.section);
                if (container) {
                    const { resource } = await container.items.create(newItem);
                    // Log
                    this.logActivity(newItem.ownerId, "added stock", newItem.name, 'create', newItem.section);
                    return resource as StockItem;
                }
            } catch (error) {
                console.error("Failed to add to Azure:", error);
            }
        }
        return newItem;
    }

    async updateItem(id: string, updates: Partial<StockItem>, section: string): Promise<StockItem | null> {
        if (!this.isConnected || !this.client) return null;
        try {
            const container = this.getContainer(section);
            if (!container) return null;

            // 1. Query Item
            const { resources } = await container.items.query({
                query: "SELECT * from c WHERE c.id = @id",
                parameters: [{ name: "@id", value: id }]
            }).fetchAll();

            if (resources.length === 0) return null;
            const existingItem = resources[0];
            const updatedItem = { ...existingItem, ...updates, lastUpdated: new Date().toISOString() };

            // 2. Replace using Category PK
            const { resource } = await container.item(id, existingItem.category).replace(updatedItem);
            // Log
            this.logActivity("System", "updated item", existingItem.name, 'update', section);
            return resource as StockItem;

        } catch (error) {
            console.error("Failed to update in Azure:", error);
            return null;
        }
    }

    async deleteItem(id: string, section: string): Promise<boolean> {
        if (!this.isConnected || !this.client) return false;
        try {
            const container = this.getContainer(section);
            if (!container) return false;

            // 1. Need category for PK delete
            const { resources } = await container.items.query({
                query: "SELECT * from c WHERE c.id = @id",
                parameters: [{ name: "@id", value: id }]
            }).fetchAll();

            if (resources.length === 0) return false;

            await container.item(id, resources[0].category).delete();
            // Log
            this.logActivity("System", "deleted item", resources[0].name, 'delete', section);
            return true;
        } catch (error) {
            console.error("Failed to delete from Azure:", error);
            return false;
        }
    }
}

export const azureService = new AzureInventoryService();
