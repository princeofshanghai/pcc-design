import React from 'react';
import { Typography, Row, Col, Tooltip, theme } from 'antd';
import { Info } from 'lucide-react';
import { toSentenceCase } from '../../utils/formatters';

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
  const { token } = theme.useToken();
  
  if (children === undefined || children === null || children === '') {
    return null;
  }

  const labelContent = (
    <Text style={{ fontSize: '13px', letterSpacing: '0.1px', color: token.colorTextSecondary }}>
      {toSentenceCase(label)}
      {tooltip && (
        <Tooltip title={tooltip}>
          <Info size={14} style={{ marginLeft: '4px', color: token.colorTextTertiary }} />
        </Tooltip>
      )}
    </Text>
  );

  if (layout === 'horizontal') {
    return (
      <Row align="top" style={{ paddingBottom: '8px' }}>
        <Col span={4}>{labelContent}</Col>
        <Col span={20}>
          <div style={{ fontSize: '13px' }}>{children}</div>
        </Col>
      </Row>
    );
  }
  
  return ( // Vertical layout
    <div style={{ marginBottom: '8px' }}>
      {labelContent}
      <div style={{ marginTop: '2px', fontSize: '13px' }}>
        {children}
      </div>
    </div>
  );
};

export default AttributeDisplay; 