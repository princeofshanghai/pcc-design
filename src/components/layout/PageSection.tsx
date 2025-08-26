import React from 'react';
import { Typography, theme } from 'antd';

const { Title, Text } = Typography;

interface PageSectionProps {
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  inlineContent?: React.ReactNode; // Content that appears inline with the title
  children: React.ReactNode;
  hideDivider?: boolean;
}

const PageSection: React.FC<PageSectionProps> = ({
  title,
  subtitle,
  actions,
  inlineContent,
  children,
  hideDivider = false,
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
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}>
            <Title level={2} style={{ margin: 0 }}>
              {title}
            </Title>
            {inlineContent && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {inlineContent}
              </div>
            )}
          </div>
          {subtitle && (
            <Text style={{ fontWeight: 'normal', marginTop: '8px', display: 'block', color: token.colorTextSecondary }}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <div>{actions}</div>}
      </div>
      
      {/* Divider line below section header - conditionally rendered */}
      {!hideDivider && (
        <div style={{ 
          width: '100%',
          borderBottom: `1px solid ${token.colorBorder}`,
          marginBottom: '16px'
        }} />
      )}
      
      {children}
    </div>
  );
};

export default PageSection; 