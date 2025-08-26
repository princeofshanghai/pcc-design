import React, { useState } from 'react';
import { Row, Col, Space, Button, Drawer, Badge, theme } from 'antd';
import { ListFilter } from 'lucide-react';
import { zIndex } from '../../theme';
import SearchBar from './SearchBar';
import FilterDropdown, { type SelectOption } from './FilterDropdown';
import CustomFilterButton from './CustomFilterButton';
import ViewOptions from './ViewOptions';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { toSentenceCase } from '../../utils/formatters/text';
import './DrawerTitle.css';

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
  const shouldRenderViewOptions = viewOptions?.groupBy || viewOptions?.sortOrder || viewOptions?.columnOptions;

  const activeFilterCount = filters.filter(f => 
    !f.excludeFromClearAll && (f.multiSelect ? (f.multiValue?.length ?? 0) > 0 : f.value != null)
  ).length;

  const showDrawer = () => setDrawerVisible(true);
  const hideDrawer = () => setDrawerVisible(false);

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  const hasFilters = filters.length > 0;

  // Component to render filters (can be used inline or in drawer)
  const renderFilters = () => (
    <Space direction={displayMode === 'inline' ? 'horizontal' : 'vertical'} 
           style={{ width: '100%' }} 
           size={displayMode === 'inline' ? 6 : 32}
           wrap={displayMode === 'inline'}>
      {filters.map((filter, index) => (
        <Space direction={displayMode === 'inline' ? 'horizontal' : 'vertical'} 
               style={displayMode === 'inline' ? {} : { width: '100%' }} 
               key={index}
               size={displayMode === 'inline' ? 8 : 8}>
          {displayMode === 'drawer' && (
            <div style={{ fontWeight: 500 }}>{toSentenceCase(filter.placeholder.replace('All ', ''))}</div>
          )}
          <div>
            {useCustomFilters ? (
              <CustomFilterButton
                placeholder={toSentenceCase(filter.placeholder)}
                options={filter.options}
                multiSelect={filter.multiSelect}
                value={filter.multiSelect ? undefined : filter.value}
                onChange={filter.multiSelect ? undefined : filter.onChange}
                multiValue={filter.multiSelect ? filter.multiValue : undefined}
                onMultiChange={filter.multiSelect ? filter.onMultiChange : undefined}
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
              />
            ) : (
              <FilterDropdown
                placeholder={toSentenceCase(filter.placeholder)}
                options={filter.options}
                multiSelect={filter.multiSelect}
                value={filter.multiSelect ? undefined : filter.value}
                onChange={filter.multiSelect ? undefined : filter.onChange}
                multiValue={filter.multiSelect ? filter.multiValue : undefined}
                onMultiChange={filter.multiSelect ? filter.onMultiChange : undefined}
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
      ))}
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