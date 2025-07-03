import React, { useState, useMemo, useEffect } from 'react';
import { Space, Tabs } from 'antd';
import { mockProducts } from '../utils/mock-data';
import type { LOB, Status } from '../utils/types';
import { useProductFilters } from '../hooks/useProductFilters';
import PageHeader from '../components/PageHeader';
import GroupedProductList from '../components/GroupedProductList';
import ProductList from '../components/ProductList';
import type { ViewMode } from '../components/ViewOptions';
import ProductListTable from '../components/ProductListTable';
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
            <span>All LOBs</span>
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
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        statusOptions={STATUS_SELECT_OPTIONS}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categoryOptions={categoryOptions}
        groupBy={groupBy}
        setGroupBy={setGroupBy}
        groupByOptions={GROUP_BY_OPTIONS}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        sortOptions={SORT_OPTIONS}
        viewMode={viewMode}
        setViewMode={setViewMode}
        isGroupingDisabled={viewMode === 'list'}
      />

      {viewMode === 'list' ? (
        <ProductListTable products={sortedProducts} />
      ) : groupedProducts ? (
        <GroupedProductList groupedProducts={groupedProducts} />
      ) : (
        <ProductList products={sortedProducts} />
      )}
    </Space>
  );
};

export default Home; 