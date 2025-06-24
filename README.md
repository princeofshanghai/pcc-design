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

# PCC Design System

## 🎨 **Design Rules**

### **Typography (Geist/Vercel Scale)**
- **H1**: 32px (Page titles)
- **H2**: 24px (Section headers)
- **H3**: 20px (Subsection headers)
- **H4**: 16px (Small headers)
- **Body**: 16px (Default text)
- **Small**: 14px (Secondary text)
- **Label**: 12px (Metadata, labels)
- **Font**: Inter (system fallbacks)

### **Responsive Spacing System**
- **Mobile (320px+)**: 16px margins
- **Tablet (768px+)**: 24px margins
- **Desktop (1024px+)**: 32px margins
- **Large (1440px+)**: 40px margins
- **XL (1920px+)**: 48px margins
- **Use `<PageContainer>` for all pages**

### **Colors (Slate Palette)**
- **Primary**: #0f172a (slate-900)
- **Secondary**: #64748b (slate-500)
- **Tertiary**: #94a3b8 (slate-400)
- **Border**: #e2e8f0 (slate-200)
- **Background**: #ffffff
- **Hover**: #f8fafc (slate-50)

### **Table Styling (Vercel Compact)**
- **Size**: `small` (Ant Design)
- **Primary text**: 14px, medium weight
- **Secondary text**: 12px, regular weight
- **Headers**: 12px, semibold, uppercase
- **Row height**: ~40px (compact)
- **Hover**: Subtle #f8fafc background

### **Layout Principles**
- **Mobile-first responsive design**
- **8px grid system** for consistent spacing
- **Progressive enhancement** (more space on larger screens)
- **Clean, minimal interfaces** (Vercel/Linear style)
- **LinkedIn branding** in sidebar (logo + "PCC")

### **Component Guidelines**
- **Always use Ant Design's built-in props** (size, render, etc.)
- **Leverage theme tokens** for consistency
- **Maintain accessibility** (don't override Ant Design's features)
- **Use responsive CSS classes** for scaling
- **Keep components reusable** and composable

### **File Structure**
- **Theme**: `src/theme.ts` (design tokens)
- **Layout**: `src/components/Layout.tsx` (responsive wrapper)
- **Pages**: `src/pages/` (wrap in PageContainer)
- **Styles**: `src/App.css` (responsive utilities)
- **Data**: `src/mockProducts.json` (542 LinkedIn products)
