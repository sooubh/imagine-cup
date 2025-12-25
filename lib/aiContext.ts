import { StockItem, Activity } from "../lib/azureDefaults";

export const SYSTEM_PROMPT = `
You are StockHealth AI, an advanced inventory management assistant for hospitals and NGOs.
Your Goal: Prevent stock-outs of critical medical supplies and minimize waste.

**Platform Knowledge:**
- You are integrated into the "StockHealth AI" platform.
- Users are Hospital Managers, NGO Officers, or Procurement Officers.
- Key Features: Real-time Stock Dashboard, AI Reorder Recommendations, Expiry Alerts.

**Tone & Style:**
- Professional, concise, and action-oriented.
- When an item is low, suggest immediate reordering.
- When an item is critical, express urgency.
- Do NOT hallucinate data. Only use the provided Inventory Context.

**Inventory Context:**
You will receive a summary of the current stock and recent activities.
- "Healthy": Sufficient stock.
- "Low": Stock is below 50% of opening.
- "Critical": Stock is below 20% of opening (or very low count).

If the user asks about an item not in the list, state that you don't have data for it.
`;

export function getInventoryContext(items: StockItem[], activities: Activity[] = []): string {
    const totalItems = items?.length || 0;

    // Inventory List Processing
    let criticalItems: string[] = [];
    let lowItems: string[] = [];
    let inventorySection = "No items found in database.";

    if (items && items.length > 0) {
        inventorySection = items.map(i => {
            let status = 'Good';
            if (i.quantity <= 10) status = 'CRITICAL';
            else if (i.quantity <= 50) status = 'Low';

            if (status === 'CRITICAL' || status === 'EXPIRED') criticalItems.push(`${i.name} (${status})`);
            if (status === 'Low' || status === 'EXPIRING SOON') lowItems.push(`${i.name} (${status})`);

            let expiryStr = i.expiryDate ? ` [Exp: ${new Date(i.expiryDate).toLocaleDateString()}]` : '';

            return `- ${i.name}: ${i.quantity} ${i.unit || 'units'} [${status}] (${i.category})${expiryStr}`;
        }).join('\n');
    }

    // Activity List Processing
    let activitySection = "No recent activity.";
    if (activities && activities.length > 0) {
        activitySection = activities.slice(0, 10).map(a =>
            `- [${new Date(a.time).toLocaleDateString()}] ${a.user} ${a.action} ${a.target} (${a.type})`
        ).join('\n');
    }

    return `
=== CURRENT INVENTORY REPORT ===
Total Unique Items: ${totalItems}
Critical Items: ${criticalItems.length > 0 ? criticalItems.join(', ') : 'None'}
Low Stock Items: ${lowItems.length > 0 ? lowItems.join(', ') : 'None'}

=== DETAILED ITEM LIST ===
${inventorySection}

=== RECENT ACTIVITIES (DATABASE LOGS) ===
${activitySection}
================================
    `.trim();
}
