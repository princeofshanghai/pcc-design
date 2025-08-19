import React from 'react';
import { Typography, theme } from 'antd';
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
  const { token } = theme.useToken();
  
  return (
    <div style={{
      background: token.colorBgContainer,
      borderTop: `1px solid ${token.colorBorderSecondary}`,
      borderBottom: `1px solid ${token.colorBorderSecondary}`,
      borderRadius: 0,
      overflow: 'hidden',
      marginTop: '16px'
    }}>
      <div className={`detail-section-header ${subtitle ? 'with-subtitle' : ''}`}>
        <div className="detail-section-title">
          <Title level={5} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && (
            <Text style={{ fontWeight: 'normal', color: token.colorTextSecondary }}>
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