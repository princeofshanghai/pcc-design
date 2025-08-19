import React, { useState } from 'react';
import { Row, Col, Space, Button, Drawer, Badge } from 'antd';
import { ListFilter } from 'lucide-react';
import { zIndex } from '../../theme';
import SearchBar from './SearchBar';
import FilterDropdown, { type SelectOption } from './FilterDropdown';
import ViewOptions, { type ViewMode } from './ViewOptions';
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
    viewMode?: {
      value: ViewMode;
      setter: (mode: ViewMode) => void;
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
  };
  // New prop to control how filters are displayed
  displayMode?: 'inline' | 'drawer';
  // New prop to control filter size
  filterSize?: 'small' | 'middle' | 'large';
  // New prop to control search bar and view options size
  searchAndViewSize?: 'small' | 'middle' | 'large';
  // New prop for custom action buttons
  actions?: React.ReactNode[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  filters = [],
  onClearAll,
  viewOptions,
  displayMode = 'drawer', // Default to current behavior
  filterSize = 'middle', // Default filter size
  searchAndViewSize = 'middle', // Default search and view options size
  actions = [], // Default to empty array
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const shouldRenderViewOptions = viewOptions?.groupBy || viewOptions?.sortOrder || viewOptions?.columnOptions;
  const viewMode = viewOptions?.viewMode;

  const activeFilterCount = filters.filter(f => 
    f.multiSelect ? (f.multiValue?.length ?? 0) > 0 : f.value != null
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
          <div className={displayMode === 'inline' ? 'pill-shaped-filter' : ''}>
            <FilterDropdown
              placeholder={toSentenceCase(filter.placeholder)}
              options={filter.options}
              multiSelect={filter.multiSelect}
              value={filter.multiSelect ? undefined : filter.value}
              onChange={filter.multiSelect ? undefined : filter.onChange}
              multiValue={filter.multiSelect ? filter.multiValue : undefined}
              onMultiChange={filter.multiSelect ? filter.onMultiChange : undefined}
              size={displayMode === 'inline' ? filterSize : 'large'}
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
          </div>
        </Space>
      ))}
      {displayMode === 'inline' && hasFilters && activeFilterCount > 0 && (
        <Button 
          type="link" 
          danger
          onClick={handleClearAll} 
          className="pill-shaped-clear-button"
          style={{ padding: '0 16px' }}
        >
          Clear All
        </Button>
      )}
    </Space>
  );

  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col flex="auto">
          {search && (
            <SearchBar
              placeholder={toSentenceCase(search.placeholder)}
              onChange={search.onChange}
              style={{ ...search.style, width: '100%' }}
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

            {(shouldRenderViewOptions || viewMode) && (
              <ViewOptions 
                viewMode={viewMode?.value}
                setViewMode={viewMode?.setter}
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
      {displayMode === 'inline' && hasFilters && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            {renderFilters()}
          </Col>
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
                danger
                onClick={handleClearAll} 
                disabled={activeFilterCount === 0}
                style={{ padding: 0 }}
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