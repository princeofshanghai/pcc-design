import React, { useState } from 'react';
import { Row, Col, Space, Button, Drawer, Badge } from 'antd';
import { ListFilter } from 'lucide-react';
import { zIndex } from '../theme';
import SearchBar from './SearchBar';
import FilterDropdown, { type SelectOption } from './FilterDropdown';
import ViewOptions from './ViewOptions';
import ViewToggle, { type ViewMode } from './ViewToggle';

export interface FilterConfig {
  placeholder: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: any) => void;
  style?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  showOptionTooltip?: boolean;
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
  };
  viewMode?: {
    value: ViewMode;
    setter: (mode: ViewMode) => void;
  };
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  filters = [],
  onClearAll,
  viewOptions,
  viewMode,
}) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const shouldRenderViewOptions = viewOptions?.groupBy || viewOptions?.sortOrder;

  const activeFilterCount = filters.filter(f => f.value != null).length;

  const showDrawer = () => setDrawerVisible(true);
  const hideDrawer = () => setDrawerVisible(false);

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
  };

  const hasFilters = filters.length > 0;

  return (
    <>
      <Row gutter={[16, 16]} justify="space-between" align="middle">
        <Col flex="auto">
          {search && (
            <SearchBar
              placeholder={search.placeholder}
              onChange={search.onChange}
              style={{ ...search.style, width: '100%' }}
              size="large"
            />
          )}
        </Col>
        <Col>
          <Space>
            {hasFilters && (
               <Badge count={activeFilterCount}>
                <Button 
                  icon={<ListFilter size={16} />} 
                  onClick={showDrawer}
                  size="large"
                >
                  Filters
                </Button>
              </Badge>
            )}

            {shouldRenderViewOptions && viewOptions && (
              <ViewOptions 
                groupBy={viewOptions.groupBy?.value}
                setGroupBy={viewOptions.groupBy?.setter}
                groupByOptions={viewOptions.groupBy?.options}
                isGroupingDisabled={viewOptions.groupBy?.disabled}

                sortOrder={viewOptions.sortOrder?.value}
                setSortOrder={viewOptions.sortOrder?.setter}
                sortOptions={viewOptions.sortOrder?.options}
              />
            )}

            {viewMode && (
              <ViewToggle
                viewMode={viewMode.value}
                onChange={viewMode.setter}
              />
            )}
          </Space>
        </Col>
      </Row>

      <Drawer
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 500 }}>Filters</span>
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
        <Space direction="vertical" style={{ width: '100%' }}>
          {filters.map((filter, index) => (
            <Space direction="vertical" style={{ width: '100%' }} key={index}>
              <div style={{ fontWeight: 500 }}>{filter.placeholder.replace('All ', '')}</div>
              <FilterDropdown
                placeholder={filter.placeholder}
                options={filter.options}
                value={filter.value}
                onChange={filter.onChange}
                size="large"
                style={{ width: '100%', ...(filter.style || {}) }}
                dropdownStyle={filter.dropdownStyle}
                showOptionTooltip={filter.showOptionTooltip}
              />
            </Space>
          ))}
        </Space>
      </Drawer>
    </>
  );
};

export default FilterBar; 