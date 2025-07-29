import React from 'react';
import { Typography, Space, theme } from 'antd';
import { ArrowLeft } from 'lucide-react';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';
import CopyableId from '../shared/CopyableId';
import type { SalesChannel, BillingCycle } from '../../utils/types';

const { Title, Text } = Typography;

interface PageHeaderProps {
  icon?: React.ReactNode;
  iconSize?: number;
  entityType?: string;
  title?: React.ReactNode;
  rightAlignedId?: string; // New prop for ID that goes on row 1
  channels?: SalesChannel[]; // New prop for channels
  billingCycles?: BillingCycle[]; // New prop for billing cycles
  tagContent?: React.ReactNode;
  onBack?: () => void;
  actions?: React.ReactNode;
  // Keep subtitle for backward compatibility, but it will be replaced by channels/cycles
  subtitle?: React.ReactNode;
  // New prop to control optical alignment
  enableOpticalAlignment?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({ 
  icon, 
  iconSize = 12, 
  entityType,
  title, 
  rightAlignedId,
  channels = [],
  billingCycles = [],
  tagContent, 
  onBack, 
  actions,
  subtitle}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        position: 'relative' // For absolute positioning of back button
      }}
    >
      {/* Back Button - Positioned outside normal flow */}
      {onBack && (
        <div 
          onClick={onBack}
          style={{
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'background-color 0.2s ease',
            color: token.colorTextSecondary,
            position: 'absolute',
            left: '-56px', // Position outside the content area
            top: '0',
            zIndex: 1
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = token.colorBgTextHover;
            e.currentTarget.style.color = token.colorText;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = token.colorTextSecondary;
          }}
        >
          <ArrowLeft size={20} />
        </div>
      )}
      
      {/* Content Area - Now follows normal layout flow */}
      <div style={{ flex: 1 }}>
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          {/* Row 1: Icon + Entity Type (left) + ID (right) */}
          {(icon || entityType || rightAlignedId) && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <Space align="center" size={4}>
                {icon && (
                  <div style={{ 
                    color: token.colorTextSecondary,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {React.cloneElement(icon as React.ReactElement, { size: iconSize } as any)}
                  </div>
                )}
                {entityType && (
                  <Text type="secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {entityType}
                  </Text>
                )}
              </Space>
              {rightAlignedId && (
                <CopyableId id={rightAlignedId} size="small" />
              )}
            </div>
          )}
          
          {/* Row 2: Title + Tag */}
          <Space align="center" size="middle">
            <Title level={1} style={{ margin: 0, fontWeight: 500 }}>
              {title}
            </Title>
            {tagContent}
          </Space>
          
          {/* Row 3: Channels and Billing Cycles (or fallback to subtitle) */}
          {(channels.length > 0 || billingCycles.length > 0) ? (
            <div style={{ marginTop: '4px' }}>
              <Space size={8} wrap>
                {/* Show all unique channels first */}
                {channels.map(channel => (
                  <SalesChannelDisplay key={channel} channel={channel} />
                ))}
                {/* Then show all unique billing cycles */}
                {billingCycles.map(cycle => (
                  <BillingCycleDisplay key={cycle} billingCycle={cycle} />
                ))}
              </Space>
            </div>
          ) : subtitle ? (
            <div style={{ marginTop: '4px' }}>
              {React.isValidElement(subtitle) ? (
                subtitle
              ) : (
                <Text type="secondary">{subtitle}</Text>
              )}
            </div>
          ) : null}
        </Space>
      </div>
      
      {/* Actions */}
      {actions && <Space>{actions}</Space>}
    </div>
  );
};

export default PageHeader; 