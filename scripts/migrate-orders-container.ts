/**
 * Run this script ONCE to delete the old Orders container
 * Then restart your app - it will recreate with the new partition key
 */

import { CosmosClient } from "@azure/cosmos";

const ENDPOINT = process.env.AZURE_COSMOS_ENDPOINT;
const KEY = process.env.AZURE_COSMOS_KEY;
const DATABASE_NAME = "InventoryDB";
const ORDERS_CONTAINER = "Orders";

async function recreateOrdersContainer() {
    if (!ENDPOINT || !KEY) {
        console.error("❌ Missing Azure credentials");
        return;
    }

    const client = new CosmosClient({ endpoint: ENDPOINT, key: KEY });
    const db = client.database(DATABASE_NAME);

    try {
        console.log("🗑️  Deleting old Orders container...");
        await db.container(ORDERS_CONTAINER).delete();
        console.log("✅ Old container deleted");

        console.log("📦 Creating new Orders container with tenantId partition key...");
        await db.containers.createIfNotExists({
            id: ORDERS_CONTAINER,
            partitionKey: "/tenantId"
        });
        console.log("✅ New container created");

        console.log("\n🎉 Migration complete! You can now use the app.");
    } catch (error: any) {
        if (error.code === 404) {
            console.log("⚠️  Container already deleted or doesn't exist");
            console.log("📦 Creating new Orders container...");
            await db.containers.createIfNotExists({
                id: ORDERS_CONTAINER,
                partitionKey: "/tenantId"
            });
            console.log("✅ New container created");
        } else {
            console.error("❌ Error:", error);
        }
    }
}

recreateOrdersContainer().then(() => {
    console.log("Done! Restart your application.");
    process.exit(0);
});
