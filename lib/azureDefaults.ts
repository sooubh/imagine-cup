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
}

// Configuration for Azure Cosmos DB
// GUIDE FOR USER:
// 1. Create an Azure Cosmos DB account in the Azure Portal.
// 2. Create a database named 'InventoryDB' and a container named 'Items'.
// 3. Get your connection string (URI and Key) from the 'Keys' section.
// 4. Add them to your .env.local file as:
//    AZURE_COSMOS_ENDPOINT="your_endpoint_uri"
//    AZURE_COSMOS_KEY="your_primary_key"

const ENDPOINT = process.env.AZURE_COSMOS_ENDPOINT;
const KEY = process.env.AZURE_COSMOS_KEY;
const DATABASE_NAME = "InventoryDB";
const CONTAINER_NAME = "Items";

// Mock data to show when Azure is not connected
let mockItems: StockItem[] = [
    {
        id: "1",
        name: "Surgical Masks",
        category: "PPE",
        quantity: 5000,
        price: 0.5,
        status: "In Stock",
        lastUpdated: new Date().toISOString(),
    },
    {
        id: "2",
        name: "Nitrile Gloves",
        category: "PPE",
        quantity: 120,
        price: 12.0,
        status: "Low Stock",
        lastUpdated: new Date().toISOString(),
    },
];

class AzureInventoryService {
    private client: CosmosClient | null = null;
    private isConnected: boolean = false;

    constructor() {
        if (ENDPOINT && KEY) {
            try {
                this.client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
                this.isConnected = true;
                console.log("✅ Azure Cosmos DB Client Initialized");
            } catch (error) {
                console.error("❌ Failed to initialize Azure Client", error);
            }
        } else {
            console.warn("⚠️ Azure Credentials not found. Using Mock Data Mode.");
        }
    }

    // Helper to get container
    private getContainer() {
        if (!this.client) return null;
        return this.client.database(DATABASE_NAME).container(CONTAINER_NAME);
    }

    async getAllItems(): Promise<StockItem[]> {
        if (this.isConnected && this.client) {
            try {
                const container = this.getContainer();
                if (container) {
                    const { resources } = await container.items
                        .query("SELECT * from c")
                        .fetchAll();
                    return resources as StockItem[];
                }
            } catch (error) {
                console.error("Failed to fetch from Azure:", error);
                return mockItems; // Fallback
            }
        }
        // Return mock data if not connected
        return Promise.resolve([...mockItems]);
    }

    async addItem(item: Omit<StockItem, "id" | "lastUpdated">): Promise<StockItem> {
        const newItem: StockItem = {
            ...item,
            id: Math.random().toString(36).substring(7),
            lastUpdated: new Date().toISOString(),
        };

        if (this.isConnected && this.client) {
            try {
                const container = this.getContainer();
                if (container) {
                    const { resource } = await container.items.create(newItem);
                    return resource as StockItem;
                }
            } catch (error) {
                console.error("Failed to add to Azure:", error);
                // Fallback to local push
                mockItems.push(newItem);
                return newItem;
            }
        }

        // Local Mock Logic
        mockItems.push(newItem);
        return Promise.resolve(newItem);
    }
}

export const azureService = new AzureInventoryService();
