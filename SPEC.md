# CRM & E-commerce Microservices Specification Request

Tôi muốn xây dựng một hệ sinh thái kết hợp giữa cửa hàng thương mại điện tử (**E-commerce Platform**) chuyên bán các mặt hàng đồ len, đồ handmade và một cổng quản lý chăm sóc khách hàng & nhân sự (**CRM Portal**) theo kiến trúc Microservices hiện đại.

---

## Technology Stack

### Frontend (Next.js & Portal Layout)
* Next.js 15 (App Router)
* TypeScript
* ShadCN/UI
* Tailwind CSS + SCSS
* React Hook Form + Zod (Validation)
* TanStack Query (State & Caching)
* Deploy trên Vercel

### Backend (Microservices Core)
* .NET 8 Web API
* Clean Architecture
* CQRS + MediatR
* Entity Framework Core
* PostgreSQL (Isolated databases per service)
* Redis Cache (Session and chat active state)
* RabbitMQ (Event-driven message bus)
* JWT Authentication & RBAC

### Infrastructure
* API Gateway (YARP)
* Docker & Docker Compose
* Tilt cho môi trường local development
* GitHub Actions CI/CD

---

## Core Pillars & Microservices Division

Hệ thống được chia tách thành 2 mảng nghiệp vụ độc lập:

### 🛒 1. E-commerce Service (Đồ Len & Handmade)
Khu vực dành cho khách hàng mua sắm trực tuyến các sản phẩm thủ công, đồ len:
* **Product Catalog**: Hiển thị danh mục mặt hàng đồ len, đồ handmade (hình ảnh, mô tả, số lượng tồn kho).
* **Shopping Cart**: Giỏ hàng lưu trữ tạm thời các mặt hàng đã chọn.
* **Order & Checkout**: Xử lý đặt hàng, thanh toán qua cổng **Stripe**.
* **Order History**: Xem lại lịch sử mua hàng, trạng thái vận chuyển của đơn hàng.

### 🏢 2. CRM Portal (Quản lý & Hỗ trợ)
Cổng quản trị nội bộ dành cho doanh nghiệp vận hành:
* **Customer Support Chat System (Core)**: Quản lý hội thoại chat trực tiếp giữa nhân viên tư vấn với khách hàng mua đồ len. Hỗ trợ real-time chat (sử dụng SignalR/WebSockets).
* **Human Resource Management (HR Core)**: Quản lý nhân sự, danh sách nhân viên kinh doanh, phân bổ ca trực, ca hỗ trợ chat.
* **Customer Management**: Xem hồ sơ 360 độ của khách hàng (lịch sử mua đồ handmade, ghi chú, timeline hoạt động và các đoạn hội thoại chat cũ).
* **Dashboard & Analytics**: Thống kê KPIs về doanh thu bán hàng handmade, hiệu suất phản hồi chat của nhân sự.

---

## AI Features (Gemini AI SDK)

* **Lead & Buyer Scoring**: Tự động chấm điểm độ tiềm năng của khách mua hàng dựa trên tương tác và giỏ hàng.
* **Smart Chat Assistant**: Gợi ý câu trả lời nhanh cho nhân viên tư vấn chat dựa trên lịch sử sản phẩm đồ len và câu hỏi của khách hàng.
* **Meeting & Conversation Summary**: Tóm tắt nội dung phiên chat hỗ trợ dài thành 3-5 ý chính.
* **Email Generator**: Sinh email chăm sóc, giới thiệu các mẫu đồ len handmade mới.

---

## Audit & Security

* **Audit Logs**: Ghi lại lịch sử truy cập, thay đổi lương/thông tin nhân sự hoặc chỉnh sửa đơn hàng.
* **Role-based Access Control (RBAC)**: Phân quyền cụ thể cho các vai trò:
  - *Super Admin*: Toàn quyền hệ thống.
  - *Manager*: Quản lý nhân viên hỗ trợ chat, xem báo cáo doanh thu đồ len.
  - *Sales/Support Rep*: Trực tiếp chat hỗ trợ khách hàng, cập nhật đơn hàng.

---

## Deliverables

Hãy giúp tôi:
1. Thiết kế kiến trúc tổng thể kết hợp E-commerce và CRM Portal.
2. Thiết kế database schema chi tiết cho cả 2 mảng (E-commerce và CRM).
3. Thiết kế Microservices và API Gateway (YARP).
4. Thiết kế Clean Architecture cho .NET 8.
5. Thiết kế Next.js frontend.
6. Thiết kế CI/CD pipeline.
7. Thiết kế Docker và Tilt cho môi trường local.
8. Viết User Stories tập trung vào nghiệp vụ bán hàng handmade, hệ thống chat hỗ trợ và quản lý nhân sự.
9. Viết Functional & Non-Functional Requirements.
10. Xây dựng Roadmap triển khai từ MVP đến Production.

---

# Frontend Architecture Specification

## Frontend Overview

Hệ thống frontend được tổ chức theo mô hình Nx Monorepo nhằm quản lý tập trung nhiều ứng dụng trong cùng một workspace.

Workspace bao gồm:

```text
apps/
├── storefront-web      (Next.js 15 SSR)
├── admin-portal        (Angular 20)
├── support-portal      (Angular 20)
└── crm-portal          (Angular 20)

libs/
├── shared-ui
├── shared-types
├── shared-utils
├── shared-auth
├── shared-api
├── shared-layout
└── shared-config
```

---

# Technology Stack

## Public Website (E-commerce)

### Framework
* Next.js 15
* React 19
* TypeScript
* App Router
* Server Components
* Server Actions

### Styling
* Tailwind CSS
* SCSS Modules

Example:
```text
ProductCard.tsx
ProductCard.module.scss
```

### UI Components
* ShadCN/UI
* Radix UI

### State Management
* TanStack Query
* Zustand

### Validation
* React Hook Form
* Zod

### Authentication
* JWT
* Refresh Token

### Deployment
* Vercel

---

# Admin Portal

## Framework
Angular 20+

### Architecture
* Standalone Components
* Signals
* Feature-based Structure
* Lazy Loading

### Styling
* SCSS
* Tailwind CSS

Example:
```text
dashboard.component.ts
dashboard.component.html
dashboard.component.scss
```

### State Management
* NgRx Signal Store

### Forms
* Reactive Forms
* Angular Validators

### Charts
* ECharts
* ngx-echarts

### Realtime
* SignalR

---

# Nx Workspace Structure

```text
apps/
│
├── storefront-web
│
├── crm-portal
│
├── support-portal
│
└── admin-portal

libs/
│
├── ui
│   ├── buttons
│   ├── forms
│   ├── dialogs
│   ├── tables
│   └── charts
│
├── auth
│
├── api
│
├── shared
│
├── constants
│
├── types
│
└── utils
```

---

# Storefront Features

## Public Pages

### Home
* Hero Banner
* Handmade Collection
* Featured Products
* Best Sellers
* New Arrivals

### Product Listing
* Search
* Category Filter
* Price Filter
* Pagination
* Sort

### Product Detail
* Gallery
* Description
* Inventory
* Reviews
* Related Products

### Shopping Cart
* Add Item
* Remove Item
* Quantity Update

### Checkout
* Shipping Address
* Stripe Payment
* Order Confirmation

### Order History
* Orders
* Tracking
* Invoices

### Customer Profile
* Profile Information
* Address Book
* Purchase History

---

# CRM Portal Features

## Dashboard

### KPI Cards
* Revenue
* Orders
* Active Customers
* Support Tickets

### Analytics
* Revenue Chart
* Customer Growth
* Product Performance

---

## Customer Management

### Customer List
* Search
* Filters
* Export

### Customer Profile
* Personal Information
* Orders
* Chat History
* Notes
* Activities Timeline

---

## Chat Support

### Inbox
* Active Conversations
* Waiting Customers
* Assigned Agents

### Chat Window
* Realtime Messages
* File Upload
* Internal Notes
* AI Suggested Replies

### AI Features
* Suggested Response
* Conversation Summary
* Sentiment Analysis

---

## Human Resource Management

### Employee Management
* Employees
* Roles
* Permissions

### Shift Management
* Shift Assignment
* Shift Calendar
* Availability

### Performance
* Response Time
* Customer Satisfaction
* Closed Conversations

---

# Authentication

## Login Flow

Access Token
```json
{
  "exp": "15m",
  "iat": "timestamp"
}
```

Refresh Token
```json
{
  "exp": "7d",
  "iat": "timestamp"
}
```

### Security
* RBAC
* Refresh Token Rotation
* Sliding Expiration
* Absolute Expiration
* Secure HTTP Only Cookies

---

# API Communication

All applications communicate through API Gateway.

```text
Next.js
        \
         \
Angular ----> YARP Gateway
         /
        /

Microservices
```

---

# Responsive Design

Breakpoints
```text
Mobile    0 - 767px
Tablet    768 - 1023px
Desktop   1024+
```

Requirements:
* Mobile First
* Responsive Tables
* Responsive Dashboard
* Responsive Chat

---

# Design System

Theme
```text
Primary
Secondary
Success
Warning
Danger
Info
```

Typography
```text
Heading
Sub Heading
Body
Caption
```

Spacing
```text
4
8
12
16
24
32
48
64
```

---

# Testing

## Next.js
* Jest
* React Testing Library
* Playwright

## Angular
* Jasmine
* Karma
* Cypress

---

# Performance Targets

Storefront
* Lighthouse > 90
* FCP < 1.5s
* LCP < 2.5s

Admin Portal
* Initial Load < 3s
* Lazy Loaded Features
* Route Preloading

---

# Deployment

## Storefront
* Vercel
* SSR
* Edge Cache

## Angular Portals
* Docker
* Nginx
* Kubernetes Ready

## CI/CD

GitHub Actions
```text
PR
 ↓
Lint
 ↓
Test
 ↓
Build
 ↓
Docker Build
 ↓
Deploy
```

All frontend applications must follow Nx Monorepo standards and share common libraries whenever possible.
