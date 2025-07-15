import React from 'react';
import { Tag, Typography, Space, Tooltip, Button } from 'antd';
import { User, Settings, ExternalLink, Calendar } from 'lucide-react';

const { Text } = Typography;

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown date';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

interface ConfigurationOriginProps {
  origin: 'manual' | 'configuration_request';
  createdBy?: string;
  createdDate?: string;
  requestId?: string;
  variant?: 'default' | 'compact' | 'detailed';
  onViewRequest?: (requestId: string) => void;
}

export const ConfigurationOrigin: React.FC<ConfigurationOriginProps> = ({
  origin,
  createdBy,
  createdDate,
  requestId,
  variant = 'default',
  onViewRequest
}) => {
  const getOriginConfig = () => {
    switch (origin) {
      case 'manual':
        return {
          color: 'blue',
          icon: <User size={12} />,
          label: 'Manual',
          description: 'Created manually by user'
        };
      case 'configuration_request':
        return {
          color: 'green',
          icon: <Settings size={12} />,
          label: 'Configuration',
          description: 'Generated from configuration request'
        };
      default:
        return {
          color: 'default',
          icon: <User size={12} />,
          label: 'Unknown',
          description: 'Origin unknown'
        };
    }
  };

  const config = getOriginConfig();

  const getTooltipContent = () => (
    <div style={{ maxWidth: 250 }}>
      <Space direction="vertical" size={4}>
        <Text strong style={{ color: 'white' }}>SKU Origin</Text>
        <Text style={{ color: 'white', fontSize: '12px' }}>
          {config.description}
        </Text>
        {createdBy && (
          <Text style={{ color: 'white', fontSize: '11px' }}>
            <strong>Created by:</strong> {createdBy}
          </Text>
        )}
        {createdDate && (
          <Text style={{ color: 'white', fontSize: '11px' }}>
            <strong>Created on:</strong> {formatDate(createdDate)}
          </Text>
        )}
        {requestId && (
          <Text style={{ color: 'white', fontSize: '11px' }}>
            <strong>Request ID:</strong> {requestId}
          </Text>
        )}
      </Space>
    </div>
  );

  // Compact variant - just a small tag
  if (variant === 'compact') {
    const compactTag = (
      <Tag 
        color={config.color} 
        style={{ 
          fontSize: '10px',
          padding: '0 4px',
          height: '18px',
          lineHeight: '16px',
          borderRadius: '4px'
        }}
      >
        <Space size={2}>
          {config.icon}
          <span>{config.label}</span>
        </Space>
      </Tag>
    );

    return (
      <Tooltip title={getTooltipContent()} placement="top">
        {compactTag}
      </Tooltip>
    );
  }

  // Detailed variant - full information display
  if (variant === 'detailed') {
    return (
      <div style={{ 
        background: origin === 'manual' ? '#f0f5ff' : '#f6ffed',
        border: `1px solid ${origin === 'manual' ? '#91d5ff' : '#b7eb8f'}`,
        borderRadius: '6px',
        padding: '12px'
      }}>
        <Space direction="vertical" style={{ width: '100%' }} size={8}>
          <Space>
            {config.icon}
            <Text strong>{config.label} Creation</Text>
          </Space>
          
          <Text style={{ fontSize: '13px', color: '#8c8c8c' }}>
            {config.description}
          </Text>
          
          <Space direction="vertical" size={2}>
            {createdBy && (
              <Text style={{ fontSize: '12px' }}>
                <Text type="secondary">Created by:</Text> {createdBy}
              </Text>
            )}
            {createdDate && (
              <Text style={{ fontSize: '12px' }}>
                <Text type="secondary">Created on:</Text> {formatDate(createdDate)}
              </Text>
            )}
            {requestId && (
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: '12px' }}>
                  <Text type="secondary">Configuration Request:</Text>
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Space>
                    <Text code style={{ fontSize: '11px' }}>{requestId}</Text>
                    {onViewRequest && (
                      <Button 
                        type="link" 
                        size="small"
                        style={{ padding: 0, height: 'auto' }}
                        icon={<ExternalLink size={10} />}
                        onClick={() => onViewRequest(requestId)}
                      >
                        View Request
                      </Button>
                    )}
                  </Space>
                </div>
              </div>
            )}
          </Space>
        </Space>
      </div>
    );
  }

  // Default variant - standard tag with tooltip
  const defaultTag = (
    <Tag 
      color={config.color}
      style={{ 
        borderRadius: '4px',
        padding: '2px 6px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      {config.icon}
      <span>{config.label}</span>
      {requestId && (
        <Text style={{ fontSize: '10px', marginLeft: 2, opacity: 0.8 }}>
          (Config)
        </Text>
      )}
    </Tag>
  );

  return (
    <Tooltip title={getTooltipContent()} placement="top">
      {defaultTag}
    </Tooltip>
  );
};

// Helper component for table cells
interface OriginTableCellProps {
  origin: 'manual' | 'configuration_request';
  createdBy?: string;
  createdDate?: string;
  requestId?: string;
  children: React.ReactNode;
  onViewRequest?: (requestId: string) => void;
}

export const OriginTableCell: React.FC<OriginTableCellProps> = ({
  origin,
  createdBy,
  createdDate,
  requestId,
  children,
  onViewRequest
}) => {
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ 
        position: 'absolute',
        top: -2,
        left: -2,
        zIndex: 1
      }}>
        <ConfigurationOrigin 
          origin={origin}
          createdBy={createdBy}
          createdDate={createdDate}
          requestId={requestId}
          variant="compact"
          onViewRequest={onViewRequest}
        />
      </div>
      <div style={{ paddingLeft: 24 }}>
        {children}
      </div>
    </div>
  );
};

// Helper component for inline origin display
interface InlineOriginProps {
  origin: 'manual' | 'configuration_request';
  createdBy?: string;
  createdDate?: string;
  requestId?: string;
  showDetails?: boolean;
  onViewRequest?: (requestId: string) => void;
}

export const InlineOrigin: React.FC<InlineOriginProps> = ({
  origin,
  createdBy,
  createdDate,
  requestId,
  showDetails = false,
  onViewRequest
}) => {
  return (
    <Space size={8}>
      <ConfigurationOrigin 
        origin={origin}
        createdBy={createdBy}
        createdDate={createdDate}
        requestId={requestId}
        variant="default"
        onViewRequest={onViewRequest}
      />
      {showDetails && (
        <Space size={4}>
          {createdBy && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              by {createdBy}
            </Text>
          )}
          {createdDate && (
            <Text type="secondary" style={{ fontSize: '11px' }}>
              <Calendar size={10} style={{ marginRight: 2 }} />
              {formatDate(createdDate)}
            </Text>
          )}
        </Space>
      )}
    </Space>
  );
}; 