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
    - [x] 5.3.1: Create sections on the page to display all key SKU attributes, using the `DetailSection` and `AttributeDisplay` components for consistency. For any attribute that differs from the parent Product, add visual indicators (badges/styling) to highlight the override inline.
    - [x] 5.3.2: Add a section for "Configuration" to show attributes like `Region`, `Sales Channel`, and `Billing Cycle`.
    - [x] 5.3.3: Add a dedicated section for "Pricing" that uses the `PriceDetailView.tsx` component to show the full price and tax information (this fulfills AC2).
    - [x] 5.3.4: Add a section to list all associated "Digital Goods" (fulfills AC3). If SKU has custom digital goods, the SKU list completely replaces the Product default list (not combined).
    - [x] 5.3.5: Add a summary section that lists all SKU-level attribute overrides for quick scanning (e.g., "This SKU overrides: Pricing, Digital Goods, Sales Channel").
    - [x] 5.3.6: For each override, provide contextual comparison (e.g., "SKU: Annual | Product Default: Monthly") using consistent visual treatment across all attribute types.
    - [x] 5.3.7: Ensure override indicators and comparison patterns are consistent across Configuration, Pricing, Digital Goods, and any other attribute sections.

- [ ] **5.4: Price Group Enhancements**
    - [x] 5.4.1: Update Price Terminology - Change "Price" to "Price Group" throughout SKU Detail page and update PriceDetailView component title and labels.
    - [x] 5.4.2: Enhanced Price Group Display in SKU Detail - Show Price Group ID prominently, add indicator showing count of other SKUs using this price group, and add link to view all SKUs with this price group.
    - [x] 5.4.3: SKU Table Price Group Features - Add "Group by Price Group" option to ViewOptions component, add optional "Price Group ID" column to table, make Price Group IDs clickable links, and update group headers.
    - [x] 5.4.4: Price Group Detail Page - Create new route `/product/:productId/price-group/:priceGroupId`, create PriceGroupDetail.tsx page component, display price group metadata and "SKUs Using This Price Group" table section.
    - [x] 5.4.5: Price Group Navigation Flow - Update breadcrumbs to support Price Group pages and implement navigation between SKU Detail → Price Group Detail → SKU Table (filtered). 