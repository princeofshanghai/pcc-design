import React, { useState } from 'react';
import { Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const skuCount = product.skus.length;

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="product-list-item"
      style={{ 
        borderBottom: isLast ? 'none' : '1px solid #f0f0f0',
        backgroundColor: isHovered ? '#fafafa' : 'transparent',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigate}
    >
      <Space direction="vertical" size={2} style={{ alignItems: 'flex-start' }}>
        <Title level={4} style={{ margin: 0, fontWeight: 500, textDecoration: isHovered ? 'underline' : 'none' }}>
          {product.name}
        </Title>
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