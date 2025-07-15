import React from 'react';
import { Tag, Typography, Space, Tooltip } from 'antd';
import { FlaskConical, Info, ExternalLink } from 'lucide-react';

const { Text } = Typography;

interface ExperimentalBadgeProps {
  lixKey: string;
  lixTreatment?: string;
  variant?: 'default' | 'compact' | 'detailed';
  showTooltip?: boolean;
  onLearnMore?: () => void;
  customTooltipContent?: React.ReactNode;
}

export const ExperimentalBadge: React.FC<ExperimentalBadgeProps> = ({
  lixKey,
  lixTreatment,
  variant = 'default',
  showTooltip = true,
  onLearnMore,
  customTooltipContent
}) => {
  const getTooltipContent = () => {
    if (customTooltipContent) {
      return customTooltipContent;
    }

    return (
      <div style={{ maxWidth: 300 }}>
        <Space direction="vertical" size={4}>
          <Text strong style={{ color: 'white' }}>This SKU is part of an experiment</Text>
          <div style={{ marginTop: 8 }}>
            <Text style={{ color: 'white', fontSize: '13px' }}>
              <strong>LIX Key:</strong> {lixKey}
            </Text>
            {lixTreatment && (
              <div>
                <Text style={{ color: 'white', fontSize: '13px' }}>
                  <strong>Treatment:</strong> {lixTreatment}
                </Text>
              </div>
            )}
          </div>
          {onLearnMore && (
            <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8 }}>
              <Text 
                style={{ color: 'white', fontSize: '11px', cursor: 'pointer', textDecoration: 'underline' }}
                onClick={onLearnMore}
              >
                Learn more about LIX experiments
              </Text>
            </div>
          )}
        </Space>
      </div>
    );
  };

  // Compact variant - just an orange icon
  if (variant === 'compact') {
    const badge = (
      <FlaskConical size={16} color="#fa8c16" />
    );

    return showTooltip ? (
      <Tooltip title={getTooltipContent()} placement="top">
        {badge}
      </Tooltip>
    ) : badge;
  }

  // Detailed variant - full information display
  if (variant === 'detailed') {
    return (
      <div style={{ 
        background: 'linear-gradient(135deg, #fff7e6 0%, #ffeedd 100%)',
        border: '1px solid #ffd591',
        borderRadius: '8px',
        padding: '12px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: 'radial-gradient(circle, rgba(250,140,22,0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(20px, -20px)'
        }} />
        
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Space>
            <FlaskConical size={16} color="#d46b08" />
            <Text strong style={{ color: '#d46b08' }}>
              Experimental Change Request
            </Text>
          </Space>
          
          <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
            This change request is part of a LinkedIn experiment for A/B testing and feature validation.
          </Text>
          
          <Space direction="vertical" size={4}>
            <div>
              <Text style={{ fontSize: '12px', color: '#595959' }}>
                <strong>LIX Key:</strong>
              </Text>
              <Tag color="orange" style={{ marginLeft: 8, fontFamily: 'monospace' }}>
                {lixKey}
              </Tag>
            </div>
            
            {lixTreatment && (
              <div>
                <Text style={{ fontSize: '12px', color: '#595959' }}>
                  <strong>Treatment:</strong>
                </Text>
                <Tag color="blue" style={{ marginLeft: 8, fontFamily: 'monospace' }}>
                  {lixTreatment}
                </Tag>
              </div>
            )}
          </Space>
          
          {onLearnMore && (
            <div style={{ marginTop: 4 }}>
              <Text 
                style={{ fontSize: '12px', color: '#1677ff', cursor: 'pointer' }}
                onClick={onLearnMore}
              >
                <Space size={4}>
                  <Info size={12} />
                  Learn more about LIX experiments
                  <ExternalLink size={10} />
                </Space>
              </Text>
            </div>
          )}
        </Space>
      </div>
    );
  }

  // Default variant - standard tag with icon
  const defaultBadge = (
    <Tag 
      color="orange" 
      style={{ 
        borderRadius: '12px',
        padding: '2px 8px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontWeight: 500
      }}
    >
      <FlaskConical size={12} />
      <span>LIX: {lixKey}</span>
      {lixTreatment && (
        <span style={{ 
          marginLeft: 4, 
          fontSize: '10px',
          opacity: 0.8,
          fontWeight: 400
        }}>
          ({lixTreatment})
        </span>
      )}
    </Tag>
  );

  return showTooltip ? (
    <Tooltip title={getTooltipContent()} placement="top">
      {defaultBadge}
    </Tooltip>
  ) : defaultBadge;
};

// Helper component for marking experimental SKUs in tables
interface ExperimentalSkuIndicatorProps {
  lixKey: string;
  lixTreatment?: string;
  inline?: boolean;
}

export const ExperimentalSkuIndicator: React.FC<ExperimentalSkuIndicatorProps> = ({
  lixKey,
  lixTreatment,
  inline = false
}) => {
  if (inline) {
    return (
      <Space size={4}>
        <ExperimentalBadge 
          lixKey={lixKey} 
          lixTreatment={lixTreatment} 
          variant="compact" 
        />
        <Text style={{ fontSize: '11px', color: '#8c8c8c' }}>
          Experimental
        </Text>
      </Space>
    );
  }

  return (
    <div style={{ marginTop: 4 }}>
      <ExperimentalBadge 
        lixKey={lixKey} 
        lixTreatment={lixTreatment} 
        variant="default" 
      />
    </div>
  );
};

// Helper component for table cells that need to show experimental status
interface ExperimentalTableCellProps {
  lixKey?: string;
  lixTreatment?: string;
  children: React.ReactNode;
}

export const ExperimentalTableCell: React.FC<ExperimentalTableCellProps> = ({
  lixKey,
  children
}) => {
  if (!lixKey) {
    return <>{children}</>;
  }

  return (
    <div>
      {children}
    </div>
  );
}; 