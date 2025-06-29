import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

interface DetailSectionProps {
  title: React.ReactNode;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  noBodyPadding?: boolean;
}

const DetailSection: React.FC<DetailSectionProps> = ({
  title,
  subtitle,
  actions,
  children,
  noBodyPadding = false,
}) => {
  const cardTitle = (
    <div>
      <Title level={5} style={{ margin: 0 }}>
        {title}
      </Title>
      {subtitle && (
        <Text type="secondary" style={{ fontWeight: 'normal' }}>
          {subtitle}
        </Text>
      )}
    </div>
  );

  return (
    <Card
      title={cardTitle}
      extra={actions}
      headStyle={subtitle ? { paddingTop: '12px', paddingBottom: '12px' } : {}}
      bodyStyle={noBodyPadding ? { paddingLeft: 0, paddingRight: 0 } : {}}
      style={{ boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)' }}
    >
      {children}
    </Card>
  );
};

export default DetailSection; 