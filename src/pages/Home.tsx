import React, { useState, useMemo } from 'react';
import { Row, Col, Space, Divider } from 'antd';
import ProductListItem from '../components/ProductListItem';
import { mockProducts } from '../utils/mock-data';
import type { Product, LOB, Status } from '../utils/types';
import SearchBar from '../components/SearchBar';
import FilterDropdown, { type SelectOption } from '../components/FilterDropdown';
import PageHeader from '../components/PageHeader';
import GroupedProductList from '../components/GroupedProductList';

const LOB_OPTIONS: LOB[] = ['LTS', 'LMS', 'LSS', 'Premium'];
const STATUS_OPTIONS: Status[] = ['Active', 'Legacy', 'Retired'];
const GROUP_BY_OPTIONS = ['None', 'LOB', 'Status'];

const LOB_SELECT_OPTIONS: SelectOption[] = LOB_OPTIONS.map(lob => ({ label: lob, value: lob }));
const STATUS_SELECT_OPTIONS: SelectOption[] = STATUS_OPTIONS.map(status => ({ label: status, value: status }));
const GROUP_BY_SELECT_OPTIONS: SelectOption[] = GROUP_BY_OPTIONS.map(opt => ({ label: `Group by ${opt}`, value: opt }));

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

  const filteredProducts = useMemo(() => {
    let products = mockProducts;

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.id.toLowerCase().includes(lowercasedQuery) ||
        p.category.toLowerCase().includes(lowercasedQuery)
      );
    }

    if (lobFilter) {
      products = products.filter(p => p.lob === lobFilter);
    }

    if (statusFilter) {
      products = products.filter(p => p.status === statusFilter);
    }

    if (categoryFilter) {
      products = products.filter(p => p.category === categoryFilter);
    }

    // Default sort by name
    products.sort((a, b) => a.name.localeCompare(b.name));

    return products;
  }, [searchQuery, lobFilter, statusFilter, categoryFilter]);

  const groupedProducts = useMemo(() => {
    if (groupBy === 'None') {
      return null;
    }
    return filteredProducts.reduce((acc, product) => {
      const key = product[groupBy.toLowerCase() as keyof Product] as string;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [filteredProducts, groupBy]);

  const productCount = filteredProducts.length;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        title="Product Catalog"
        subtitle={`${productCount} product${productCount !== 1 ? 's' : ''} found`}
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
              placeholder="All LOBs"
              options={LOB_SELECT_OPTIONS}
              value={lobFilter}
              onChange={(value) => setLobFilter((value as LOB) ?? null)}
              size="large"
            />
            <FilterDropdown
              placeholder="All Statuses"
              options={STATUS_SELECT_OPTIONS}
              value={statusFilter}
              onChange={(value) => setStatusFilter((value as Status) ?? null)}
              size="large"
            />
            <FilterDropdown
              placeholder="All Categories"
              options={CATEGORY_GROUPED_OPTIONS}
              value={categoryFilter}
              onChange={(value) => setCategoryFilter(value ?? null)}
              size="large"
              showOptionTooltip
            />
            <FilterDropdown
              placeholder="Group by..."
              options={GROUP_BY_SELECT_OPTIONS}
              value={groupBy}
              onChange={(value) => setGroupBy(value ?? 'None')}
              size="large"
            />
          </Space>
        </Col>
      </Row>

      {groupedProducts ? (
        <GroupedProductList groupedProducts={groupedProducts} />
      ) : (
        <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
          {filteredProducts.map((product: Product, index: number) => (
            <ProductListItem
              key={product.id}
              product={product}
              isLast={index === filteredProducts.length - 1}
            />
          ))}
        </div>
      )}
    </Space>
  );
};

export default Home; 