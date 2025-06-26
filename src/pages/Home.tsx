import React, { useState, useMemo } from 'react';
import { Typography, List, Row, Col, Space } from 'antd';
import ProductListItem from '../components/ProductListItem';
import { mockProducts } from '../utils/mock-data';
import type { Product, LOB, Status } from '../utils/types';
import SearchBar from '../components/SearchBar';
import FilterDropdown from '../components/FilterDropdown';

const { Title } = Typography;

// Helper to convert TypeScript union types into string arrays for dropdowns
const LOB_OPTIONS: LOB[] = ['LTS', 'LMS', 'LSS', 'Premium'];
const STATUS_OPTIONS: Status[] = ['Active', 'Legacy', 'Retired'];

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [lobFilter, setLobFilter] = useState<LOB | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);

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

    return products;
  }, [searchQuery, lobFilter, statusFilter]);

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <Title level={2}>Product Catalog</Title>
      
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
            onChange={(value) => setLobFilter(value as LOB)}
          />
        </Col>
        <Col>
          <FilterDropdown
            label="Status"
            placeholder="Filter by Status"
            options={STATUS_OPTIONS}
            onChange={(value) => setStatusFilter(value as Status)}
          />
        </Col>
      </Row>

      <List
        itemLayout="vertical"
        dataSource={filteredProducts}
        renderItem={(product: Product) => <ProductListItem product={product} />}
      />
    </Space>
  );
};

export default Home; 