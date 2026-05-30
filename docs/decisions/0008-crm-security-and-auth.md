# Architectural Decision Record (ADR): 0008 CRM Portal & E-commerce Security & Auth

- **Date**: 2026-05-30
- **Status**: Accepted
- **Context**: The CRM Portal hosts proprietary employee rosters, schedules, and active customer live support chat sessions. The storefront operates with external customer orders. We must build a clean Role-Based Access Control (RBAC) structure.

---

## 1. Authentication Separation

We separate user scopes to simplify authentication flows:
1. **Portal Users (Employees/Admins)**: Authenticated via the **Identity Service**. Credentials map to specific tenant workspaces. Upon successful verification, they receive a JWT specifying their tenant context and organizational roles.
2. **E-commerce Shoppers (Customers)**: Authenticated via a simplified customer account profile. Access token claims contain email parameters but exclude system manager roles.

---

## 2. Dynamic RBAC Matrix (Cổng CRM Portal)

We map corporate permissions dynamically using resource claims. 

| Resource | Action | Super Admin | Manager | Support/Sales Rep | Customer |
| --- | --- | :---: | :---: | :---: | :---: |
| **Workspace Settings**| Read/Write | Yes | No | No | No |
| **Employee Registry** | Create/Delete | Yes | Yes | No | No |
| **Employee Shifts** | Read/Write | Yes | Yes | Yes (Read-only) | No |
| **Products (Wool)** | Create/Update | Yes | Yes | No | No |
| | Read | Yes | Yes | Yes | Yes (Public) |
| **Orders** | Read/Update | Yes | Yes | Yes | Yes (Own) |
| **Live Chat Sessions**| Assign Agent | Yes | Yes | No | No |
| | Chat Response | Yes | Yes | Yes | Yes (Own) |
| **AI Assistants** | Suggested Chat| Yes | Yes | Yes | No |
| **Audit Logs** | Read | Yes | Yes (Own) | No | No |

---

## 3. SignalR WebSockets Security Gate

To protect the Customer Support Chat channels:
- Socket handshakes at `/hubs/chat` must supply a valid authentication token.
- For customers, the Gateway authorizes anonymous socket connections but tags them with a unique temporary shopper identifier.
- For employees, the connection requires a valid `Identity Service` JWT carrying a support claim.
- Connection tokens are validated at the Gateway before connection upgrade.
