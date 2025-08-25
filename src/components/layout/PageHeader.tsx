import React from 'react';
import { Typography, Space, theme, Button, Tooltip } from 'antd';
import { Edit } from 'lucide-react';
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
  rightAlignedId?: string; // ID that appears inline with entity type
  channels?: SalesChannel[]; // New prop for channels
  billingCycles?: BillingCycle[]; // New prop for billing cycles
  validityText?: string; // New prop for validity period text
  tagContent?: React.ReactNode;
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
  validityText,
  tagContent, 
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
        {/* Main Content Area */}
        <div className="page-header-content page-header-content--no-back">
          {/* Top row: Icon + Entity Type + ID (inline) */}
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
                  <Text style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                    {entityType}
                  </Text>
                )}
                {rightAlignedId && (
                  <>
                    <div style={{ 
                      color: token.colorBorder,
                      fontSize: '14px',
                      margin: '0 4px'
                    }}>
                      |
                    </div>
                    <CopyableId id={rightAlignedId} />
                  </>
                )}
              </Space>
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
            
            {/* Right side: Last Updated + Edit Button + Actions (will wrap on mobile) */}
            {(lastUpdatedBy && lastUpdatedAt) || onEdit || actions ? (
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
                    type="default"
                    className="page-header-edit-button"
                    icon={<Edit size={14} />}
                    onClick={onEdit}
                  >
                    <span className="page-header-edit-button-text">
                      Edit
                    </span>
                  </Button>
                )}

                {actions && (
                  <Space wrap>{actions}</Space>
                )}
              </div>
            ) : null}
          </div>
          
          {/* Bottom row: Channels, Billing Cycles, and Validity */}
          {(channels.length > 0 || billingCycles.length > 0 || validityText) ? (
            <div>
              <Space size={4} wrap>
                {channels.map(channel => (
                  <SalesChannelDisplay key={channel} channel={channel} />
                ))}
                {billingCycles.map(cycle => (
                  <BillingCycleDisplay key={cycle} billingCycle={cycle} />
                ))}
                {validityText && (
                  <Text 
                    style={{ 
                      fontSize: '13px', 
                      color: token.colorTextSecondary,
                      fontWeight: 500 
                    }}
                  >
                    {validityText}
                  </Text>
                )}
              </Space>
            </div>
          ) : subtitle ? (
            <div>
              {React.isValidElement(subtitle) ? (
                subtitle
              ) : (
                <Text style={{ color: token.colorTextSecondary }}>{subtitle}</Text>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PageHeader; 