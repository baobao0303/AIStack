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
5. Thiết kế cấu trúc Next.js frontend.
6. Thiết kế CI/CD pipeline.
7. Thiết kế Docker và Tilt cho môi trường local.
8. Viết User Stories tập trung vào nghiệp vụ bán hàng handmade, hệ thống chat hỗ trợ và quản lý nhân sự.
9. Viết Functional & Non-Functional Requirements.
10. Xây dựng Roadmap triển khai từ MVP đến Production.
