# CRM Portal & E-commerce Microservices Project Plan

Tài liệu này lưu trữ lộ trình phát triển và tiến độ thực thi thực tế của AI Coding Agent (**Antigravity**) trong quá trình xây dựng hệ thống **E-commerce Platform** (bán đồ len handmade) và **CRM Portal** (chat SignalR & quản lý nhân sự).

---

## 📊 Trạng thái Tiến độ Dự án (Project Progress)

```text
[████████████░░░░░░░░░░░░░░░░░░] 40% Hoàn thành (Hoàn thành US-001 & US-002 backend cores)
```

- **Quyết định thiết kế (ADRs)**: 5/5 tài liệu kỹ thuật đã hoàn thành.
- **Backlog & Stories**: 8 câu chuyện người dùng đã được định nghĩa và đăng ký vào Harness DB.
- **Môi trường & SDK**: Đã ghi nhận tương thích chéo sang **.NET 6 SDK** (Backlog #1) phù hợp với máy local.
- **Hành động hiện tại (Current Focus)**: Chuẩn bị chuyển sang Giai đoạn 3: Phát triển E-commerce Core & Stripe.

---

## 📝 Nhật ký & Checklist chi tiết

### 🟢 Giai đoạn 1: Đặc tả Nghiệp vụ & Khởi tạo (ĐÃ HOÀN THÀNH)
- [x] Đăng ký Intake phân loại rủi ro trên Harness (`high_risk` - Intake #2).
- [x] Điều chỉnh tệp đặc tả [SPEC.md](file:///Users/bao312/Desktop/Test/SPEC.md) phân tách rõ E-commerce và CRM.
- [x] Biên soạn hợp đồng sản phẩm [crm-overview.md](file:///Users/bao312/Desktop/Test/docs/product/crm-overview.md) và phân chia lộ trình [crm-roadmap.md](file:///Users/bao312/Desktop/Test/docs/product/crm-roadmap.md).
- [x] Tạo lập bộ 8 User Stories chi tiết tại [crm-stories.md](file:///Users/bao312/Desktop/Test/docs/product/crm-stories.md) và đăng ký vào cơ sở dữ liệu Harness SQLite.
- [x] Hoàn thiện 3 Quyết định Kiến trúc (ADRs): Sơ đồ Microservices ([ADR 0006](file:///Users/bao312/Desktop/Test/docs/decisions/0006-crm-microservice-architecture.md)), Sơ đồ database PostgreSQL ([ADR 0007](file:///Users/bao312/Desktop/Test/docs/decisions/0007-crm-database-schema-and-tenancy.md)), Mô hình RBAC & Security ([ADR 0008](file:///Users/bao312/Desktop/Test/docs/decisions/0008-crm-security-and-auth.md)).
- [x] Viết script tự động kiểm tra tính hợp lệ của tài liệu [validate-crm-docs.sh](file:///Users/bao312/Desktop/Test/scripts/validate-crm-docs.sh).

### 🟡 Giai đoạn 2: Phát triển Lõi Backend (ĐÃ HOÀN THÀNH)
- [x] Khởi tạo folder dự án cô lập `backend/services/Identity` để tránh ảnh hưởng đến thư mục gốc.
- [x] Scaffold thành công giải pháp **Clean Architecture** `.NET 6` (Domain, Application, Infrastructure, Api, Tests) và liên kết tệp `Identity.sln`.
- [x] Cấu hình chính xác tất cả các Project References giữa các tầng.
- [x] Biên dịch và thử nghiệm giải pháp thành công với **0 lỗi và 0 cảnh báo**.
- [x] **[ĐÃ HOÀN THÀNH]** Triển khai thành công US-001: Xây dựng các thực thể Tenant, User, Role, UserRole trong Identity.Domain, viết MediatR command handler và bộ 14 unit tests (100% Passed).
- [x] **[ĐÃ HOÀN THÀNH]** Xây dựng Database Context (Entity Framework Core) kết nối PostgreSQL và viết Database Migrations cho US-001.
- [x] **[ĐÃ HOÀN THÀNH]** Triển khai các API Endpoints phục vụ việc đăng ký tài khoản và doanh nghiệp.
- [x] **[ĐÃ HOÀN THÀNH]** Viết bộ kiểm thử tự động xUnit để chứng minh chất lượng (Validation Proof).
- [x] **[ĐÃ HOÀN THÀNH]** Triển khai US-002: Xây dựng secure login endpoint `POST /api/v1/auth/login`, JWT access token emission, và Redis-backed session tracking. Viết bộ 5 unit/integration tests (100% Passed).

### ⚪ Giai đoạn 3: Phát triển E-commerce Core & Stripe (CHƯA BẮT ĐẦU)
- [ ] Khởi tạo dự án `E-commerce Service` (.NET 6).
- [ ] Xây dựng catalog sản phẩm đồ len handmade.
- [ ] Tích hợp Stripe Checkout và RabbitMQ webhook consumers.

### ⚪ Giai đoạn 4: Hệ thống Chat SignalR & CRM Portal HR (CHƯA BẮT ĐẦU)
- [ ] Khởi tạo `CRM Chat Service` (.NET 6) và SignalR Hub.
- [ ] Thiết lập hệ thống hàng đợi phiên chat trên Redis.
- [ ] Xây dựng phân hệ HR Employees quản lý ca trực của nhân viên.

---

## 🛠️ Các lệnh kiểm chứng hữu ích cho lập trình viên

1. **Kiểm tra tính hợp lệ của toàn bộ tài liệu thiết kế**:
   ```bash
   ./scripts/validate-crm-docs.sh
   ```
2. **Xem tiến độ kiểm thử và trạng thái Stories hiện tại**:
   ```bash
   ./scripts/harness query matrix
   ```
3. **Xem các báo cáo rào cản/nỗi đau phát triển (Friction)**:
   ```bash
   ./scripts/harness query backlog
   ```
4. **Xem lịch sử log trace của AI Agent**:
   ```bash
   ./scripts/harness query traces
   ```
