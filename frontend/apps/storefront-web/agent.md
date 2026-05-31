# Storefront Web — Development Guide & Feature Specification

This file serves as the definitive, single source of truth for the **storefront-web** frontend application. Coding agents must reference this document before performing any feature additions, refactoring, or bug fixes to prevent code hallucinations ("bịa") and ensure alignment with the established design and architecture.

---

## 🏛️ Technology Stack & Core Rules

- **Framework**: Next.js 15+ (using App Router, client-rendered with `'use client'`).
- **Styling**: SCSS modules (`page.module.scss` for core variables and themes) + Vanilla CSS.
- **State & Queries**: Zustand (for light global states) and `@tanstack/react-query` (for server-side caching).
- **HTTP client**: Axios (`src/core/api/api.service.ts` is the central client wrapper).
- **Directory Layout**: Feature-Sliced Design (FSD) architecture.

---

## 📂 Feature-Sliced Design Directory Map

```text
frontend/apps/storefront-web/src/
├── app/                  # Application bootstrap, routing layout, and global CSS styles
│   ├── api/              # Simulated serverless API gateways
│   ├── global.css        # Curated color palettes, dark modes, scrollbars, and animations
│   ├── layout.tsx        # Next.js Root Layout wrapper
│   └── page.tsx          # Storefront entrypoint coordinating active views and states
│
├── core/                 # Shared enterprise abstractions (matches SPEC_CORE_FE.md)
│   ├── api/              # Axios HTTP client instances and interceptor configurations
│   ├── components/       # ErrorBoundary react class catchers
│   ├── constants/        # Route registries, API routes, RBAC permission roles
│   ├── exceptions/       # Custom ApiException classes
│   ├── hooks/            # useAuth, usePermission, useDebounce, usePagination, useLoading, useInfiniteScroll
│   ├── models/           # BaseEntity, AuditableEntity mapping interfaces
│   ├── repositories/     # BaseRepository data access decoupling shims
│   ├── stores/           # Zustand base state templates (loading, error, resets)
│   ├── types/            # Pagination requests, Pagination responses, API envelopes
│   └── utils/            # formatCurrency, formatDate, formatDateTime, slugify, truncate
│
├── entities/             # Business concepts & entities (e.g. Products, Cart, Users)
│   └── product/
│       └── data/
│           └── products.ts   # Curated raw dataset of wool & hand-knitted items
│
├── shared/               # Reusable styles, TypeScript typings, and generic components
│   ├── model/
│   │   └── types.ts      # Global types (Product, CartItem, Order, ViewType)
│   ├── styles/
│   │   └── page.module.scss  # Sleek dark mode gradients and micro-animation styles
│   └── ui/
│       └── ShaderBackground.tsx # WebGL organic simplex 2D noise animated canvas
│
├── views/                # Full-screen content layouts mapped to active storefront views
│   ├── home/ui/          # HomeView: Hero banners, highlights, and review carousels
│   ├── catalog/ui/       # CatalogView: Filters, search input, price range sliders
│   ├── detail/ui/        # DetailView: High-fidelity customization forms and galleries
│   ├── checkout/ui/      # CheckoutView: Shipping forms, mocked Stripe Card inputs
│   └── tracking/ui/      # TrackingView: Live real-time order status timeline tracker
│
└── widgets/              # Composite layout containers
    ├── cart-modal/ui/    # CartFloatingModal: Floating checkout summary drawer
    ├── footer/ui/        # Footer widget
    └── navbar/ui/        # Navbar widget with cart count state
```

---

## 🎨 Interactive Business Features (The Five View Tabs)

The application behaves like a Single Page Application (SPA) driven by the `activeView` state:

### 1. Home View (`src/views/home/ui/HomeView.tsx`)
- **Visuals**: Modern minimalist glassmorphic landing deck featuring neon HSL gradients.
- **Highlights**: Curated collection of high-end wool and handcrafted catalog items.
- **Interactions**: Organic call-to-action buttons redirecting directly to the **Catalog** tab.
- **Scroll Reveals**: Features elements with the `.reveal-on-scroll` class that transition smoothly using a custom `IntersectionObserver` trigger.

### 2. Catalog View (`src/views/catalog/ui/CatalogView.tsx`)
- **Search**: Case-insensitive query matching product names or categories.
- **Faceted Sidebar Filters**:
  - **Wool Types**: Multi-select options (e.g., *Lông Cừu Tự Nhiên*, *Sợi Acrylic Cao Cấp*, *Sợi Cotton Mềm*).
  - **Simulated Colors**: Dynamic filters (e.g., *Sage*, *Cream*, *Oatmeal*, *Lavender*).
  - **Max Price**: Range slider with real-time feedback (maximum limit up to 2,000,000 VND).
- **Actions**: Direct "Add to Cart" button (creates standard items in the cart) and "Xem chi tiết" buttons (triggers transition to **Detail View**).

### 3. Detail View / Bespoke Customizer (`src/views/detail/ui/DetailView.tsx`)
- **Visuals**: Split-screen dashboard. The left side holds high-fidelity product galleries with active main-image swapping. The right side holds the customizer form.
- **Bespoke Size Customization**:
  - **Chest Width**: Sliders or input groups (default: `85` cm, hidden/labeled *N/A* for non-apparel items like teddy bears).
  - **Sleeve Length**: Custom lengths (default: `58` cm, hidden/labeled *N/A* for non-apparel).
  - **Height**: Shopper height configuration (default: `165` cm, hidden/labeled *N/A* for non-apparel).
- **Color Selection**: Visual color swatches (e.g., *Sage Green*, *Cream Ivory*, *Warm Oatmeal*, *Soft Lavender*).
- **Shopper Notes**: Large textareas for specific requirements ("Mong muốn dáng áo hơi rộng một chút...", etc.).
- **Actions**: "Thêm vào giỏ hàng" triggers cart push carrying these custom sizing attributes.

### 4. Cart & Checkout View (`src/views/checkout/ui/CheckoutView.tsx`)
- **Cart Summary**: Lists items containing custom notes, colors, and dimensions. Allows removal of individual items.
- **Shipping Form**: Interactive input validators for *Họ và tên*, *Email*, *Địa chỉ*, and *Thành phố* selector.
- **Stripe Mocked Payments**: Card details section (*Số thẻ*, *Hạn sử dụng MM/YY*, *CVC*).
- **Loading States**: Shows a glassmorphic spinner overlay when "Thanh Toán Ngay" is triggered. Creates a mock order ID (`ZIT-XXXXXX`) and redirects to **Tracking View** after a 2-second simulation.

### 5. Live Order Tracking (`src/views/tracking/ui/TrackingView.tsx`)
- **Visuals**: A high-end vertical timeline tracing the active order status.
- **Timeline Milestones**:
  1. `received` (Đã tiếp nhận đơn hàng - Đang xếp hàng đợi đan len).
  2. `knitting` (Đang gia công đan tay - Đang thực hiện đan len theo số đo của bạn).
  3. `completed` (Đã đan xong - Đang kiểm tra chất lượng sản phẩm kỹ lưỡng).
  4. `shipping` (Đang giao hàng - Đơn hàng đã bàn giao cho đơn vị vận chuyển).
  5. `success` (Đã hoàn thành - Đơn hàng đã giao thành công).
- **Simulated Progression**: Automatically transitions status markers to the next stage every 8 seconds via a custom React effect.

---

## ⚡ Technical Foundations & Mocks

1. **WebGL Simplex Noise Canvas**: Renders a gorgeous high-fidelity dynamic animated weave background using custom vertex/fragment shader programs executed on the GPU, achieving smooth frame rates without external layout bloat.
2. **Backward-compatible Database placeholders**: Avoids database hardcoding in config sheets, falling back seamlessly to memory-based arrays or testing schemas depending on host environments.
3. **Nx Monorepo Compilability**: Must compile clean without diagnostics warnings:
   ```bash
   npx nx build storefront-web
   ```
