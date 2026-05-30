# CRM Portal & E-commerce Product Overview & Requirements

This document represents the living product contract for the unified E-commerce Platform (selling wool and handmade products) and the CRM Portal (handling support chat and HR operations).

---

## 1. Functional Requirements (Yêu cầu Nghiệp vụ)

### 1.1 Identity & Tenant Service (Xác thực & Cách ly)
- **FR-AUTH-01 (Đăng ký Doanh nghiệp)**: Người sở hữu đăng ký thông tin doanh nghiệp (Tenant) và tài khoản quản trị viên.
- **FR-AUTH-02 (Xác thực & Cấp quyền)**: Sử dụng Access Token (JWT, 15 phút) và Refresh Token (Cookie HttpOnly, 7 ngày) được hỗ trợ lưu trữ bởi Redis.
- **FR-AUTH-03 (Phân quyền RBAC)**: Quản lý 4 nhóm vai trò chính:
  - *Super Admin*: Toàn quyền quản lý Tenant và cổng thanh toán.
  - *Manager*: Quản lý danh sách nhân sự hỗ trợ chat, cấu hình phân bổ ca trực và xem báo cáo doanh thu đồ len.
  - *Support/Sales Rep*: Nhân viên trực cổng CRM Portal, tiếp nhận chat của khách hàng, cập nhật trạng thái đơn hàng.
  - *Customer*: Người mua hàng trên giao diện E-commerce (đăng nhập xem lịch sử đơn hàng).

### 1.2 E-commerce Service (Đồ Len & Handmade Store)
- **FR-ECOM-01 (Danh mục sản phẩm)**: Hiển thị danh sách các sản phẩm làm từ len, đồ handmade (mô tả, giá, hình ảnh, phân loại và số lượng tồn kho).
- **FR-ECOM-02 (Giỏ hàng & Đặt hàng)**: Người dùng thêm/bớt mặt hàng len vào giỏ hàng, nhập thông tin giao hàng và gửi yêu cầu tạo đơn hàng.
- **FR-ECOM-03 (Thanh toán Stripe)**: Tích hợp cổng thanh toán trực tiếp qua **Stripe Checkout** an toàn. Xử lý các sự kiện thanh toán thành công thông qua Webhooks.
- **FR-ECOM-04 (Lịch sử đơn hàng)**: Khách hàng đăng nhập có thể xem lịch sử các đơn hàng đồ len handmade đã mua kèm trạng thái giao hàng.

### 1.3 CRM Portal: Chat Support & HR (Quản lý Hội thoại & Nhân sự)
- **FR-CRM-01 (Hệ thống Chat trực tuyến - Core)**: 
  - Kênh chat real-time (SignalR) liên kết trực tiếp từ giao diện mua đồ len ở E-commerce tới giao diện của nhân sự trực ca tại CRM Portal.
  - Quản lý hàng đợi tin nhắn (Chat queues) và tự động chỉ định phiên chat cho nhân sự đang online (Auto-assign).
- **FR-CRM-02 (Quản lý nhân sự - HR Core)**:
  - Quản lý danh sách nhân viên, thông tin liên hệ, phòng ban.
  - Thiết lập lịch trực ca chat hỗ trợ, ca chăm sóc khách hàng mua đồ handmade.
- **FR-CRM-03 (Hồ sơ Khách hàng 360 độ)**:
  - Tích hợp thông tin khách hàng, lịch sử mua đồ len handmade, và nhật ký các phiên chat hỗ trợ cũ lên một màn hình duy nhất.

### 1.4 AI Features (Gemini AI SDK)
- **FR-AI-01 (Smart Chat Assistant)**: Gemini gợi ý câu trả lời nhanh cho nhân viên tư vấn chat dựa trên lịch sử sản phẩm đồ len đang xem và câu hỏi của khách.
- **FR-AI-02 (Conversation Summary)**: Tự động tóm tắt các phiên chat hỗ trợ dài, ghi chú lại các ý chính của khách hàng (ví dụ: *yêu cầu đổi màu len, thắc mắc size*).
- **FR-AI-03 (Lead/Buyer Scoring)**: Đánh giá chất lượng và xếp hạng độ tiềm năng mua hàng của khách dựa trên tần suất tương tác chat và giỏ hàng hiện tại.
- **FR-AI-04 (Outreach Email Generator)**: Tự động viết email quảng bá, giới thiệu các mẫu đồ len handmade mới thiết kế dựa trên gu mua sắm cũ của khách.

---

## 2. Non-Functional Requirements (Yêu cầu Phi chức năng)

### 2.1 Security & Compliance (Bảo mật & Tuân thủ)
- **NFR-SEC-01 (Cách ly Tenant)**: Dữ liệu giữa các Portal doanh nghiệp phải được cô lập vật lý ở tầng database hoặc logic ở tầng Schema, đảm bảo không có rò rỉ chéo.
- **NFR-SEC-02 (Audit Logs)**: Ghi lại lịch sử thay đổi thông tin nhân sự, bảng lương hoặc điều chỉnh giá sản phẩm len.
- **NFR-SEC-03 (An toàn thông tin)**: Mã hóa mật khẩu người dùng bằng thuật toán hashing mạnh (BCrypt), lưu trữ token an toàn chống XSS/CSRF.

### 2.2 Performance & Scalability (Hiệu năng & Khả năng Mở rộng)
- **NFR-PERF-01 (Độ trễ truyền thông chat)**: Tin nhắn chat thời gian thực qua SignalR phải truyền tải dưới 100ms.
- **NFR-PERF-02 (Redis Caching)**: Lưu trữ các phiên chat đang hoạt động trên Redis để giảm tải truy vấn liên tục vào PostgreSQL.
- **NFR-PERF-03 (Xử lý bất đồng bộ)**: Đơn hàng E-commerce thanh toán thành công qua Stripe được gửi sang RabbitMQ để thông báo cho CRM Portal xử lý đơn hàng và gửi email xác nhận.
