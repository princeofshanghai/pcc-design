import React from 'react';
import { Card, Typography, Space, Tag } from 'antd';
import { Link } from 'react-router-dom';
import type { Product } from '../utils/types';
import StatusTag from './StatusTag';
import CopyableId from './CopyableId';

const { Title, Text } = Typography;

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const skuCount = product.skus.length;

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Title level={4} style={{ margin: 0 }}>
              {product.name}
            </Title>
            <StatusTag status={product.status} />
          </Space>
          <Space size="small">
            <Tag>{product.lob}</Tag>
            <Tag>{product.category}</Tag>
          </Space>
          <Space style={{ color: '#888' }} size="large">
            <CopyableId id={product.id} />
            <Text type="secondary">{skuCount} SKU{skuCount !== 1 ? 's' : ''}</Text>
          </Space>
        </Space>
      </Link>
    </Card>
  );
};

export default ProductListItem; 