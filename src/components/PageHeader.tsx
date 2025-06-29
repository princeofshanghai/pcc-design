import React from 'react';
import { Typography, Space } from 'antd';
import { Box, ChevronLeft } from 'lucide-react';

const { Title, Text } = Typography;

interface PageHeaderProps {
  preTitle?: string;
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  tagContent?: React.ReactNode;
  onBack?: () => void;
}

const PageHeader: React.FC<PageHeaderProps> = ({ preTitle, title, subtitle, actions, tagContent, onBack }) => {
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
          <div onClick={onBack} style={{ cursor: 'pointer', marginTop: '8px' }}>
            <ChevronLeft size={24} style={{ color: 'var(--ant-color-text-secondary)' }} />
          </div>
        )}
        <Space direction="vertical" size={2}>
          {preTitle && (
            <Space align="center" size={4}>
              <Box size={14} style={{ color: 'var(--ant-color-text-secondary)' }} />
              <Text type="secondary" style={{ textTransform: 'uppercase', fontSize: '12px', letterSpacing: '0.5px', fontWeight: 500 }}>
                {preTitle}
              </Text>
            </Space>
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