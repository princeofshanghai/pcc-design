import React from 'react';
import { Typography, Row, Col } from 'antd';
import { toSentenceCase } from '../utils/formatting';

const { Text } = Typography;

interface AttributeDisplayProps {
  label: string;
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal';
}

const AttributeDisplay: React.FC<AttributeDisplayProps> = ({ label, children, layout = 'vertical' }) => {
  if (children === undefined || children === null || children === '') {
    return null;
  }

  if (layout === 'horizontal') {
    return (
      <Row align="top" style={{ paddingBottom: '12px' }}>
        <Col span={8}>
          <Text type="secondary" style={{ fontSize: '14px', letterSpacing: '0.1px' }}>
            {toSentenceCase(label)}
          </Text>
        </Col>
        <Col span={16}>
          <div style={{ fontSize: '14px' }}>
            {children}
          </div>
        </Col>
      </Row>
    );
  }
  
  return ( // Vertical layout
    <div style={{ marginBottom: '8px' }}>
      <Text type="secondary" style={{ fontSize: '14px', letterSpacing: '0.1px' }}>
        {toSentenceCase(label)}
      </Text>
      <div style={{ marginTop: '2px', fontSize: '14px' }}>
        {children}
      </div>
    </div>
  );
};

export default AttributeDisplay; 