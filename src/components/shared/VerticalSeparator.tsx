import React from 'react';
import { theme } from 'antd';

const VerticalSeparator: React.FC = () => {
  const { token } = theme.useToken();
  
  return (
    <div style={{ 
      color: token.colorTextTertiary, // Darker than colorBorder, lighter than colorTextSecondary
      fontSize: '12px', // Smaller than the original 14px
      lineHeight: '1',   // Tighter line height
      margin: '0 6px',   // Horizontal spacing
      display: 'flex',
      alignItems: 'center'
    }}>
      |
    </div>
  );
};

export default VerticalSeparator;
