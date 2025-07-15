import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

interface PageSectionProps {
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

const PageSection: React.FC<PageSectionProps> = ({
  title,
  subtitle,
  actions,
  children,
}) => {
  return (
    <div style={{ width: '100%' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: subtitle ? 'flex-start' : 'center',
        marginBottom: '16px'
      }}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontWeight: 'normal' }}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </div>
  );
};

export default PageSection; 