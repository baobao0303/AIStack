# 🧶 Tiệm Nhà Zịt - Frontend Nx Monorepo Workspace

This workspace manages the Next.js storefront and Angular management portals under a centralized, highly-reusable structure powered by **Nx Monorepo**.

---

## 📂 Workspace Structure

```text
apps/
├── storefront-web      # Next.js 15 (SSR) - Public e-commerce website for handmade items
├── crm-portal          # Angular 20 - Customer Relationship & Real-time Support Chat
├── support-portal      # Angular 20 - Support tickets intake portal
└── admin-portal        # Angular 20 - System administration dashboard

libs/
├── shared-ui           # Generic UI widgets (buttons, charts, inputs)
├── shared-types        # Unified TypeScript interfaces matching C# microservices models
├── shared-utils        # Core pure utilities (parsers, formatters)
├── shared-auth         # JWT, Refresh Token & secure session sliding logic
├── shared-api          # Centralized HTTP Client and API gateway endpoints mappings
├── shared-layout       # Shared navigation headers, footers & layout grids
└── shared-config       # Theme tokens, Tailwind configs, and Stitch Design system
```

---

## 🎨 Design System & Colors (Artisanal Craft Logic)
The monorepo uses unified design tokens generated from the **Google Stitch** mockup:
* **Background Canvas (Neutral)**: `#FAF9F6` (warm creamy parchment)
* **Accent Tone (Primary)**: `#6B46C1` (deep purple representing dyed wool)
* **Secondary Hue**: `#E9D8FD` (soft lavender)
* **Surfaces**: `#FFFFFF` (clean white cards with diffused shadows)
* **Typography**: Playfair Display + Inter

---

## 🚀 Running Applications

### Start Storefront Web (Next.js 15):
```bash
npx nx serve storefront-web
```

### Start CRM Portal (Angular 20):
```bash
npx nx serve crm-portal
```

### Start Support Portal (Angular 20):
```bash
npx nx serve support-portal
```

### Start Admin Portal (Angular 20):
```bash
npx nx serve admin-portal
```

---

## 🧪 Building, Linting & Testing

**Build all applications:**
```bash
npx nx run-many --target=build --all
```

**Execute linting suite:**
```bash
npx nx run-many --target=lint --all
```

**Run automated unit tests:**
```bash
npx nx run-many --target=test --all
```
