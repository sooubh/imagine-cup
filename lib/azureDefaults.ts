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
const TRANSACTIONS_CONTAINER = "Transactions";
const ORDERS_CONTAINER = "Orders";

export interface Transaction {
    id: string;
    invoiceNumber: string;
    date: string; // ISO String
    type: 'SALE' | 'INTERNAL_USAGE' | 'DAMAGE' | 'EXPIRY';
    items: {
        itemId: string;
        name: string;
        quantity: number;
        unitPrice: number;
        tax: number;
        subtotal: number;
    }[];
    totalAmount: number;
    paymentMethod: 'CASH' | 'UPI' | 'CARD' | 'OTHER';
    customerName?: string;
    customerContact?: string;
    section: string;
    performedBy: string; // User ID or Name
}

export interface PurchaseOrder {
    id: string;
    poNumber: string;
    dateCreated: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'PARTIALLY_RECEIVED' | 'RECEIVED' | 'CANCELLED';
    items: {
        itemId: string;
        name: string;
        currentStock: number;
        requestedQuantity: number;
        unit: string;
        section: string;
        receivedQuantity?: number;
        price?: number;
    }[];
    totalEstimatedCost?: number;
    vendor?: string;
    notes?: string;
    createdBy: string;
    approvedBy?: string;
}

export interface Activity {
    id: string;
    user: string;
    action: string;
    target: string;
    time: string;
    type: 'update' | 'create' | 'delete' | 'alert';
    section: string;
}

export class AzureInventoryService {
    private client: CosmosClient | null = null;
    private isConnected: boolean = false;

    constructor() {
        if (ENDPOINT && KEY) {
            this.client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
            this.isConnected = true;
            this.initContainers();
        } else {
            console.warn("Azure Cosmos DB credentials not found.");
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

            // Create Transactions Container
            await db.containers.createIfNotExists({ id: TRANSACTIONS_CONTAINER, partitionKey: "/section" });
            console.log(`Verified Container: ${TRANSACTIONS_CONTAINER}`);

            // Create Orders Container
            await db.containers.createIfNotExists({ id: ORDERS_CONTAINER, partitionKey: "/status" });
            console.log(`Verified Container: ${ORDERS_CONTAINER}`);

        } catch (e) {
            console.error("Error initializing containers:", e);
        }
    }

    // ... (existing methods getContainer, logActivity, createTransaction, getTransactions, getRecentActivities, getAllItems, getGlobalItems, getItem, addItem)

    // --- PURCHASE ORDERS ---
    async createOrder(order: Omit<PurchaseOrder, "id">): Promise<PurchaseOrder | null> {
        if (!this.isConnected || !this.client) return null;
        try {
            const container = this.client.database(DATABASE_NAME).container(ORDERS_CONTAINER);
            const newOrder: PurchaseOrder = {
                ...order,
                id: Math.random().toString(36).substring(7)
            };
            const { resource } = await container.items.create(newOrder);
            return resource as PurchaseOrder;
        } catch (e) {
            console.error("Failed to create order:", e);
            return null;
        }
    }

    async getOrders(): Promise<PurchaseOrder[]> {
        if (!this.isConnected || !this.client) return [];
        try {
            const container = this.client.database(DATABASE_NAME).container(ORDERS_CONTAINER);
            const { resources } = await container.items
                .query("SELECT * FROM c ORDER BY c.dateCreated DESC")
                .fetchAll();
            return resources as PurchaseOrder[];
        } catch (e) {
            console.error("Failed to fetch orders:", e);
            return [];
        }
    }

    async updateOrder(id: string, updates: Partial<PurchaseOrder>, statusPartitionKey: string): Promise<PurchaseOrder | null> {
        if (!this.isConnected || !this.client) return null;
        try {
            const container = this.client.database(DATABASE_NAME).container(ORDERS_CONTAINER);
            // Must read first or use patch if we know PK is status. 
            // Since status can change (PK change), we might need delete/create if status changes.
            // For simplicity, assuming status might be the PK.

            // If status is changing, we need to delete and recreate because Partition Key is immutable
            if (updates.status && updates.status !== statusPartitionKey) {
                const { resource: existing } = await container.item(id, statusPartitionKey).read();
                if (!existing) return null;

                const newOrder = { ...existing, ...updates, id: id };
                // Transactional batch to ensure atomicity ideally, but simple delete/create here
                await container.item(id, statusPartitionKey).delete();
                const { resource } = await container.items.create(newOrder);
                return resource as PurchaseOrder;
            } else {
                const { resource } = await container.item(id, statusPartitionKey).replace({ ...updates, id }); // Need full object for replace? Or use patch?
                // Actually replace needs full body. Let's stick to simple read-modify-write pattern or PATCH.
                // PATCH is better.
                /*
                const { resource } = await container.item(id, statusPartitionKey).patch(
                    Object.keys(updates).map(k => ({ op: 'replace', path: `/${k}`, value: updates[k as keyof PurchaseOrder] }))
                );
                */
                // Falling back to read-replace for safety in this mocked env
                const { resource: existing } = await container.item(id, statusPartitionKey).read();
                if (existing) {
                    const { resource } = await container.item(id, statusPartitionKey).replace({ ...existing, ...updates });
                    return resource as PurchaseOrder;
                }
                return null;
            }
        } catch (e) {
            console.error("Failed to update order:", e);
            return null;
        }
    }

    // ... (rest of class)

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

    // --- TRANSACTION LOGGING ---
    async createTransaction(transaction: Omit<Transaction, "id">): Promise<Transaction | null> {
        if (!this.isConnected || !this.client) return null;
        try {
            const container = this.client.database(DATABASE_NAME).container(TRANSACTIONS_CONTAINER);
            const newTransaction: Transaction = {
                ...transaction,
                id: Math.random().toString(36).substring(7)
            };
            const { resource } = await container.items.create(newTransaction);
            return resource as Transaction;
        } catch (e) {
            console.error("Failed to create transaction:", e);
            return null;
        }
    }

    async getTransactions(section: string): Promise<Transaction[]> {
        if (!this.isConnected || !this.client) return [];
        try {
            const container = this.client.database(DATABASE_NAME).container(TRANSACTIONS_CONTAINER);
            const { resources } = await container.items
                .query({
                    query: "SELECT * FROM c WHERE c.section = @section ORDER BY c.date DESC",
                    parameters: [{ name: "@section", value: section }]
                })
                .fetchAll();
            return resources as Transaction[];
        } catch (e) {
            console.error("Failed to fetch transactions:", e);
            return [];
        }
    }

    async getAllTransactions(): Promise<Transaction[]> {
        if (!this.isConnected || !this.client) return [];
        try {
            const container = this.client.database(DATABASE_NAME).container(TRANSACTIONS_CONTAINER);
            const { resources } = await container.items
                .query("SELECT * FROM c ORDER BY c.date DESC")
                .fetchAll();
            return resources as Transaction[];
        } catch (e) {
            console.error("Failed to fetch all transactions:", e);
            return [];
        }
    }

    async getAllActivities(): Promise<Activity[]> {
        if (!this.isConnected || !this.client) return [];
        try {
            const container = this.client.database(DATABASE_NAME).container(ACTIVITIES_CONTAINER);
            const { resources } = await container.items
                .query("SELECT * FROM c ORDER BY c.time DESC")
                .fetchAll();
            return resources as Activity[];
        } catch (e) {
            console.error("Failed to fetch all activities:", e);
            return [];
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
