# Architectural Decision Record (ADR): 0009 CRM Next.js Frontend Structure

- **Date**: 2026-05-30
- **Status**: Accepted
- **Context**: The frontend needs a premium, high-performance, and maintainable user interface. It is built on **Next.js 15 (App Router)** and needs a structured organization that separates layout shells, reusable components, and API states cleanly while supporting rapid client-side rendering.

---

## 1. Directory Structure

We use a modular structure inside the `src/` directory to group layouts, page slices, hooks, and API interactions.

```text
src/
├── app/                           # Next.js 15 App Router Routes
│   ├── (auth)/                    # Auth Group (Login, Register, Forgot Password)
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/               # Dashboard Shell Group (Shared sidebar & topbar)
│   │   ├── dashboard/page.tsx     # Overview charts and KPI dashboard
│   │   ├── customers/             # Customers and Contacts listing
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx      # Customer detail and activity timeline
│   │   ├── leads/                 # Lead pipeline Kanban
│   │   │   └── page.tsx
│   │   └── settings/              # System and Subscription settings
│   ├── layout.tsx                 # Root HTML & Providers shell
│   └── page.tsx                   # Public landing page
├── components/                    # Reusable Presentation Components
│   ├── ui/                        # ShadCN raw components (Button, Input, Dialog, etc.)
│   ├── sidebar.tsx                # Premium collapsible Navigation Sidebar
│   ├── kpi-card.tsx               # Analytics statistic display block
│   └── kanban-board.tsx           # Drag-and-drop Opportunity board
├── hooks/                         # Custom Hooks (API, UI States)
│   ├── use-auth.ts                # Auth session and role controls
│   └── use-toast.ts               # User alerts notifier hook
├── lib/                           # Utilities & Clients
│   ├── api-client.ts              # Axios wrapper with automatic token refresh
│   └── utils.ts                   # Tailwind merger (cn)
├── styles/                        # Custom SCSS overrides
│   ├── variables.scss
│   └── globals.css
```

---

## 2. Component System & Styling

- **Core Structure**: Built on **ShadCN/UI** components, which are customizable directly inside the repository.
- **Styling**: Structured **Tailwind CSS** classes combined with **SCSS** for variables and custom animations (micro-interactions, transitions, glassmorphism overlays).
- **Typography & Theme**: Modern geometric typography using the Google Font *Outfit* or *Inter*. Responsive layouts that transition smoothly from desktop viewports down to tablet and mobile panels.

---

## 3. Form Validation & Client State

- **Form Validation**: **React Hook Form** paired with **Zod** schema parser to enforce boundary constraints on user inputs before submitting payloads:
  ```typescript
  // Validation schema for creating a new Lead
  export const leadFormSchema = zod.object({
    firstName: zod.string().min(2, "First name must be at least 2 characters"),
    lastName: zod.string().optional(),
    company: zod.string().min(1, "Company is required"),
    email: zod.string().email("Invalid email address"),
    phone: zod.string().regex(/^\+?[0-9]{10,15}$/, "Invalid phone format"),
  });
  ```
- **Server-State Sync**: **TanStack Query (React Query)** to handle data fetching, query caching, background polling, and cache invalidation:
  ```typescript
  // Custom hook to query a Customer list
  export function useCustomers() {
    return useQuery({
      queryKey: ['customers'],
      queryFn: async () => {
        const response = await apiClient.get('/api/v1/customers');
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });
  }
  ```

---

## 4. Consequences

### Positive
- **Highly Modular**: Adding new pages or features is as simple as inserting a Next.js App Router subfolder.
- **Robust Client Validation**: Zod prevents malformed requests from leaving the browser, easing backend input validation load.
- **Data Consistency**: TanStack Query automatically syncs data across different components (e.g. converting a lead in Kanban immediately updates the customers list).

### Tradeoffs
- **Initial Setup**: Customizing ShadCN theme and configuring automatic Axios refresh interceptors adds upfront configuration overhead.
- **Hydration Sync**: Strict separation between Server Components (RSC) and Client Components (`"use client"`) must be maintained to prevent React hydration errors.
