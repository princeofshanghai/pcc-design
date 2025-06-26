# Task List: Epic 1 - The Single Source of Truth

This document breaks down the work for Epic 1 into small, concrete, and ordered tasks. It follows the "Design-First" methodology outlined in our `@task-generation-playbook.mdc`.

---

### 1.0: Phase 1 - Project Setup & Foundation

**Goal:** Prepare the project with the necessary tools and a central place for our mock data.

- [ ] **1.1: Install and Configure Ant Design**
    - [ ] 1.1.1: As per our technical stack, we will use Ant Design. Run `npm i antd` in the terminal.
    - [ ] 1.1.2: Import Ant Design's global stylesheet. In `src/main.tsx`, add the line `import 'antd/dist/reset.css';` at the top. This provides the default styling for all components.

- [ ] **1.2: Create Mock Data and Types**
    - [ ] 1.2.1: In the `src/utils` directory, create a new file named `mock-data.ts`. This will be the single source of truth for all data in the prototype.
    - [ ] 1.2.2: In the same directory, create `types.ts`. We'll define the "shape" of our data here.
    - [ ] 1.2.3: In `types.ts`, define and export a TypeScript `type` called `Product`. Based on the PRD, it should include fields like `id`, `name`, `lob`, `category`, `status`, and an array of `skus`.
    - [ ] 1.2.4: In `types.ts`, define and export a `type` called `Sku`. It should include `id`, `region`, `channel`, `billingCycle`, `status`, `pricePoints`, etc.
    - [ ] 1.2.5: In `mock-data.ts`, import the types and create an array of at least 5-7 realistic-looking `Product` objects, each with 3-5 `Sku` objects inside. Populate them with varied data (e.g., different statuses, LOBs, regions) to ensure our UI can handle all cases.

- [ ] **1.3: Set up Basic App Structure**
    - [ ] 1.3.1: The `Layout.tsx` component in `src/components` will serve as our main app shell. Let's use Ant Design's `Layout` component to add a simple `Header` with the project title "Product Configuration Center".
    - [ ] 1.3.2: Ensure the `Home.tsx` page in `src/pages` is rendered inside the `Layout`'s `Content` section. This will be our main product catalog view.

---

### 2.0: Phase 2 - Build the Component Library (The "Lego Bricks")

**Goal:** Create all the small, reusable UI components needed to build the pages.

- [ ] **2.1: `StatusTag.tsx` Component**
    - [ ] 2.1.1: Create a new component in `src/components` called `StatusTag.tsx`.
    - [ ] 2.1.2: It should accept a `status` prop which can be 'Active', 'Legacy', or 'Retired'.
    - [ ] 2.1.3: It should use Ant Design's `Tag` component and map the status to a specific `color` prop (e.g., `green` for Active, `default` for Legacy, `red` for Retired).

- [ ] **2.2: `ProductListItem.tsx` Component**
    - [ ] 2.2.1: Create a new component `ProductListItem.tsx`.
    - [ ] 2.2.2: It should accept a single `product` object of type `Product` as a prop.
    - [ ] 2.2.3: It should use Ant Design's `Card` or `List.Item` component to display the `Product Name`, `Product ID`, `LOB`, and `Category` in a clean, organized format.
    - [ ] 2.2.4: It should use the `StatusTag` component to display the product's status.

- [ ] **2.3: `SkuListItem.tsx` Component**
    - [ ] 2.3.1: Create a new component `SkuListItem.tsx`.
    - [ ] 2.3.2: It should accept a single `sku` object of type `Sku` as a prop.
    - [ ] 2.3.3: It should display key SKU attributes like `Region`, `Sales Channel`, and `Billing Cycle` using Ant Design `Tag` components.
    - [ ] 2.3.4: It should also use the `StatusTag` to display the SKU's status.

- [ ] **2.4: Search and Filter Components**
    - [ ] 2.4.1: Create a `SearchBar.tsx` component that renders Ant Design's `Input.Search` component.
    - [ ] 2.4.2: Create a generic `FilterDropdown.tsx` component that takes a label (e.g., "LOB") and a list of options as props and renders Ant Design's `Select` component.

---

### 3.0: Phase 3 - Assemble the Pages (The "Lego Castles")

**Goal:** Compose the pages using the components we just built and our mock data.

- [ ] **3.1: Build the `HomePage.tsx` (Product Catalog)**
    - [ ] 3.1.1: In `src/pages/Home.tsx`, import the mock product list from `mock-data.ts`.
    - [ ] 3.1.2: Use Ant Design's `Space` and `Row`/`Col` components to lay out the `SearchBar` and `FilterDropdown` components at the top of the page.
    - [ ] 3.1.3: Use Ant Design's `List` component to map over the mock product array and render a `ProductListItem` for each product.

- [ ] **3.2: Build the `ProductDetailPage.tsx`**
    - [ ] 3.2.1: Create a new page file `src/pages/ProductDetailPage.tsx`.
    - [ ] 3.2.2: This page should be designed to receive a single product's data.
    - [ ] 3.2.3: Use Ant Design components like `Typography.Title` and `Descriptions` to display the parent product's details prominently at the top.
    - [ ] 3.2.4: Below the header, add a title for "SKUs" and filter controls for the SKU list (Region, Channel).
    - [ ] 3.2.5: Use an Ant Design `List` or `Card` grid to map over the `skus` array from the product data and render a `SkuListItem` for each SKU.

---

### 4.0: Phase 4 - Add Interactivity (Making it "Clickable")

**Goal:** Make the static pages feel like a real, interactive application.

- [ ] **4.1: Implement Search & Filter on Home Page**
    - [ ] 4.1.1: In `Home.tsx`, use React's `useState` hook to store the user's search query and filter selections.
    - [ ] 4.1.2: Write the logic to filter the list of products based on the current state of the search query and filters before rendering the list. The list should re-render automatically when the user types or selects a filter.

- [ ] **4.2: Implement Navigation**
    - [ ] 4.2.1: Install React Router by running `npm i react-router-dom`.
    - [ ] 4.2.2: Set up the router in `App.tsx` to define two routes: `/` for the `HomePage` and `/product/:id` for the `ProductDetailPage`.
    - [ ] 4.2.3: In `ProductListItem.tsx`, wrap the component in a `Link` from React Router so that clicking it navigates the user to `/product/<product-id>`.
    - [ ] 4.2.4: In `ProductDetailPage.tsx`, use the `useParams` hook from React Router to get the product ID from the URL and find the correct product to display from your mock data.

- [ ] **4.3: Implement SKU Price View**
    - [ ] 4.3.1: In `SkuListItem.tsx`, add an Ant Design `Button` with the text "View Price".
    - [ ] 4.3.2: When the button is clicked, use state (`useState`) to toggle the visibility of a details section. An Ant Design `Modal` or `Collapse` component could work well here.
    - [ ] 4.3.3: This section should use an Ant Design `Descriptions` component to display the SKU's price points, including currency and amount, and the tax class information as specified in the PRD. 