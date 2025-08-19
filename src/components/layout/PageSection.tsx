import React from 'react';
import { Typography, theme } from 'antd';

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
  const { token } = theme.useToken();
  
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
            <Text style={{ fontWeight: 'normal', marginTop: '8px', display: 'block', color: token.colorTextSecondary }}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      
      {/* Divider line below section header */}
      <div style={{ 
        width: '100%',
        borderBottom: `1px solid ${token.colorBorder}`,
        marginBottom: '16px'
      }} />
      
      {children}
    </div>
  );
};

export default PageSection; 