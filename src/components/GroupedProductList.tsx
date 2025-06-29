import React from 'react';
import { Collapse, Typography, theme, Tag, Space } from 'antd';
import type { Product } from '../utils/types';
import ProductListItem from './ProductListItem';

const { Panel } = Collapse;
const { Text } = Typography;

interface GroupedProductListProps {
  groupedProducts: Record<string, Product[]>;
}

const GroupedProductList: React.FC<GroupedProductListProps> = ({ groupedProducts }) => {
  const { token } = theme.useToken();

  return (
    <Collapse defaultActiveKey={Object.keys(groupedProducts)}>
      {Object.entries(groupedProducts).map(([groupName, products]) => (
        <Panel 
          header={
            <Space>
              <Text style={{ fontSize: token.fontSizeHeading3, fontWeight: 500 }}>
                {groupName}
              </Text>
              <Tag style={{ borderRadius: '12px' }}>{products.length}</Tag>
            </Space>
          } 
          key={groupName}
        >
          <div style={{
            paddingTop: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {products.map((product) => (
              <ProductListItem 
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </Panel>
      ))}
    </Collapse>
  );
};

export default GroupedProductList; 