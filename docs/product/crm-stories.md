# CRM Portal & E-commerce User Stories (Agile Backlog)

This document contains the revised set of User Stories mapping out the core requirements for the customer-facing E-commerce Platform (wool and handmade sales) and the internal CRM Portal (customer support chat & HR management).

---

## 🏛️ Epic E01: Identity & Tenant Registry (Xác thực & Cách ly)

### US-001: Register User and Workspace Tenant
*   **Description**:
    *   *As a* Business Owner (Tenant Creator),
    *   *I want to* sign up my company profile and default administrative credentials,
    *   *So that* I can provision an isolated CRM Portal workspace tenant.
*   **Acceptance Criteria**:
    1. Validates unique company domain, name, email, and password.
    2. Inserts a record in the `tenants` table and hashes passwords using BCrypt.
    3. Seeds default role mappings (Super Admin) inside the tenant space.
*   **Validation Proof**:
    - **Unit**: Verify password hasher encrypts credentials securely.
    - **Integration**: Verify database transaction rolls back if user registration fails after tenant creation.

### US-002: Secure Login with JWT & Redis-backed Session
*   **Description**:
    *   *As an* Employee or Customer,
    *   *I want to* log in with my verified credentials,
    *   *So that* I can access E-commerce features or CRM Portal controls securely.
*   **Acceptance Criteria**:
    1. Rejects unverified login attempts.
    2. Generates an Access Token (JWT, 15 mins) and sets an HttpOnly, SameSite=Strict cookie containing the rotated Refresh Token.
    3. Active sessions are stored and checked against the Redis cache.
*   **Validation Proof**:
    - **Integration**: Mock Redis and test token expiration and revocation flows.

---

## 🏛️ Epic E02: E-commerce Storefront (Bán hàng Đồ len & Handmade)

### US-003: Browse Wool & Handmade Product Catalog
*   **Description**:
    *   *As an* E-commerce Customer,
    *   *I want to* view the list of wool and handmade items with details on price, availability, and tags,
    *   *So that* I can find and select items to purchase.
*   **Acceptance Criteria**:
    1. API `/api/v1/products` returns list of wool/handmade items with filters (price, categories).
    2. Respects real-time inventory counts from Catalog Database.
*   **Validation Proof**:
    - **Unit**: Verify category filtering logic returns correct item subsets.

### US-004: Create Order & Checkout with Stripe Payments
*   **Description**:
    *   *As an* E-commerce Customer,
    *   *I want to* check out my shopping cart and pay via Stripe,
    *   *So that* I can complete my purchase securely.
*   **Acceptance Criteria**:
    1. Generates a unique checkout session in Stripe.
    2. Stripe Webhook pushes `charge.succeeded` event to RabbitMQ event bus.
    3. E-commerce Orders Service consumes the event and marks the order as Paid.
*   **Validation Proof**:
    - **Integration**: Verify orders service state transitions from Pending to Paid on mock Stripe Webhook payload.

---

## 🏛️ Epic E03: CRM Portal - Live Chat & HR (Hỗ trợ Hội thoại & Nhân lực)

### US-005: Real-time Live Chat Support via WebSockets/SignalR
*   **Description**:
    *   *As a* Customer needing advice on handmade sizes or wool types,
    *   *I want to* start a real-time live chat with an agent directly from the store,
    *   *So that* I get immediate assistance.
*   **Acceptance Criteria**:
    1. Customer interface initiates WebSockets connection (via SignalR hub).
    2. Automatically routes session to the next online CRM Agent on ca trực.
    3. Active session chats and message logs are cached in Redis and persisted in PostgreSQL.
*   **Validation Proof**:
    - **Integration**: Verify low latency message delivery (<100ms) between multiple connected SignalR client mocks.

### US-006: HR Employee Directory & Live Ca Trực Schedule
*   **Description**:
    *   *As a* Portal Manager,
    *   *I want to* manage the employee directory and configure daily chat support shifts (ca trực),
    *   *So that* I ensure continuous customer chat support coverage.
*   **Acceptance Criteria**:
    1. Dashboard displays employee registry and active schedule panels.
    2. Automatically marks agents offline or away if their shift ends.
*   **Validation Proof**:
    - **Unit**: Verify shift scheduler boundaries and time zone adjustments.

---

## 🏛️ Epic E04: AI Capabilities (Trí tuệ nhân tạo Gemini AI)

### US-007: AI Gemini Smart Chat Assistant Response Generator
*   **Description**:
    *   *As a* Chat Support Agent,
    *   *I want to* get automated suggestion replies from Gemini based on the product the customer is viewing,
    *   *So that* I can answer questions about wool quality and handmade care instructions instantly.
*   **Acceptance Criteria**:
    1. Gemini parses the customer's active product details and recent chat messages.
    2. Renders 3 quick-reply suggestions in the agent's CRM Portal workspace.
*   **Validation Proof**:
    - **Integration**: Verify prompt engine returns coherent wool care suggestions and falls back gracefully under API limit thresholds.

### US-008: AI Gemini Conversation Summarizer & Buyer Scoring
*   **Description**:
    *   *As a* CRM Manager,
    *   *I want to* read automated chat summaries and view AI calculated buyer scores based on carts and chats,
    *   *So that* I understand client intent and prioritize high-value sales leads.
*   **Acceptance Criteria**:
    1. Summarizes active chats into a bullet-point summary (maximum 5 points).
    2. Calculates a potential buyer score (0-100) based on active cart size and interaction intent.
*   **Validation Proof**:
    - **Unit**: Verify prompt templates successfully structure JSON payloads containing scores.
