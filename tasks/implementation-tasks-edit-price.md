GTM# Implementation Tasks: Edit Price Functionality

## Instructions for AI Assistant
- Work through these tasks **in order** - do not skip ahead
- Mark completed tasks with `[x]` 
- **Do NOT proceed to next task without explicit user approval**
- Each task should be fully complete and tested before moving on
- Ask for user confirmation before marking task as complete

---

## Phase 1: Foundation & Data Structures

### Task 1: Setup Types and Data Structures
- [x] Add `GTMMotion` type to `src/utils/types.ts`
- [x] Add `PriceEditContext` type for editing context
- [x] Add `PriceChange` type for tracking changes
- [x] Extend existing types if needed for price editing

**Goal:** Establish the data foundation before building components

### Task 2: Create Mock GTM Motion Data  
- [x] Add mock GTM motion data to `src/utils/mock-data.ts`
- [x] Create sample draft motions with different statuses
- [x] Add utility functions to find/create GTM motions

**Goal:** Have realistic data for development and testing

### Task 3: Setup Modal Trigger Integration
- [x] Update ProductDetail.tsx dropdown to include "Update prices" option
- [x] Add modal state management and handlers
- [x] Create basic modal container (empty for now)
- [x] Test modal open/close functionality

**Goal:** Get the entry point working before building modal content

---

## Phase 2: Step 1 - Context Selection

### Task 4: Create PriceEditorModal Container
- [x] Create `src/components/pricing/PriceEditor/PriceEditorModal.tsx`
- [x] Setup full-screen modal using Ant Design Modal
- [x] Add 2-step navigation state management
- [x] Add proper styling using theme.ts patterns

**Goal:** Main modal container with step navigation

### Task 5: Build Context Selection Component
- [x] Create `src/components/pricing/PriceEditor/ContextSelector.tsx`
- [x] Add channel selection (new or existing dropdown)
- [x] Add billing cycle selection (new or existing dropdown, filtered by selected channel)  
- [x] Add validity period selection (separate start/end date pickers)
- [x] Add optional LIX experiment search/selection
- [x] Remove seat range and pricing tier selectors (moved to Step 2)

**Goal:** Simplified context selection focusing on price group identity (channel + billing cycle)

### Task 6: Add Context Validation
- [x] Add validation for required context fields
- [x] Show validation errors appropriately
- [x] Disable "Continue" button until valid context selected
- [x] Add context summary display (removed per user feedback - simplified UX)

**Goal:** Ensure valid context before proceeding to price editing

---

## Phase 3: Step 2 - Price Comparison & Editing

### Task 7: Create Channel-Specific Price Editing Components
- [x] Create `src/components/pricing/PriceEditor/FieldPriceMatrix.tsx` for Field channel
  - [x] Implement currency tabs interface (8-10 currencies)
  - [x] Create seat range × pricing tier matrix for each currency tab
  - [x] Load existing prices and show empty fields for new combinations
- [x] Create `src/components/pricing/PriceEditor/SimplePriceTable.tsx` for Desktop/iOS/GPB
  - [x] Create scrollable table: Currency | Current | New | Change
  - [x] Handle 50-60 currencies in single table
- [x] Add price input fields with proper formatting for both components
- [x] Style using existing Table component patterns

**Goal:** Channel-appropriate price editing interfaces

### Task 8: Add Price Calculations and Validation
- [x] Add real-time diff calculations (amount and percentage)
- [x] Add visual indicators for increases/decreases/unchanged
- [x] Add input validation (positive numbers, proper decimals)
- [x] Handle zero-decimal currencies properly
- [x] Add currency tooltips with full names

**Goal:** Working price editing with accurate calculations

### Task 9: Build Impact Preview Component
- [x] ~~Create `src/components/pricing/PriceEditor/ImpactPreview.tsx`~~ (Simplified UX - removed separate preview component)
- [x] Implement SKU creation vs. update business logic (integrated into price group selection)
- [x] Show clear messaging about what will happen (integrated into workflow)
- [x] ~~Display context summary and change count~~ (Simplified UX - removed)

**Goal:** Clear visibility into business impact of changes

---

## Phase 4: GTM Motion Integration

### Task 10: Create GTM Motion Selector Component
- [x] Create `src/components/pricing/PriceEditor/GTMMotionSelector.tsx`
- [x] Add dropdown to select existing GTM motions
- [x] Add "Create new motion" form with name, description, activation date
- [x] Add GTM motion validation
- [x] Integrate with price editing flow

**Goal:** Complete GTM motion workflow integration

### Task 11: Add Save and Submit Logic
- [x] Implement draft saving to selected/created GTM motion
- [x] Add success/error handling for save operations
- [x] ~~Add confirmation dialogs where appropriate~~ (Clean UX - save directly)
- [x] Add loading states during save operations
- [x] Return user to product detail after successful save

**Goal:** Complete the editing workflow with proper persistence

---

## Phase 5: GTM Motion Management

### Task 12: Add GTM Motion Sidebar Navigation
- [x] Update sidebar navigation to include "GTM Motions" menu item
- [x] Add routing for GTM motion pages
- [x] Style consistently with existing navigation

**Goal:** Access point to GTM motion management

### Task 13: Create GTM Motion List Page
- [x] Create `src/pages/GTMMotionList.tsx`
- [x] Display list of all GTM motions with status, dates, etc.
- [x] Add basic filtering/sorting capabilities
- [x] Add navigation to motion details
- [x] Follow existing list page patterns

**Goal:** Overview of all GTM motions

### Task 14: Create GTM Motion Detail Page  
- [x] Create `src/pages/GTMMotionDetail.tsx`
- [x] Show motion details (name, description, activation date)
- [x] List all draft price changes in the motion
- [x] Add placeholders for future approval workflow
- [x] Follow existing detail page patterns

**Goal:** Detailed view of individual GTM motions

---

## Phase 6: Polish and Testing

### Task 15: Add Error Handling and Edge Cases
- [ ] Add proper error boundaries
- [ ] Handle network failures gracefully
- [ ] Add validation for edge cases (empty currencies, etc.)
- [ ] Test with various data scenarios
- [ ] Add loading states where missing

**Goal:** Robust error handling and user experience

### Task 16: Final Integration Testing
- [ ] Test complete end-to-end flow
- [ ] Verify all business rules work correctly
- [ ] Test with different product/pricing scenarios
- [ ] Verify GTM motion integration works properly
- [ ] Test modal behavior and navigation

**Goal:** Fully working feature ready for use

---

## Completion Status: 14/16 tasks completed

**Current Task:** Task 15 - Add Error Handling and Edge Cases  
**Status:** 🎉 **READY FOR POLISH** - Full GTM Motion workflow is complete!

**What was completed:**
- Created comprehensive ContextSelector component in `/src/components/pricing/PriceEditor/ContextSelector.tsx`
- **ENHANCED: Progressive Disclosure Design** - Step-by-step guided context selection
  - Channel selection (full width, always visible)
  - Billing cycle selection (appears after channel selected, filtered by channel)
  - Context summary + LIX button + Price details section (appears after both selected)
- **Smart Channel-Filtered Billing Cycles**: Billing cycle options dynamically filtered based on selected channel
  - **"Existing" section**: Billing cycles that exist for the selected channel
  - **"New" section**: Billing cycles that don't exist for that specific channel yet
- **Simplified Context Logic**: Removed seat range and pricing tier from Step 1 (moved to Step 2)
  - **Channel + Billing Cycle = Price Group/SKU** identity (core business logic)
  - Seat ranges and pricing tiers are price point attributes within price groups
- **Real-time SKU Detection**: Automatically detects if channel+cycle combination creates new price group
- **Visual Context Summary**: Shows selected combo and clearly indicates "✨ Creates new SKU" vs "📝 Updates existing SKU"
- **Intelligent State Reset**: When user changes channel, billing cycle and all dependent fields reset automatically
- **Separate Validity Date Fields**: Start Date (required) + End Date (optional for open-ended validity)
- **Enhanced LIX Experiment Flow**: 
  - Progressive disclosure: "+ Add LIX experiment" button → LIX Key → LIX Treatment
  - Smart treatment field: Text input for new LIX keys, dropdown for existing LIX keys
  - Real data extraction from product SKU data
- **Clean Section-Based Layout**: "General" and "Price Details" sections with clear visual hierarchy
- Added comprehensive form validation and proper form reset on modal close
- Fixed all TypeScript errors and successfully builds with no errors

**MAJOR ENHANCEMENTS COMPLETED BEYOND ORIGINAL SCOPE:**
- 🎯 **Validity Architecture Redesign**: Moved validity from Step 1 to Step 2 (global per-price-point level)
- 🎯 **Direct Edit Flow**: Added "Edit prices" button to PriceGroupDetail.tsx that skips Step 1
- 🎯 **Price Group Selection Logic**: Complete business logic for create vs. update price groups  
- 🎯 **Copy-Paste Functionality**: Spreadsheet-like paste support (1D and 2D) for both components
- 🎯 **Custom Undo System**: Ctrl+Z support for paste operations with proper state restoration
- 🎯 **Advanced UI Polish**: 
  - Tab change indicators showing edit counts
  - Warning borders for changed inputs
  - Conditional column hiding for new SKUs
  - Zebra striping and responsive layouts
  - Progressive disclosure for all optional fields
  - Unified modal sizing and z-index management

**CURRENT STATUS:** The core price editing workflow is fully functional with advanced features. Users can:
✅ Navigate Product → Update Prices → Select Context → Edit Prices → Save
✅ Navigate Price Group → Edit Prices (direct to Step 2)  
✅ Handle both Field (matrix) and Desktop/iOS/GPB (table) pricing models
✅ Copy-paste from spreadsheets, undo changes, see live calculations
✅ Create new price groups or update existing ones with full business logic

**🎉 GTM MOTION INTEGRATION COMPLETE:**
- ✅ **GTMMotionSelector Component**: Step 3 in price editing workflow
  - Radio button choice: "Add to existing" vs "Create new" GTM Motion
  - Dropdown with existing GTM Motions (filtered by Draft/Submitted status)
  - New motion form: name, description, activation date with validation
  - Smart sorting by most recent, status color coding, motion metadata display
- ✅ **3-Step Workflow Integration**: 
  - Normal Flow: Context → Price Editing → GTM Motion → Save
  - Direct Flow: Price Editing → GTM Motion → Save (skips Step 1)
- ✅ **Save Logic with Professional UX**:
  - Loading states with spinner on Save button
  - Async save simulation with error handling
  - Proper state management and cleanup
  - Modal closes and returns user to original page after save
- ✅ **Universal Design**: Same GTM Motion step works for both main edit and direct edit flows

**CURRENT STATUS:** Complete end-to-end price editing workflow! Users can edit prices and save them to GTM Motions with full professional UX. Ready for final polish and testing.

**REMAINING TASKS:** Tasks 15-16 (Error handling polish and final integration testing)
