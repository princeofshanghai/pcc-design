// Barrel export file - maintains compatibility during component reorganization
// All existing imports will continue to work through this file

// Layout components
export { default as Layout } from './layout/Layout';
export { default as PageHeader } from './layout/PageHeader';
export { default as PageSection } from './layout/PageSection';
export { default as DetailSection } from './layout/DetailSection';
export { default as ScrollToTop } from './layout/ScrollToTop';

// Product components
export { default as ProductListTable } from './product/ProductListTable';
export { default as GroupedProductListTable } from './product/GroupedProductListTable';

// SKU components  
export { default as SkuListTable } from './sku/SkuListTable';
export { default as GroupedSkuListTable } from './sku/GroupedSkuListTable';

// Pricing components
export { default as OverrideIndicator } from './pricing/OverrideIndicator';
export { default as PriceGroupTable } from './pricing/PriceGroupTable';
export { default as PricePointTable } from './pricing/PricePointTable';
export { default as PivotTable } from './pricing/PivotTable';
export { default as AnalyticsChart } from './pricing/AnalyticsChart';
export { default as ChartControls } from './pricing/ChartControls';


// Attribute components
export { default as AttributeDisplay } from './attributes/AttributeDisplay';
export { default as AttributeGroup } from './attributes/AttributeGroup';
export { default as StatusTag } from './attributes/StatusTag';
export { default as GTMStatusTag } from './attributes/GTMStatusTag';
export { default as PricePointStatusTag } from './attributes/PricePointStatusTag';
export { default as PriceGroupStatusTag } from './attributes/PriceGroupStatusTag';
export { default as LobTag } from './attributes/LobTag';
export { default as FolderTag } from './attributes/FolderTag';
export { default as CountTag } from './attributes/CountTag';
export { default as ChannelTag } from './attributes/ChannelTag';
export { default as BillingCycleTag } from './attributes/BillingCycleTag';
export { default as BillingModelTag } from './attributes/BillingModelTag';
export { default as GTMItemTypeTag } from './attributes/GTMItemTypeTag';
export { default as ApprovalStatusTag } from './attributes/ApprovalStatusTag';
// FolderTabs component removed - no longer used with new navigation
export { default as BillingCycleDisplay } from './attributes/BillingCycleDisplay';

// Filter components
export { default as FilterBar } from './filters/FilterBar';
export { default as FilterDropdown } from './filters/FilterDropdown';
export { default as SearchBar } from './filters/SearchBar';
export { default as ViewOptions } from './filters/ViewOptions';

// Shared/utility components
export { default as CopyableId } from './shared/CopyableId';
export { default as GroupHeader } from './shared/GroupHeader';
export { default as UserAvatar } from './shared/UserAvatar';
export { default as BaseChip } from './shared/BaseChip';
export { default as SecondaryText } from './shared/SecondaryText';
export { default as ViewModeToggle } from './shared/ViewModeToggle';
export { default as VerticalSeparator } from './shared/VerticalSeparator';
export { default as MetricCard } from './shared/MetricCard';
export { default as InfoPopover } from './shared/InfoPopover';
export { default as ModeSelectorButton } from './shared/ModeSelectorButton';
export { default as TruncatedText } from './shared/TruncatedText';

// Attribute Dictionary components
export { default as AttributeDictionaryTable } from './attribute-dictionary/AttributeDictionaryTable';

// Activity components
export { default as ActivityFeedItem } from './activity/ActivityFeedItem';

// GTM components
export { default as GTMItemsTable } from './gtm/GTMItemsTable';
export { default as GTMMotionTable } from './gtm/GTMMotionTable';
export { default as GTMItemChangesModal } from './gtm/GTMItemChangesModal';

// Export types that might be imported from components
export type { SelectOption } from './filters/FilterDropdown';
export type { ViewModeOption, ViewModeConfig } from './filters/FilterBar'; 