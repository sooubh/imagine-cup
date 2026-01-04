# 🔌 StockHealth AI - API Reference

Complete API documentation for developers integrating with StockHealth AI.

---

## Table of Contents

1. [Base Configuration](#base-configuration)
2. [Authentication](#authentication)
3. [HTTP API Endpoints](#http-api-endpoints)
4. [Server Actions](#server-actions)
5. [Database Service API](#database-service-api)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Code Examples](#code-examples)

---

## Base Configuration

### API Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.vercel.app/api
```

### Request Headers

```http
Content-Type: application/json
Cookie: simulated_user_id=<user_id>
```

### Response Format

All API responses follow this structure:

```typescript
// Success Response
{
  "success": true,
  "data": <response_data>
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

---

## Authentication

### Current Implementation (Demo Mode)

**Cookie-Based Authentication:**

```javascript
// Setting user session
document.cookie = `simulated_user_id=${userId}; path=/; max-age=86400`;

// Reading user session (server-side)
import { cookies } from 'next/headers';

const cookieStore = await cookies();
const userId = cookieStore.get('simulated_user_id')?.value;
```

**Retrieving User Profile:**

```typescript
import { getUser } from '@/lib/auth';

const user = getUser(userId);
// Returns: UserProfile | undefined
```

---

## HTTP API Endpoints

### 1. Inventory Items

#### GET `/api/items`

Fetch all inventory items for a specific section.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| section | string | Yes | FDC, Hospital, or NGO |

**Request Example:**

```bash
curl -X GET "http://localhost:3000/api/items?section=Hospital" \
  -H "Cookie: simulated_user_id=hosp-r1"
```

**Response Example:**

```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "name": "Paracetamol 500mg",
      "category": "Medicines",
      "quantity": 150,
      "price": 50,
      "status": "In Stock",
      "lastUpdated": "2024-01-04T10:00:00.000Z",
      "expiryDate": "2025-12-31T00:00:00.000Z",
      "manufacturingDate": "2023-06-15T00:00:00.000Z",
      "batchNumber": "BATCH-2023-A",
      "supplier": "PharmaCo Ltd",
      "description": "Pain relief medication",
      "unit": "box",
      "minQuantity": 50,
      "ownerId": "hosp-r1",
      "section": "Hospital"
    },
    {
      "id": "def456",
      "name": "Insulin 100IU",
      "category": "Medicines",
      "quantity": 80,
      "price": 450,
      "status": "In Stock",
      "lastUpdated": "2024-01-04T11:30:00.000Z",
      "expiryDate": "2026-03-15T00:00:00.000Z",
      "manufacturingDate": "2023-09-01T00:00:00.000Z",
      "batchNumber": "BATCH-2023-INS",
      "supplier": "MediSupply Inc",
      "unit": "vial",
      "minQuantity": 20,
      "ownerId": "hosp-r1",
      "section": "Hospital"
    }
  ]
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "MISSING_SECTION",
    "message": "Section parameter is required"
  }
}
```

#### POST `/api/items`

Create a new inventory item.

**Request Body:**

```typescript
{
  name: string;                  // Required
  category: string;              // Required
  quantity: number;              // Required
  price: number;                 // Required
  unit?: string;                 // Optional
  supplier?: string;             // Optional
  description?: string;          // Optional
  expiryDate?: string;           // Optional (ISO date string)
  manufacturingDate?: string;    // Optional (ISO date string)
  batchNumber?: string;          // Optional
  minQuantity?: number;          // Optional
  ownerId: string;               // Required
  section: string;               // Required
}
```

**Request Example:**

```bash
curl -X POST "http://localhost:3000/api/items" \
  -H "Content-Type: application/json" \
  -H "Cookie: simulated_user_id=hosp-r1" \
  -d '{
    "name": "Amoxicillin 250mg",
    "category": "Medicines",
    "quantity": 200,
    "price": 75,
    "unit": "bottle",
    "supplier": "PharmaCo Ltd",
    "expiryDate": "2026-06-30T00:00:00.000Z",
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "batchNumber": "BATCH-2024-AMX",
    "minQuantity": 50,
    "ownerId": "hosp-r1",
    "section": "Hospital"
  }'
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "id": "ghi789",
    "name": "Amoxicillin 250mg",
    "category": "Medicines",
    "quantity": 200,
    "price": 75,
    "status": "In Stock",
    "lastUpdated": "2024-01-04T12:00:00.000Z",
    "unit": "bottle",
    "supplier": "PharmaCo Ltd",
    "expiryDate": "2026-06-30T00:00:00.000Z",
    "manufacturingDate": "2024-01-01T00:00:00.000Z",
    "batchNumber": "BATCH-2024-AMX",
    "minQuantity": 50,
    "ownerId": "hosp-r1",
    "section": "Hospital"
  }
}
```

#### PUT `/api/items/:id`

Update an existing inventory item.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Item ID |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| section | string | Yes | FDC, Hospital, or NGO |

**Request Body:** (Partial updates allowed)

```typescript
{
  name?: string;
  category?: string;
  quantity?: number;
  price?: number;
  unit?: string;
  supplier?: string;
  description?: string;
  expiryDate?: string;
  // ... any other fields
}
```

**Request Example:**

```bash
curl -X PUT "http://localhost:3000/api/items/abc123?section=Hospital" \
  -H "Content-Type: application/json" \
  -H "Cookie: simulated_user_id=hosp-r1" \
  -d '{
    "quantity": 175,
    "price": 55
  }'
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "Paracetamol 500mg",
    "quantity": 175,
    "price": 55,
    "lastUpdated": "2024-01-04T13:00:00.000Z",
    ...
  }
}
```

#### DELETE `/api/items/:id`

Delete an inventory item.

**Path Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Item ID |

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| section | string | Yes | FDC, Hospital, or NGO |

**Request Example:**

```bash
curl -X DELETE "http://localhost:3000/api/items/abc123?section=Hospital" \
  -H "Cookie: simulated_user_id=hosp-r1"
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "message": "Item deleted successfully"
  }
}
```

---

### 2. Global Search

#### GET `/api/search`

Search across all data types (items, transactions, orders).

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Search query |
| section | string | Yes | User's section |

**Request Example:**

```bash
curl -X GET "http://localhost:3000/api/search?q=paracetamol&section=Hospital" \
  -H "Cookie: simulated_user_id=hosp-r1"
```

**Response Example:**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "abc123",
        "name": "Paracetamol 500mg",
        "category": "Medicines",
        "quantity": 150,
        ...
      }
    ],
    "transactions": [
      {
        "id": "txn001",
        "invoiceNumber": "INV-20240104-001",
        "items": [
          {
            "name": "Paracetamol 500mg",
            "quantity": 10
          }
        ],
        ...
      }
    ],
    "orders": [
      {
        "id": "po001",
        "poNumber": "PO-2024-0001",
        "items": [
          {
            "name": "Paracetamol 500mg",
            "requestedQuantity": 100
          }
        ],
        ...
      }
    ]
  }
}
```

---

## Server Actions

Server actions are called from client components using Next.js server actions.

### chatWithLedgerBot

AI chatbot interaction.

**Location:** `app/actions/chat.ts`

**Function Signature:**

```typescript
async function chatWithLedgerBot(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  items: StockItem[],
  activities: Activity[],
  currentPath: string
): Promise<{
  text: string;
  toolCalls?: Array<{ tool: string; args: any }>;
}>
```

**Usage Example:**

```typescript
'use client';

import { chatWithLedgerBot } from '@/app/actions/chat';
import { useState } from 'react';

export function ChatComponent({ items, activities }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  async function handleSend() {
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);

    const response = await chatWithLedgerBot(
      newMessages,
      items,
      activities,
      window.location.pathname
    );

    setMessages([...newMessages, { role: 'assistant', content: response.text }]);

    // Handle tool calls if any
    if (response.toolCalls) {
      response.toolCalls.forEach(call => {
        if (call.tool === 'navigate_to_page') {
          window.location.href = call.args.path;
        }
      });
    }
  }

  return (
    <div>
      {messages.map((msg, i) => (
        <div key={i}>{msg.content}</div>
      ))}
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
```

**Tool Call Types:**

```typescript
// Navigate to a page
{
  tool: 'navigate_to_page',
  args: { path: '/dashboard' }
}

// Create purchase order
{
  tool: 'create_purchase_order',
  args: { itemId: 'abc123', quantity: 100 }
}

// Update stock level
{
  tool: 'update_stock_level',
  args: { itemId: 'abc123', newQuantity: 200 }
}

// Add to sales cart
{
  tool: 'add_to_sales_cart',
  args: { itemId: 'abc123', quantity: 10 }
}
```

---

## Database Service API

The `AzureInventoryService` class provides methods for database operations.

**Location:** `lib/azureDefaults.ts`

**Import:**

```typescript
import { azureService } from '@/lib/azureDefaults';
```

### Inventory Operations

#### getAllItems

```typescript
async getAllItems(
  section?: string,
  pageSize?: number,
  continuationToken?: string
): Promise<StockItem[] | { items: StockItem[], continuationToken?: string }>
```

**Example:**

```typescript
// Get all items for a section
const items = await azureService.getAllItems('Hospital');

// Paginated query
const result = await azureService.getAllItems('Hospital', 50, token);
console.log(result.items);
console.log(result.continuationToken); // Use for next page
```

#### getItem

```typescript
async getItem(id: string, section: string): Promise<StockItem | null>
```

**Example:**

```typescript
const item = await azureService.getItem('abc123', 'Hospital');
```

#### addItem

```typescript
async addItem(item: Omit<StockItem, "id" | "lastUpdated">): Promise<StockItem>
```

**Example:**

```typescript
const newItem = await azureService.addItem({
  name: 'Aspirin 100mg',
  category: 'Medicines',
  quantity: 500,
  price: 20,
  unit: 'tablet',
  ownerId: 'hosp-r1',
  section: 'Hospital'
});
```

#### updateItem

```typescript
async updateItem(
  id: string,
  updates: Partial<StockItem>,
  section: string
): Promise<StockItem | null>
```

**Example:**

```typescript
const updated = await azureService.updateItem('abc123', {
  quantity: 200,
  price: 55
}, 'Hospital');
```

#### deleteItem

```typescript
async deleteItem(id: string, section: string): Promise<boolean>
```

**Example:**

```typescript
const success = await azureService.deleteItem('abc123', 'Hospital');
```

### Transaction Operations

#### createTransaction

```typescript
async createTransaction(
  transaction: Omit<Transaction, "id">
): Promise<Transaction | null>
```

**Example:**

```typescript
const transaction = await azureService.createTransaction({
  invoiceNumber: 'INV-20240104-001',
  date: new Date().toISOString(),
  type: 'SALE',
  items: [
    {
      itemId: 'abc123',
      name: 'Paracetamol 500mg',
      quantity: 10,
      unitPrice: 50,
      tax: 9,
      subtotal: 509
    }
  ],
  totalAmount: 509,
  paymentMethod: 'CASH',
  customerName: 'John Doe',
  section: 'Hospital',
  performedBy: 'hosp-r1'
});
```

#### getTransactions

```typescript
async getTransactions(section: string): Promise<Transaction[]>
```

**Example:**

```typescript
const transactions = await azureService.getTransactions('Hospital');
```

### Order Operations

#### createOrder

```typescript
async createOrder(
  order: Omit<PurchaseOrder, "id">
): Promise<PurchaseOrder | null>
```

**Example:**

```typescript
const order = await azureService.createOrder({
  poNumber: 'PO-2024-0001',
  dateCreated: new Date().toISOString(),
  status: 'PENDING',
  items: [
    {
      itemId: 'abc123',
      name: 'Paracetamol 500mg',
      currentStock: 10,
      requestedQuantity: 100,
      unit: 'box',
      section: 'Hospital'
    }
  ],
  vendor: 'PharmaCo Ltd',
  createdBy: 'hosp-r1'
});
```

#### getOrders

```typescript
async getOrders(): Promise<PurchaseOrder[]>
```

**Example:**

```typescript
const orders = await azureService.getOrders();
```

#### updateOrder

```typescript
async updateOrder(
  id: string,
  updates: Partial<PurchaseOrder>,
  currentStatus: string
): Promise<PurchaseOrder | null>
```

**Example:**

```typescript
const updated = await azureService.updateOrder('po001', {
  status: 'APPROVED',
  approvedBy: 'admin-hosp'
}, 'PENDING');
```

### Activity Operations

#### logActivity

```typescript
async logActivity(
  user: string,
  action: string,
  target: string,
  type: Activity['type'],
  section: string
): Promise<void>
```

**Example:**

```typescript
await azureService.logActivity(
  'City General',
  'added stock',
  'Paracetamol 500mg',
  'create',
  'Hospital'
);
```

#### getRecentActivities

```typescript
async getRecentActivities(
  section: string,
  limit: number = 5
): Promise<Activity[]>
```

**Example:**

```typescript
const activities = await azureService.getRecentActivities('Hospital', 10);
```

### Store Operations

#### getSystemStores

```typescript
async getSystemStores(): Promise<SystemStore[]>
```

**Example:**

```typescript
const stores = await azureService.getSystemStores();
```

#### getStoresBySection

```typescript
async getStoresBySection(section: string): Promise<SystemStore[]>
```

**Example:**

```typescript
const hospitalStores = await azureService.getStoresBySection('Hospital');
```

#### getItemsByStore

```typescript
async getItemsByStore(
  storeId: string,
  section: string
): Promise<StockItem[]>
```

**Example:**

```typescript
const items = await azureService.getItemsByStore('hosp-r1', 'Hospital');
```

---

## Error Handling

### Error Types

```typescript
// Missing required parameters
{
  code: 'MISSING_PARAMETER',
  message: 'Required parameter "section" is missing'
}

// Invalid data format
{
  code: 'INVALID_DATA',
  message: 'Quantity must be a positive number'
}

// Authentication error
{
  code: 'UNAUTHORIZED',
  message: 'User not authenticated'
}

// Permission error
{
  code: 'FORBIDDEN',
  message: 'User does not have permission to access this resource'
}

// Resource not found
{
  code: 'NOT_FOUND',
  message: 'Item with ID abc123 not found'
}

// Database error
{
  code: 'DATABASE_ERROR',
  message: 'Failed to connect to database'
}

// Rate limit exceeded
{
  code: 'RATE_LIMIT_EXCEEDED',
  message: 'Too many requests. Please try again later.'
}
```

### Error Handling Example

```typescript
try {
  const response = await fetch('/api/items?section=Hospital');
  const data = await response.json();

  if (!data.success) {
    switch (data.error.code) {
      case 'UNAUTHORIZED':
        // Redirect to login
        window.location.href = '/';
        break;
      case 'RATE_LIMIT_EXCEEDED':
        // Show rate limit message
        alert('Too many requests. Please wait.');
        break;
      default:
        // Show generic error
        console.error(data.error.message);
    }
  } else {
    // Use data.data
    console.log(data.data);
  }
} catch (error) {
  // Network or parsing error
  console.error('Request failed:', error);
}
```

---

## Rate Limiting

**Implementation:** `lib/rate-limit.ts`

**Default Limits:**
- 100 requests per minute per IP
- Applies to all API endpoints

**Response when rate limit exceeded:**

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again in 60 seconds."
  }
}
```

**Headers:**

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1704369600
```

---

## Code Examples

### Complete React Component Example

```typescript
'use client';

import { useState, useEffect } from 'react';
import { StockItem } from '@/lib/azureDefaults';

export function InventoryList({ section }: { section: string }) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchItems();
  }, [section]);

  async function fetchItems() {
    try {
      setLoading(true);
      const response = await fetch(`/api/items?section=${section}`);
      const data = await response.json();

      if (data.success) {
        setItems(data.data);
        setError(null);
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('Failed to fetch items');
    } finally {
      setLoading(false);
    }
  }

  async function handleAddItem(newItem: Omit<StockItem, 'id' | 'lastUpdated'>) {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });

      const data = await response.json();

      if (data.success) {
        setItems([...items, data.data]);
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert('Failed to add item');
    }
  }

  async function handleUpdateItem(id: string, updates: Partial<StockItem>) {
    try {
      const response = await fetch(`/api/items/${id}?section=${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      const data = await response.json();

      if (data.success) {
        setItems(items.map(item => 
          item.id === id ? data.data : item
        ));
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert('Failed to update item');
    }
  }

  async function handleDeleteItem(id: string) {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/items/${id}?section=${section}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setItems(items.filter(item => item.id !== id));
      } else {
        alert(data.error.message);
      }
    } catch (err) {
      alert('Failed to delete item');
    }
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Inventory ({items.length})</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name} - {item.quantity} {item.unit}
            <button onClick={() => handleUpdateItem(item.id, { quantity: item.quantity + 10 })}>
              +10
            </button>
            <button onClick={() => handleDeleteItem(item.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Server-Side Data Fetching Example

```typescript
// app/inventory/page.tsx
import { azureService } from '@/lib/azureDefaults';
import { getUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function InventoryPage() {
  const cookieStore = await cookies();
  const userId = cookieStore.get('simulated_user_id')?.value;

  if (!userId) redirect('/');

  const user = getUser(userId);
  if (!user) redirect('/');

  // Fetch data server-side
  const items = await azureService.getAllItems(user.section);
  const activities = await azureService.getRecentActivities(user.section);

  return (
    <div>
      <h1>Inventory - {user.section}</h1>
      <p>Total Items: {items.length}</p>
      
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}: {item.quantity} {item.unit}
          </li>
        ))}
      </ul>

      <h2>Recent Activities</h2>
      <ul>
        {activities.map(activity => (
          <li key={activity.id}>
            {activity.user} {activity.action} {activity.target}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## Testing API Endpoints

### Using cURL

```bash
# Fetch items
curl -X GET "http://localhost:3000/api/items?section=Hospital" \
  -H "Cookie: simulated_user_id=hosp-r1"

# Add item
curl -X POST "http://localhost:3000/api/items" \
  -H "Content-Type: application/json" \
  -H "Cookie: simulated_user_id=hosp-r1" \
  -d '{
    "name": "Test Item",
    "category": "Medicines",
    "quantity": 100,
    "price": 50,
    "ownerId": "hosp-r1",
    "section": "Hospital"
  }'

# Search
curl -X GET "http://localhost:3000/api/search?q=test&section=Hospital" \
  -H "Cookie: simulated_user_id=hosp-r1"
```

### Using Postman

1. Create new request
2. Set method (GET, POST, PUT, DELETE)
3. Enter URL with query parameters
4. Add headers: `Content-Type: application/json`
5. Add Cookie in Headers tab: `simulated_user_id=hosp-r1`
6. For POST/PUT: Add JSON body
7. Click Send

### Using JavaScript Fetch

```javascript
// GET request
fetch('/api/items?section=Hospital')
  .then(res => res.json())
  .then(data => console.log(data));

// POST request
fetch('/api/items', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Test Item',
    category: 'Medicines',
    quantity: 100,
    price: 50,
    ownerId: 'hosp-r1',
    section: 'Hospital'
  })
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

**For questions or support, contact: api-support@stockhealth.ai**

*Last Updated: January 4, 2026*
