# PRD: Epic 1 - The Single Source of Truth (Read-Only)

> **Status:** Draft
> **Author:** [Your Name/Team]
> **Last Updated:** [Current Date]
> **Related Documents:** [@vision-and-goals](/.cursor/context-library/vision-and-goals.mdc), [@mvp-scope](/.cursor/context-library/mvp-scope.mdc), [@playbook-prd](/.cursor/context-library/playbook-prd.mdc)

---

### 1. Background & Problem Statement
LinkedIn's product catalog, with its 500+ products and complex pricing, is currently managed through a fragmented system of spreadsheets, internal wikis, and tribal knowledge. This makes it nearly impossible for business stakeholders (Product Managers, Pricing Teams, Business Partners) to answer a fundamental question: "What do we sell, where, and for how much?"

Answering this question today requires manual data digging and direct requests to engineering, causing significant delays and hindering our ability to make fast, data-driven decisions.

This document outlines the requirements for the first major epic of the Product Configuration Center (PCC): creating a centralized, **read-only** source of truth for the product catalog. This is the foundational step in our broader vision.

### 2. Goals & Success Metrics
The primary goal of this epic is to **empower business users to independently find and understand product and pricing information.**

**Success Metrics:**
- **Adoption:** At least 80% of target users (PMs, Pricing Managers) can look up product information in PCC without needing to ask an engineer within the first month of launch.
- **Efficiency:** A measurable reduction in ad-hoc data requests to the engineering team.
- **User Satisfaction (Qualitative):** Stakeholders report that the system is intuitive, fast, and a trustworthy source of information.

### 3. User Personas
- **Priya, the Product Manager:** Needs to quickly understand the current pricing, market availability, and feature set of her products to inform her roadmap.
- **Anand, the Pricing Manager:** Needs to see a detailed breakdown of all SKUs and price points for a given product to analyze revenue.
- **Sam, the Business Partner:** Needs to filter the catalog to see all products available for a specific market segment (e.g., all products sold via Field Sales in EMEA).

### 4. User Stories & Acceptance Criteria

**User Story 1: Discover Products in the Catalog**
*As Priya the PM, I want to search and filter the entire catalog, so that I can quickly find the products relevant to my work.*

- **AC1:** The UI must provide a persistent search bar to find products by name or ID.
- **AC2:** The UI must provide filter controls for **Line of Business (LOB)**, **Category**, **Product Status**, and **Region**.
- **AC3:** Applying search or filters updates the main product list in real-time.
- **AC4:** The product list must clearly display the **Product Name**, **Product ID**, **LOB**, and **Category** for each item.
- **AC5:** The list should be sortable by Product Name and LOB.

**User Story 2: View a Specific Product's Configurations**
*As Anand the Pricing Manager, I want to select a product and see all of its available configurations (SKUs), so that I can understand all the different ways we sell it.*

- **AC1:** Clicking on a product from the main list navigates to a "Product Detail Page".
- **AC2:** This page must display a clear header showing the parent Product's key details (Name, ID, LOB, Category, Status).
- **AC3:** The page must display a list of all **SKUs** associated with that Product.
- **AC4:** The SKU list must be filterable by **Region**, **Sales Channel**, and **Billing Cycle**.
- **AC5:** Each SKU in the list should display its key defining attributes (e.g., `Region: NAMER`, `Channel: Desktop`) and its business status (Active, Legacy, Retired).

**User Story 3: Inspect a Single SKU's Price**
*As Sam the Business Partner, I want to select a single, specific SKU and see its detailed price points in all currencies, so that I can confirm the exact price for a customer.*

- **AC1:** Selecting or expanding a SKU from the list reveals its detailed price view.
- **AC2:** The view must show the active `Price` for that SKU, including its `Start Date` and `End Date`.
- **AC3:** The view must list all `Price Points` (the actual amounts) for the active `Price`, including **Currency Code** and **Amount**.
- **AC4:** The UI must clearly indicate whether a price is **tax-inclusive** or **tax-exclusive** based on its sales channel (e.g., Mobile vs. Desktop).

### 5. Scope and Data Requirements

#### In Scope:
- A read-only interface for browsing and searching the product catalog.
- A two-level view: a main catalog list of **Products**, and a detail page for each Product that lists its **SKUs**.
- Displaying all key attributes for Products and SKUs as defined in the data table below.
- Filtering and sorting by the most important attributes.

#### Out of Scope (for Epic 1):
- **Any and all editing functionality.** This is strictly a "read-only" epic.
- Creating new Products or SKUs.
- Designing or launching pricing experiments (this is a future epic).
- Backend integrations, authentication, or publishing workflows. All data is assumed to be available via a pre-defined source.
- Analytics or experiment result dashboards.

#### Data Requirements:
| Attribute | Level | Description / Example |
|---|---|---|
| Product Name | Product | The display name of the product (e.g., "Sales Navigator Core") |
| Product ID | Product | Unique identifier for the product (e.g., 5095295) |
| Line of Business (LOB)| Product | Business line grouping (LTS, LMS, LSS, Premium) |
| Category | Product | Logical grouping within LOB (e.g., "Career Pages") |
| Product Status | Product | Active, Legacy, Retired |
| Product Type | Product | Subscription, Consumable, etc. |
| Product Description | Product | Short summary of the product (if available) |
| SKU ID | SKU | Unique identifier for the SKU/configuration |
| Sales Channel | SKU | Desktop, Field, Mobile |
| Billing Cycle | SKU | Monthly, Quarterly, Annual |
| Region | SKU | NAMER, EMEA, APAC, LATAM, OTHER |
| Digital Goods | SKU | Features, entitlements, consumables (e.g., InMail credits) |
| Price / Price Points | SKU | Price in each currency (e.g., $99.00 USD, €89.00 EUR) |
| Tax Class | SKU | A label indicating if the price is tax-inclusive or exclusive |
| SKU Status | SKU | Active, Legacy, Retired |

### 6. Open Questions & Design Considerations
- **Q1:** How can we best display a potentially long list of SKUs on the Product Detail Page? (e.g., Table, cards, expandable list?)
- **Q2:** What is the most intuitive UI for the filter controls? (e.g., Dropdowns, multi-select checkboxes?)
- **Q3:** What should the UI display if a product has no active SKUs?
- **Q4:** How do we visually distinguish between `Active`, `Legacy`, and `Retired` entities to avoid user confusion? This is critical for data trust.
- **Q5:** How should we display the list of "Digital Goods" for a SKU? Is a simple list sufficient for the MVP? 