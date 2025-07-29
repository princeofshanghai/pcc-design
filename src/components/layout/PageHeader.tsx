import React from 'react';
import { Typography, Space, theme, Button, Tooltip } from 'antd';
import { ArrowLeft, Edit } from 'lucide-react';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';
import CopyableId from '../shared/CopyableId';
import UserAvatar from '../shared/UserAvatar';
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
  // New props for last updated info and edit button
  lastUpdatedBy?: string; // Now just the user identifier (full name or LDAP)
  lastUpdatedAt?: Date;
  onEdit?: () => void;
}

// Helper function to format date for display (shortened)
const formatDateShort = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return diffInMinutes < 1 ? 'Just now' : `${diffInMinutes}m ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Helper function to format full UTC date for tooltip
const formatDateFullUTC = (date: Date): string => {
  return date.toUTCString();
};

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
  subtitle,
  lastUpdatedBy,
  lastUpdatedAt,
  onEdit}) => {
  const { token } = theme.useToken();

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        gap: '12px' // Add gap between back button and content
      }}
    >
      {/* Back Button - Now part of normal flow */}
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
            flexShrink: 0 // Prevent the button from shrinking
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
      
      {/* Content Area - Now flows naturally after back button */}
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
                <CopyableId id={rightAlignedId} />
              )}
            </div>
          )}
          
          {/* Row 2: Title + Tag (left) + Last Updated + Edit Button (right) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Space align="center" size="middle">
              <Title level={1} style={{ margin: 0, fontWeight: 500 }}>
                {title}
              </Title>
              {tagContent}
            </Space>
            
            {/* Right side: Last Updated + Edit Button */}
            <Space align="center" size="middle">
              {lastUpdatedBy && lastUpdatedAt && (
                <Space align="center" size={8}>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Last updated
                  </Text>
                  <Tooltip title={`${formatDateFullUTC(lastUpdatedAt)} by ${lastUpdatedBy}`}>
                    <Space align="center" size={6}>
                      <Text style={{ fontSize: '13px' }}>
                        {formatDateShort(lastUpdatedAt)}
                      </Text>
                      <UserAvatar 
                        user={lastUpdatedBy}
                        size={20} 
                        showTooltip={false} // We're handling tooltip here
                      />
                    </Space>
                  </Tooltip>
                </Space>
              )}
              
              {onEdit && (
                <Button 
                  icon={<Edit size={14} />}
                  onClick={onEdit}
                >
                  Edit
                </Button>
              )}
            </Space>
          </div>
          
          {/* Row 3: Channels and Billing Cycles (or fallback to subtitle) */}
          {(channels.length > 0 || billingCycles.length > 0) ? (
            <div style={{ marginTop: '8px' }}>
              <Space size={4} wrap>
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