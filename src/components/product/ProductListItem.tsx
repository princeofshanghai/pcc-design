import React, { useState } from 'react';
import { Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import LobTag from '../attributes/LobTag';
import FolderTag from '../attributes/FolderTag';
import './ProductListItem.css';

const { Title, Text } = Typography;

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
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
        padding: '20px 32px 20px 24px',
        border: '1px solid #e8e8e8',
        borderRadius: '8px',
        backgroundColor: isHovered ? '#fafafa' : '#ffffff',
        boxShadow: isHovered ? '0 2px 8px rgba(0, 0, 0, 0.09)' : '0 1px 2px rgba(0, 0, 0, 0.03)',
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
      <Space direction="vertical" size={4} style={{ alignItems: 'flex-start' }}>
        <Space align="center">
          <Title level={4} style={{ margin: 0, fontWeight: 500, textDecoration: isHovered ? 'underline' : 'none' }}>
            {product.name}
          </Title>
          <StatusTag status={product.status} showLabel={false} size={16} />
        </Space>
        <Space>
          <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'rgba(0, 0, 0, 0.88)' }}>{product.id}</span>
          <CopyableId id={product.id} showId={false} />
        </Space>
        {/* Always show LOB and Folder tags */}
        <div style={{ marginTop: '8px' }}>
          <Space size={0}>
            <LobTag lob={product.lob} />
            <FolderTag folder={product.folder} lob={product.lob} />
          </Space>
        </div>
      </Space>

      <Space size={24} align="center">
        <Text>{skuCount} SKU{skuCount !== 1 ? 's' : ''}</Text>
      </Space>
    </div>
  );
};

export default ProductListItem; 