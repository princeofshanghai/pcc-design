# Product Configuration Center (PCC)

A centralized, enterprise-grade web app for viewing and searching LinkedIn’s product catalog.

## Overview

PCC is designed to be the single source of truth for LinkedIn’s product, SKU, and pricing data. It enables product managers, pricing managers, and business partners to:

- Search and browse all products and SKUs
- View detailed pricing, price points, and tax logic
- See included features, entitlements, and digital goods for each SKU
- Filter by Line of Business (LOB), region, channel, and billing cycle
- Export price data for sharing and analysis

The UI is built for speed, clarity, and future-proofing, with a focus on realistic, scalable design for engineering handoff.

## Key Features

- **Product → SKU → Price → Price Point** hierarchy
- Support for multiple regions, channels, billing cycles, and currencies
- Digital Goods (entitlements and consumables) displayed per SKU
- Tax-inclusive (mobile) and tax-exclusive (desktop) pricing logic
- Read-only UI for Epic 1 (future epics will add editing and publishing workflows)
- Mock data for rapid prototyping and design validation
- Export to CSV/PDF for pricing data

## Tech Stack

- React + TypeScript
- Vite (for fast development)
- Ant Design components (with Shadcn/ui visual style)
- No backend integration (mock data only for MVP)

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Run the app locally:**
   ```sh
   npm run dev
   ```
3. **Open in your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## Project Structure

- `/src` — Main app code and components
- `/src/mockProducts.json` — Mock product, SKU, and pricing data
- `/docs` — PRD, business context, and supporting documentation
- `.cursor/context-library/` — Core business context, vision, and attribute definitions

## Documentation

- [Business Context](.cursor/context-library/business-context.mdc)
- [Vision & Goals](.cursor/context-library/vision-and-goals.mdc)
- [MVP Scope](.cursor/context-library/mvp-scope.mdc)
- [Epic 1 PRD](docs/PCC-Epic-1-View-and-Search-PRD.md)

## Contributing

- See the PRD and business context for requirements and data model details.
- For design or engineering questions, refer to the documentation or contact the project owner.

---

*This project is for prototyping and design handoff. Not production-ready.*
