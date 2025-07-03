import React from 'react';
import { Row, Col, Space } from 'antd';
import SearchBar from './SearchBar';
import FilterDropdown, { type SelectOption } from './FilterDropdown';
import ViewOptions, { type ViewMode } from './ViewOptions';
import type { Status } from '../utils/types';

interface FilterBarProps {
  setSearchQuery: (query: string) => void;

  statusFilter: Status | null;
  setStatusFilter: (status: Status | null) => void;
  statusOptions: SelectOption[];

  categoryFilter: string | null;
  setCategoryFilter: (category: string | null) => void;
  categoryOptions: SelectOption[];
  
  groupBy: string;
  setGroupBy: (group: string) => void;
  groupByOptions: string[];

  sortOrder: string;
  setSortOrder: (order: string) => void;
  sortOptions: string[];

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  isGroupingDisabled: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  statusOptions,
  categoryFilter,
  setCategoryFilter,
  categoryOptions,
  groupBy,
  setGroupBy,
  groupByOptions,
  sortOrder,
  setSortOrder,
  sortOptions,
  viewMode,
  setViewMode,
  isGroupingDisabled,
}) => {
  return (
    <Row gutter={[16, 16]} justify="space-between" align="bottom">
      <Col>
        <SearchBar
          placeholder="Search by name, ID, or category..."
          onChange={setSearchQuery}
          style={{ width: 300 }}
          size="large"
        />
      </Col>
      <Col>
        <Space>
          <FilterDropdown
            placeholder="All statuses"
            options={statusOptions}
            value={statusFilter}
            onChange={(value) => setStatusFilter((value as Status) ?? null)}
            size="large"
            style={{ width: 180 }}
            dropdownStyle={{ minWidth: 220 }}
          />
          <FilterDropdown
            placeholder="All categories"
            options={categoryOptions}
            value={categoryFilter}
            onChange={(value) => setCategoryFilter(value ?? null)}
            size="large"
            showOptionTooltip
            style={{ width: 180 }}
            dropdownStyle={{ minWidth: 280 }}
          />
          <ViewOptions 
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            groupByOptions={groupByOptions}
            sortOptions={sortOptions}
            viewMode={viewMode}
            setViewMode={setViewMode}
            isGroupingDisabled={isGroupingDisabled}
          />
        </Space>
      </Col>
    </Row>
  );
};

export default FilterBar; 