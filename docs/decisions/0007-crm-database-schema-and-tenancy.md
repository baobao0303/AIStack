# Architectural Decision Record (ADR): 0007 CRM Portal & E-commerce Database Schema

- **Date**: 2026-05-30
- **Status**: Accepted
- **Context**: The separation of the customer-facing E-commerce storefront and the internal CRM Portal requires a clean PostgreSQL database schema partition. Each service will contain its own PostgreSQL database connection to enforce strict microservice data boundaries.

---

## 1. Database Tenancy Division

We deploy two separate physical PostgreSQL databases to isolate our two primary business workflows:
1. **`ecommerce_db`**: Stores Catalog, Shopping Cart, Orders, and Stripe invoice mappings. Multi-tenancy is not relevant for external public shoppers, but the `tenant_id` is tracked on orders to link them to the selling business.
2. **`crm_portal_db`**: Stores Support Chat transcripts, Employee schedules, and Customer interaction notes. Access is filtered strictly by the tenant workspace `tenant_id` at the repository layer using EF Core global filters.

---

## 2. Detailed Database Schemas

### 2.1 E-commerce Service Schema (PostgreSQL)

Manages handmade and wool items, inventory metrics, order requests, and Stripe mappings.

```sql
-- 1. Products Table (Wool & Handmade items catalog)
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(18,2) NOT NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    categories VARCHAR(50)[], -- Array (e.g. "wool", "handmade", "clothes")
    image_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_products_tenant ON products(tenant_id);

-- 2. Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Paid, Shipped, Cancelled
    total_amount DECIMAL(18,2) NOT NULL,
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Order Items Table (Relationship to Product)
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL, -- Logical reference to products
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(18,2) NOT NULL
);
```

### 2.2 CRM Portal Service Schema (PostgreSQL)

Handles internal employee registries, shift rosters (ca trực), chat logs, and client timelines.

```sql
-- 1. Employees Table (HR Registry)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department VARCHAR(100), -- E.g. "Support", "Sales", "Inventory"
    active_chat_status VARCHAR(50) DEFAULT 'Offline', -- Offline, Online, Busy
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_employees_tenant ON employees(tenant_id);

-- 2. Employee Shifts Table (Schedule & Ca Trực)
CREATE TABLE employee_shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    shift_start TIMESTAMP WITH TIME ZONE NOT NULL,
    shift_end TIMESTAMP WITH TIME ZONE NOT NULL,
    notes TEXT
);

-- 3. Chat Sessions Table (Live Support Chat Logs)
CREATE TABLE chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    assigned_employee_id UUID REFERENCES employees(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Active', -- Active, Closed, Queued
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);
CREATE INDEX idx_chat_sessions_active ON chat_sessions(tenant_id, status);

-- 4. Chat Messages Table
CREATE TABLE chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    sender_type VARCHAR(50) NOT NULL, -- Customer, Employee, AI
    sender_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_chat_messages_session ON chat_messages(session_id, sent_at ASC);
```

---

## 3. Data Integrity & Distributed Concerns

- **E-commerce & CRM Sync**: Chat logs in the CRM DB link to customers by email (`customer_email`). Orders in the E-commerce DB also use `customer_email`. The Portal interface pulls historical transactions from `ecommerce_db` via HTTP/gRPC API aggregation.
- **SignalR message caching**: Chat messages are cached on **Redis** for active sessions to avoid heavy real-time PostgreSQL writes. On session closure (`chat_sessions.status = 'Closed'`), the transcripts are flushed asynchronously to the database.
