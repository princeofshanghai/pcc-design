import React, { useState, useMemo, useEffect } from 'react';
import { Row, Col, Space, Tabs } from 'antd';
import { mockProducts } from '../utils/mock-data';
import type { Product, LOB, Status } from '../utils/types';
import SearchBar from '../components/SearchBar';
import FilterDropdown, { type SelectOption } from '../components/FilterDropdown';
import PageHeader from '../components/PageHeader';
import GroupedProductList from '../components/GroupedProductList';
import ProductList from '../components/ProductList';
import ViewOptions, { type ViewMode } from '../components/ViewOptions';
import ProductListTable from '../components/ProductListTable';
import CountTag from '../components/CountTag';

const LOB_OPTIONS: LOB[] = [...new Set(mockProducts.map(p => p.lob))];
const STATUS_OPTIONS: Status[] = ['Active', 'Legacy', 'Retired'];
const GROUP_BY_OPTIONS = ['None', 'LOB', 'Status', 'Category'];
const SORT_OPTIONS = ['None', 'Name (A-Z)', 'Name (Z-A)'];


const STATUS_SELECT_OPTIONS: SelectOption[] = STATUS_OPTIONS.map(status => ({ label: status, value: status }));

const CATEGORY_GROUPED_OPTIONS: SelectOption[] = LOB_OPTIONS.map(lob => ({
  label: lob,
  options: [...new Set(mockProducts.filter(p => p.lob === lob).map(p => p.category))]
    .map(category => ({ label: category, value: category }))
})).filter(group => group.options.length > 0);

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lobFilter, setLobFilter] = useState<LOB | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<string>('None');
  const [sortOrder, setSortOrder] = useState<string>('None');
  const [activeLobTab, setActiveLobTab] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('card');

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
  }, [viewMode]);

  const handleLobChange = (key: string) => {
    setActiveLobTab(key);
    setLobFilter(key === 'All' ? null : (key as LOB));
    setCategoryFilter(null);
  };

  const categoryOptions = useMemo(() => {
    if (lobFilter) {
      return [...new Set(mockProducts.filter(p => p.lob === lobFilter).map(p => p.category))]
        .map(category => ({ label: category, value: category }));
    }
    return CATEGORY_GROUPED_OPTIONS;
  }, [lobFilter]);

  useEffect(() => {
    if (lobFilter) {
      const validCategories = mockProducts
        .filter(p => p.lob === lobFilter)
        .map(p => p.category);
      
      if (categoryFilter && !validCategories.includes(categoryFilter)) {
        setCategoryFilter(null);
      }
    }
  }, [lobFilter, categoryFilter]);

  const sortedProducts = useMemo(() => {
    let products = mockProducts;

    // Filtering
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.id.toLowerCase().includes(lowercasedQuery) ||
        p.category.toLowerCase().includes(lowercasedQuery)
      );
    }
    if (lobFilter) { products = products.filter(p => p.lob === lobFilter); }
    if (statusFilter) { products = products.filter(p => p.status === statusFilter); }
    if (categoryFilter) { products = products.filter(p => p.category === categoryFilter); }

    // Sorting
    products.sort((a, b) => {
      if (sortOrder === 'Name (A-Z)') { return a.name.localeCompare(b.name); }
      if (sortOrder === 'Name (Z-A)') { return b.name.localeCompare(a.name); }
      return 0;
    });

    return products;
  }, [searchQuery, lobFilter, statusFilter, categoryFilter, sortOrder]);

  const groupedProducts = useMemo(() => {
    if (groupBy === 'None') return null;
    return sortedProducts.reduce((acc, product) => {
      const key = product[groupBy.toLowerCase() as keyof Product] as string;
      if (!acc[key]) { acc[key] = []; }
      acc[key].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [sortedProducts, groupBy]);

  const productCount = sortedProducts.length;

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
              options={STATUS_SELECT_OPTIONS}
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
              groupByOptions={GROUP_BY_OPTIONS}
              sortOptions={SORT_OPTIONS}
              viewMode={viewMode}
              setViewMode={setViewMode}
              isGroupingDisabled={viewMode === 'list'}
            />
          </Space>
        </Col>
      </Row>

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