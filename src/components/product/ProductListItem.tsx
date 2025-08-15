import React, { useState } from 'react';
import { Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, borderRadius, shadows } from '../../theme';
import type { Product } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import './ProductListItem.css';

const { Title, Text } = Typography;

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const skuCount = product.skus.length;
  const uniqueChannels = [...new Set(product.skus.map(sku => sku.salesChannel))];

  const handleNavigate = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div
      className="product-list-item"
      style={{
        padding: `${spacing.xxl}px ${spacing.xxxxl}px ${spacing.xxl}px ${spacing.xxxl}px`,
        border: `1px solid ${colors.gray[300]}`,
        borderRadius: `${borderRadius.lg}px`,
        backgroundColor: isHovered ? colors.gray[50] : colors.neutral.white,
        boxShadow: isHovered ? shadows.md : shadows.sm,
        cursor: 'pointer',
        transition: 'box-shadow 0.3s, background-color 0.3s',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleNavigate}
    >
      <Space direction="vertical" size={8} style={{ alignItems: 'flex-start' }}>
        <Space align="center">
          <Title level={4} style={{ margin: 0, fontWeight: 500, textDecoration: isHovered ? 'underline' : 'none' }}>
            {product.name}
          </Title>
          <StatusTag status={product.status} showLabel={false} size={16} />
        </Space>
        <div onClick={(e) => e.stopPropagation()}>
                      <CopyableId id={product.id} />
        </div>

        {/* Show channel pills */}
        {uniqueChannels.length > 0 && (
          <div style={{ marginTop: '8px' }}>
            <Space size={4} wrap>
              {uniqueChannels.map(channel => (
                <SalesChannelDisplay key={channel} channel={channel} />
              ))}
            </Space>
          </div>
        )}
      </Space>

      <Space size={24} align="center">
        <Text>{skuCount} SKU{skuCount !== 1 ? 's' : ''}</Text>
      </Space>
    </div>
  );
};

export default ProductListItem; 