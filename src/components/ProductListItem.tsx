import React, { useState } from 'react';
import { Typography, Space, Divider } from 'antd';
import { Link } from 'react-router-dom';
import type { Product } from '../utils/types';
import StatusTag from './StatusTag';
import CopyableId from './CopyableId';

const { Title, Text } = Typography;

interface ProductListItemProps {
  product: Product;
  isLast?: boolean;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, isLast = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const skuCount = product.skus.length;

  const linkStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr) auto',
    gap: '24px',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
    backgroundColor: isHovered ? '#fafafa' : 'transparent',
    transition: 'background-color 0.2s ease',
    textDecoration: 'none',
    color: 'inherit',
  };

  return (
    <Link
      to={`/product/${product.id}`}
      style={linkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Space direction="vertical" size={0} style={{ alignItems: 'flex-start' }}>
        <Space align="center">
          <Title level={4} style={{ margin: 0, fontWeight: 500 }}>
            {product.name}
          </Title>
          <CopyableId id={product.id} />
        </Space>
        <Text type="secondary">{skuCount} SKU{skuCount !== 1 ? 's' : ''}</Text>
      </Space>

      <Space direction="vertical" size={0}>
        <Text>{product.lob}</Text>
        <Text>{product.category}</Text>
      </Space>

      <StatusTag status={product.status} />
    </Link>
  );
};

export default ProductListItem; 