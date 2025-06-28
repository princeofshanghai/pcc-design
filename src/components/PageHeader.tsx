import React from 'react';
import { Typography, Space } from 'antd';
import { Box } from 'lucide-react';

const { Title, Text } = Typography;

interface PageHeaderProps {
  preTitle?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tagContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ preTitle, title, subtitle, actions, tagContent }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
      }}
    >
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
        {subtitle && <Text type="secondary">{subtitle}</Text>}
      </Space>
      {actions && <Space>{actions}</Space>}
    </div>
  );
};

export default PageHeader; 