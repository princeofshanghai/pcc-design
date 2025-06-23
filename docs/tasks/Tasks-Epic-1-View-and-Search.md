# Tasks: PCC Epic 1 – View and Search the Product Catalog

_This file contains a breakdown of actionable design and prototyping tasks generated from the PRD for Epic 1. Tasks are grouped by user story/feature for clarity and easy handoff to engineering. Each task is numbered and has a checkbox for easy tracking._

---

## Catalog Page: Search & Filter Products

- [ ] 1. **Task:** Design a main Catalog page listing all Products in a clear, scannable table or card layout
    - Show Product Name, LOB, Product Status, Category
- [ ] 2. **Task:** Add a prominent, always-visible search bar at the top of the Catalog page
    - Supports full/partial product name matches, real-time results
- [ ] 3. **Task:** Add filter controls for Line of Business (LOB), Region, Channel, Billing Cycle, Product Status, and Category
    - Support multiple filters, show active filters, add "Reset" button
    - **Subtasks:**
        - [ ] 3.1 **Subtask:** Implement filter UI components (dropdowns, checkboxes, etc.)
        - [ ] 3.2 **Subtask:** Display active filters and provide a clear way to reset
- [ ] 4. **Task:** Add navigation tabs or a dropdown for the four LOBs (LTS, LMS, LSS, Premium) and an "All Products" option
    - Visually highlight current selection

---

## Product Detail Page: View Product & SKU Details

- [ ] 1. **Task:** Design a Product Detail Page displaying all key product and SKU attributes
    - Product Name, Product ID, LOB, Category, Product Status, Product Type, Product Description, SKU ID, Sales Channel, Billing Cycle, Region, Digital Goods, Price/Price Points, Tax Class, SKU Status, Billing Frequency
- [ ] 2. **Task:** Add filter controls for selecting SKU attributes: Region, Channel, Billing Cycle
    - Update SKU details and prices as user selects
    - **Subtasks:**
        - [ ] 2.1 **Subtask:** Build Region filter dropdown
        - [ ] 2.2 **Subtask:** Build Channel filter dropdown
        - [ ] 2.3 **Subtask:** Build Billing Cycle filter dropdown
- [ ] 3. **Task:** Show a clear "Not Found" or "No Price Defined" state if the selected SKU doesn't exist
- [ ] 4. **Task:** For each SKU, display a list of Price versions
    - Show business status, effective dates, LIX experiment details, price points—USD first, currency codes, correct decimals
- [ ] 5. **Task:** Clearly indicate whether each price is tax-inclusive or tax-exclusive, and display prices in the correct format for the channel (desktop/mobile)
- [ ] 6. **Task:** Add a visually distinct section for "Included Features" or "Digital Goods" (entitlements and consumables) for the selected SKU
- [ ] 7. **Task:** Show a clear default state on the Product Detail Page before a SKU is selected
    - Prompt user to select, or show a default SKU

---

## Export Functionality

- [ ] 1. **Task:** Add an "Export" button to both the Product Detail and SKU views
    - Downloads a spreadsheet or PDF with all visible price data; can be static/mock for now

---

## General Design & Accessibility

- [ ] 1. **Task:** Ensure all components meet WCAG 2.1 AA accessibility standards
    - Color contrast, keyboard navigation, ARIA labels
- [ ] 2. **Task:** Use clear groupings and visual hierarchy for all attributes and sections
    - Make it easy to scan and understand information

---

## Future-Proofing

- [ ] 1. **Task:** Add a `publishingStatus` field to all product, SKU, price, and price point data models
    - UI should be ready to filter/display by publishing status in the future

---

## Relevant Files

</rewritten_file> 