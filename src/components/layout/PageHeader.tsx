import React from 'react';
import { Typography, Space, theme } from 'antd';
import { ArrowLeft } from 'lucide-react';

const { Title, Text } = Typography;

interface PageHeaderProps {
  icon?: React.ReactNode;
  iconSize?: number;
  entityType?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  tagContent?: React.ReactNode;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  icon, 
  iconSize = 14, 
  entityType,
  title, 
  subtitle, 
  tagContent, 
  onBack, 
  actions 
}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
      }}
    >
      <Space align="start" size="middle">
        {onBack && (
          <div 
            onClick={onBack}
            style={{
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'background-color 0.2s ease',
              color: token.colorTextSecondary,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = token.colorBgTextHover;
              e.currentTarget.style.color = token.colorText;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = token.colorTextSecondary;
            }}
          >
            <ArrowLeft size={20} />
          </div>
        )}
        <Space direction="vertical" size={4}>
          {/* Icon + Entity Type above title */}
          {(icon || entityType) && (
            <Space align="center" size={4}>
              {icon && (
                <div style={{ 
                  color: token.colorTextSecondary,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {React.cloneElement(icon as React.ReactElement, { size: iconSize } as any)}
                </div>
              )}
              {entityType && (
                <Text type="secondary" style={{ fontSize: '14px', fontWeight: 500 }}>
                  {entityType}
                </Text>
              )}
            </Space>
          )}
          
          {/* Title + Tag */}
          <Space align="center" size="middle">
            <Title level={1} style={{ margin: 0, fontWeight: 500 }}>
              {title}
            </Title>
            {tagContent}
          </Space>
          
          {/* Subtitle */}
          {subtitle && (
            <div style={{ marginTop: '4px' }}>
              {React.isValidElement(subtitle) ? (
                subtitle
              ) : (
                <Text type="secondary">{subtitle}</Text>
              )}
            </div>
          )}
        </Space>
      </Space>
      {actions && <Space>{actions}</Space>}
    </div>
  );
};

export default PageHeader; 