import React from 'react';
import { Collapse, Typography, theme } from 'antd';
import type { Product } from '../../utils/types';
import ProductListItem from './ProductListItem';
import { toSentenceCase } from '../../utils/formatters';

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
            <div>
              <Text style={{ 
                fontSize: token.fontSizeHeading3, 
                fontWeight: 500,
                display: 'block',
                lineHeight: 1.2
              }}>
                {toSentenceCase(groupName)}
              </Text>
              <Text 
                type="secondary" 
                style={{ 
                  fontSize: token.fontSizeSM,
                  display: 'block',
                  marginTop: '2px'
                }}
              >
                {products.length === 1 ? '1 product' : `${products.length} products`}
              </Text>
            </div>
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