# 🧶 Tiệm Nhà Zịt - Distributed E-commerce & CRM Microservices Ecosystem

Welcome to the **Tiệm Nhà Zịt** repository — an enterprise-grade, distributed microservices ecosystem combining a premium hand-knitted wool & handmade craft e-commerce storefront with a comprehensive customer relationship management (CRM) and human resource management portal.

This repository is built using modern **.NET Clean Architecture**, **CQRS (MediatR)**, **YARP API Gateway**, **SignalR WebSockets**, and **Google Gemini 1.5 Flash AI** integration, powered by **Docker Compose & Tilt** for an outstanding local developer experience.

---

## 🏛️ System Architecture

The system is designed with highly isolated microservice boundaries, separate databases for data sovereignty, and asynchronous event-driven communication:

```text
                                   [ Client Apps ]
                                         │
                                         ▼ (HTTP / WebSockets)
                              ┌──────────────────────┐
                              │  YARP API Gateway    │ (Port 5119 / 7013)
                              └──────────┬───────────┘
                                         │
                 ┌───────────────────────┼───────────────────────┐
                 ▼                       ▼                       ▼
      ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
      │    Identity.Api     │ │    ECommerce.Api    │ │      Chat.Api       │
      │   (Port 5122/7074)  │ │   (Port 5120/7057)  │ │   (Port 5125/7068)  │
      └──────────┬──────────┘ └──────────┬──────────┘ └──────────┬──────────┘
                 │                       │                       │
                 ▼                       ▼                       ▼
      ┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
      │  PostgreSQL: tenant │ │ PostgreSQL: catalog │ │  PostgreSQL: crm    │
      │  & user identities  │ │     & order data    │ │   & shift rosters   │
      └─────────────────────┘ └─────────────────────┘ └──────────┬──────────┘
                                                                 │ (Redis Backplane)
                                                                 ▼
                                                      ┌─────────────────────┐
                                                      │     Redis Cache     │
                                                      │  (Active sessions)  │
                                                      └─────────────────────┘
                                         │
                                         ▼ (Asynchronous Integration Events)
                              ┌──────────────────────┐
                              │  RabbitMQ Message    │
                              │         Bus          │
                              └──────────┬───────────┘
                                         │
                                         ▼
                              ┌──────────────────────┐
                              │ Notification.Service │
                              │   (Worker Daemon)    │
                              └──────────┬───────────┘
                                         │
                                         ▼ (TLS / SMTP)
                              ┌──────────────────────┐
                              │     MailKit SMTP     │ ---> [ Customer Inbox ]
                              │ (HTML Invoice Email) │
                              └──────────────────────┘
```

### Integrated External Services
* **Stripe Payments**: Secure payment processing, checkout sessions, and webhook handling.
* **Google Gemini 1.5 Flash AI**: Generates 3-point contextual Vietnamese reply suggestions, summarizes conversations, and calculates buyer intent scores.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| --- | --- | --- |
| **Core Framework** | .NET 6 / .NET 8 Web API | Built using C# with Clean Architecture layout |
| **Patterns** | CQRS + MediatR | Separation of concerns for high-performance reads and writes |
| **Database ORM** | Entity Framework Core | Fluent APIs, PostgreSQL isolated schemas, and database migrations |
| **API Gateway** | YARP (Yet Another Reverse Proxy) | Dynamic request routing, header transformations, and SignalR WebSocket upgrades |
| **Real-time Engine** | ASP.NET Core SignalR | Fully scaled out with a Redis backplane for high-availability WebSocket communication |
| **Asynchronous Bus** | RabbitMQ Topics | Pub/Sub messaging to process integration events (e.g. `ChargeSucceededEvent`) |
| **AI Integration** | Gemini 1.5 Flash HTTP API | Contextual generative AI suggestions and analysis with local offline fallbacks |
| **Development** | Docker Compose, Tilt | Fully containerized orchestration and live hot-reloading |
| **Operating Framework** | Harness SQLite CLI | SQLite-backed framework for managing development progress and matrix proofs |

---

## 📂 Repository Layout

```text
.
├── backend/
│   ├── api-gateway/          # YARP API Gateway Proxy & observability logging
│   ├── shared/               # Shared.dll - messaging types and resilient RabbitMQ EventBus
│   └── services/
│       ├── Identity/         # Identity.sln - tenant registration, RBAC, sliding JWT sessions
│       ├── ECommerce/        # ECommerce.sln - products catalog, shopping carts, Stripe checkouts
│       ├── Chat/             # Chat.sln - SignalR chatrooms, HR Shifts, Gemini AI analytics
│       └── Notification/     # Notification.sln - RabbitMQ worker daemon & MailKit SMTP
├── docs/                     # Product specs, stories, and ADR (Architectural Decision Records)
├── infra/                    # Deployment configurations (docker-compose, Kubernetes templates)
├── rules/                    # Authoritative Harness rules & operational guidelines
├── scripts/                  # Harness CLI binary, test scripts, and git commit hooks
└── workflow/                 # Step-by-step developer guides and story workflows
```

---

## 🚪 API Gateway Routing Matrix

The **YARP API Gateway** acts as the single entrypoint on port `5119` (HTTP) / `7013` (HTTPS) and proxies requests downstream:

| Client Endpoint Path | Target Microservice | Description |
| --- | --- | --- |
| `/api/auth/{**catch-all}` | `Identity.Api` | User registration, JWT secure login, and Token Refresh |
| `/api/products/{**catch-all}` | `ECommerce.Api` | Catalog browsing, category filtering, and inventory updates |
| `/api/orders/{**catch-all}` | `ECommerce.Api` | Stripe Checkout Sessions, order status, and transaction history |
| `/api/employees/{**catch-all}` | `Chat.Api` | Support agent profile management & system directory |
| `/api/shifts/{**catch-all}` | `Chat.Api` | Work schedule rosters & active shift analysis |
| `/api/ai/{**catch-all}` | `Chat.Api` | Gemini response suggestions, session summaries & buyer scoring |
| `/hubs/chat` | `Chat.Api` (SignalR) | Real-time WebSocket connection hub for chat communications |

---

## 🛡️ Offline Resilience & Mock Mode Defaults

To ensure the microservices mesh runs flawlessly in local environments where external backing infrastructure or APIs might be offline, the system implements robust fallback engines:

1. **Gemini AI Offline Engine**: If the official `GEMINI_API_KEY` is not set or calls fail, `GeminiAiService` automatically switches to a high-quality local rule-based system. It generates Vietnamese product care suggestions (wool wash rules, sheep wool softeners) and buyer scoring natively without throwing exceptions.
2. **Resilient RabbitMQ EventBus**: If a local RabbitMQ broker is offline, the shared event bus logs a warning and bypasses dispatches instead of crashing on startup.
3. **Startup PostgreSQL Bypass**: Db initializers gracefully catch PostgreSQL connection failures and log warnings rather than crashing the API hosting lifecycle.

---

## 🚀 Local Development Setup

### Prerequisites
* **.NET 6 SDK** (or higher)
* **Docker & Docker Compose**
* **Tilt** (Optional, recommended for live hot-reload development)

### Environment Variables
Configure your credentials securely by creating a `.env` file in the root directory (Git ignored):
```env
SMTP_USER=baobao0303@gmail.com
SMTP_PASSWORD=YOUR_SMTP_APPLICATION_PASSWORD
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
```

### Option A: Run Natively with Tilt (Recommended)
Tilt orchestrates all services natively on the host while keeping dependencies (PostgreSQL, Redis, RabbitMQ) in Docker:
```bash
tilt up
```
This binds to the gateway proxy and opens the Tilt visual dashboard showing live logs and server hot-reloads.

### Option B: Run via Docker Compose
Build and run the entire ecosystem isolated in containers:
```bash
docker-compose up --build
```

---

## 🧪 Testing & Verification Matrix

The suite includes extensive unit, integration, and endpoint tests.

### Important: MSBuild File Lock Compilation
Since Tilt holds locks on active assemblies during hot-reload, always compile the test suites strictly without attempting to copy or overwrite locked binaries:

**Compile the test assemblies exclusively:**
```bash
dotnet build backend/services/Chat/Chat.Tests/Chat.Tests.csproj --no-dependencies
dotnet build backend/services/Notification/Notification.Service.Tests/Notification.Service.Tests.csproj --no-dependencies
```

**Execute the test suites safely:**
```bash
dotnet test backend/services/Chat/Chat.Tests/Chat.Tests.csproj --no-build
dotnet test backend/services/Notification/Notification.sln
```

---

## 🦾 Harness Durable Development Loop

This repository uses **Harness** — a SQLite-backed operating framework for human-agent pair programming.

### Mandatory Task Commands

**1. Query Matrix Status:**
```bash
./scripts/harness query matrix
```

**2. Check Growth Backlog & Friction Logs:**
```bash
./scripts/harness query backlog
```

**3. Record a Completed User Story Proof:**
```bash
./scripts/harness story update --id <story_id> --status implemented --unit 1 --integration 1 --evidence "<details>"
```

### 🤝 Clean Commit Attributions
Always stage and commit changes using the project-standard git hook helper. It automatically prevents local configuration leaks and formats commits cleanly:
```bash
./scripts/harness-commit.sh done "your commit message details"
```
* Agent commits are automatically attributed to `claude <claude@users.noreply.github.com>`.
* Operational system commits remain attributed to `baobao0303 <baobao22.work@gmail.com>`.
