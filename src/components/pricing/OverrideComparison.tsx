import React from 'react';

interface OverrideComparisonProps {
  skuValue: string | React.ReactNode;
  productValue: string | React.ReactNode;
  style?: React.CSSProperties;
}

const OverrideComparison: React.FC<OverrideComparisonProps> = ({ 
  skuValue, 
  productValue, 
  style = {} 
}) => (
  <div style={{ 
    fontSize: '14px', 
    color: 'rgba(0, 0, 0, 0.65)', 
    marginTop: '4px',
    ...style 
  }}>
    <strong>SKU:</strong> {skuValue} | <strong>Product Default:</strong> {productValue}
  </div>
);

export default OverrideComparison; 