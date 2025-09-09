# Product Requirements Document: Edit Price Functionality

## Introduction/Overview

The Edit Price functionality allows field sales reps and pricing operations teams to efficiently update product pricing without needing to understand the underlying SKU complexity. This feature abstracts SKU management while providing clear before/after price comparison and integrates with Go-to-Market (GTM) motion workflows for proper approval processes.

The core problem this solves is the current complexity of price updates, where users must navigate SKU structures and risk creating unintended SKUs or price points. This feature provides a guided, context-aware editing experience that handles business logic automatically while maintaining transparency about changes.

## Goals

1. **Simplify price editing workflow** - Allow users to update prices by focusing on business context (channel, billing cycle, validity) rather than technical SKU structures
2. **Prevent pricing errors** - Provide clear before/after comparison to catch mistakes before submission
3. **Automate SKU logic** - Automatically determine whether to create new SKUs or update existing ones based on business rules
4. **Integrate approval workflow** - Seamlessly connect price changes to GTM motion drafts for proper review and activation
5. **Scale across channels** - Design to support field pricing initially, with clear expansion path to desktop/mobile/iOS/Android channels

## User Stories

### Primary User Stories

**As a field sales rep**, I want to update pricing for my territory so that I can respond quickly to competitive market conditions without needing to understand SKU technical details.

**As a pricing operations manager**, I want to make quarterly price adjustments across multiple currencies so that I can maintain competitive positioning while ensuring all changes go through proper approval workflow.

**As a revenue operations team member**, I want to set up experimental pricing (LIX) so that I can test new pricing strategies with clear visibility into what SKUs will be created or modified.

### Supporting User Stories

**As a pricing manager**, I want to review draft price changes in GTM motions so that I can approve or reject changes before they go live.

**As a field sales rep**, I want to see exactly what prices are changing and by how much so that I can verify my updates are correct before submitting.

## Functional Requirements

### Core Price Editing Flow

1. **The system must provide a "Update prices" option** in the ProductDetail page dropdown menu that triggers the edit flow
2. **The system must display a full-screen modal** that provides focused editing experience without competing visual elements
3. **The system must guide users through a 2-step editing process**: context selection, then price editing with GTM motion integration
4. **The system must allow users to configure editing context** with channel, billing cycle, and validity period selection (new or existing combinations)
5. **The system must support optional LIX experiment configuration** with search/type functionality for existing experiments
6. **The system must display channel-appropriate price editing interfaces**:
   - **Field channel**: Currency-tabbed matrices showing seat ranges × pricing tiers for each currency
   - **Desktop/iOS/GPB channels**: Single scrollable comparison table with all currencies
7. **The system must validate price inputs** with real-time feedback on invalid values
8. **The system must calculate and display price differences** with clear visual indicators (unchanged, increase, decrease)
9. **The system must show impact preview** revealing whether changes will update existing price groups or create new ones

### Business Logic & SKU Management

10. **The system must automatically determine price group/SKU creation vs. update** based on business rules:
    - **Channel + Billing Cycle combination** determines price group/SKU identity
    - New channel/billing cycle combination = new price group = new SKU  
    - Existing channel/billing cycle combination = update existing price group/SKU
    - **Seat ranges and pricing tiers** are price point attributes within the price group (Field channel only)
    - **LIX experiments** are labels/attributes, not SKU determinants
11. **The system must handle currency-specific formatting** including zero-decimal currencies (JPY, KRW, etc.)
12. **The system must handle channel-specific pricing complexity**:
    - **Field channel**: Multiple seat ranges × pricing tiers × currencies
    - **Desktop/iOS/GPB channels**: Single price point per currency
13. **The system must validate business rules** such as minimum/maximum price constraints (if applicable)

### GTM Motion Integration

14. **The system must require GTM motion association** - users cannot save price changes without linking to a GTM motion
15. **The system must allow creating new GTM motions** with required fields: name, description, activation date
16. **The system must allow selecting existing GTM motions** from a searchable dropdown
17. **The system must save changes as drafts** in the selected GTM motion for later review and activation
18. **The system must provide GTM motion management pages** including list view and detail view accessible from sidebar navigation

### Data & Display Requirements  

19. **The system must load current pricing data** from existing price group structures
20. **The system must support all currencies** present in the current pricing structure
21. **The system must display currency names in tooltips** for currency codes (e.g., "USD - US Dollar")
22. **The system must show seat ranges and pricing tiers** as context labels during editing
23. **The system must persist draft changes** until user completes or cancels the flow

## Non-Goals (Out of Scope)

1. **Mobile responsive design** - Initial release focuses on laptop/desktop usage only
2. **Bulk product editing** - Users edit one product at a time in this release
3. **Bulk price actions** - No percentage increases, copy rates, or mass updates - manual entry only
4. **Historical price tracking** - Focus is on current price changes, not price history analysis  
5. **Advanced pricing algorithms** - No automatic price optimization or competitive intelligence
6. **Real-time collaboration** - Multiple users cannot edit the same product simultaneously
7. **Immediate price activation** - All changes must go through GTM motion approval workflow
8. **Price change notifications** - Not including email alerts or notifications for price changes
9. **Audit trail details** - Basic change tracking only, not detailed user action logging

## Design Considerations

### Visual Design
- **Clean, minimal design** following existing theme.ts patterns with Tailwind Gray color palette and Inter font
- **Full-screen modal experience** providing focused editing without visual distractions
- **Spacious comparison table** using existing Ant Design Table components with room for multiple currencies
- **Clear visual hierarchy** using established typography scale (fontSizeHeading2: 18px, etc.)
- **Consistent spacing** following existing PageSection patterns

### Component Architecture
- **Reuse existing components** wherever possible (Table, Input, Select, DatePicker from Ant Design)
- **Follow established patterns** from PriceGroupTable, FilterBar, and other pricing components
- **Modular step components** for easy maintenance and testing
- **Consistent styling** using theme tokens (colorBorder, colorTextSecondary, etc.)

### User Experience
- **Progressive disclosure** - reveal complexity only when needed
- **Clear context labels** - always show what the user is editing
- **Immediate visual feedback** - price differences calculated and displayed in real-time
- **Error prevention** - validate inputs before allowing progression to next step
- **Escape hatches** - clear way to cancel and return to original view

## Technical Considerations

### Integration Points
- **Extend existing demoDataLoader.ts patterns** for current pricing data
- **Integrate with ProductDetail.tsx** dropdown menu structure
- **Follow established routing patterns** for GTM motion pages
- **Use existing theme.ts zIndex hierarchy** (modal: 1050)

### Data Structure
- **Leverage existing PricePoint and PriceGroup types** from types.ts
- **Extend for GTM motion entity** with name, description, activationDate fields
- **Mock data initially** following existing patterns in mock-data.ts
- **LocalStorage for draft persistence** during editing session

### Performance
- **Lazy load pricing data** only when drawer opens
- **Debounce price calculations** to avoid excessive re-renders during typing
- **Optimize comparison table rendering** for multiple currencies

## Success Metrics

### User Experience Metrics
- **Reduced time to complete price changes** - Target: 50% reduction from current workflow
- **Decreased pricing errors** - Measured by fewer correction requests after submission
- **Increased adoption** - Track usage of new edit flow vs. alternative methods

### Product Quality Metrics  
- **Accuracy of SKU creation logic** - Verify system correctly determines new vs. existing SKU scenarios
- **GTM motion integration usage** - Track percentage of price changes that successfully flow through approval process
- **User satisfaction score** - Collect feedback on ease of use and confidence in price accuracy

### Technical Metrics
- **Drawer load performance** - Target: < 500ms to fully loaded state
- **Price calculation responsiveness** - Target: < 100ms for diff calculations
- **Error rates** - Track validation failures and system errors during editing

## Open Questions

1. **Price change approval workflow** - What happens after draft is saved to GTM motion? Who approves and how?
2. **Rollback capabilities** - If activated prices need to be reverted, how should that work?  
3. **Multi-currency rate relationships** - Should system suggest exchange rate-based prices for related currencies?
4. **Integration with external pricing systems** - Will this connect to other pricing tools or remain standalone?
5. **Bulk action sophistication** - Should percentage increases be currency-aware (different % per region)?
6. **LIX experiment lifecycle** - How do experimental prices graduate to permanent pricing?
7. **Conflict resolution** - What happens if two users create conflicting price changes for the same product?
8. **GTM motion templates** - Should there be predefined motion templates for common scenarios (quarterly increases, etc.)?

---

**Document Status:** Draft v1.0  
**Last Updated:** December 2024  
**Next Review:** After initial technical feasibility assessment
