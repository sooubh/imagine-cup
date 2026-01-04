'use server';

import { azureService } from '@/lib/azureDefaults';
import { getUser } from '@/lib/auth';
import { cookies } from 'next/headers';

export interface DashboardStats {
    totalItems: number;
    totalValue: number;
    savedWaste: number;
    itemsAtRisk: number;
}

export async function getRealTimeDashboardStats(): Promise<DashboardStats | null> {
    const cookieStore = await cookies();
    const userId = cookieStore.get('simulated_user_id')?.value;

    if (!userId) {
        return null;
    }

    const user = getUser(userId);
    if (!user) return null;

    try {
        // 1. Fetch Fresh Items
        const allItems = await azureService.getAllItems(user.section);

        // Admin sees ALL items in section (all stores), Retailer sees only their own
        const myItems = Array.isArray(allItems) ? (
            user.role === 'admin'
                ? allItems.filter(i => i.section === user.section)
                : allItems.filter(i => i.ownerId === user.id)
        ) : [];

        // 2. Calculate Stats
        const totalItems = myItems.length;
        const totalValue = myItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        // Simulated "Saved Waste" based on inventory efficiency
        // In a real app, this might come from a specific "SavedWaste" log container.
        // Here we simulate it as 8% of total inventory value being "optimized" or "saved" from waste via AI.
        const savedWaste = totalValue * 0.08;

        const itemsAtRisk = myItems.filter(i => {
            // Simplified status check logic matching utils
            return i.quantity <= (i.minQuantity || 10);
        }).length;

        return {
            totalItems,
            totalValue,
            savedWaste,
            itemsAtRisk
        };

    } catch (error) {
        console.error("Failed to fetch real-time stats", error);
        return null;
    }
}
