# Task List: Epic 4 - Product Configuration Management

This document breaks down the work for Epic 4 into small, concrete, and ordered tasks. It follows the "Design-First" methodology outlined in our `@playbook-tasks.mdc` and directly addresses the user stories in `@PRD-Epic-4-Product-Configuration-Management.md`.

---

### 1.0: Phase 1 - Project Setup & Foundation

**Goal:** Extend the existing data models and foundation to support configuration creation workflows.

- [ ] **1.1: Extend Mock Data and Types**
    - [x] 1.1.1: In `src/utils/types.ts`, define and export a `ConfigurationRequest` type with fields for `id`, `targetProductId`, `salesChannel`, `billingCycle`, `priceAmount`, `lixKey?`, `lixTreatment?`, `status`, `createdBy`, `createdDate`, `generatedSkuId?`, `generatedPriceGroupId?`.
    - [x] 1.1.2: In `src/utils/types.ts`, define a `ChangeRequestStatus` type with values `'Draft' | 'Pending Review' | 'In Staging' | 'Live' | 'Failed'`.
    - [x] 1.1.3: In `src/utils/types.ts`, extend the `Product` type to include an optional `configurationRequests?: ConfigurationRequest[]` array.
    - [x] 1.1.4: In `src/utils/mock-data.ts`, add a `mockConfigurationRequests` array with 3-5 example configuration requests in various states (Draft, Pending Review, Live) for different products.
    - [x] 1.1.5: In `src/utils/mock-data.ts`, add configuration request arrays to select products in the `mockProducts` array to simulate request history.

- [x] **1.2: Create Configuration Utilities**
    - [x] 1.2.1: In `src/utils`, create a new file `configurationUtils.ts` with functions for generating SKU IDs, price group IDs, and validating configuration uniqueness.
    - [x] 1.2.2: In `configurationUtils.ts`, create a function `generatePreviewSku(product: Product, configRequest: ConfigurationRequest): Sku` that shows what SKU would be created.
    - [x] 1.2.3: In `configurationUtils.ts`, create a function `checkConfigurationConflicts(product: Product, configRequest: ConfigurationRequest): string[]` that returns any conflict warnings.

---

### 2.0: Phase 2 - Build the Component Library (The "Lego Bricks")

**Goal:** Create all the small, reusable UI components needed for configuration management.

- [ ] **2.1: Configuration Form Components**
    - [x] 2.1.1: Create a new component `ConfigurationForm.tsx` in `src/components/configuration/` that accepts a `product` prop and renders the configuration creation form.
    - [x] 2.1.2: The form should include `SalesChannel` dropdown (Desktop, Mobile, Field), `BillingCycle` dropdown (Monthly, Quarterly, Annual), and USD pricing input field.
    - [x] 2.1.3: Add optional LIX fields section with `LIX Key` and `LIX Treatment` text inputs, clearly labeled as "Experimental Configuration (Optional)".
    - [x] 2.1.4: Include form validation with real-time feedback for required fields and price format validation.

- [ ] **2.2: Preview Components**
    - [x] 2.2.1: Create a `ConfigurationPreview.tsx` component that shows a preview of what will be created when the configuration is submitted.
    - [x] 2.2.2: The preview should display the generated SKU ID, price group information, and all inherited product attributes.
    - [x] 2.2.3: Add a `PriceGroupImpact.tsx` component that shows whether a new price group will be created or an existing one will be used.
    - [x] 2.2.4: Create a `ConflictWarning.tsx` component that displays any configuration conflicts or warnings in a clear, actionable format.

- [ ] **2.3: Status and Request Tracking Components**
    - [x] 2.3.1: Create a `ChangeRequestStatus.tsx` component that displays the current status of a configuration request with appropriate colors and icons.
    - [x] 2.3.2: Create a `ConfigurationTimeline.tsx` component that shows the progression stages (Draft → Pending Review → In Staging → Live).
    - [x] 2.3.3: Create a `RequestHistoryItem.tsx` component that displays a single configuration request in a list format with key details and status.
    - [x] 2.3.4: Create an `ExperimentalBadge.tsx` component that clearly marks experimental configurations with LIX key information.

- [x] **2.4: Enhanced SKU Display Components**
    - [x] 2.4.1: Update the existing `SkuListTable.tsx` to support displaying experimental configurations with the new `ExperimentalBadge` component.
    - [x] 2.4.2: Add a `ConfigurationOrigin.tsx` component that shows how a SKU was created (manual vs configuration request) for audit trail purposes.
    - [x] 2.4.3: Create a `PriceGroupLink.tsx` component that shows price group relationships with clickable links to view all SKUs sharing the same price group.

---

### 3.0: Phase 3 - Assemble the Pages (The "Lego Castles")

**Goal:** Integrate the configuration components into the existing page structure.

- [ ] **3.1: Enhance Product Detail Page**
    - [x] 3.1.1: In `src/pages/ProductDetail.tsx`, add an "Add Configuration" button to the Pricing tab that opens the configuration creation workflow.
    - [x] 3.1.2: Implement the configuration creation workflow as a multi-step modal or drawer that includes the `ConfigurationForm` and `ConfigurationPreview` components.
    - [x] 3.1.3: Add a "Configuration Requests" section to the Pricing tab that displays recent configuration requests using the `RequestHistoryItem` component.
    - [x] 3.1.4: Update the SKU table to show experimental configurations with the `ExperimentalBadge` and `ConfigurationOrigin` components.

- [ ] **3.2: Configuration Request Detail View**
    - [x] 3.2.1: Create a new page `ConfigurationRequestDetail.tsx` in `src/pages/` that displays detailed information about a single configuration request.
    - [x] 3.2.2: Add routing for the configuration request detail page with path `/product/:productId/configuration/:requestId`.
    - [x] 3.2.3: The page should show the request timeline, current status, configuration details, and preview of what will be created.
    - [x] 3.2.4: Include breadcrumbs and navigation back to the parent product with the `ConfigurationTimeline` component prominently displayed.

- [ ] **3.3: Configuration Management Interface**
    - [x] 3.3.1: Add a "Pending Configurations" section to the Product Detail page that shows all configuration requests in progress.
    - [x] 3.3.2: Create a simple dashboard view that lists all configuration requests across products (could be a new tab or section).
    - [ ] 3.3.3: Implement filtering and sorting for configuration requests by status, date, and product.

---

### 4.0: Phase 4 - Add Interactivity (Making it "Clickable")

**Goal:** Make the configuration workflow fully functional with proper state management and user interactions.

- [ ] **4.1: Configuration Creation Workflow**
    - [ ] 4.1.1: Implement form state management for the `ConfigurationForm` component with proper validation and error handling.
    - [ ] 4.1.2: Add real-time preview generation that updates as users change form fields, showing the generated SKU and price group information.
    - [ ] 4.1.3: Implement configuration conflict detection that warns users if they're creating a duplicate configuration.
    - [ ] 4.1.4: Add form submission logic that creates a new configuration request and adds it to the mock data.

- [ ] **4.2: Preview and Validation Logic**
    - [ ] 4.2.1: Connect the `ConfigurationPreview` component to show real-time updates based on form inputs.
    - [ ] 4.2.2: Implement the price group impact logic that determines whether to create a new price group or use an existing one.
    - [ ] 4.2.3: Add pricing validation rules (e.g., minimum price, pricing tier consistency) with clear error messages.
    - [ ] 4.2.4: Implement the conflict warning system that checks for existing SKUs with the same configuration.

- [ ] **4.3: Status Tracking and Change Request Workflow**
    - [ ] 4.3.1: Implement a mock change request workflow that simulates the progression from Draft → Pending Review → In Staging → Live.
    - [ ] 4.3.2: Add status update functionality that allows advancing configuration requests through different stages.
    - [ ] 4.3.3: Implement the timeline component to show progress and estimated completion times for each stage.
    - [ ] 4.3.4: Add the ability to view and share links to configuration requests for cross-team collaboration.

- [ ] **4.4: Enhanced SKU Table Integration**
    - [ ] 4.4.1: Update the SKU filtering system to include experimental configurations and configuration origin filtering.
    - [ ] 4.4.2: Add visual indicators to distinguish manually created SKUs from configuration-generated SKUs.
    - [ ] 4.4.3: Implement the price group relationship display that shows how many SKUs share the same price group.
    - [ ] 4.4.4: Add click-through navigation from SKU table to configuration request details where applicable.

- [ ] **4.5: Experimental Configuration Support**
    - [ ] 4.5.1: Implement LIX integration display that shows experimental configurations with proper badges and explanations.
    - [ ] 4.5.2: Add tooltips and help text that explain how experimental configurations work with TREX.
    - [ ] 4.5.3: Implement filtering options to show/hide experimental configurations in the SKU table.
    - [ ] 4.5.4: Add visual distinction between standard and experimental configurations throughout the interface.

---

## Notes for Implementation

- **Component Directory Structure:** Create a new `src/components/configuration/` directory to organize all configuration-related components.
- **Mock Data Strategy:** Use the existing `mock-data.ts` pattern to simulate the configuration request lifecycle without requiring backend integration.
- **State Management:** Leverage React's `useState` and `useContext` patterns for managing configuration form state and request tracking.
- **Error Handling:** Implement comprehensive form validation and user feedback for all configuration creation steps.
- **Accessibility:** Ensure all form components and interactive elements follow accessibility best practices with proper ARIA labels and keyboard navigation. 