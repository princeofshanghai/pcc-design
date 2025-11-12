# LinkedIn Business Context for Product Configuration Center

## 1. Core Entities & Hierarchy

Four-level structure: **Product → SKU → Price → Price Point**

```
Product (e.g., "Sales Navigator Core")
└── SKU (e.g., Annual, NAMER, Desktop)
    └── Price (effective dates, LIX experiments)
        ├── Price Point (USD 959.88)
        └── Price Point (CAD 1271.88)
```

### Product
- Highest-level offering (e.g., "Sales Navigator Core", "Premium Career")
- Container for all sellable configurations

### SKU (Sellable Configuration)
- **Unit of experimentation** - defined by immutable attributes (Region, Channel, Billing Cycle)
- To test changes (price, billing cycle, etc.), create a **new SKU** and use LIX to control visibility
- Example: `Annual billing, NAMER region, Desktop channel`

### Price
- Container for price points tied to a specific SKU
- Has effective dates (Start/End) for scheduled changes
- Can exist as Draft before going live

### Price Point
- Actual monetary amount in a specific currency (USD, EUR, JPY, etc.)
- Attached to a Price object

**Key Principle:** Separates "what" (immutable SKU) from "how much and when" (Price), enabling safe experimentation.

---

## 2. Catalog Organization

### Line of Business (LOB)
Primary organizational grouping:
- **LTS:** LinkedIn Talent Solutions
- **LMS:** LinkedIn Marketing Solutions
- **LSS:** LinkedIn Sales Solutions
- **Premium:** Individual and small business subscriptions

Every product has exactly one LOB. Used for filtering, navigation, reporting, and access control.

### Product Category
Logical grouping within LOB:
- **LTS:** Career Pages, GeoFenced, Glint, Jobs, Learning, LiHA, Lynda, RLite, SMB Solution
- **Premium:** Company Page, Generic Products, Multiseat, Small Business
- **LSS:** Sales Navigator
- **LMS:** Ads

Every product has exactly one Category.

### Product ID
Unique identifier that never changes (e.g., 5095295). Used for search and reference across all systems.

---

## 3. Commercial Dimensions

### Geographic Regions
| Abbreviation | Region Name | Areas |
|-------------|-------------|-------|
| **NAMER** | North America | U.S., Canada |
| **EMEA** | Europe, Middle East, and Africa | Europe, Middle East, Africa |
| **APAC** | Asia-Pacific | East Asia, South Asia, Southeast Asia, Australia, New Zealand |
| **LATAM** | Latin America | Central and South America, Mexico |
| **OTHER** | Other or Global | Rarely used catch-all |

### Sales Channels
- **Desktop:** LinkedIn.com online sales
- **Field:** Sales through LinkedIn representatives
- **Mobile:** iOS App Store and Google Play Billing (separate from desktop due to platform rules/fees)

### Billing Cycles
- Monthly, Quarterly, Annual

### Billing Models
- **Subscription:** Recurring (majority of products)
- **One-time:** Single purchase
- **Usage:** Consumption-based

**Key Rules:**
- Products cannot be multiple types (no mixed models)
- Pricing varies by Channel × Region × Billing Cycle
- Mobile pricing often differs due to platform fees

---

## 4. Pricing Logic

### USD-First Pricing
- USD is the primary currency and baseline for all pricing
- Other currencies calculated from USD using FX rates, with optional business overrides
- Always display USD first in UI

### Charm Pricing
- **Monthly:** End in `.99` or `.95` (e.g., $29.99, $49.95)
- **Annual:** Discounted (e.g., 10-11 months for 12-month subscription), can be whole numbers or charm prices
- **Other currencies:** Follow local conventions (EUR: `.99` or `.00`, JPY: whole numbers)

---

## 5. Status & Lifecycle

### Business Status
- **Active:** Currently live and offered
- **Legacy:** No longer offered to new customers, but existing customers still use
- **Retired:** Completely shut off

**Cascade Logic:**
- If any Price Point is Active → parent Price is Active
- If any Price is Active → parent Product is Active
- If all children are not Active → parent becomes Legacy/Retired

### Publishing Workflow (Future)
For Epic 2+ editing flows:
- **Draft** → **Pending to EI** → **EI** (staging) → **Pending to Prod** → **Prod** (live)
- Ensures all changes are validated and deployed by Engineering
- **Note:** Not required for Epic 1 (view-only)

---

## 6. Currency Logic

### Global Support
- **55 currencies** total
- **Core (23):** USD, EUR, CAD, AUD, CHF, DKK, NOK, SEK, GBP, HKD, SGD, BRL, NZD, JPY, INR, ZAR, AED, PLN, SAR, MXN, EGP, TRY, CNY
- **Longtail (32):** Remaining currencies (ARS, BDT, CLP, IDR, TWD, VND, etc.)

### Channel Restrictions
- **Desktop/Mobile:** All 55 currencies (Core/Longtail grouping)
- **Field Sales:** Only 10 currencies (USD, CAD, GBP, EUR, AUD, SGD, INR, HKD, CNY, JPY)

### Formatting Rules
- Use currency codes (USD, EUR, JPY), not symbols ($, €, ¥)
- Most currencies: 2 decimals (USD 49.99, EUR 79.00)
- No decimals: JPY, KRW, CLP, VND (e.g., JPY 5000)
- No localization of separators—keep formatting simple and consistent

### Business Rules
- USD is **required** for every product/price
- Other currencies are optional but recommended
- Business users can override FX-based prices
- Core currencies more prominent in UI; longtail may be collapsed by default

---

## 7. Pricing Activation & Experimentation

### Effective Dates
- **Start Date:** When price becomes valid (blank = active immediately)
- **End Date:** When price stops being used (blank = stays active until replaced)
- Allows scheduled rollouts without engineering intervention

### LIX (LinkedIn Experiments)
- **LIX Key:** Experiment name/ID (e.g., "price_test_q4_2025")
- **LIX Treatment:** Test group (e.g., "control", "variantA")
- If a Price has LIX, only users in that treatment see it
- Enables safe pricing experiments without global rollout

### Combined Logic
- **Price with no LIX:** Available to everyone once effective
- **Price with LIX:** Only visible to treatment group after Start Date

---

## 8. Digital Goods

Attached to **SKU level** (not Product). Define what users receive:

- **Entitlement:** Yes/no permission (e.g., Access to Applicant Insights)
- **Consumable:** Countable benefit (e.g., 30 InMail credits/month)

**UI:** Show "Included Features" or "Digital Goods" section when viewing a SKU.

---

## 9. Tax Mode

### Desktop (LinkedIn.com)
- **Tax-Exclusive:** Business enters base price (e.g., $99.00)
- System calculates and adds tax at checkout
- Customer sees base price + separate tax line

### Mobile (iOS/Google Play)
- **Tax-Inclusive:** Business enters final price (e.g., $100.00)
- System back-calculates pre-tax amount
- Customer sees only final price (no tax line)

**UI:** Clearly indicate tax mode in all relevant screens and exports.

---

## 10. Price Export

Pricing managers need to export prices (CSV/Excel/PDF) for sharing, analysis, and reporting. Include SKU attributes, price points, tax mode, etc. Accessible from Product and SKU views.

**MVP/Epic 1:** Can be simple mock export (no backend required).

---

## 11. Epic 1 Attribute Focus

Key attributes for viewing and searching the catalog:

| Attribute | Level | Example |
|-----------|-------|---------|
| Product Name | Product | "Sales Navigator Core" |
| Product ID | Product | 5095295 |
| Line of Business (LOB) | Product | LTS, LMS, LSS, Premium |
| Category | Product | "Career Pages" |
| Product Status | Product | Active, Legacy, Retired |
| Product Type | Product | Subscription, Consumable |
| Product Description | Product | Short summary (optional) |
| SKU ID | SKU | Unique identifier |
| Sales Channel | SKU | Desktop, Field, Mobile |
| Billing Cycle | SKU | Monthly, Quarterly, Annual |
| Region | SKU | NAMER, EMEA, APAC, LATAM, OTHER |
| Digital Goods | SKU | Features, entitlements, consumables |
| Price / Price Points | SKU | USD 99.00, EUR 89.00 |
| Tax Class | SKU | SUBDIGBNDL |
| SKU Status | SKU | Active, Legacy, Retired |
| Billing Frequency | SKU | 1 Month, 12 Months |

---

## 12. Core Data Model Rules

### Product
- `description`: **Optional**
- `billingModel`: **Required** - must be `'Subscription'`, `'One-time'`, or `'Usage'`

### Price
- `startDate`: **Optional** (open-ended start)
- `endDate`: **Optional** (open-ended end)

---

## Glossary

- **Product:** Highest-level offering (e.g., "Sales Navigator Core")
- **SKU:** Sellable configuration defined by region, channel, billing cycle (unit of experimentation)
- **Price:** Container for price points with effective dates
- **Price Point:** Monetary amount in a specific currency
- **LOB:** Business grouping (LTS, LMS, LSS, Premium)
- **Product Category:** Logical grouping within LOB
- **Digital Goods:** Features/benefits attached to SKU
- **Entitlement:** Yes/no permission to access a feature
- **Consumable:** Countable/spendable benefit
- **Tax Mode:** Tax-inclusive (mobile) or tax-exclusive (desktop)
- **Publishing Status:** Workflow state (Draft, Pending, EI, Prod) - for Epic 2+
- **Business Status:** Active, Legacy, or Retired
