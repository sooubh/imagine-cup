'use server';



import { azureService, PurchaseOrder, StockItem } from '@/lib/azureDefaults';

import { revalidatePath } from 'next/cache';

export async function fetchItemsForProcurement(itemComponentIds: string[]) {
    // specific helper to fetch multiple items by ID-Section
    // itemComponentIds are valid "id-section" strings

    // Efficiency: getGlobalItems() is okay for small datasets (100 items), but filtering is better.
    // For now, fetching global is simplest implementation of existing service.
    const allItems = await azureService.getGlobalItems();

    return allItems.filter((item: StockItem) =>
        itemComponentIds.includes(`${item.id}-${item.section}`)
    );
}

export async function createPurchaseOrder(order: any, tenantId: string = 'default') {
    const created = await azureService.createOrder(order, tenantId);
    revalidatePath('/procurement');
    return created;
}

export async function getPurchaseOrders(tenantId: string = 'default') {
    return await azureService.getOrders(tenantId);
}

export async function updatePurchaseOrder(id: string, updates: any, tenantId: string = 'default') {
    const updated = await azureService.updateOrder(id, updates, tenantId);
    revalidatePath('/procurement');
    return updated;
}

export async function cancelPurchaseOrder(id: string, tenantId: string = 'default') {
    console.log('[SERVER] cancelPurchaseOrder called with id:', id, 'tenantId:', tenantId);
    try {
        const cancelled = await azureService.updateOrder(id, { status: 'CANCELLED' }, tenantId);
        console.log('[SERVER] cancelPurchaseOrder result:', cancelled ? 'SUCCESS' : 'NULL');
        revalidatePath('/procurement');
        return cancelled;
    } catch (error) {
        console.error('[SERVER] cancelPurchaseOrder error:', error);
        throw error;
    }
}

export async function receiveOrderItems(order: PurchaseOrder) {
    console.log('[SERVER] receiveOrderItems called for order:', order.id, 'tenant:', order.tenantId);
    // Server-side logic to receive items
    // This transactionally updates stock
    let success = true;
    for (const item of order.items) {
        try {
            console.log('[SERVER] Updating item:', item.itemId, 'section:', item.section, 'adding qty:', item.requestedQuantity);
            const current = await azureService.getItem(item.itemId, item.section);
            if (current) {
                const newQuantity = current.quantity + item.requestedQuantity;
                console.log('[SERVER] Current qty:', current.quantity, 'New qty:', newQuantity);
                await azureService.updateItem(item.itemId, {
                    quantity: newQuantity
                }, item.section);
                console.log('[SERVER] Item updated successfully');
            } else {
                console.error('[SERVER] Item not found:', item.itemId, 'section:', item.section);
                success = false;
            }
        } catch (e) {
            console.error(`[SERVER] Failed to update item ${item.itemId}`, e);
            success = false;
        }
    }

    if (success) {
        console.log('[SERVER] All items updated, updating order status to COMPLETED');
        const result = await azureService.updateOrder(order.id, { status: 'COMPLETED' }, order.tenantId);
        console.log('[SERVER] Order status update result:', result ? 'SUCCESS' : 'NULL');
    } else {
        console.error('[SERVER] Some items failed to update, not changing order status');
    }
    revalidatePath('/procurement');
    console.log('[SERVER] receiveOrderItems returning:', success);
    return success;
}

export async function markItemsAsOrdered(itemComponentIds: string[], tenantId: string = 'default') {
    const allItems = await azureService.getGlobalItems();
    const selected = allItems.filter(item =>
        itemComponentIds.includes(`${item.id}-${item.section}`)
    );

    if (selected.length === 0) return false;

    const newOrder: any = {
        poNumber: `MANUAL-${Date.now()}`,
        dateCreated: new Date().toISOString(),
        status: 'PENDING',
        items: selected.map(item => ({
            itemId: item.id,
            name: item.name,
            currentStock: item.quantity,
            requestedQuantity: Math.max(0, (item.minQuantity || 20) * 2 - item.quantity),
            unit: item.unit || 'units',
            section: item.section,
            price: item.price
        })),
        createdBy: 'Manual Action',
        notes: 'Marked as ordered from Reorder Page manually.'
    };

    await azureService.createOrder(newOrder, tenantId);
    return true;
}

export async function repairOrders(tenantId: string = 'default') {
    // Note: No longer needed with immutable partition key, but kept for backwards compatibility
    console.warn('[SERVER] repairOrders is deprecated with tenantId partition key');
    const orders = await azureService.getOrders(tenantId);
    // No duplicates should exist with immutable partition key
    return 0;
}
