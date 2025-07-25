# PRD: Epic 1 - The Single Source of Truth (Read-Only)

> **Status:** Draft
> **Author:** [Your Name/Team]
> **Last Updated:** [Current Date]
> **Related Documents:** [@scope-vision](/.cursor/context-library/scope-vision.mdc), [@scope-mvp](/.cursor/context-library/scope-mvp.mdc), [@playbook-prd](/.cursor/rules/playbook-prd.mdc)

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
- **AC2:** This page must display a clear header showing the parent Product's key details (Name, LOB, Category, Status).
- **AC3:** The page must present information in a clean, tabbed interface, separating high-level details from other areas like Configuration, Links, etc.
- **AC4:** Within the main tab, the page must display a table of all **SKUs** associated with that Product.
- **AC5:** The SKU table must be filterable by **Region**, **Sales Channel**, and **Status**.
- **AC6:** The SKU table must have columns for key attributes including **SKU ID**, **Region**, **Sales Channel**, **Billing Cycle**, **Validity**, **Price**, and **Status**.

**User Story 3: Inspect a Single SKU's Price and Configuration**
*As Sam the Business Partner, I want to select a single, specific SKU and see its detailed price points and configuration, so that I can confirm the exact price and setup for a customer.*

- **AC1:** The SKU table rows must be expandable to reveal a detailed view for that specific SKU.
- **AC2:** The expanded view must show the SKU's active `Price` version, including its `Valid From` and `Valid To` dates.
- **AC3:** Within that `Price` version, the view must list all `Price Points` (the actual amounts), including **Currency Code** and **Amount**.
- **AC4:** The expanded view must clearly display the `Tax Class` of the SKU.
- **AC5:** If a SKU is part of a **LIX experiment**, the table must clearly indicate the LIX `key` and show the `treatment` on hover.
- **AC6:** If a SKU has any attribute values that override the Product-level defaults (e.g., `Grace Period`, `Seat Min/Max`), these must be clearly listed in a dedicated "Overrides" section within the expanded view.

**User Story 4: Deep Dive into a Single SKU**
*As a product stakeholder, I want to navigate from the SKU list to a dedicated, linkable detail page for a single SKU, so that I can perform a focused analysis or share a direct link to that specific configuration with a colleague.*

- **AC1:** In the SKU table, the SKU ID must be a hyperlink that navigates to a unique URL for that SKU.
- **AC2:** The SKU Detail Page must display all information from the expanded view (Price, Price Points, Tax Class, LIX info).
- **AC3:** The SKU Detail Page must also display other SKU-level attributes, such as Digital Goods and any product-level overrides.
- **AC4:** When displaying an overridden attribute, the page must also show the original Product-level value that was overridden for context (e.g., "14 days (Overrides product default of 7 days)").
- **AC5:** The page must have its own breadcrumb trail (e.g., `Home > Product: Sales Nav > SKU: 12345`).

### 5. Scope and Data Requirements

#### In Scope:
- A read-only interface for browsing and searching the product catalog.
- A hierarchical view: a main catalog of **Products**, a detail page for each Product listing its **SKUs**, and an expanded view for each SKU showing its active **Price** and its **Price Points**.
- Displaying all key attributes for Products and SKUs as defined in the data table below.
- Filtering and sorting by the most important attributes.

#### Out of Scope (for Epic 1):
- **Any and all editing functionality.** This is strictly a "read-only" epic.
- Creating new Products or SKUs.
- **Experimentation workflows.** While the UI will display LIX assignments, this epic does not include the workflows for creating new experiment SKUs. Per the experimentation model, all experiments are handled by creating new, versioned SKUs.
- Backend integrations, authentication, or **publishing workflows.** The UI will only show data with a "Prod" publishing status.
- Analytics or experiment result dashboards.

#### Data Requirements:
| Attribute | Level | Description / Example |
|---|---|---|
| Product Name | Product | The display name of the product (e.g., "Sales Navigator Core") |
| Product ID | Product | Unique identifier for the product (e.g., 5095295) |
| Line of Business (LOB)| Product | Business line grouping (LTS, LMS, LSS, Premium) |
| Category | Product | Logical grouping within LOB (e.g., "Career Pages") |
| Product Status | Product | Business status: Active, Legacy, Retired. (Future epics will add a `Publishing Status`). |
| Product Type | Product | Subscription, Consumable, etc. |
| Product Description | Product | Short summary of the product (if available) |
| SKU ID | SKU | Unique identifier for the SKU/configuration |
| Sales Channel | SKU | Desktop, Field, Mobile |
| Billing Cycle | SKU | Monthly, Quarterly, Annual |
| Region | SKU | NAMER, EMEA, APAC, LATAM, OTHER |
| LIX Assignment | SKU | Optional LIX experiment key and treatment. |
| Digital Goods | SKU | Features included. Can be an `Entitlement` (boolean) or `Consumable` (numeric). |
| Price | Price | A versioned container for price points with validity `Valid From` and `Valid To` dates. |
| Price Points | Price Point | The actual price in a given `Currency Code` and `Amount`. |
| Tax Class | SKU | A label indicating if the price is tax-inclusive or exclusive |
| SKU Status | SKU | Business status: Active, Legacy, Retired. |

### 6. Open Questions & Design Considerations
- **Q1:** How can we best display a potentially long list of SKUs on the Product Detail Page? (Answered: A filterable, expandable table.)
- **Q2:** What is the most intuitive UI for the filter controls? (Answered: Dropdowns.)
- **Q3:** What should the UI display if a product has no active SKUs?
- **Q4:** How do we visually distinguish between `Active`, `Legacy`, and `Retired` entities to avoid user confusion? (Answered: Color-coded tags.)
- **Q5:** How should we display the list of "Digital Goods" for a SKU? Is a simple list sufficient for the MVP?

### 7. Glossary
- **Product:** The highest-level conceptual offering that users recognize (e.g., "Sales Navigator Core").
- **SKU (Sellable Configuration):** A unique, immutable combination of commercial attributes. A single Product can have many SKUs. The SKU is the unit of experimentation.
- **Price:** A versioned container attached to a SKU that holds price points and has validity from/to dates.
- **Price Point:** The most granular level, representing the actual monetary amount in a specific currency.
- **Digital Good:** A feature or benefit included with a SKU.
- **Entitlement:** A type of Digital Good that is a boolean (yes/no) permission to access a feature.
- **Consumable:** A type of Digital Good that is a countable or spendable benefit (e.g., InMail credits).
- **Business Status:** Whether a product or SKU is `Active`, `Legacy`, or `Retired`.
- **Publishing Status:** The lifecycle state of a change in the publishing workflow (`Draft`, `Prod`, etc.). Out of scope for Epic 1.
- **LIX:** The internal experimentation framework at LinkedIn. 