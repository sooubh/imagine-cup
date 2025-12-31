"use server";

import { azureService, SystemStore, StockItem } from "@/lib/azureDefaults";
import { revalidatePath } from "next/cache";

// --- STORE MANAGEMENT ---

export async function getStoresAction(): Promise<SystemStore[]> {
    try {
        const stores = await azureService.getSystemStores();
        return stores;
    } catch (e) {
        console.error("getStoresAction failed:", e);
        return [];
    }
}

export async function addStoreAction(name: string, section: string): Promise<{ success: boolean; store?: SystemStore; error?: string }> {
    try {
        if (!name || name.length < 3) {
            return { success: false, error: "Store name must be at least 3 characters." };
        }

        const newStore = await azureService.addStore(name, section);
        if (newStore) {
            revalidatePath('/dashboard/stores');
            return { success: true, store: newStore };
        }
        return { success: false, error: "Failed to create store in database." };
    } catch (e) {
        console.error("addStoreAction failed:", e);
        return { success: false, error: "Server error." };
    }
}

export async function deleteStoreAction(storeId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const result = await azureService.deleteStore(storeId);
        if (result) {
            revalidatePath('/dashboard/stores');
            return { success: true };
        }
        return { success: false, error: "Failed to delete store. It might not exist or is a system store." };
    } catch (e) {
        console.error("deleteStoreAction failed:", e);
        return { success: false, error: "Server error." };
    }
}

// --- STOCK MANAGEMENT ---

export async function addStockItemAction(item: Omit<StockItem, "id" | "lastUpdated">): Promise<{ success: boolean; item?: StockItem; error?: string }> {
    try {
        const newItem = await azureService.addItem(item);
        if (newItem) {
            revalidatePath(`/dashboard/stores`); // Revalidate relevant paths
            return { success: true, item: newItem };
        }
        return { success: false, error: "Failed to add item." };
    } catch (e) {
        console.error("addStockItemAction failed:", e);
        return { success: false, error: "Server error." };
    }
}

export async function deleteStockItemAction(itemId: string, section: string): Promise<{ success: boolean; error?: string }> {
    try {
        const result = await azureService.deleteItem(itemId, section);
        if (result) {
            revalidatePath(`/dashboard/stores`);
            return { success: true };
        }
        return { success: false, error: "Failed to delete item." };
    } catch (e) {
        console.error("deleteStockItemAction failed:", e);
        return { success: false, error: "Server error." };
    }
}

export async function getStoreItemsAction(section: string): Promise<StockItem[]> {
    try {
        if (!section) return [];
        const decodedSection = decodeURIComponent(section);
        const items = await azureService.getAllItems(decodedSection);
        return items;
    } catch (e) {
        console.error("getStoreItemsAction failed:", e);
        return [];
    }
}
