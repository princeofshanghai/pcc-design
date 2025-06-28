import React from 'react';
import { Typography, Space } from 'antd';

const { Title, Text } = Typography;

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  tagContent?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions, tagContent }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
      }}
    >
      <Space direction="vertical" size={0}>
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