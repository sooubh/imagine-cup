import { NextResponse } from 'next/server';
import { azureService } from '@/lib/azureDefaults';
import { z } from 'zod';

// Input Validation Schema using Zod
const searchSchema = z.object({
    query: z.string().max(100, "Query too long").transform(val => val.toLowerCase().trim()),
    section: z.string().max(50).optional().default('all'),
    category: z.string().max(50).optional().default('all'),
});

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Validate inputs
        const result = searchSchema.safeParse({
            query: searchParams.get('q') || '',
            section: searchParams.get('section') || 'all',
            category: searchParams.get('category') || 'all'
        });

        if (!result.success) {
            return NextResponse.json({
                results: [],
                count: 0,
                error: "Invalid Input",
                details: result.error.flatten()
            }, { status: 400 });
        }

        const { query, section, category } = result.data;

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [], count: 0, query });
        }

        // Fetch items from all sections or specific section
        let allItems = [];
        if (section === 'all') {
            allItems = await azureService.getGlobalItems();
        } else {
            allItems = await azureService.getAllItems(section);
        }

        // Filter items based on search query
        const results = allItems.filter(item => {
            const matchesQuery =
                item.name.toLowerCase().includes(query) ||
                item.id.toLowerCase().includes(query) ||
                (item.description && item.description.toLowerCase().includes(query));

            const matchesCategory = category === 'all' || item.category === category;

            return matchesQuery && matchesCategory;
        });

        // Sort by relevance (exact matches first, then partial matches)
        results.sort((a, b) => {
            const aExact = a.name.toLowerCase() === query ? 1 : 0;
            const bExact = b.name.toLowerCase() === query ? 1 : 0;
            if (aExact !== bExact) return bExact - aExact;

            const aStarts = a.name.toLowerCase().startsWith(query) ? 1 : 0;
            const bStarts = b.name.toLowerCase().startsWith(query) ? 1 : 0;
            return bStarts - aStarts;
        });

        // Limit results to 50
        const limitedResults = results.slice(0, 50);

        return NextResponse.json({
            results: limitedResults,
            count: limitedResults.length,
            total: results.length,
            query
        });

    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json(
            { error: 'Failed to search items', results: [], count: 0 },
            { status: 500 }
        );
    }
}
