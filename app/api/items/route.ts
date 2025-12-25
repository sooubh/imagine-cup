import { NextResponse } from 'next/server';
import { azureService } from '@/lib/azureDefaults';

export async function GET() {
    try {
        const items = await azureService.getAllItems();
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.price || !body.quantity) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const newItem = await azureService.addItem({
            name: body.name,
            category: body.category || 'General',
            quantity: Number(body.quantity),
            price: Number(body.price),
            status: body.quantity > 100 ? 'In Stock' : body.quantity > 0 ? 'Low Stock' : 'Out of Stock',
            ownerId: body.ownerId,
            section: body.section,
            expiryDate: body.expiryDate,
            manufacturingDate: body.manufacturingDate,
            batchNumber: body.batchNumber,
            supplier: body.supplier,
            description: body.description,
            unit: body.unit
        });

        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
    }
}
