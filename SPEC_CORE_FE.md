# Frontend Core Specification

## Overview

Tài liệu này định nghĩa các thành phần Core được sử dụng xuyên suốt toàn bộ hệ thống Frontend nhằm đảm bảo tính nhất quán, khả năng tái sử dụng và dễ bảo trì.

---

# Technology Stack

| Category         | Technology         |
| ---------------- | ------------------ |
| Framework        | Next.js 15+        |
| Language         | TypeScript         |
| UI Library       | ShadCN/UI          |
| Styling          | TailwindCSS + SCSS |
| State Management | Zustand            |
| Data Fetching    | TanStack Query     |
| HTTP Client      | Axios              |
| Form             | React Hook Form    |
| Validation       | Zod                |

---

# Core Architecture

```text
src/
├── core/
│   ├── api/
│   ├── repositories/
│   ├── stores/
│   ├── models/
│   ├── hooks/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── exceptions/
```

---

# Base API Service

## Purpose

Cung cấp abstraction dùng chung cho việc gọi API.

## Responsibilities

* HTTP GET
* HTTP POST
* HTTP PUT
* HTTP PATCH
* HTTP DELETE
* Upload File
* Download File
* Request Interceptor
* Response Interceptor
* Error Handling
* Authorization Header Injection

## Standard Methods

```typescript
get<T>()
post<T>()
put<T>()
patch<T>()
delete<T>()
```

---

# Base Repository

## Purpose

Tách biệt tầng Business Logic và API Layer.

## Responsibilities

* CRUD Operations
* Mapping DTO
* Data Transformation
* Query Composition

## Standard Methods

```typescript
getAll()
getById()
create()
update()
delete()
```

---

# Base Query Layer

## Purpose

Chuẩn hóa việc sử dụng TanStack Query.

## Responsibilities

* Cache Management
* Retry Strategy
* Pagination Support
* Infinite Query Support
* Error Handling

## Standards

* Query Keys phải được centralize.
* Không hard-code query keys trong component.

Example:

```typescript
export const QueryKeys = {
  users: ["users"],
  products: ["products"],
  orders: ["orders"]
};
```

---

# Base Store

## Purpose

Quản lý Global State bằng Zustand.

## Responsibilities

* Loading State
* Error State
* Global State Synchronization

## Base State

```typescript
interface BaseState {
  loading: boolean;
  error?: string;
}
```

## Base Actions

```typescript
interface BaseActions {
  reset(): void;
  clearError(): void;
}
```

---

# Base Models

## Base Entity

```typescript
interface BaseEntity {
  id: string;
}
```

## Auditable Entity

```typescript
interface AuditableEntity {
  createdAt: string;
  createdBy?: string;

  updatedAt?: string;
  updatedBy?: string;
}
```

---

# API Response Standards

## Standard Response

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
```

## Error Response

```typescript
interface ApiErrorResponse {
  success: false;
  code: string;
  message: string;
}
```

---

# Pagination Standards

## Request

```typescript
interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}
```

## Response

```typescript
interface PaginationResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
```

---

# Base Form Standards

## Purpose

Chuẩn hóa việc xử lý Form.

## Libraries

* React Hook Form
* Zod

## Responsibilities

* Validation
* Error Mapping
* Submit Handling
* Loading State
* Reset Form

## Rules

* Tất cả Form phải sử dụng Zod Schema.
* Không validate trực tiếp trong Component.

---

# Error Handling

## Global Error Boundary

Bắt toàn bộ lỗi Runtime trong ứng dụng.

## API Error Handling

| Status | Action                |
| ------ | --------------------- |
| 400    | Show Validation Error |
| 401    | Redirect Login        |
| 403    | Access Denied         |
| 404    | Not Found Page        |
| 500    | Internal Error Page   |

---

# Authentication Core

## Responsibilities

* Login
* Logout
* Refresh Token
* Session Validation

## Storage Strategy

| Token         | Storage         |
| ------------- | --------------- |
| Access Token  | Memory          |
| Refresh Token | HttpOnly Cookie |

---

# Authorization Core

## RBAC Model

### Roles

```text
SuperAdmin
Admin
Manager
Staff
Customer
```

### Permission Format

```text
user.view
user.create
user.update
user.delete

role.manage

product.manage
```

---

# Core Hooks

## Standard Hooks

```text
useDebounce()
usePagination()
useLoading()
usePermission()
useAuth()
useInfiniteScroll()
```

---

# Utility Layer

## Date Utilities

```text
formatDate()
formatDateTime()
```

## Number Utilities

```text
formatCurrency()
formatNumber()
```

## String Utilities

```text
capitalize()
slugify()
truncate()
```

## File Utilities

```text
downloadFile()
uploadFile()
```

---

# Constants Management

## Structure

```text
constants/
├── api.constants.ts
├── route.constants.ts
├── permission.constants.ts
├── role.constants.ts
└── app.constants.ts
```

## Rules

* Không hard-code URL.
* Không hard-code Permission.
* Không hard-code Route Path.

---

# Logging Standards

## Client Logging

Capture:

* API Errors
* Runtime Errors
* Unhandled Exceptions

## Log Levels

```text
INFO
WARN
ERROR
DEBUG
```

---

# Coding Standards

## Naming Convention

### Components

```text
UserTable.tsx
ProductForm.tsx
OrderDetail.tsx
```

### Hooks

```text
useAuth.ts
usePagination.ts
useDebounce.ts
```

### Services

```text
user.service.ts
product.service.ts
order.service.ts
```

### Stores

```text
auth.store.ts
app.store.ts
theme.store.ts
```

---

# Performance Standards

## Requirements

* Lazy Loading
* Dynamic Import
* Route Prefetching
* Image Optimization
* Query Caching

## Targets

* Lighthouse Score >= 90
* First Contentful Paint < 2s
* Largest Contentful Paint < 2.5s

---

# Security Standards

## Frontend Security

* CSP Headers
* XSS Prevention
* CSRF Protection
* Secure Cookies
* Token Rotation

## Route Security

* Middleware Authentication
* Permission-Based Access Control

---

# Definition of Done

Một Core Module được xem là hoàn thành khi:

* Có Unit Test.
* Có Type Definition.
* Có Error Handling.
* Có Loading State.
* Có Documentation.
* Tuân thủ Coding Standards.
* Được review và approved.

```
```
