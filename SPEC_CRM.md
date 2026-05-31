# SPEC_CRM.md - Specification for CRM Portal (Tiệm Nhà Zịt)

Đây là tài liệu đặc tả chi tiết giao diện và luồng xử lý của cổng quản trị **CRM Portal** của hệ thống **Tiệm Nhà Zịt**, được thiết kế theo ngôn ngữ thiết kế **Stitch Design System** (Modern Tactile) và kết nối trực tiếp với backend C# API.

---

## 1. Kiến trúc Giao diện & Chủ đề (Theme Setup)

Theo Stitch Design System định nghĩa cho dự án `CRM and Admin Portals` (Modern Tactile off-white / lavender theme):
*   **Color Mode**: LIGHT
*   **Global Background**: `#faf9f6` (Off-white / Creamy Neutral - Parchment-like canvas)
*   **Card/Surface**: `#ffffff` (Pure White with subtle 1px border and soft shadow: Blur 15px, Y 4px, 4% black shadow)
*   **Primary Color**: `#6b46c1` (Deep Purple - Rich brand identity representing dyed wool)
*   **Secondary Color**: `#e9d8fd` (Soft Lavender - Subtle backgrounds, tag fills)
*   **Typography**:
    *   *Headings*: **Playfair Display** (Serif, adding high-end artisanal look)
    *   *Body/UI Elements*: **Inter** (Sans-serif, ensuring optimal legibility)
*   **Corner Radius (Shapes)**:
    *   *Containers/Cards*: 16px (`roundness: ROUND_EIGHT`)
    *   *Buttons/Inputs*: 8px
    *   *Status dots*: 100% Circular

---

## 2. Các Phân hệ Chức năng của CRM Portal

### 2.1 Màn hình Dashboard KPI & Shell
*   **Bảng Điều Khiển KPI (Tổng quan)**:
    *   Hiển thị 4 thẻ KPI chính ở phía trên:
        1.  **Tổng Sản Phẩm**: Tổng số sản phẩm trong hệ thống (Call `/api/v1/products`).
        2.  **Đang Hoạt Động (Active)**: Số sản phẩm có status là `Active`.
        3.  **Hết Hàng / Cảnh Báo**: Sản phẩm có `inventoryStock <= 5` hoặc status `OutOfStock`.
        4.  **Sản phẩm Bản nháp (Draft)**: Số lượng sản phẩm ở chế độ bản nháp.
    *   **Thống kê Kho hàng**: Hiển thị biểu đồ/bảng danh sách các sản phẩm có lượng tồn kho thấp (dưới ngưỡng Warning Threshold).
*   **Khung Giao Diện (Layout Shell)**:
    *   Thanh Sidebar bên trái: Logo "Tiệm Nhà Zịt", menu điều hướng (Tổng quan, Sản phẩm, Danh mục, Tồn kho, Phản hồi khách hàng), thông tin tài khoản Admin/Manager hiện tại.
    *   Thanh Header bên trên: Tiêu đề trang động (sử dụng Playfair Display), công cụ tìm kiếm nhanh (kèm đề xuất Suggestion qua `/api/v1/products/suggestions`).

### 2.2 Quản lý Sản phẩm (Product CRUD & Media Upload)
*   **Bảng Danh sách Sản phẩm**:
    *   Hiển thị ảnh thu nhỏ, tên sản phẩm, mã SKU, phân loại (Category), giá bán (Formatted VND), số lượng tồn kho và Trạng thái (`Active`, `Draft`, `OutOfStock`, `Archived`).
    *   Hỗ trợ lọc sản phẩm theo Category và tầm giá.
    *   Hành động nhanh trên mỗi hàng: Đăng bán (Publish), Lưu trữ (Archive), Sửa (Edit), Xóa mềm (Delete).
*   **Form Thêm / Sửa Sản phẩm (Modal or Drawer)**:
    *   Các trường thông tin: Tên sản phẩm, SKU, Slug (tự động tạo từ tên), Giá bán, Phân loại, Chất liệu len (WoolType), Mô tả (Rich text hoặc textarea).
    *   Cấu hình Biến thể (Colors & Types): Thêm danh sách màu sắc (Tên màu, mã màu hex) và kiểu dáng.
    *   **Tải lên Hình ảnh / Video**: Tích hợp kéo thả tải file lên S3 Storage thông qua endpoint `/api/v1/products/media/images` và hiển thị danh sách media trực quan.

### 2.3 Quản lý Danh mục (Category Administration)
*   Màn hình quản trị danh sách các danh mục (Móc khóa, Áo len, Thảm handmade, Phụ kiện, v.v.).
*   **Chức năng**:
    *   Hiển thị bảng danh mục kèm số lượng sản phẩm liên kết (nếu có).
    *   Thêm mới danh mục: Modal nhập tên danh mục, tự động kiểm tra trùng lặp.
    *   Chỉnh sửa danh mục: Cập nhật tên.
    *   Xóa danh mục: Chỉ cho phép xóa danh mục trống hoặc chuyển các sản phẩm liên quan sang danh mục mặc định.

### 2.4 Quản lý Tồn kho (Inventory Limits & Adjustments)
*   Bảng điều khiển kiểm soát lượng tồn kho thời gian thực.
*   **Hành động**:
    *   Cập nhật nhanh lượng tồn kho (`inventoryStock`) cho từng sản phẩm trực tiếp trên bảng hoặc qua Modal.
    *   Thiết lập ngưỡng cảnh báo tồn kho thấp (Warning Threshold) chung của hệ thống hoặc riêng cho từng sản phẩm.
    *   Hiển thị số lượng Stock Đang giữ tạm thời (Reserved Stock) của khách mua đang checkout để theo dõi luồng Pessimistic Lock.

### 2.5 Nhật ký Phản hồi & Đánh giá (Review Moderation Logs)
*   Màn hình kiểm duyệt phản hồi khách hàng.
*   **Chức năng**:
    *   Hiển thị danh sách các phản hồi khách hàng: Tên sản phẩm, số sao đánh giá (sử dụng sao vàng trực quan), nội dung nhận xét, ngày gửi.
    *   Thao tác kiểm duyệt: Duyệt phản hồi để hiện lên storefront hoặc Ẩn/Lưu trữ các phản hồi vi phạm chính sách cộng đồng.
    *   Xem thống kê số điểm trung bình của sản phẩm theo phản hồi.

---

## 3. Bản đồ Tương thích API (Backend Integration)

| Nghiệp vụ CRM | Phương thức HTTP | Route API | Payload / Parameters |
| :--- | :--- | :--- | :--- |
| **KPI Dashboard** | `GET` | `/api/v1/products` | Lấy toàn bộ để tự thống kê client-side (do backend chưa có endpoint thống kê riêng biệt) |
| **Tìm kiếm & Đề xuất** | `GET` | `/api/v1/products/suggestions` | `?q={keyword}` -> Trả về mảng gợi ý tên sản phẩm |
| **Đọc Sản phẩm** | `GET` | `/api/v1/products` | Phục vụ phân trang, lọc theo category, giá cả |
| **Tạo Sản phẩm** | `POST` | `/api/v1/products` | `CreateProductCommand` `{ name, description, price, categoryId, colors, ... }` |
| **Sửa Sản phẩm** | `PUT` | `/api/v1/products/{id}` | `UpdateProductCommand` |
| **Xóa Sản phẩm** | `DELETE` | `/api/v1/products/{id}` | Xóa mềm |
| **Đăng bán** | `PATCH` | `/api/v1/products/{id}/publish` | Đổi status sang `Active` |
| **Lưu trữ** | `PATCH` | `/api/v1/products/{id}/archive` | Đổi status sang `Archived` |
| **Tải ảnh** | `POST` | `/api/v1/products/media/images` | `multipart/form-data` file upload |
| **Danh mục** | `GET`, `POST` | `/api/v1/categories` | CRUD danh mục |
| **Tồn kho** | `GET`, `PUT` | `/api/v1/inventory/{productId}` | Cập nhật `inventoryStock` |
| **Kiểm duyệt Reviews** | `GET` | `/api/v1/products/{productId}/reviews` | Danh sách review của sản phẩm |

---

## 4. Kế hoạch Kiểm thử & Định nghĩa Thành công

1.  **Giao diện Đẹp Đạt Chuẩn Stitch**: Toàn bộ Portal sử dụng đúng bảng màu kem (#faf9f6), tím (#6b46c1), các nút có bán kính góc bo tròn 8px, thẻ bo tròn 16px, và typography Playfair Display nổi bật, tạo cảm giác vô cùng cao cấp và ấm áp.
2.  **Luồng Nghiệp Vụ Chạy Trơn Tru**:
    *   Có thể thêm sản phẩm len mới, upload ảnh trực quan, đặt giá và đăng bán.
    *   Tự động tính toán KPI chính xác từ dữ liệu API.
    *   Cập nhật số lượng tồn kho tức thì phản ánh chính xác.
3.  **Hoàn thành chuỗi Story trong DB**: Cả 4 user stories (US-017, US-018, US-019, US-020) được cập nhật status `implemented` kèm evidence rõ ràng.
