import React from 'react';
import blueTheme from '../theme';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '', 
  style = {} 
}) => {
  return (
    <div 
      className={`page-container ${className}`}
      style={{
        padding: '0',
        background: 'transparent',
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer; 