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
    <Text style={{ fontSize: '13px', letterSpacing: '0.1px', color: token.colorTextSecondary, display: 'flex', alignItems: 'center', gap: '4px' }}>
      {toSentenceCase(label)}
      {tooltip && (
        <Tooltip title={tooltip}>
          <Info size={13} strokeWidth={2.5} style={{ color: token.colorTextTertiary, flexShrink: 0 }} />
        </Tooltip>
      )}
    </Text>
  );

  if (layout === 'horizontal') {
    return (
      <Row align="top" style={{ paddingBottom: '8px' }}>
        <Col span={4}>{labelContent}</Col>
        <Col span={20}>
          <div style={{ 
            fontSize: '13px',
            maxWidth: '600px', // Limit width to encourage earlier wrapping
            wordWrap: 'break-word', // Ensure long words break properly
            overflowWrap: 'break-word' // Modern CSS property for better word breaking
          }}>
            {children}
          </div>
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