# PRD: View and Search the Product Catalog (PCC Epic 1)

> **Status:** Draft
> **Author:** Senior Product Manager
> **Last Updated:** [Current Date]
> **Related Documents:** [PCC 5-Year Vision](/.cursor/context-library/vision-and-goals.mdc), [PCC MVP Scope](/.cursor/context-library/mvp-scope.mdc), [Business Context](/.cursor/context-library/business-context.mdc)

---

### 1. Overview & Business Case
*   **Feature Name:** View and Search the Product Catalog
*   **Problem Statement:** LinkedIn's product, pricing, and market data is fragmented across spreadsheets and tribal knowledge, making it impossible for business stakeholders to get timely, accurate answers without relying on engineering.
*   **Target Audience:** Product Managers, Pricing Managers, and Business Partners.
*   **Business Goal:** This epic is the foundational first step towards creating a centralized source of truth for our product catalog. It will directly address the core pain point of data accessibility, reduce reliance on engineering for basic information lookups, and accelerate go-to-market decisions by providing clear, on-demand insights.

### 2. User Stories & Requirements

**Story 1: Find a specific Product**
*As a Product Manager, I want to search for any Product by its name so that I can quickly find its details without asking an engineer.*
-   **Acceptance Criteria 1:** The interface must have a prominent search bar that is always accessible.
-   **Acceptance Criteria 2:** Search must support both full and partial matches for Product names (e.g., "Sales Navigator").
-   **Acceptance Criteria 3:** Search results must appear dynamically as I type, narrowing down the list of Products in real-time.
-   **Acceptance Criteria 4:** Each item in the search results should clearly display the full Product name, its Line of Business (LOB), and its business status (Active, Legacy, Retired), indicating it is a container for many configurations.

**Story 2: View the pricing and included Digital Goods for a specific sellable configuration (SKU)**
*As a Pricing Manager, I want to select a specific configuration (e.g., Annual, for EMEA, sold via Field) on a Product page to see its detailed pricing and a list of included Digital Goods, so I can understand both the cost and the value delivered to the end user.*
-   **Acceptance Criteria 1:** The Product Detail Page must feature prominent filter controls to select the attributes that define a SKU: `Region`, `Channel`, and `Billing Cycle`.
-   **Acceptance Criteria 2:** As the user makes selections, the page dynamically updates to display the information for the matching SKU. A "Not Found" or "No Price Defined" state must be shown if the selected combination does not exist.
-   **Acceptance Criteria 3:** For the selected SKU, the page displays a list of its `Price` versions (e.g., "Live Price," "Q4 Discount Experiment," "2023 Legacy Price").
-   **Acceptance Criteria 4:** Each `Price` version clearly displays its business status, effective dates, and any LIX experiment details (key/treatment).
-   **Acceptance Criteria 5:** Each `Price` version lists its `Price Points` (currency amounts), following LinkedIn's currency formatting rules (codes, not symbols; correct decimals; USD first).
-   **Acceptance Criteria 6:** For the selected SKU, the page displays a section called "Included Features" or "Digital Goods" that lists all entitlements (yes/no features) and consumables (e.g., credits) included with that SKU, using clear, user-friendly labels.
-   **Acceptance Criteria 7:** For each Price, the UI must indicate whether the price is tax-inclusive or tax-exclusive, based on the sales channel, and display the price in the correct format for the channel.

**Story 3: Discover Products with specific attributes**
*As a Business Partner, I want to filter the main catalog list to find all Products that have SKUs matching certain criteria (e.g., available in EMEA via Field Sales) so that I can understand our portfolio for a specific segment.*
-   **Acceptance Criteria 1:** The main catalog list must provide filter controls for `Line of Business`, `Region`, `Channel`, and `Billing Cycle`.
-   **Acceptance Criteria 2:** Applying a filter (e.g., `Region: EMEA` and `Channel: Field`) should instantly update the list to show only Products that contain at least one SKU matching those criteria.
-   **Acceptance Criteria 3:** Multiple filters can be applied at once.
-   **Acceptance Criteria 4:** There is a clear way to see which filters are currently active and to reset them.

**Story 4: Navigate by Line of Business**
*As a Product Manager, I want to quickly switch between viewing products from different Lines of Business so that I can focus on my area of responsibility while still having access to the broader catalog.*
-   **Acceptance Criteria 1:** The main navigation should include tabs or a dropdown for the four LOBs: LTS, LMS, LSS, and Premium.
-   **Acceptance Criteria 2:** Selecting an LOB should filter the catalog to show only products from that business line.
-   **Acceptance Criteria 3:** There should be a clear "All Products" option to view the complete catalog.
-   **Acceptance Criteria 4:** The current LOB selection should be visually highlighted in the navigation.

**Story: Export Prices for a Product or SKU**
_As a Pricing Manager, I want to export the prices for a product or SKU as a spreadsheet or PDF, so I can share and analyze pricing information easily._

**Acceptance Criteria:**
- There is an “Export” button on the Product Detail and SKU views.
- Clicking “Export” downloads a spreadsheet (CSV/Excel) or PDF with all visible price data for the selected product or SKU.
- The export includes: Product/SKU attributes, price versions, price points, tax mode, and digital goods.
- For Epic 1, this can be a static or mock export (no backend integration required).

**Design & UX Considerations:**
- An “Export” button should be present and clearly labeled on both Product and SKU views.
- The exported file should be easy to read and include all relevant columns for business use.

### 3. Scope & Features
#### In Scope:
-   A main "Catalog" page that displays a list of all Products.
-   Filtering on the main catalog page to find Products that contain SKUs with specific attributes.
-   A "Product Detail Page" that serves as an interactive viewer to find and display the pricing for a specific SKU. The user selects SKU attributes (`Region`, `Channel`, etc.) to see the corresponding `Price` versions and `Price Points`.
-   The UI will be read-only for Epic 1.
-   When viewing a SKU, display a list of Digital Goods (entitlements and consumables) included with that SKU, in addition to pricing information.

#### Out of Scope (Future Epics):
-   Creating, editing, or deleting Products, SKUs, Prices, or Price Points.
-   Managing SKU configurations.
-   Creating or managing pricing experiments (LIX) or effective date scheduling.
-   Bundling, offer creation, or discount logic.
-   Backend integrations, authentication, or approval workflows.
-   Publishing workflow (lifecycle status) and editing flows.

#### Future-Proofing for Publishing Workflow:
While Epic 1 only displays data in the "prod" (production/live) state, the data model and UI should be designed to support additional publishing statuses (e.g., Draft, Pending, EI, Prod) in the future. All objects (Product, SKU, Price, Price Point) should be able to store a `publishingStatus` field, even if it is always set to "prod" in Epic 1. The UI should be architected so that filtering or displaying by publishing status can be added in Epic 2 without major redesign.

### 4. Design & UX Considerations
-   **Guiding Principle:** The interface must feel like a "consumer-grade enterprise tool" — fast, intuitive, and trustworthy.
-   **Key Mockups/Wireframes:** [Link to Figma files to be added here.]
-   **User Flow:** The primary flow is now: User lands on the Catalog page -> Uses search/filters to find a **Product** -> Clicks to view the Product Detail Page -> Uses on-page filters to select a specific **SKU** configuration -> Views the `Price(s)` and `Price Points` for that SKU.
-   **Information Hierarchy:** The Product Detail Page's primary interaction is the SKU selector/filter. The most critical information displayed is the `Price` information for the *selected SKU*.
-   **Default State:** The Product Detail Page must have a clear default state before a user has selected a full SKU configuration. (e.g., prompt the user to make selections, or show a default/common SKU like `Monthly, NAMER, Desktop`).
-   **Currency Formatting:** All prices must use currency codes (not symbols), follow LinkedIn's decimal rules, and display USD first.
-   **Accessibility:** All components must meet WCAG 2.1 AA compliance, ensuring the application is usable by everyone.
-   **When a SKU is selected, the Product Detail Page must show a clear, visually distinct section listing all Digital Goods (features, entitlements, consumables) included with that SKU, so users can easily understand the value proposition.**
-   **The Product Detail Page must clearly show whether a price is tax-inclusive or tax-exclusive, and display the price in the correct format for the channel (desktop or mobile).**

### 5. Success Metrics
*How will we know this epic is successful?*
-   **Primary Metric:** At least 80% of PMs and pricing managers are able to use PCC to look up product information without engineering support within 3 months of launch.
-   **Secondary Metric:** A >15% week-over-week retention rate for users of the tool.
-   **Qualitative Feedback:** Stakeholders report that the system is intuitive, faster, and reduces GTM bottlenecks in user interviews.

### 6. Open Questions
-   What is the desired default view on a Product Detail Page before the user has selected a full SKU configuration?
-   How do we best guide the user to find the SKU they need on the Product Detail Page? (e.g., pre-populating filters, showing a list of all available SKUs).
-   For the main catalog list, what information should we show for each Product to summarize its available configurations?
-   What is the expected performance for the on-page SKU filtering?
-   Should we still allow searching by SKU from the main search bar, and if so, where does it lead? (e.g., directly to the Product page with the SKU pre-selected).

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