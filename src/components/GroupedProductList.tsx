import React from 'react';
import { Collapse, Typography } from 'antd';
import type { Product } from '../utils/types';
import ProductListItem from './ProductListItem';

const { Panel } = Collapse;
const { Text } = Typography;

interface GroupedProductListProps {
  groupedProducts: Record<string, Product[]>;
}

const GroupedProductList: React.FC<GroupedProductListProps> = ({ groupedProducts }) => {
  return (
    <div style={{ border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
      <Collapse defaultActiveKey={Object.keys(groupedProducts)} ghost>
        {Object.entries(groupedProducts).map(([groupName, products]) => (
          <Panel 
            header={
              <Text strong>
                {groupName} <Text type="secondary">({products.length})</Text>
              </Text>
            } 
            key={groupName}
          >
            {products.map((product, index) => (
              <ProductListItem 
                key={product.id}
                product={product} 
                isLast={index === products.length - 1}
              />
            ))}
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default GroupedProductList; 