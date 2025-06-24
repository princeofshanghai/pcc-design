import React from 'react';
import { Typography } from 'antd';

interface PageTitleProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PageTitle: React.FC<PageTitleProps> = ({ children, className, style }) => {
  return (
    <Typography.Title level={1} className={className} style={style}>
      {children}
    </Typography.Title>
  );
};

export default PageTitle; 