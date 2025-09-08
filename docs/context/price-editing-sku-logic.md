# Price Editing → SKU Logic Rules

*Last updated: December 2024*

## Overview

This document defines the business rules for how price editing actions translate to SKU creation or updates in the PCC system. These rules determine what gets displayed in GTM Motions and how the system behaves when users edit pricing.

## Core Business Rules

### Update vs Create Decision Tree

```
User edits pricing for: [Product] + [Channel] + [Billing Cycle] + [LIX]

Step 1: Search existing SKUs for EXACT match
- Channel: Must match exactly
- Billing Cycle: Must match exactly  
- LIX: Must match exactly (including null/none)

Step 2: Determine action
├── EXACT MATCH EXISTS → Update existing SKU/PriceGroup (in place)
└── ANY DIFFERENCE → Create new SKU/PriceGroup
```

### What Gets Preserved vs Modified

**Always Preserved:**
- Seat ranges (1-10 seats, 11-50 seats, etc.) - never change
- Existing validity dates - just update in place
- SKU structure - only modify price points

**User Can Edit:**
- All currencies at once in one editing session
- Individual price amounts per currency per seat range

**System Generated:**
- SKU IDs: Random digits (e.g., "47291", "85743")
- PriceGroup IDs: Random digits (e.g., "130200", "456789")

## Concrete Examples

### Example 1: Update Existing Context
```
Current State:
- SKU "47291" → Field Sales + Monthly → PriceGroup "130200"

User Action:
- Edit Field Sales + Monthly pricing from $29.99 to $34.99

Result:
- SKU "47291" stays the same
- PriceGroup "130200" updated in place
- GTM Shows: "🔄 Updated pricing for SKU 47291"
```

### Example 2: Create New Context
```
Current State:
- No SKU exists for Mobile + Monthly

User Action:
- Add Mobile + Monthly pricing at $24.99  

Result:
- New SKU "85743" created
- New PriceGroup "456789" created
- GTM Shows: "✨ Created new SKU 85743 (Mobile + Monthly)"
```

### Example 3: LIX Experiment (Always Creates New)
```
Current State:
- SKU "47291" exists for Field Sales + Monthly

User Action:
- Field Sales + Monthly + LIX Experiment "price-test-v2"

Result:
- New SKU "92108" created (LIX makes it unique)
- New PriceGroup "789456" created  
- GTM Shows: "✨ Created experimental SKU 92108 (LIX: price-test-v2)"
```

## Multi-Currency Editing

**Behavior:**
- User edits all currencies at once in one session
- One GTM item covers all currency changes for that context
- System preserves existing seat ranges across all currencies

**Example GTM Item Data Structure:**
```typescript
{
  id: "gtm-item-001",
  type: "Price",
  productName: "Premium Career",
  details: "Updated pricing across 3 currencies",
  
  skuImpact: {
    action: "update", // or "create"
    skuId: "47291", 
    priceGroupId: "130200",
    context: {
      channel: "Field Sales", 
      billingCycle: "Monthly",
      lix: null
    },
    priceChanges: [
      { currency: "USD", seatRange: "1-10", old: 29.99, new: 34.99 },
      { currency: "USD", seatRange: "11-50", old: 24.99, new: 29.99 },
      { currency: "EUR", seatRange: "1-10", old: 26.99, new: 31.99 },
      { currency: "JPY", seatRange: "1-10", old: 3200, new: 3800 }
    ]
  }
}
```

## GTM Motion Display Logic

### SKU Impact Summary
```
Items & SKU Impact:
├── Price Update: Premium Career
│   └── 🔄 Updated SKU 47291 (Field Sales + Monthly) - 3 currencies
├── Price Creation: Premium Career  
│   └── ✨ Created SKU 85743 (Mobile + Monthly) - USD pricing
└── Price Experiment: Premium Career
    └── ✨ Created SKU 92108 (Field Sales + Monthly + LIX: test-v2) - 2 currencies
```

### Motion-Level Aggregation
- Show total new SKUs created: "✨ 2 new SKUs created"
- Show total existing SKUs updated: "🔄 1 existing SKU updated"  
- Provide clear mapping of what changes affect which SKUs

## Technical Implementation Notes

### Data Structure Requirements
- GTM items must include `skuImpact` object with full context
- Track both old and new prices for audit/rollback purposes  
- Preserve original seat range structure
- Support null/undefined LIX values for non-experiment contexts

### Validation Rules
- Exact context matching includes null-checking for optional fields
- Price group updates are atomic (all currencies succeed or all fail)
- SKU ID generation must avoid collisions

## Business Context

This logic supports the PRD requirement that:
> - New LIX experiment = new price group = new SKU
> - New channel/billing cycle combination = new price group = new SKU  
> - Same context as existing = update existing price group/SKU

The goal is to provide clear visibility into what changes are actually happening at the SKU level when users make pricing updates, enabling better approval workflows and change tracking.
