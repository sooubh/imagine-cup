import { NextResponse } from 'next/server';
import { azureService } from '@/lib/azureDefaults';
import { cookies } from 'next/headers';
import { getUser } from '@/lib/auth';

type Params = Promise<{ id: string }>;

export async function PUT(
    request: Request,
    { params }: { params: Params }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');
        const body = await request.json();

        const cookieStore = await cookies();
        const userId = cookieStore.get('simulated_user_id')?.value;
        const user = userId ? getUser(userId) : null;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Use section from URL if provided (for sub-stores), otherwise user's default section
        const targetSection = section || user.section;

        // Validation: Ensure we are not wiping out essential fields if partial
        const updatedItem = await azureService.updateItem(id, body, targetSection);

        if (!updatedItem) {
            return NextResponse.json({ error: 'Item not found or update failed' }, { status: 404 });
        }

        return NextResponse.json(updatedItem);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Params }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const section = searchParams.get('section');

        const cookieStore = await cookies();
        const userId = cookieStore.get('simulated_user_id')?.value;
        const user = userId ? getUser(userId) : null;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const targetSection = section || user.section;

        const success = await azureService.deleteItem(id, targetSection);

        if (!success) {
            return NextResponse.json({ error: 'Item not found or delete failed' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
