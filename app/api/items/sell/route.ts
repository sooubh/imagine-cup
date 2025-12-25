import { NextResponse } from 'next/server';
import { azureService } from '@/lib/azureDefaults';

export async function POST(request: Request) {
    try {
        const { itemId, section } = await request.json();

        if (!itemId || !section) {
            return NextResponse.json({ error: 'Missing itemId or section' }, { status: 400 });
        }

        // 1. Get the current item
        const item = await azureService.getItem(itemId, section);

        if (!item) {
            return NextResponse.json({ error: 'Item not found' }, { status: 404 });
        }

        // 2. Check stock
        if (item.quantity <= 0) {
            return NextResponse.json({ error: 'Out of stock' }, { status: 400 });
        }

        // 3. Decrement stock
        const newQuantity = item.quantity - 1;
        const newStatus = newQuantity > 100 ? 'In Stock' : newQuantity > 0 ? 'Low Stock' : 'Out of Stock';

        // 4. Update item
        const updatedItem = await azureService.updateItem(itemId, {
            quantity: newQuantity,
            status: newStatus
        }, section);

        // 5. Log specific sale activity
        await azureService.logActivity(item.ownerId, "sold item", item.name, 'update', section);

        return NextResponse.json(updatedItem);

    } catch (error) {
        console.error("Sell error:", error);
        return NextResponse.json({ error: 'Failed to process sale' }, { status: 500 });
    }
}
