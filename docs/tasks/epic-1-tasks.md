# Task List: Epic 1 - The Single Source of Truth

This document breaks down the work for Epic 1 into small, concrete, and ordered tasks. It follows the "Design-First" methodology outlined in our `@playbook-tasks.mdc`.

---

### 1.0: Phase 1 - Project Setup & Foundation

**Goal:** Prepare the project with the necessary tools and a central place for our mock data.

- [ ] **1.1: Install and Configure Ant Design**
    - [x] 1.1.1: As per our technical stack, we will use Ant Design. Run `npm i antd` in the terminal.
    - [x] 1.1.2: Import Ant Design's global stylesheet. In `src/main.tsx`, add the line `import 'antd/dist/reset.css';` at the top. This provides the default styling for all components.

- [ ] **1.2: Create Mock Data and Types**
    - [x] 1.2.1: In the `src/utils` directory, create a new file named `mock-data.ts`. This will be the single source of truth for all data in the prototype.
    - [x] 1.2.2: In the same directory, create `types.ts`. We'll define the "shape" of our data here.
    - [x] 1.2.3: In `types.ts`, define and export a TypeScript `type` called `Product`. Based on the PRD, it should include fields like `id`, `name`, `lob`, `category`, `status`, and an array of `skus`.
    - [x] 1.2.4: In `types.ts`, define and export a `type` called `Sku`. It should include `id`, `region`, `channel`, `billingCycle`, `status`, `pricePoints`, etc.
    - [x] 1.2.5: In `mock-data.ts`, import the types and create an array of at least 5-7 realistic-looking `Product` objects, each with 3-5 `Sku` objects inside. Populate them with varied data (e.g., different statuses, LOBs, regions) to ensure our UI can handle all cases.

- [ ] **1.3: Set up Basic App Structure**
    - [x] 1.3.1: Use the existing `Layout.tsx` which includes a polished, collapsible sidebar with the "PCC" logo and a professional header.
    - [x] 1.3.2: Ensure the `Home.tsx` page in `src/pages` is rendered inside the `Layout`'s `Content` section. This will be our main product catalog view.

---

### 2.0: Phase 2 - Build the Component Library (The "Lego Bricks")

**Goal:** Create all the small, reusable UI components needed to build the pages.

- [ ] **2.1: `StatusTag.tsx` Component**
    - [x] 2.1.1: Create a new component in `src/components` called `StatusTag.tsx`.
    - [x] 2.1.2: It should accept a `status` prop which can be 'Active', 'Legacy', or 'Retired'.
    - [x] 2.1.3: It should use Ant Design's `Tag` component and map the status to a specific `color` prop (e.g., `green` for Active, `default` for Legacy, `red` for Retired).

- [x] **2.2: `ProductListItem.tsx` Component**
    - [x] 2.2.1: Create a new component `ProductListItem.tsx`.
    - [x] 2.2.2: It should accept a single `product` object of type `Product` as a prop.
    - [x] 2.2.3: It should use Ant Design's `Card` or `List.Item` component to display the `Product Name`, `Product ID`, `LOB`, and `Category` in a clean, organized format.
    - [x] 2.2.4: It should use the `StatusTag` component to display the product's status.
    - [x] 2.2.5: Create a `CopyableId.tsx` component that shows an ID and a button to copy it to the clipboard, then integrate it into the `ProductListItem`.

- [x] **2.3: `SkuListItem.tsx` Component**
    - [x] 2.3.1: Create a new component `SkuListItem.tsx`.
    - [x] 2.3.2: It should accept a single `sku` object of type `Sku` as a prop.
    - [x] 2.3.3: It should display key SKU attributes like `Region`, `Sales Channel`, and `Billing Cycle` using Ant Design `Tag` components.
    - [x] 2.3.4: It should also use the `StatusTag` to display the SKU's status.

- [x] **2.4: Search and Filter Components**
    - [x] 2.4.1: Create a `SearchBar.tsx` component that renders Ant Design's `Input.Search` component.
    - [x] 2.4.2: Create a generic `FilterDropdown.tsx` component that takes a label (e.g., "LOB") and a list of options as props and renders Ant Design's `Select` component.

---

### 3.0: Phase 3 - Assemble the Pages (The "Lego Castles")

**Goal:** Compose the pages using the components we just built and our mock data.

- [x] **3.1: Build the `HomePage.tsx` (Product Catalog)**
    - [x] 3.1.1: In `src/pages/Home.tsx`, import the mock product list from `mock-data.ts`.
    - [x] 3.1.2: Use Ant Design's `Space` and `Row`/`Col` components to lay out the `SearchBar` and `FilterDropdown` components above the product list.
    - [x] 3.1.3: Implement state management (`useState`) to store the current search query and filter selections.
    - [x] 3.1.4: Use the state to filter the product list and display only the matching results.
    - [x] 3.1.5: Add pagination to the `List` component to handle large sets of data.