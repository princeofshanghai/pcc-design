import React, { useState, useMemo } from 'react';
import { Row, Col, Space } from 'antd';
import ProductListItem from '../components/ProductListItem';
import { mockProducts } from '../utils/mock-data';
import type { Product, LOB, Status } from '../utils/types';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';
import PageHeader from '../components/PageHeader';

// Helper to convert TypeScript union types into string arrays for dropdowns
const LOB_OPTIONS: LOB[] = ['LTS', 'LMS', 'LSS', 'Premium'];
const STATUS_OPTIONS: Status[] = ['Active', 'Legacy', 'Retired'];
const CATEGORY_OPTIONS: string[] = [...new Set(mockProducts.map(p => p.category))];

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lobFilter, setLobFilter] = useState<LOB | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

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

    return products;
  }, [searchQuery, lobFilter, statusFilter, categoryFilter]);

  const productCount = filteredProducts.length;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        title="Product Catalog"
        subtitle={`${productCount} product${productCount !== 1 ? 's' : ''} found`}
      />

      <Row gutter={[16, 16]} align="bottom">
        <Col flex="auto">
          <SearchBar
            placeholder="Search by name, ID, or category..."
            onChange={setSearchQuery}
          />
        </Col>
        <Col>
          <FilterDropdown
            label="LOB"
            placeholder="Filter by LOB"
            options={LOB_OPTIONS}
            onChange={(value) => setLobFilter((value as LOB) ?? null)}
          />
        </Col>
        <Col>
          <FilterDropdown
            label="Status"
            placeholder="Filter by Status"
            options={STATUS_OPTIONS}
            onChange={(value) => setStatusFilter((value as Status) ?? null)}
          />
        </Col>
        <Col>
          <FilterDropdown
            label="Category"
            placeholder="Filter by Category"
            options={CATEGORY_OPTIONS}
            onChange={(value) => setCategoryFilter(value ?? null)}
          />
        </Col>
      </Row>

      <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
        {filteredProducts.map((product: Product, index: number) => (
          <ProductListItem
            key={product.id}
            product={product}
            isLast={index === filteredProducts.length - 1}
          />
        ))}
      </div>
    </Space>
  );
};

export default Home; 