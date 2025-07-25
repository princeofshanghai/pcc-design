# Task List: Epic 2 - The Product Detail View

This document breaks down the work for the second major epic: building the Product Detail page. It follows the "Design-First" methodology and picks up where `epic-1-tasks.md` left off.

---

### 4.0: Phase 4 - The Product Detail Page

**Goal:** Build the dedicated page that displays a single product's details and its associated SKUs, fulfilling User Stories 2 and 3 from the PRD.

- [x] **4.1: Enhance Data Models (Source of Truth)**
    - [x] 4.1.1: In `src/utils/types.ts`, ensure the `Product` type includes `billingModel: BillingModel;` and an optional `description: string;`.
    - [x] 4.1.2: In `src/utils/types.ts`, ensure a `PricePoint` type exists with fields for `currencyCode: string;` and `amount: number;`.
    - [x] 4.1.3: In `src/utils/types.ts`, ensure a `Price` type exists with optional `startDate: string;` and `endDate: string;` fields, and a required `pricePoints: PricePoint[];` array.
    - [x] 4.1.4: In `src/utils/types.ts`, ensure the `Sku` type includes `taxClass` and an optional `lix` field.
    - [x] 4.1.5: In `src/utils/mock-data.ts`, update the mock `Product` and `Sku` objects to include realistic data for all new fields.

- [x] **4.2: Create Product Detail Page & Routing**
    - [x] 4.2.1: In `src/pages`, create a new file named `ProductDetail.tsx`.
    - [x] 4.2.2: In `src/App.tsx`, add a new route for the product detail page with a dynamic path `/product/:productId`.
    - [x] 4.2.3: In `ProductListItem.tsx` (or the component used in the catalog), ensure clicking an item navigates to the correct dynamic URL.

- [x] **4.3: Build the Product Detail View**
    - [x] 4.3.1: In `ProductDetail.tsx`, fetch the correct product from the `mock-data.ts` file based on the `productId` from the URL.
    - [x] 4.3.2: Implement dynamic breadcrumbs for the Product Detail Page.
    - [x] 4.3.3: Use the existing `PageHeader.tsx` component to display the product's `name` and its `LOB`, `Category`, and `Status` using tags.
    - [x] 4.3.4: Implement a tabbed interface to organize the product's details (`Details`, `Other`, etc.).

- [x] **4.4: Build the SKU List Table**
    - [x] 4.4.1: In the "Details" tab, add a `SkuListTable.tsx` component to display all SKUs for the product.
    - [x] 4.4.2: The table must include columns for `SKU ID`, `Region`, `Sales Channel`, `Billing Cycle`, `Validity`, `Amount`, `LIX Key`, and `Status`.
    - [x] 4.4.3: Add a `CountTag` next to the section title to show the number of SKUs.

- [x] **4.5: Implement SKU Filtering**
    - [x] 4.5.1: Above the `SkuListTable`, add `FilterDropdown.tsx` components to allow filtering by `Region`, `Sales Channel`, and `Status`.
    - [x] 4.5.2: Implement state management (`useState`) to handle filter selections and update the table in real-time.
    - [x] 4.5.3: Ensure the SKU count in the section header updates as filters are applied.

- [x] **4.6: Implement Expandable Price & Tax View**
    - [x] 4.6.1: Make the rows in `SkuListTable.tsx` expandable.
    - [x] 4.6.2: Create a `PriceDetailView.tsx` component to render inside the expanded row.
    - [x] 4.6.3: Add a "Validity" column to the `SkuListTable` with user-friendly date formatting.
    - [x] 4.6.4: The `PriceDetailView` must display a list of all `Price Points` (currency and amount).
    - [x] 4.6.5: Add a section to the expanded view that only appears if a SKU has overrides and lists them clearly.
    
- [x] **4.7: Flesh out Detail Sections**
    - [x] 4.7.1: In the "Details" tab, add a section for "Digital Goods" and display them in a table.
    - [x] 4.7.2: In the "Other" tab, populate the "Configuration" section with relevant product attributes (e.g., `Tax Class`, `Seat Type`, `Grace Periods`).
    - [x] 4.7.3: In the "Other" tab, populate the "Tags" section, grouping tags by their type.
    - [x] 4.7.4: In the "Other" tab, populate the "Links" section with all relevant URLs.
    - [x] 4.7.5: In the "Other" tab, populate the "Visibility" section with the various boolean flags on the product. 