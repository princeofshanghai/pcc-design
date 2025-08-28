import React, { useState } from 'react';
import { Row, Col, Space, Button, Drawer, Badge, theme, Dropdown } from 'antd';
import { ListFilter, CirclePlus } from 'lucide-react';
import { zIndex, TAILWIND_COLORS } from '../../theme';
import SearchBar from './SearchBar';
import FilterDropdown, { type SelectOption } from './FilterDropdown';
import CustomFilterButton from './CustomFilterButton';
import ViewOptions from './ViewOptions';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { toSentenceCase } from '../../utils/formatters/text';
import { getColumnLabel } from '../../utils/tableConfigurations';
import './DrawerTitle.css';

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
  };
  // New prop to control how filters are displayed
  displayMode?: 'inline' | 'drawer';

  // New prop to control search bar and view options size
  searchAndViewSize?: 'small' | 'middle' | 'large';
  // New prop for custom action buttons
  actions?: React.ReactNode[];
  // New prop for custom actions that appear in the inline filters row (before ViewOptions)
  inlineActions?: React.ReactNode[];
  // New prop for custom actions that appear in the inline filters row (after ViewOptions)
  rightActions?: React.ReactNode[];
  // New prop to use custom filter buttons instead of Ant Design Select
  useCustomFilters?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  filters = [],
  onClearAll,
  viewOptions,
  displayMode = 'drawer', // Default to current behavior
  searchAndViewSize = 'middle', // Default search and view options size
  actions = [], // Default to empty array
  inlineActions = [], // Default to empty array
  rightActions = [], // Default to empty array
  useCustomFilters = false, // Default to existing behavior
}) => {
  const { token } = theme.useToken();
  const [drawerVisible, setDrawerVisible] = useState(false);
  
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
  
  const shouldRenderViewOptions = viewOptions?.viewMode || viewOptions?.groupBy || viewOptions?.sortOrder || viewOptions?.columnOptions;

  const activeFilterCount = filters.filter(f => 
    !f.excludeFromClearAll && (f.multiSelect ? (f.multiValue?.length ?? 0) > 0 : f.value != null)
  ).length;

  // Separate primary and secondary filters
  const hasProgressiveDisclosure = filters.some(f => f.primary === false);
  const primaryFilters = hasProgressiveDisclosure ? 
    filters.filter(f => f.primary !== false) : 
    filters; // If no progressive disclosure, all are primary
  const secondaryFilters = hasProgressiveDisclosure ? 
    filters.filter(f => f.primary === false) : 
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

  const showDrawer = () => setDrawerVisible(true);
  const hideDrawer = () => setDrawerVisible(false);

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

  const hasFilters = filters.length > 0;

  // Component to render filters (can be used inline or in drawer)
  const renderFilters = (filtersToRender = displayMode === 'inline' ? activeInlineFilters : filters) => (
    <Space direction={displayMode === 'inline' ? 'horizontal' : 'vertical'} 
           style={{ width: '100%' }} 
           size={displayMode === 'inline' ? 6 : 32}
           wrap={displayMode === 'inline'}>
      {filtersToRender.map((filter, index) => {
        const isProvisional = provisionalFilters.includes(filter.placeholder);
        
        return (
          <Space direction={displayMode === 'inline' ? 'horizontal' : 'vertical'} 
               style={displayMode === 'inline' ? {} : { width: '100%' }} 
               key={`${filter.placeholder}-${index}`}
               size={displayMode === 'inline' ? 8 : 8}>
          {displayMode === 'drawer' && (
            <div style={{ fontWeight: 500 }}>{toSentenceCase(filter.placeholder.replace('All ', ''))}</div>
          )}
          <div data-filter-placeholder={filter.placeholder}>
            {useCustomFilters ? (
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
                size={displayMode === 'inline' ? 'middle' : 'large'}
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
                size={displayMode === 'inline' ? 'middle' : 'large'}
                style={{ 
                  width: displayMode === 'inline' ? 'auto' : '100%', 
                  minWidth: displayMode === 'inline' ? 'auto' : 140,
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
      
      {/* More filters button - only show in inline mode when there are available secondary filters */}
      {displayMode === 'inline' && availableSecondaryFilters.length > 0 && (
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
          >
            More filters
          </Button>
        </Dropdown>
      )}
      
      {displayMode === 'inline' && hasFilters && activeFilterCount > 0 && (
        <Button 
          type="link" 
          onClick={handleClearAll} 
          style={{ 
            padding: '0 16px',
            color: token.colorPrimary,
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
              style={{ ...search.style, width: '320px' }}
              size={searchAndViewSize}
            />
          )}
        </Col>
        <Col>
          <Space>
            {hasFilters && displayMode === 'drawer' && (
               <Badge count={activeFilterCount}>
                <Button 
                  icon={<ListFilter size={16} />} 
                  onClick={showDrawer}
                  size={searchAndViewSize}
                >
                  Filters
                </Button>
              </Badge>
            )}

            {shouldRenderViewOptions && displayMode === 'drawer' && (
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
                
                size={searchAndViewSize}
              />
            )}

            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action}
              </React.Fragment>
            ))}
          </Space>
        </Col>
      </Row>

      {/* Inline filters row */}
      {displayMode === 'inline' && (hasFilters || shouldRenderViewOptions) && (
        <Row style={{ marginTop: 24 }} justify="space-between" align="middle">
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

      {/* Drawer for drawer mode */}
      {displayMode === 'drawer' && (
        <Drawer
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="drawer-title-text">Filters</span>
              <Button 
                type="link" 
                onClick={handleClearAll} 
                disabled={activeFilterCount === 0}
                style={{ 
                  padding: 0,
                  color: token.colorPrimary
                }}
              >
                Clear All
              </Button>
            </div>
          }
          placement="right"
          onClose={hideDrawer}
          open={drawerVisible}
          zIndex={zIndex.drawer}
          footer={
            <div style={{ textAlign: 'right' }}>
              <Button type="default" onClick={hideDrawer}>
                Done
              </Button>
            </div>
          }
        >
          {renderFilters()}
        </Drawer>
      )}
    </>
  );
};

export default FilterBar; 