# PRD: View and Search the Product Catalog (PCC Epic 1)

> **Status:** Final
> **Author:** [Your Name/Team]
> **Last Updated:** [Current Date]
> **Related Documents:** [PCC 5-Year Vision](/.cursor/context-library/vision-and-goals.mdc), [PCC MVP Scope](/.cursor/context-library/mvp-scope.mdc), [Business Context](/.cursor/context-library/business-context.mdc)

---

### 1. Background & Problem Statement
LinkedIn's product catalog, with its 500+ products and complex pricing, is currently managed through a fragmented system of spreadsheets, internal wikis, and tribal knowledge. This makes it nearly impossible for business stakeholders (Product Managers, Pricing Teams, Business Partners) to answer a fundamental question: "What do we sell, where, and for how much?"

Answering this question today requires manual data digging and direct requests to engineering, causing significant delays and hindering our ability to make fast, data-driven decisions.

This document outlines the requirements for the first major epic of the Product Configuration Center (PCC): creating a centralized, read-only source of truth for the product catalog.

### 2. Goals & Success Metrics
The primary goal of this epic is to **empower business users to independently find and understand product and pricing information.**

**Success Metrics:**
- **Adoption:** At least 80% of target users (PMs, Pricing Managers) can look up product information in PCC without needing to ask an engineer within the first month of launch.
- **Efficiency:** A measurable reduction in ad-hoc data requests to the engineering team.
- **User Satisfaction (Qualitative):** Stakeholders report that the system is intuitive, fast, and a trustworthy source of information.

### 3. User Personas
- **Priya, the Product Manager:** Needs to quickly understand the current pricing, market availability, and feature set of her products to inform her roadmap.
- **Anand, the Pricing Manager:** Needs to see a detailed breakdown of all SKUs and price points for a given product to analyze revenue and plan experiments.
- **Sam, the Business Partner:** Needs to filter the catalog to see all products available for a specific market segment (e.g., all products sold via Field Sales in EMEA).

### 4. User Stories & Requirements

**User Story 1: Discovering Products**
*As Priya the PM, I want to search and filter the entire catalog by LOB, category, region, or channel, so that I can quickly find the products relevant to my work.*
- **AC1:** The UI must provide a persistent search bar to find products by name or ID.
- **AC2:** The UI must provide filter controls for **Line of Business (LOB)**, **Category**, **Region**, and **Sales Channel**.
- **AC3:** Applying search or filters updates the main product list in real-time.
- **AC4:** The product list must clearly display the **Product Name**, **Product ID**, **LOB**, and **Category** for each item.

**User Story 2: Viewing a Specific Product's Configurations**
*As Anand the Pricing Manager, I want to select a product and then see all of its available configurations (SKUs), so that I can understand all the different ways we sell it.*
- **AC1:** Clicking on a product from the main list navigates to a "Product Detail Page".
- **AC2:** This page must display a clear list of all **SKUs** associated with that Product.
- **AC3:** The SKU list must be filterable by key attributes like **Region**, **Channel**, and **Billing Cycle**.
- **AC4:** Each SKU in the list should display its key defining attributes and its business status (Active, Legacy, Retired).

**User Story 3: Inspecting a Single SKU**
*As Sam the Business Partner, I want to select a single, specific SKU and see its detailed price points in all currencies, so that I can confirm the exact price for a customer in a specific country.*
- **AC1:** Selecting a SKU from the list reveals its detailed view.
- **AC2:** The view must show the `Price` active for that SKU, including its `Start Date` and `End Date`.
- **AC3:** The view must list all `Price Points` (the actual amounts) for the active `Price`, including **Currency Code** and **Amount**.
- **AC4:** Prices must be formatted according to the business context rules (e.g., USD first, no symbols, correct decimal places for JPY).

### 5. Scope

#### In Scope:
- A read-only interface for browsing and searching the product catalog.
- A two-level view: a main catalog list of **Products**, and a detail page for each Product that lists its **SKUs**.
- Displaying all key attributes for Products and SKUs as defined in the `business-context.mdc`.
- Filtering by the most important attributes (LOB, Category, Region, Channel, Billing Cycle).

#### Out of Scope:
- **Any and all editing functionality.** This is strictly a "read-only" epic.
- Creating new Products or SKUs.
- Designing or launching pricing experiments (this is Epic 2).
- Backend integrations, authentication, or publishing workflows.
- Analytics or experiment result dashboards.

### 6. Key Data Attributes to Display
To be successful, the UI must clearly display the following information sourced from our business context:

| Level | Attribute | Example |
|---|---|---|
| **Product** | Product Name | "Sales Navigator Core" |
| | Product ID | `5095295` |
| | Line of Business (LOB) | "LSS" |
| | Category | "Sales Navigator" |
| | Product Status | `Active` |
| | | |
| **SKU** | SKU ID | `8675309` |
| | Defining Attributes | `Region: NAMER`, `Channel: Desktop`, `Billing Cycle: Annual` |
| | SKU Status | `Active` |
| | | |
| **Price** | Effective Dates | `Oct 1, 2024 - Dec 31, 2024` |
| | | |
| **Price Point** | Price | `USD 959.88` |
| | Price | `CAD 1271.88` |


### 7. Open Questions for Design
- How can we best display a potentially long list of SKUs on the Product Detail Page? Should we use a table, cards, or another format?
- What is the most intuitive way for a user to filter the SKUs on the detail page?
- What should the UI display if a product has no active SKUs?
- How do we visually distinguish between `Active`, `Legacy`, and `Retired` entities to avoid user confusion?

### Digital Goods (Entitlements & Consumables)
- When viewing a SKU, users must be able to see a clear list of all Digital Goods included with that SKU.
- Digital Goods are the features, entitlements (yes/no access), and consumables (e.g., credits) that define what the end user receives.
- This helps users understand the value of each SKU and compare offerings.

### Tax-Inclusive vs. Tax-Exclusive Pricing
- Desktop (LinkedIn.com): Prices are tax-exclusive. The business enters a base price (e.g., $99.00), and tax is automatically calculated at checkout based on the user's region. The customer sees the base price plus a separate tax line.
- Mobile (iOS / Google Play): Prices are tax-inclusive. The business enters the final, tax-included price (e.g., $100.00), and the system back-calculates the pre-tax base price using the region's tax rate. The customer sees only the final, tax-included price.
- The UI must clearly indicate whether a price is tax-inclusive or tax-exclusive for each channel, and display prices accordingly.
- All pricing logic, UI inputs, and exports must reflect this difference. Prioritize ease of use by letting the user focus on the customer-facing price, especially for mobile.

### Key Product & SKU Attributes for Epic 1
The following attributes must be displayed in the UI for each Product and SKU in Epic 1:

| Attribute         | Level    | Description / Example                        |
|-------------------|----------|----------------------------------------------|
| Product Name      | Product  | The display name of the product (e.g., "Sales Navigator Core") |
| Product ID        | Product  | Unique identifier for the product (e.g., 5095295) |
| Line of Business (LOB) | Product  | Business line grouping (LTS, LMS, LSS, Premium) |
| Category          | Product  | Logical grouping within LOB (e.g., "Career Pages") |
| Product Status    | Product  | Active, Legacy, Retired                      |
| Product Type      | Product  | Subscription, Consumable, etc.               |
| Product Description | Product | Short summary of the product (if available)  |
| SKU ID            | SKU      | Unique identifier for the SKU/configuration  |
| Sales Channel     | SKU      | Desktop, Field, Mobile                       |
| Billing Cycle     | SKU      | Monthly, Quarterly, Annual                   |
| Region            | SKU      | NAMER, EMEA, APAC, LATAM, OTHER              |
| Digital Goods     | SKU      | Features, entitlements, consumables (e.g., InMail credits, Applicant Insights) |
| Price / Price Points | SKU   | Price in each currency (e.g., $99.00 USD, €89.00 EUR) |
| Tax Class         | SKU      | Tax logic for the SKU (e.g., SUBDIGBNDL)     |
| SKU Status        | SKU      | Active, Legacy, Retired                      |
| Billing Frequency | SKU      | How often the SKU is billed (e.g., 1 Month, 12 Months) |

---

Update user stories, acceptance criteria, and design/UX considerations to reference these attributes:

**Story 1: Find a specific Product**
- Search results must display: Product Name, LOB, Product Status, and Category.

**Story 2: View the pricing and included Digital Goods for a specific sellable configuration (SKU)**
- The Product Detail Page must display: Product Name, Product ID, LOB, Category, Product Status, Product Type, Product Description, SKU ID, Sales Channel, Billing Cycle, Region, Digital Goods, Price/Price Points, Tax Class, SKU Status, and Billing Frequency.
- Acceptance criteria should specify that all these fields are visible and clearly labeled.

**Story 3: Discover Products with specific attributes**
- Filtering and search must support: LOB, Region, Channel, Billing Cycle, Product Status, and Category.

**Design & UX Considerations**
- All key attributes listed above must be clearly visible and labeled in the UI, both in catalog lists and on the Product Detail Page.
- Use clear groupings and visual hierarchy to help users quickly scan and understand the information.

--- 