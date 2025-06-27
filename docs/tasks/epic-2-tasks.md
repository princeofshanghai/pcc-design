# Task List: Epic 2 - The Product Detail View

This document breaks down the work for the second major epic: building the Product Detail page. It follows the "Design-First" methodology and picks up where `epic-1-tasks.md` left off.

---

### 4.0: Phase 4 - The Product Detail Page

**Goal:** Build the dedicated page that displays a single product's details and its associated SKUs, fulfilling User Stories 2 and 3 from the PRD.

- [ ] **4.1: Enhance Data Models (Source of Truth)**
    - [ ] 4.1.1: In `src/utils/types.ts`, update the `Product` type to include `productType: string;` and `description: string;`.
    - [ ] 4.1.2: In `src/utils/types.ts`, create a new `PricePoint` type with fields for `currencyCode: string;` and `amount: number;`.
    - [ ] 4.1.3: In `src/utils/types.ts`, create a new `Price` type with fields for `startDate: string;`, `endDate: string;`, and `pricePoints: PricePoint[];`.
    - [ ] 4.1.4: In `src/utils/types.ts`, update the `Sku` type to include `taxClass: 'Tax-Inclusive' | 'Tax-Exclusive';` and `price: Price;`.
    - [ ] 4.1.5: In `src/utils/mock-data.ts`, update the mock `Product` objects to include realistic data for the new `productType` and `description` fields.
    - [ ] 4.1.6: In `src/utils/mock-data.ts`, update the mock `Sku` objects to include realistic data for the new `taxClass` and `price` fields, including nested `PricePoint` data.

- [ ] **4.2: Create Product Detail Page & Routing**
    - [ ] 4.2.1: In `src/pages`, create a new file named `ProductDetail.tsx`.
    - [ ] 4.2.2: In `src/App.tsx`, add a new route for the product detail page. The path should be dynamic, like `/product/:productId`, and it should render the `ProductDetail.tsx` component.
    - [ ] 4.2.3: In `ProductListItem.tsx`, ensure the link navigates to the correct dynamic URL for the product (e.g., `/product/5124922`).

- [ ] **4.3: Build the Product Detail Header**
    - [ ] 4.3.1: In `ProductDetail.tsx`, fetch the correct product from the `mock-data.ts` file based on the `productId` from the URL.
    - [ ] 4.3.2: Use the existing `PageHeader.tsx` component to display the product's `name` and its `description` as the subtitle.
    - [ ] 4.3.3: Below the header, display other key product attributes like `Product ID`, `LOB`, `Category`, and `Product Type` using Ant Design `Descriptions` or `Tag` components for a clean layout.

- [ ] **4.4: Build the SKU List**
    - [ ] 4.4.1: In `ProductDetail.tsx`, display a list of all SKUs associated with the current product.
    - [ ] 4.4.2: Use the existing `SkuListItem.tsx` component to render each SKU in the list.
    - [ ] 4.4.3: Add a header for the SKU list section that includes the number of SKUs, e.g., "SKU Configurations (12)".

- [ ] **4.5: Implement SKU Filtering**
    - [ ] 4.5.1: Above the SKU list, add `FilterDropdown.tsx` components to allow filtering by `Region`, `Sales Channel`, and `Billing Cycle` as per the PRD.
    - [ ] 4.5.2: Implement state management (`useState`) to handle the filter selections and update the displayed list of SKUs in real-time.

- [ ] **4.6: Implement SKU Price View**
    - [ ] 4.6.1: Modify `SkuListItem.tsx` to be expandable (e.g., using Ant Design's `Collapse` or by adding an "Expand" button).
    - [ ] 4.6.2: When expanded, the component should display the SKU's price details.
    - [ ] 4.6.3: Create a new component, `PriceDetailView.tsx`, to render the `Price` object's details: `Start Date`, `End Date`, and the list of `Price Points` (Currency and Amount) in a clean table or list format.
    - [ ] 4.6.4: The view must also clearly display the `Tax Class` of the SKU. 