import React, { useState } from 'react';
import { Row, Col, Space, Button, theme, Dropdown } from 'antd';
import { ListFilter, CirclePlus } from 'lucide-react';
import { TAILWIND_COLORS } from '../../theme';
import SearchBar from './SearchBar';
import FilterDropdown, { type SelectOption } from './FilterDropdown';
import CustomFilterButton from './CustomFilterButton';
import ViewOptions from './ViewOptions';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { toSentenceCase } from '../../utils/formatters/text';
import { getColumnLabel } from '../../utils/tableConfigurations';

// Utility function to determine if a filter should be shown based on available options
const shouldShowFilter = (filter: FilterConfig): boolean => {
  // Always show custom components (like ValiditySelector)
  if (filter.customComponent) {
    return true;
  }
  
  // Count real selectable options (exclude "All", catch-all options, etc.)
  const getRealOptionsCount = (options: SelectOption[]): number => {
    let count = 0;
    
    for (const option of options) {
      if ('options' in option) {
        // Option group - count all child options
        count += option.options.length;
      } else {
        // Simple option - exclude common catch-all patterns
        const label = option.label.toLowerCase();
        const value = option.value.toLowerCase();
        
        // Skip "All" options and similar catch-all patterns
        if (
          label.startsWith('all ') || 
          value.startsWith('all') ||
          label === 'all' ||
          value === 'all' ||
          label === 'any' ||
          value === 'any'
        ) {
          continue;
        }
        
        count++;
      }
    }
    
    return count;
  };
  
  const realOptionsCount = getRealOptionsCount(filter.options);
  
  // Show filter only if there are 2 or more real options to choose from
  return realOptionsCount > 1;
};

// Create CSS for More filters button and dropdown items to match inline filters
const createMoreFiltersButtonStyles = (primaryColor: string, primaryBg: string) => `
  .more-filters-button {
    transition: all 0.2s ease;
    border: 1px dashed ${TAILWIND_COLORS.gray[300]} !important;
  }
  
  .more-filters-button:hover:not(:disabled) {
    border-color: ${primaryColor} !important;
    color: ${primaryColor} !important;
  }
  
  .more-filters-button:focus:not(:disabled) {
    border-color: ${primaryColor} !important;
    box-shadow: 0 0 0 2px ${primaryColor}1a !important;
  }
  
  .more-filters-dropdown-item {
    padding: 6px 12px;
    cursor: pointer;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: ${primaryColor};
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background-color 0.2s ease;
  }
  
  .more-filters-dropdown-item:hover {
    background-color: ${primaryBg};
  }
`;

export interface ViewModeOption {
  key: string;
  label: string;
  icon: React.ReactNode;
}

export interface ViewModeConfig {
  value: string;
  setter: (value: string) => void;
  options: ViewModeOption[];
  storageKey?: string;
}

export interface FilterConfig {
  placeholder: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: any) => void;
  style?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  showOptionTooltip?: boolean;
  
  // New optional properties for multiselect support
  multiSelect?: boolean;
  multiValue?: string[];
  onMultiChange?: (values: string[]) => void;
  disableSearch?: boolean;
  
  // View selector behavior props (new)
  excludeFromClearAll?: boolean;
  hideClearButton?: boolean;
  preventDeselection?: boolean;
  
  // Progressive disclosure props
  primary?: boolean; // If false, filter appears in "More filters" dropdown
  
  // Custom display props
  customDisplayValue?: (value: string | null, multiValue?: string[]) => string;
  icon?: React.ReactNode;
  
  // Custom component (alternative to standard filter button)
  customComponent?: React.ReactNode;
}

interface FilterBarProps {
  search?: {
    placeholder: string;
    onChange: (query: string) => void;
    style?: React.CSSProperties;
  };
  filters?: FilterConfig[];
  onClearAll?: () => void;
  viewOptions?: {
    // View mode toggle options
    viewMode?: ViewModeConfig;
    groupBy?: {
      value: string;
      setter: (group: string) => void;
      options: string[];
      disabled?: boolean;
    };
    sortOrder?: {
      value: string;
      setter: (order: string) => void;
      options: string[];
    };
    // Column visibility options
    columnOptions?: ColumnConfig[];
    visibleColumns?: ColumnVisibility;
    setVisibleColumns?: (columns: ColumnVisibility) => void;
    // Column ordering options
    columnOrder?: ColumnOrder;
    setColumnOrder?: (order: ColumnOrder) => void;
    // Default column visibility for this specific context
    defaultVisibleColumns?: ColumnVisibility;
    // Default column order for this specific context
    defaultColumnOrder?: ColumnOrder;
    // Default sort order for this specific context
    defaultSortOrder?: string;
    // USD equivalent toggle options
    showUsdEquivalent?: boolean;
    setShowUsdEquivalent?: (show: boolean) => void;
  };
  // Control search bar and view options size
  searchAndViewSize?: 'small' | 'middle' | 'large';
  // Custom action buttons (legacy - use rightActions instead)
  actions?: React.ReactNode[];
  // Custom actions that appear in the inline filters row (before ViewOptions)
  inlineActions?: React.ReactNode[];
  // Custom actions that appear in the inline filters row (after ViewOptions)
  rightActions?: React.ReactNode[];
  // Use custom filter buttons instead of Ant Design Select
  useCustomFilters?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  filters = [],
  onClearAll,
  viewOptions,
  searchAndViewSize = 'middle',
  actions = [],
  inlineActions = [],
  rightActions = [],
  useCustomFilters = false,
}) => {
  const { token } = theme.useToken();
  
  // Inject CSS styles for More filters button (only once)
  React.useEffect(() => {
    const styleId = 'more-filters-button-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = createMoreFiltersButtonStyles(token.colorPrimary, token.colorPrimaryBg);
      document.head.appendChild(style);
    }
  }, [token.colorPrimary, token.colorPrimaryBg]);
  
  // State for managing provisional (temporarily added) filters
  const [provisionalFilters, setProvisionalFilters] = useState<string[]>([]);
  const [moreFiltersDropdownVisible, setMoreFiltersDropdownVisible] = useState(false);
  
  const shouldRenderViewOptions = viewOptions?.viewMode || viewOptions?.groupBy || viewOptions?.sortOrder || viewOptions?.columnOptions || viewOptions?.showUsdEquivalent !== undefined;

  // Filter out single-option filters first (auto-hide filters with only 1 selectable option)
  // This improves UX by reducing clutter when filters aren't useful
  const usefulFilters = filters.filter(shouldShowFilter);
  
  // Count active filters only among visible (useful) filters
  const activeFilterCount = usefulFilters.filter(f => 
    !f.excludeFromClearAll && (f.multiSelect ? (f.multiValue?.length ?? 0) > 0 : f.value != null)
  ).length;

  const hasProgressiveDisclosure = usefulFilters.some(f => f.primary === false);
  const primaryFilters = hasProgressiveDisclosure ? 
    usefulFilters.filter(f => f.primary !== false) : 
    usefulFilters; // If no progressive disclosure, all are primary
  const secondaryFilters = hasProgressiveDisclosure ? 
    usefulFilters.filter(f => f.primary === false) : 
    [];

  // Get currently active inline filters (primary + provisional secondary)
  const activeInlineFilters = [
    ...primaryFilters,
    ...secondaryFilters.filter(f => provisionalFilters.includes(f.placeholder))
  ];

  // Get available secondary filters (not yet provisional)
  const availableSecondaryFilters = secondaryFilters.filter(f => 
    !provisionalFilters.includes(f.placeholder)
  );

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
    // Also clear provisional filters
    setProvisionalFilters([]);
  };

  // Handle adding a secondary filter provisionally
  const handleAddProvisionalFilter = (filterPlaceholder: string) => {
    setProvisionalFilters(prev => [...prev, filterPlaceholder]);
    setMoreFiltersDropdownVisible(false);
    
    // Auto-open the filter dropdown after it's rendered
    setTimeout(() => {
      // Try multiple selectors to find the newly added filter button
      const selectors = [
        '.custom-filter-button',           // Custom filter buttons
        '.ant-select-selector',            // Ant Design selects
        '[role="combobox"]',               // ARIA combobox role
        '.ant-btn'                         // Generic Ant Design buttons
      ];
      
      for (const selector of selectors) {
        const buttons = document.querySelectorAll(selector);
        for (const button of buttons) {
          const buttonText = button.textContent || '';
          
          // Try to match by placeholder text (with various formats)
          const variations = [
            filterPlaceholder.replace(/^All\s+/i, '').toLowerCase(),  // "statuses" -> "statuses"
            filterPlaceholder.toLowerCase(),                          // "All statuses"
            // Also try the proper column labels
            ...(filterPlaceholder.toLowerCase().includes('statuses') ? ['status'] : []),
            ...(filterPlaceholder.toLowerCase().includes('lix') ? ['lix'] : [])
          ];
          
          if (variations.some(variation => buttonText.toLowerCase().includes(variation))) {
            (button as HTMLElement).click();
            return; // Exit all loops once we find and click
          }
        }
      }
    }, 100); // Fast response for better UX
  };

  // Handle clicks outside provisional filters to remove them if no selection made
  const handleProvisionalFilterChange = (filterPlaceholder: string, hasValue: boolean) => {
    if (!hasValue) {
      // No value selected, remove from provisional
      setProvisionalFilters(prev => prev.filter(p => p !== filterPlaceholder));
    }
    // If has value, keep it (it's now committed)
  };

  const hasFilters = usefulFilters.length > 0;

  // Component to render filters inline
  const renderFilters = (filtersToRender = activeInlineFilters) => (
    <Space direction="horizontal" 
           style={{ width: '100%' }} 
           size={6}
           wrap>
      {filtersToRender.map((filter, index) => {
        const isProvisional = provisionalFilters.includes(filter.placeholder);
        
        return (
          <Space direction="horizontal" 
               key={`${filter.placeholder}-${index}`}
               size={8}>
          <div data-filter-placeholder={filter.placeholder}>
            {filter.customComponent ? (
              filter.customComponent
            ) : useCustomFilters ? (
              <CustomFilterButton
                placeholder={toSentenceCase(filter.placeholder)}
                options={filter.options}
                multiSelect={filter.multiSelect}
                value={filter.multiSelect ? undefined : filter.value}
                onChange={filter.multiSelect ? undefined : (value) => {
                  filter.onChange(value);
                  if (isProvisional) {
                    handleProvisionalFilterChange(filter.placeholder, value != null);
                  }
                }}
                multiValue={filter.multiSelect ? filter.multiValue : undefined}
                onMultiChange={filter.multiSelect ? (values) => {
                  filter.onMultiChange?.(values);
                  if (isProvisional) {
                    handleProvisionalFilterChange(filter.placeholder, values.length > 0);
                  }
                } : undefined}
                size="middle"
                style={{ 
                  ...(filter.style || {}) 
                }}
                dropdownStyle={{
                  minWidth: '200px', // Ensure dropdown is always wide enough
                  ...filter.dropdownStyle
                }}
                showOptionTooltip={filter.showOptionTooltip}
                disableSearch={filter.disableSearch}
                excludeFromClearAll={filter.excludeFromClearAll}
                hideClearButton={filter.hideClearButton}
                preventDeselection={filter.preventDeselection}
                customDisplayValue={filter.customDisplayValue}
                icon={filter.icon}
              />
            ) : (
              <FilterDropdown
                placeholder={toSentenceCase(filter.placeholder)}
                options={filter.options}
                multiSelect={filter.multiSelect}
                value={filter.multiSelect ? undefined : filter.value}
                onChange={filter.multiSelect ? undefined : (value) => {
                  filter.onChange(value);
                  if (isProvisional) {
                    handleProvisionalFilterChange(filter.placeholder, value != null);
                  }
                }}
                multiValue={filter.multiSelect ? filter.multiValue : undefined}
                onMultiChange={filter.multiSelect ? (values) => {
                  filter.onMultiChange?.(values);
                  if (isProvisional) {
                    handleProvisionalFilterChange(filter.placeholder, values.length > 0);
                  }
                } : undefined}
                size="middle"
                style={{ 
                  width: 'auto', 
                  minWidth: 'auto',
                  ...(filter.style || {}) 
                }}
                dropdownStyle={{
                  minWidth: '200px', // Ensure dropdown is always wide enough
                  ...filter.dropdownStyle
                }}
                showOptionTooltip={filter.showOptionTooltip}
              />
            )}
          </div>
          </Space>
        );
      })}
      
      {/* More filters button - only show when there are available secondary filters */}
      {availableSecondaryFilters.length > 0 && (
        <Dropdown
          open={moreFiltersDropdownVisible}
          onOpenChange={setMoreFiltersDropdownVisible}
          dropdownRender={() => (
            <div style={{
              backgroundColor: token.colorBgElevated,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowSecondary,
              padding: '8px',
              minWidth: '160px'
            }}>
              {availableSecondaryFilters.map((filter, index) => {
                // Get proper display name by figuring out the column key from placeholder
                let displayName = filter.placeholder.replace(/^All\s+/i, '');
                
                // Map common placeholder patterns back to their proper column labels
                if (filter.placeholder.toLowerCase().includes('statuses')) {
                  displayName = getColumnLabel('status');
                } else if (filter.placeholder.toLowerCase().includes('lix')) {
                  displayName = getColumnLabel('lix');
                } else if (filter.placeholder.toLowerCase().includes('channels')) {
                  displayName = getColumnLabel('channel');
                } else if (filter.placeholder.toLowerCase().includes('billing cycles')) {
                  displayName = getColumnLabel('billingCycle');
                } else if (filter.placeholder.toLowerCase().includes('currencies')) {
                  displayName = getColumnLabel('currency');
                }
                
                return (
                  <div
                    key={`secondary-${filter.placeholder}-${index}`}
                    onClick={() => handleAddProvisionalFilter(filter.placeholder)}
                    className="more-filters-dropdown-item"
                  >
                    <CirclePlus size={14} />
                    {displayName}
                  </div>
                );
              })}
            </div>
          )}
          trigger={['click']}
        >
          <Button 
            size="middle"
            icon={<ListFilter size={14} />}
            className="more-filters-button"
            style={{ fontSize: token.fontSizeSM, fontWeight: token.fontWeightStrong }}
          >
            More filters
          </Button>
        </Dropdown>
      )}
      
      {hasFilters && activeFilterCount > 0 && (
        <Button 
          type="link" 
          onClick={handleClearAll} 
          style={{ 
            padding: '0 16px',
            color: token.colorPrimary,
            fontSize: token.fontSizeSM,
            fontWeight: token.fontWeightStrong,
          }}
        >
          Clear All
        </Button>
      )}
    </Space>
  );

  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col>
          {search && (
            <SearchBar
              placeholder={toSentenceCase(search.placeholder)}
              onChange={search.onChange}
              style={{ ...search.style, width: '480px' }}
              size={searchAndViewSize}
            />
          )}
        </Col>
        <Col>
          <Space>
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action}
              </React.Fragment>
            ))}
          </Space>
        </Col>
      </Row>

      {/* Filters row */}
      {(hasFilters || shouldRenderViewOptions) && (
        <Row style={{ marginTop: 12 }} justify="space-between" align="middle">
          <Col flex="auto" style={{ minWidth: 0 }}>
            {hasFilters && renderFilters()}
          </Col>
          {inlineActions.length > 0 && (
            <Col flex="none" style={{ marginLeft: 16 }}>
              <Space size="small">
                {inlineActions.map((action, index) => (
                  <React.Fragment key={index}>
                    {action}
                  </React.Fragment>
                ))}
              </Space>
            </Col>
          )}
          {shouldRenderViewOptions && (
            <Col flex="none" style={{ marginLeft: 16 }}>
              <ViewOptions 
                viewMode={viewOptions?.viewMode}

                groupBy={viewOptions?.groupBy?.value}
                setGroupBy={viewOptions?.groupBy?.setter}
                groupByOptions={viewOptions?.groupBy?.options}
                isGroupingDisabled={viewOptions?.groupBy?.disabled}

                sortOrder={viewOptions?.sortOrder?.value}
                setSortOrder={viewOptions?.sortOrder?.setter}
                sortOptions={viewOptions?.sortOrder?.options}

                columnOptions={viewOptions?.columnOptions}
                visibleColumns={viewOptions?.visibleColumns}
                setVisibleColumns={viewOptions?.setVisibleColumns}
                columnOrder={viewOptions?.columnOrder}
                setColumnOrder={viewOptions?.setColumnOrder}
                defaultVisibleColumns={viewOptions?.defaultVisibleColumns}
                defaultColumnOrder={viewOptions?.defaultColumnOrder}
                defaultSortOrder={viewOptions?.defaultSortOrder}
                
                showUsdEquivalent={viewOptions?.showUsdEquivalent}
                setShowUsdEquivalent={viewOptions?.setShowUsdEquivalent}
                
                size={searchAndViewSize}
              />
            </Col>
          )}
          {rightActions.length > 0 && (
            <Col flex="none" style={{ marginLeft: 8 }}>
              <Space size="small">
                {rightActions.map((action, index) => (
                  <React.Fragment key={index}>
                    {action}
                  </React.Fragment>
                ))}
              </Space>
            </Col>
          )}
        </Row>
      )}
    </>
  );
};

export default FilterBar; 