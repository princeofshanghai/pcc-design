import React from 'react';
import { Row, Col, Space } from 'antd';
import SearchBar from './SearchBar';
import FilterDropdown, { type SelectOption } from './FilterDropdown';
import ViewOptions, { type ViewMode } from './ViewOptions';

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
  };
}

const FilterBar: React.FC<FilterBarProps> = ({
  search,
  filters = [],
  viewOptions,
}) => {
  const shouldRenderViewOptions = viewOptions?.groupBy || viewOptions?.sortOrder || viewOptions?.viewMode;

  return (
    <Row gutter={[16, 16]} justify="space-between" align="bottom">
      <Col>
        {search && (
          <SearchBar
            placeholder={search.placeholder}
            onChange={search.onChange}
            style={search.style || { width: 300 }}
            size="large"
          />
        )}
      </Col>
      <Col>
        <Space>
          {filters.map((filter, index) => (
            <FilterDropdown
              key={index}
              placeholder={filter.placeholder}
              options={filter.options}
              value={filter.value}
              onChange={filter.onChange}
              size="large"
              style={filter.style || { width: 180 }}
              dropdownStyle={filter.dropdownStyle}
              showOptionTooltip={filter.showOptionTooltip}
            />
          ))}

          {shouldRenderViewOptions && viewOptions && (
            <ViewOptions 
              groupBy={viewOptions.groupBy?.value}
              setGroupBy={viewOptions.groupBy?.setter}
              groupByOptions={viewOptions.groupBy?.options}
              isGroupingDisabled={viewOptions.groupBy?.disabled}

              sortOrder={viewOptions.sortOrder?.value}
              setSortOrder={viewOptions.sortOrder?.setter}
              sortOptions={viewOptions.sortOrder?.options}

              viewMode={viewOptions.viewMode?.value}
              setViewMode={viewOptions.viewMode?.setter}
            />
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default FilterBar; 