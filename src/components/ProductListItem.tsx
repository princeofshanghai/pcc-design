import React, { useState } from 'react';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import type { Product } from '../utils/types';
import StatusTag from './StatusTag';
import CopyableId from './CopyableId';
import './ProductListItem.css';

const { Title, Text } = Typography;

interface ProductListItemProps {
  product: Product;
  isLast?: boolean;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, isLast = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const skuCount = product.skus.length;

  return (
    <div
      className="product-list-item"
      style={{ 
        borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
        backgroundColor: isHovered ? '#fafafa' : 'transparent',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Space direction="vertical" size={2} style={{ alignItems: 'flex-start' }}>
        <Link to={`/product/${product.id}`} className="product-name-link">
          <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
            {product.name}
          </Title>
        </Link>
        <Text type="secondary">{`${product.lob} / ${product.category}`}</Text>
        <div style={{ marginTop: 8 }}>
          <CopyableId id={product.id} />
        </div>
      </Space>

      <Space size={24}>
        <Text>{skuCount} SKU{skuCount !== 1 ? 's' : ''}</Text>
        <StatusTag status={product.status} />
      </Space>
    </div>
  );
};

export default ProductListItem; 