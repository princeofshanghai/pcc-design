import React from 'react';
import { Typography, Row, Col, Tooltip } from 'antd';
import { Info } from 'lucide-react';
import { toSentenceCase } from '../utils/formatters';

const { Text } = Typography;

interface AttributeDisplayProps {
  label: string;
  children: React.ReactNode;
  layout?: 'vertical' | 'horizontal';
  tooltip?: string;
}

const AttributeDisplay: React.FC<AttributeDisplayProps> = ({
  label,
  children,
  layout = 'vertical',
  tooltip,
}) => {
  if (children === undefined || children === null || children === '') {
    return null;
  }

  const labelContent = (
    <Text type="secondary" style={{ fontSize: '14px', letterSpacing: '0.1px' }}>
      {toSentenceCase(label)}
      {tooltip && (
        <Tooltip title={tooltip}>
          <Info size={14} style={{ marginLeft: '4px', color: 'rgba(0, 0, 0, 0.45)' }} />
        </Tooltip>
      )}
    </Text>
  );

  if (layout === 'horizontal') {
    return (
      <Row align="top" style={{ paddingBottom: '12px' }}>
        <Col span={6}>{labelContent}</Col>
        <Col span={16}>
          <div style={{ fontSize: '14px' }}>{children}</div>
        </Col>
      </Row>
    );
  }
  
  return ( // Vertical layout
    <div style={{ marginBottom: '8px' }}>
      {labelContent}
      <div style={{ marginTop: '2px', fontSize: '14px' }}>
        {children}
      </div>
    </div>
  );
};

export default AttributeDisplay; 