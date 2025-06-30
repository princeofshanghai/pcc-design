# Task List: Epic 3 - The SKU Detail View

This document breaks down the work for the third epic: building the dedicated SKU Detail page. It follows the "Design-First" methodology and directly addresses **User Story 4** in the PRD.

---

### 5.0: Phase 5 - The SKU Detail Page

**Goal:** Build a dedicated, shareable page for a single SKU, allowing for focused analysis and easy collaboration.

- [ ] **5.1: Create SKU Detail Page & Routing**
    - [x] 5.1.1: In `src/pages`, create a new file named `SkuDetail.tsx`.
    - [x] 5.1.2: In `src/App.tsx`, add a new nested route for the SKU detail page with a path like `/product/:productId/sku/:skuId`.
    - [x] 5.1.3: In `SkuListTable.tsx`, modify the `SKU ID` column to render the ID as a link that navigates to the correct SKU detail page URL. Use the `Link` component from `react-router-dom`.

- [ ] **5.2: Build the SKU Detail View**
    - [x] 5.2.1: In `SkuDetail.tsx`, fetch the correct `product` and `sku` from `mock-data.ts` based on the `productId` and `skuId` from the URL parameters.
    - [x] 5.2.2: Implement dynamic breadcrumbs for the SKU Detail Page (e.g., "Home > [Product Name] > SKU: [SKU ID]"). This will likely require updating the `BreadcrumbContext`.
    - [x] 5.2.3: Use the `PageHeader.tsx` component to display the `SKU ID` as the main title, with the parent `Product Name` as a pre-title or subtitle.
    - [x] 5.2.4: Display the SKU's `Status` using the `StatusTag` component in the page header.

- [ ] **5.3: Display SKU-Level Details**
    - [ ] 5.3.1: Create sections on the page to display all key SKU attributes, using the `DetailSection` and `AttributeDisplay` components for consistency.
    - [ ] 5.3.2: Add a section for "Configuration" to show attributes like `Region`, `Sales Channel`, and `Billing Cycle`.
    - [ ] 5.3.3: Add a dedicated section for "Pricing" that uses the `PriceDetailView.tsx` component to show the full price and tax information (this fulfills AC2).
    - [ ] 5.3.4: Add a section to list all associated "Digital Goods" (fulfills AC3).
    - [ ] 5.3.5: Add a section to display any SKU-level attribute overrides if they exist.
    - [ ] 5.3.6: When an override is displayed, ensure the original product-level default is also shown for comparison. 