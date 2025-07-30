import React from 'react';
import { Typography, Space, theme, Button, Tooltip } from 'antd';
import { ArrowLeft, Edit } from 'lucide-react';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';
import CopyableId from '../shared/CopyableId';
import UserAvatar from '../shared/UserAvatar';
import type { SalesChannel, BillingCycle } from '../../utils/types';
import './PageHeader.css';

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
  // New prop to reduce spacing when followed by tabs
  compact?: boolean;
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
  onEdit,
  compact = false}) => {
  const { token } = theme.useToken();

  return (
    <div className={`page-header ${compact ? 'page-header--compact' : ''}`}>
      {/* Container for responsive layout */}
      <div className="page-header-grid">
        {/* Back Button */}
        {onBack && (
          <div 
            className="page-header-back-button"
            onClick={onBack}
            style={{
              color: token.colorTextSecondary,
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
        
        {/* Main Content Area */}
        <div className={`page-header-content ${!onBack ? 'page-header-content--no-back' : ''}`}>
          {/* Top row: Icon + Entity Type + ID (responsive) */}
          {(icon || entityType || rightAlignedId) && (
            <div className="page-header-top-row">
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
                <div className="page-header-id-mobile">
                  <CopyableId id={rightAlignedId} />
                </div>
              )}
            </div>
          )}
          
          {/* Title row: Title + Tag + Meta info (responsive) */}
          <div className="page-header-title-row">
            {/* Left side: Title + Tag */}
            <div className="page-header-title-left">
              <Title 
                level={1} 
                className="page-header-title"
              >
                {title}
              </Title>
              {tagContent && (
                <div className="page-header-tag">
                  {tagContent}
                </div>
              )}
            </div>
            
            {/* Right side: Last Updated + Edit Button (will wrap on mobile) */}
            {(lastUpdatedBy && lastUpdatedAt) || onEdit ? (
              <div className="page-header-meta">
                {lastUpdatedBy && lastUpdatedAt && (
                  <Space align="center" size={8}>
                    <Text 
                      type="secondary" 
                      className="page-header-last-updated-text"
                      style={{ fontSize: '13px' }}
                    >
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
                          showTooltip={false}
                        />
                      </Space>
                    </Tooltip>
                  </Space>
                )}
                
                {onEdit && (
                  <Button 
                    className="page-header-edit-button"
                    icon={<Edit size={14} />}
                    onClick={onEdit}
                  >
                    <span className="page-header-edit-button-text">
                      Edit
                    </span>
                  </Button>
                )}
              </div>
            ) : null}
          </div>
          
          {/* Bottom row: Channels and Billing Cycles */}
          {(channels.length > 0 || billingCycles.length > 0) ? (
            <div>
              <Space size={4} wrap>
                {channels.map(channel => (
                  <SalesChannelDisplay key={channel} channel={channel} />
                ))}
                {billingCycles.map(cycle => (
                  <BillingCycleDisplay key={cycle} billingCycle={cycle} />
                ))}
              </Space>
            </div>
          ) : subtitle ? (
            <div>
              {React.isValidElement(subtitle) ? (
                subtitle
              ) : (
                <Text type="secondary">{subtitle}</Text>
              )}
            </div>
          ) : null}
        </div>
        
        {/* Actions - Will wrap to new row on mobile */}
        {actions && (
          <div className="page-header-actions">
            <Space wrap>{actions}</Space>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader; 