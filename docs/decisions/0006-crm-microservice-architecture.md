# Architectural Decision Record (ADR): 0006 CRM Portal & E-commerce Architecture

- **Date**: 2026-05-30
- **Status**: Accepted
- **Context**: The specifications require dividing the CRM Portal (internal real-time chat & HR) and the E-commerce Platform (external wool/handmade product store) into independent service boundaries targeting **.NET 6** (to match the developer SDK).

---

## 1. System Architecture Layout

The system is partitioned into independent microservices communicating asynchronously via RabbitMQ (MassTransit) and synchronously via gRPC or WebSockets.

```text
                                  +-------------------+
                                  |    Next.js Client |
                                  | (Storefront/CRM)  |
                                  +---------+---------+
                                            | (HTTPS / WebSockets)
                                            v
                                  +---------+---------+
                                  |    API Gateway    |
                                  |      (YARP)       |
                                  +----+----+----+----+
                                       |    |    |
          +----------------------------+    |    +----------------------------+
          | (gRPC / HTTP / SignalR)         | (gRPC / HTTP)                   | (gRPC / HTTP)
          v                                 v                                 v
+---------+---------+             +---------+---------+             +---------+---------+
|  Identity Service |             | E-commerce Serv.  |             | CRM Chat Service  |
| (Auth & RBAC)     |             | (Catalog/Stripe)  |             | (SignalR Hub)     |
+---------+---------+             +---------+---------+             +---------+---------+
          |                                 |                                 |
    (PostgreSQL)                      (PostgreSQL)                      (PostgreSQL/Redis)
          |                                 |                                 |
          +-----------------+---------------+---------------+-----------------+
                            | (Event Bus: RabbitMQ / MassTransit)
                            v
                  +---------+---------+             +---------+---------+
                  |  HR Personnel Svc |             |    AI Service     |
                  | (Employee/Shifts) |             | (Gemini AI SDK)   |
                  +---------+---------+             +---------+---------+
```

---

## 2. Microservice Gateways & Real-Time Communications

### 2.1 API Gateway Routing Rules (YARP)
We use YARP to direct traffic based on request prefixes. The SignalR Hub connection is explicitly routed to support WebSockets upgrades:

```json
{
  "ReverseProxy": {
    "Routes": {
      "identity-route": {
        "ClusterId": "identity-cluster",
        "Match": { "Path": "/api/v1/auth/{**catch-all}" }
      },
      "catalog-route": {
        "ClusterId": "ecommerce-cluster",
        "Match": { "Path": "/api/v1/products/{**catch-all}" }
      },
      "orders-route": {
        "ClusterId": "ecommerce-cluster",
        "Match": { "Path": "/api/v1/orders/{**catch-all}" }
      },
      "chat-hub-route": {
        "ClusterId": "crmchat-cluster",
        "Match": { "Path": "/hubs/chat/{**catch-all}" }
      },
      "hr-route": {
        "ClusterId": "hr-cluster",
        "Match": { "Path": "/api/v1/employees/{**catch-all}" }
      }
    },
    "Clusters": {
      "identity-cluster": {
        "Destinations": { "destination1": { "Address": "http://identity-service:8080" } }
      },
      "ecommerce-cluster": {
        "Destinations": { "destination1": { "Address": "http://ecommerce-service:8080" } }
      },
      "crmchat-cluster": {
        "Destinations": { "destination1": { "Address": "http://crmchat-service:8080" } }
      },
      "hr-cluster": {
        "Destinations": { "destination1": { "Address": "http://hr-service:8080" } }
      }
    }
  }
}
```

---

## 3. Communication Strategy

### 3.1 Real-Time Chat (SignalR WebSockets Hub)
- Customers initiate a socket handcheck at `/hubs/chat` which YARP routes to the **CRM Chat Service**.
- The service maps the customer to an active rep's socket connection using Redis as the backplane for tracking session states and socket descriptors.

### 3.2 Asynchronous Order Pipeline (RabbitMQ)
- When a customer purchases a wool product, Stripe triggers `checkout.session.completed`.
- **E-commerce Service** consumes this webhook and publishes an `OrderPaidEvent`.
- **CRM Chat & Customer Service** consumes this event to update the customer's purchase timeline.
- **Notification Service** triggers email confirmation alerts.
