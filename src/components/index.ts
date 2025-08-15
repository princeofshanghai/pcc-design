/**
 * Barrel export file for all components
 * This provides clean, organized imports for all components in the application
 * 
 * Usage examples:
 * import { Layout, PageHeader, StatusTag } from '@/components';
 * import { ProductListTable, PriceGroupTable } from '@/components';
 */

// ============================================
// LAYOUT COMPONENTS
// ============================================
export { default as Layout } from './layout/Layout';
export { default as AppSidebar } from './layout/AppSidebar';
export { default as AppHeader } from './layout/AppHeader';
export { default as AppContent } from './layout/AppContent';
export { default as PageHeader } from './layout/PageHeader';
export { default as PageSection } from './layout/PageSection';
export { default as DetailSection } from './layout/DetailSection';
export { default as ScrollToTop } from './layout/ScrollToTop';

// ============================================
// SHARED/UTILITY COMPONENTS
// ============================================
export { default as CopyableId } from './shared/CopyableId';
export { default as UserAvatar } from './shared/UserAvatar';
export { default as GroupHeader } from './shared/GroupHeader';
export { ExperimentBadge, ExperimentalBadge, ExperimentalTableCell } from './shared/ExperimentBadge';

// ============================================
// ATTRIBUTE/TAG COMPONENTS
// ============================================
export { default as StatusTag } from './attributes/StatusTag';
export { default as SalesChannelDisplay } from './attributes/SalesChannelDisplay';
export { default as BillingCycleDisplay } from './attributes/BillingCycleDisplay';
export { default as AttributeDisplay } from './attributes/AttributeDisplay';
export { default as AttributeGroup } from './attributes/AttributeGroup';
export { default as CountTag } from './attributes/CountTag';
export { default as FolderTag } from './attributes/FolderTag';
export { default as LobTag } from './attributes/LobTag';
export { default as PricePointStatusTag } from './attributes/PricePointStatusTag';

// ============================================
// PRODUCT COMPONENTS
// ============================================
export { default as ProductList } from './product/ProductList';
export { default as ProductListItem } from './product/ProductListItem';
export { default as ProductListTable } from './product/ProductListTable';
export { default as GroupedProductList } from './product/GroupedProductList';
export { default as GroupedProductListTable } from './product/GroupedProductListTable';

// ============================================
// PRICING COMPONENTS
// ============================================
export { default as BillingModelDisplay } from './pricing/BillingModelDisplay';
export { default as PriceDetailView } from './pricing/PriceDetailView';
export { default as PriceGroupTable } from './pricing/PriceGroupTable';
export { default as PricePointTable } from './pricing/PricePointTable';
export { default as OverrideComparison } from './pricing/OverrideComparison';
export { default as OverrideIndicator } from './pricing/OverrideIndicator';

// ============================================
// SKU COMPONENTS
// ============================================
export { default as SkuListItem } from './sku/SkuListItem';
export { default as SkuListTable } from './sku/SkuListTable';
export { default as GroupedSkuListTable } from './sku/GroupedSkuListTable';
export { default as DigitalGoodsTable } from './sku/DigitalGoodsTable';

// ============================================
// FILTER COMPONENTS
// ============================================
export { default as FilterBar } from './filters/FilterBar';
export { default as FilterDropdown, type SelectOption } from './filters/FilterDropdown';
export { default as SearchBar } from './filters/SearchBar';
export { default as ViewOptions, type ViewMode } from './filters/ViewOptions';





// ============================================
// ATTRIBUTE DICTIONARY COMPONENTS
// ============================================
export { default as AttributeDictionaryTable } from './attribute-dictionary/AttributeDictionaryTable';

// ============================================
// TYPE EXPORTS
// ============================================
// Re-export shared types for convenience
export type * from '../types/shared';