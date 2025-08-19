import React from 'react';
import { Typography, theme } from 'antd';

const { Text } = Typography;

interface SecondaryTextProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * SecondaryText component that automatically uses the correct Tailwind secondary color
 * Use this instead of <Text type="secondary"> to ensure consistent colors across the app
 */
const SecondaryText: React.FC<SecondaryTextProps> = ({ 
  children, 
  style = {},
  className 
}) => {
  const { token } = theme.useToken();
  
  return (
    <Text 
      style={{ 
        color: token.colorTextSecondary,
        ...style 
      }}
      className={className}
    >
      {children}
    </Text>
  );
};

export default SecondaryText;
