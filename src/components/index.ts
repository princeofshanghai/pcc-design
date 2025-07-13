// Barrel export file - maintains compatibility during component reorganization
// All existing imports will continue to work through this file

// Layout components
export { default as Layout } from './layout/Layout';
export { default as PageHeader } from './layout/PageHeader';
export { default as PageSection } from './layout/PageSection';
export { default as DetailSection } from './layout/DetailSection';
export { default as ScrollToTop } from './layout/ScrollToTop';

// Product components
export { default as ProductList } from './product/ProductList';
export { default as ProductListItem } from './product/ProductListItem';
export { default as ProductListTable } from './product/ProductListTable';
export { default as GroupedProductList } from './product/GroupedProductList';
export { default as GroupedProductListTable } from './product/GroupedProductListTable';

// SKU components
export { default as SkuListItem } from './sku/SkuListItem';
export { default as SkuListTable } from './sku/SkuListTable';
export { default as GroupedSkuListTable } from './sku/GroupedSkuListTable';
export { default as DigitalGoodsTable } from './sku/DigitalGoodsTable';

// Pricing components
export { default as PriceDetailView } from './pricing/PriceDetailView';
export { default as BillingModelDisplay } from './pricing/BillingModelDisplay';
export { default as OverrideIndicator } from './pricing/OverrideIndicator';
export { default as OverrideComparison } from './pricing/OverrideComparison';

// Attribute components
export { default as AttributeDisplay } from './attributes/AttributeDisplay';
export { default as AttributeGroup } from './attributes/AttributeGroup';
export { default as StatusTag } from './attributes/StatusTag';
export { default as LobTag } from './attributes/LobTag';
export { default as FolderTag } from './attributes/FolderTag';
export { default as CountTag } from './attributes/CountTag';
// FolderTabs component removed - no longer used with new navigation
export { default as SalesChannelDisplay } from './attributes/SalesChannelDisplay';

// Filter components
export { default as FilterBar } from './filters/FilterBar';
export { default as FilterDropdown } from './filters/FilterDropdown';
export { default as SearchBar } from './filters/SearchBar';
export { default as ViewOptions } from './filters/ViewOptions';

// Shared/utility components
export { default as CopyableId } from './shared/CopyableId';

// Export types that might be imported from components
export type { ViewMode } from './filters/ViewOptions';
export type { SelectOption } from './filters/FilterDropdown'; 