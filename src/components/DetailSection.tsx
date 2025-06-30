import React from 'react';
import { Typography } from 'antd';
import './DetailSection.css';

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
  return (
    <div className="content-panel">
      <div className={`detail-section-header ${subtitle ? 'with-subtitle' : ''}`}>
        <div className="detail-section-title">
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" style={{ fontWeight: 'normal' }}>
              {subtitle}
            </Text>
          )}
        </div>
        {actions && <div className="detail-section-actions">{actions}</div>}
      </div>
      <div className={`detail-section-body ${noBodyPadding ? 'no-padding' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default DetailSection; 