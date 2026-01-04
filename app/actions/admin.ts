"use server";

import { azureService, SystemStore, StockItem } from "@/lib/azureDefaults";
import { SIMULATED_USERS } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// --- STORE MANAGEMENT ---

export async function getStoresAction(sectionFilter?: string): Promise<SystemStore[]> {
    try {
        console.log('🏪 getStoresAction called with sectionFilter:', sectionFilter);

        // Source stores from SIMULATED_USERS to ensure Owner ID alignment
        // This ensures that "Store A" has ID "psd-r1", matching the ownerId in stock items.
        // We include all users (including admins) as they can all hold inventory.

        let targetUsers = SIMULATED_USERS;

        if (sectionFilter) {
            targetUsers = targetUsers.filter(u => u.section === sectionFilter);
        }

        const mappedStores: SystemStore[] = targetUsers.map(user => ({
            id: user.id,
            name: user.name,
            section: user.section,
            containerName: `Items_${user.section}`, // They share the section container, distinguished by ownerId
            status: 'ACTIVE',
            createdAt: new Date().toISOString()
        }));

        console.log(`✅ getStoresAction: returning ${mappedStores.length} stores from SIMULATED_USERS for section ${sectionFilter || 'all'}`);
        return mappedStores;
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

export async function updateStoreAction(storeId: string, updates: Partial<SystemStore>): Promise<{ success: boolean; store?: SystemStore; error?: string }> {
    try {
        const updatedStore = await azureService.updateStore(storeId, updates);
        if (updatedStore) {
            revalidatePath('/dashboard/stores');
            return { success: true, store: updatedStore };
        }
        return { success: false, error: "Failed to update store in database." };
    } catch (e) {
        console.error("updateStoreAction failed:", e);
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

export async function getStoreItemsAction(section: string, ownerId?: string): Promise<StockItem[]> {
    try {
        if (!section) return [];
        const decodedSection = decodeURIComponent(section);

        if (ownerId) {
            const items = await azureService.getItemsByStore(ownerId, decodedSection);
            return items;
        }

        const items = await azureService.getAllItems(decodedSection);
        // Explicitly cast to StockItem[] to avoid type ambiguity
        return items as StockItem[];
    } catch (e) {
        console.error("getStoreItemsAction failed:", e);
        return [];
    }
}
