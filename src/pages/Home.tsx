import React, { useState, useMemo, useEffect } from 'react';
import { Space, Tabs } from 'antd';
import { mockProducts } from '../utils/mock-data';
import type { LOB, Status } from '../utils/types';
import { useProductFilters } from '../hooks/useProductFilters';
import PageHeader from '../components/PageHeader';
import GroupedProductList from '../components/GroupedProductList';
import ProductList from '../components/ProductList';
import type { ViewMode } from '../components/ViewToggle';
import ProductListTable from '../components/ProductListTable';
import GroupedProductListTable from '../components/GroupedProductListTable';
import CountTag from '../components/CountTag';
import FilterBar from '../components/FilterBar';
import type { SelectOption } from '../components/FilterDropdown';

const LOB_OPTIONS: LOB[] = [...new Set(mockProducts.map(p => p.lob))];
const STATUS_OPTIONS: Status[] = ['Active', 'Legacy', 'Retired'];
const GROUP_BY_OPTIONS = ['None', 'LOB', 'Status', 'Category'];
const SORT_OPTIONS = ['None', 'Name (A-Z)', 'Name (Z-A)'];


const STATUS_SELECT_OPTIONS: SelectOption[] = STATUS_OPTIONS.map(status => ({ label: status, value: status }));

const Home: React.FC = () => {
  const [lobFilter, setLobFilter] = useState<LOB | null>(null);
  const [activeLobTab, setActiveLobTab] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

  const {
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    groupBy,
    setGroupBy,
    sortOrder,
    setSortOrder,
    sortedProducts,
    groupedProducts,
    productCount,
    categoryOptions,
  } = useProductFilters(mockProducts, lobFilter);

  const lobCounts = useMemo(() => {
    const counts: Record<string, number> = { All: mockProducts.length };
    LOB_OPTIONS.forEach(lob => {
      counts[lob] = mockProducts.filter(p => p.lob === lob).length;
    });
    return counts;
  }, []);

  const lobTabOptions = useMemo(() => {
    return [
      { 
        key: 'All', 
        label: (
          <Space>
            <span>All</span>
            <CountTag count={lobCounts.All} />
          </Space>
        )
      },
      ...LOB_OPTIONS.map(lob => ({ 
        key: lob, 
        label: (
          <Space>
            <span>{lob}</span>
            <CountTag count={lobCounts[lob]} />
          </Space>
        )
      }))
    ];
  }, [lobCounts]);

  useEffect(() => {
    if (viewMode === 'list') {
      setGroupBy('None');
    }
  }, [viewMode, setGroupBy]);

  const handleLobChange = (key: string) => {
    setActiveLobTab(key);
    setLobFilter(key === 'All' ? null : (key as LOB));
    setCategoryFilter(null);
  };

  const clearAllProductFilters = () => {
    setStatusFilter(null);
    setCategoryFilter(null);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        title="Product Catalog"
        subtitle={`${productCount} product${productCount !== 1 ? 's' : ''} found`}
      />

      <Tabs
        activeKey={activeLobTab}
        onChange={handleLobChange}
        items={lobTabOptions}
      />

      <FilterBar
        search={{
          placeholder: "Search by name, ID, or category...",
          onChange: setSearchQuery,
        }}
        onClearAll={clearAllProductFilters}
        filters={[
          {
            placeholder: "All statuses",
            options: STATUS_SELECT_OPTIONS,
            value: statusFilter,
            onChange: (value) => setStatusFilter((value as Status) ?? null),
            style: { width: 180 },
            dropdownStyle: { minWidth: 220 },
          },
          {
            placeholder: "All categories",
            options: categoryOptions,
            value: categoryFilter,
            onChange: (value) => setCategoryFilter(value ?? null),
            showOptionTooltip: true,
            style: { width: 180 },
            dropdownStyle: { minWidth: 280 },
          },
        ]}
        viewOptions={{
          groupBy: {
            value: groupBy,
            setter: setGroupBy,
            options: GROUP_BY_OPTIONS,
          },
          sortOrder: {
            value: sortOrder,
            setter: setSortOrder,
            options: SORT_OPTIONS,
          },
        }}
        viewMode={{
          value: viewMode,
          setter: setViewMode,
        }}
      />

      {viewMode === 'list' ? (
        groupedProducts ? (
          <GroupedProductListTable groupedProducts={groupedProducts} />
        ) : (
          <ProductListTable products={sortedProducts} />
        )
      ) : groupedProducts ? (
        <GroupedProductList groupedProducts={groupedProducts} />
      ) : (
        <ProductList products={sortedProducts} />
      )}
    </Space>
  );
};

export default Home; 