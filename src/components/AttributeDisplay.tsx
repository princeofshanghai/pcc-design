import React from 'react';
import { Typography } from 'antd';

const { Text } = Typography;

interface AttributeDisplayProps {
  label: string;
  children: React.ReactNode;
}

const AttributeDisplay: React.FC<AttributeDisplayProps> = ({ label, children }) => {
  if (children === undefined || children === null || children === '') {
    return null;
  }
  
  return (
    <div>
      <Text type="secondary" style={{ fontSize: '14px', letterSpacing: '0.1px' }}>
        {label}
      </Text>
      <div style={{ marginTop: '2px', fontSize: '14px' }}>
        {children}
      </div>
    </div>
  );
};

export default AttributeDisplay; 