# Requirements Document

## Introduction

This feature introduces **Redux Toolkit** as the centralized client-side state management solution and **Yup** as the form validation solution for the `storefront-web` Next.js application in the existing Nx monorepo frontend.

Today the storefront keeps all of its application state inside a single large page component (`src/app/page.tsx`) using roughly sixteen `useState` hooks, and passes both state and the CSS-module `styles` object down to every view/widget as props (prop drilling). Form validation is done with ad-hoc imperative checks (for example an `alert()` when the shipping name/email/address is empty). This makes the page hard to read, hard to test, and prone to state-synchronization bugs.

The goal is to move global, cross-view state (shopping cart, catalog filters, checkout form, order history/tracking) into a typed Redux Toolkit store organized along the project's existing Feature-Sliced Design (FSD) layout, and to express form validation as declarative Yup schemas wired into the existing `react-hook-form` setup.

The system being modified is an existing one and the user-visible behavior MUST be preserved. This is a frontend-only architectural refactor: no backend, API contract, or routing change is in scope.

### Known constraint: library duplication

The repository already declares `zustand` (with a scaffolded `core/stores/base.store.ts`) for state and `zod` for validation, and `zod` is the validator named in `SPEC.md`. Adopting Redux Toolkit and Yup therefore overlaps with existing libraries. This spec REQUIRES that the duplication be resolved (a single state library and a single validation library remain after the work) so the codebase does not ship two competing state managers and two competing validators. The chosen direction is: Redux Toolkit replaces the Zustand usage, and Yup is the validator for the storefront forms covered here.

## Glossary

- **Redux Toolkit (RTK)**: The official, opinionated Redux package providing `configureStore`, `createSlice`, and typed utilities. Referred to as the **Store_Toolkit**.
- **react-redux**: The React bindings (`Provider`, `useSelector`, `useDispatch`) for the Redux store.
- **Store**: The single Redux store instance holding all global client state for the storefront.
- **Slice**: A Redux Toolkit `createSlice` unit owning one domain's state, reducers, and actions (for example the cart slice).
- **Root State**: The aggregate TypeScript type describing the entire Store shape.
- **Typed Hooks**: Project-specific `useAppDispatch` and `useAppSelector` hooks bound to the Store's types.
- **Store Provider**: A client-side React component that wraps the application subtree in the react-redux `Provider`.
- **Yup**: A schema-based JavaScript validation library used to declare and validate form shapes. Referred to as the **Validator**.
- **@hookform/resolvers**: The adapter package that connects a Yup schema to `react-hook-form`.
- **Validation Schema**: A Yup object schema describing the valid shape and rules for one form.
- **FSD (Feature-Sliced Design)**: The existing frontend layering (`app`, `views`, `widgets`, `features`, `entities`, `shared`) used by `storefront-web`.
- **Storefront**: The Next.js (App Router) application at `frontend/apps/storefront-web`.
- **Cart / Catalog Filter / Checkout / Order state**: The four domains of global state currently held in `page.tsx`.

## Requirements

### Requirement 1: Install and configure Redux Toolkit dependencies

**User Story:** As a frontend developer, I want Redux Toolkit and react-redux installed and wired into the storefront, so that I have a single typed store to hold global state.

#### Acceptance Criteria

1. THE project SHALL add `@reduxjs/toolkit` and `react-redux` as dependencies in the monorepo `package.json`.
2. THE added dependency versions SHALL be compatible with the project's React 19 and Next.js 15 versions.
3. THE project SHALL add `@reduxjs/toolkit` and `react-redux` using explicit pinned version ranges rather than unspecified or wildcard versions.
4. WHEN the storefront is built after the dependencies are added, THE build SHALL complete without dependency-resolution errors.

### Requirement 2: Provide a typed Redux store configured via Redux Toolkit

**User Story:** As a frontend developer, I want a single store created with `configureStore` and exposed with typed accessors, so that state access is type-safe across the app.

#### Acceptance Criteria

1. THE Store SHALL be created using the Store_Toolkit `configureStore` API.
2. THE Store module SHALL export a `RootState` type and an `AppDispatch` type derived from the configured store.
3. THE project SHALL provide Typed Hooks `useAppSelector` and `useAppDispatch` that are bound to `RootState` and `AppDispatch`.
4. THE Store and its supporting modules SHALL be placed under the FSD layout (store composition at the `app` layer and the typed hooks at a shared location) consistent with the existing storefront structure.
5. THE Store SHALL register the cart, catalog-filter, checkout, and order reducers defined in Requirements 4 through 7.

### Requirement 3: Make the store available to the Next.js App Router tree

**User Story:** As a developer, I want the store provided to the React tree in a way that is compatible with the Next.js App Router, so that client components can read and update state.

#### Acceptance Criteria

1. THE project SHALL provide a Store Provider component declared as a client component.
2. THE Store Provider SHALL wrap the application content within the App Router root layout so that all storefront views and widgets are descendants of the react-redux `Provider`.
3. THE Store Provider SHALL provide a single store instance to the React tree for the lifetime of a client session.
4. WHEN a client component calls `useAppSelector` or `useAppDispatch`, THE component SHALL receive the store state and dispatch function without a runtime "could not find react-redux context" error.

### Requirement 4: Manage shopping cart state in a Redux slice

**User Story:** As a shopper, I want my cart to behave exactly as before, so that adding, removing, and clearing items continues to work after the refactor.

#### Acceptance Criteria

1. THE cart Slice SHALL hold the list of cart items using the existing `CartItem` shape from the shared types.
2. THE cart Slice SHALL provide an action that adds a cart item.
3. THE cart Slice SHALL provide an action that removes a cart item by its id.
4. THE cart Slice SHALL provide an action that clears all cart items.
5. THE cart total SHALL be derived from cart state via a selector rather than stored as separate duplicated state.
6. WHEN an item is added or removed, THE cart state SHALL update immutably through the slice reducers.
7. THE cart-count value consumed by the navbar badge SHALL be read from the cart Slice via a selector.

### Requirement 5: Manage catalog filter state in a Redux slice

**User Story:** As a shopper, I want product search and filters to work as before, so that browsing the catalog is unchanged.

#### Acceptance Criteria

1. THE catalog-filter Slice SHALL hold the search query, the selected wool types, the selected colors, and the maximum price.
2. THE catalog-filter Slice SHALL provide actions to set the search query, toggle a wool type, toggle a color, set the maximum price, and clear all filters.
3. THE list of filtered products SHALL be computed from the catalog-filter state via a selector or derived computation, preserving the current filtering logic (search, wool type, color, price).
4. WHEN a filter value changes, THE derived filtered-products result SHALL reflect the change.

### Requirement 6: Manage checkout state in a Redux slice with Yup validation

**User Story:** As a shopper, I want the checkout form validated clearly before submission, so that I cannot submit incomplete shipping information.

#### Acceptance Criteria

1. THE checkout Slice SHALL hold the shipping form fields (name, email, address, city), the payment card fields, and a checkout status whose value is one of `idle` or `submitting`.
2. THE project SHALL define a Yup Validation Schema for the shipping form in which name, email, and address are required and non-empty after trimming, email is a validly formatted email address, and the fields enforce maximum lengths (name at most 100 characters, address at most 200 characters, email at most 254 characters).
3. WHEN the shopper submits the checkout form, THE checkout form SHALL validate all shipping fields against the Yup Validation Schema before any submission is processed.
4. IF the shipping form fails Yup validation, THEN THE checkout submission SHALL be prevented, the values already entered SHALL be preserved, and a per-field validation message SHALL be surfaced for each failing field.
5. WHEN the shipping form passes Yup validation and submission is processed, THE checkout Slice SHALL create an order, clear the cart, and set the active view to order tracking.
6. THE checkout form validation SHALL be wired to the existing `react-hook-form` setup using the Yup resolver adapter rather than imperative inline checks.
7. WHILE the checkout status is `submitting`, THE checkout form SHALL prevent a duplicate concurrent submission.

### Requirement 7: Manage order history and tracking state in a Redux slice

**User Story:** As a shopper, I want my placed order and its tracking status to persist across views, so that the tracking timeline continues to work as before.

#### Acceptance Criteria

1. THE order Slice SHALL hold the order history list and the currently active order.
2. THE order Slice SHALL provide an action that records a newly placed order and sets it as the active order.
3. THE order Slice SHALL provide an action that advances the active order's status through the existing sequence (received, knitting, completed, shipping, success).
4. WHEN the active order status is advanced past the final state, THE status SHALL remain at the final state.

### Requirement 8: Install Yup and define validation schemas

**User Story:** As a developer, I want Yup and its react-hook-form resolver installed with reusable schemas, so that form validation is declarative and consistent.

#### Acceptance Criteria

1. THE project SHALL add `yup` and `@hookform/resolvers` as dependencies in the monorepo `package.json` using explicit pinned version ranges.
2. THE added versions SHALL be compatible with the installed `react-hook-form` version.
3. THE project SHALL define Yup Validation Schemas for the checkout shipping form and for the newsletter email form.
4. THE newsletter form SHALL validate that the email field is non-empty and is a validly formatted email address before submission is accepted.
5. WHEN a form field fails its Yup Validation Schema, THE corresponding field-level validation message SHALL be available to render in the UI.

### Requirement 9: Migrate the page component off local state and prop drilling

**User Story:** As a developer, I want the storefront page to read and update global state through the store instead of local `useState` and prop drilling, so that the code is maintainable and the views are decoupled.

#### Acceptance Criteria

1. THE cart, catalog-filter, checkout, and order state currently held as `useState` in `page.tsx` SHALL be sourced from the Store after the migration, and `page.tsx` SHALL NOT declare `useState` for those four domains.
2. THE views and widgets that currently receive cart, filter, checkout, or order state and setters as props SHALL obtain that state and those dispatches from the Store via Typed Hooks, and SHALL no longer receive that state or those setters as props.
3. WHEN the same sequence of user interactions (navigation, cart add/remove, catalog filtering, checkout, order tracking) is performed before and after the migration, THE resulting user-visible behavior SHALL be equivalent.
4. WHEN the migration is complete, THE storefront SHALL NOT depend on `zustand` for global state.
5. WHEN the migration is complete, THE scaffolded Zustand store module SHALL be removed from the storefront.
6. THE refactor SHALL NOT add, remove, or rename any route, and THE set of rendered page URLs SHALL be identical to the pre-migration set.

### Requirement 10: Preserve build, lint, and type integrity

**User Story:** As a developer, I want the refactor to keep the project building and linting cleanly, so that the change is safe to merge.

#### Acceptance Criteria

1. WHEN `nx build storefront-web` is run after the change, THE build SHALL succeed.
2. WHEN `nx lint storefront-web` is run after the change, THE lint SHALL pass without new errors introduced by this work.
3. THE TypeScript types for store state, selectors, and dispatch SHALL compile without type errors.
4. THE Store slices SHALL be unit-testable as pure reducers, and at least one reducer test SHALL be provided per slice for the cart and checkout domains.
