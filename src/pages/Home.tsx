import React from 'react';
import { Typography, List } from 'antd';
import ProductListItem from '../components/ProductListItem';
import { mockProducts } from '../utils/mock-data';

const { Title } = Typography;

const Home: React.FC = () => {
  return (
    <div>
      <Title level={2}>Product Catalog</Title>
      <List
        itemLayout="vertical"
        dataSource={mockProducts}
        renderItem={(product) => <ProductListItem product={product} />}
      />
    </div>
  );
};

export default Home; 