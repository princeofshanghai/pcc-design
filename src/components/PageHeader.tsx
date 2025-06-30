import React from 'react';
import { Typography, Space, theme, Button } from 'antd';
import { Box, ArrowLeft } from 'lucide-react';

const { Title, Text } = Typography;

interface PageHeaderProps {
  preTitle?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  tagContent?: React.ReactNode;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ preTitle, title, subtitle, tagContent, onBack, actions }) => {
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
          <Button 
            shape="circle" 
            icon={<ArrowLeft size={16} />} 
            onClick={onBack}
          />
        )}
        <Space direction="vertical" size={2}>
          {preTitle && (
            <div style={{ color: token.colorTextSecondary, textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px', fontWeight: 500 }}>
              {preTitle}
            </div>
          )}
          <Space align="center" size="middle">
            <Title level={1} style={{ margin: 0, fontWeight: 500 }}>
              {title}
            </Title>
            {tagContent}
          </Space>
          {subtitle && <div style={{ marginTop: '4px' }}><Text type="secondary">{subtitle}</Text></div>}
        </Space>
      </Space>
      {actions && <Space>{actions}</Space>}
    </div>
  );
};

export default PageHeader; 