import React from 'react';
import { Typography, Space, theme, Button, Tooltip, Dropdown } from 'antd';
import { Edit, TestTubeDiagonal } from 'lucide-react';
import CopyableId from '../shared/CopyableId';
import UserAvatar from '../shared/UserAvatar';
import VerticalSeparator from '../shared/VerticalSeparator';
import { getChannelIconForPageHeader } from '../../utils/channelIcons';
import type { SalesChannel, BillingCycle } from '../../utils/types';
import './PageHeader.css';

const { Title, Text } = Typography;

interface PageHeaderProps {
  entityType?: string;
  title?: React.ReactNode;
  rightAlignedId?: string; // ID that appears inline with entity type
  channels?: SalesChannel[]; // Legacy prop for channels (backward compatibility)
  billingCycles?: BillingCycle[]; // Legacy prop for billing cycles (backward compatibility)
  channelBillingGroups?: Record<SalesChannel, BillingCycle[]>; // New prop: each channel with its specific billing cycles
  validityText?: string; // New prop for validity period text
  lixKey?: string; // New prop for experiment key
  lixTreatment?: string; // New prop for experiment treatment
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
  editDropdown?: () => React.ReactNode; // Custom dropdown content for edit button
  editButtonText?: string; // Custom text for edit button
  editButtonIcon?: React.ReactNode; // Custom icon for edit button
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
  entityType,
  title, 
  rightAlignedId,
  channels = [],
  billingCycles = [],
  channelBillingGroups,
  validityText,
  lixKey,
  lixTreatment,
  tagContent, 
  actions,
  subtitle,
  lastUpdatedBy,
  lastUpdatedAt,
  onEdit,
  editDropdown,
  editButtonText = "Edit",
  editButtonIcon = <Edit size={14} />,
  compact = false}) => {
  const { token } = theme.useToken();

  return (
    <div className={`page-header ${compact ? 'page-header--compact' : ''}`}>
      {/* Container for responsive layout */}
      <div className="page-header-grid">
        {/* Main Content Area */}
        <div className="page-header-content page-header-content--no-back">
          {/* Top row: Entity Type only */}
          {entityType && (
            <div className="page-header-top-row">
              <Text style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                {entityType}
              </Text>
            </div>
          )}
          
          {/* Title row: Title + Tag + ID + Meta info (responsive) */}
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

            {/* Right side: ID + Last Updated + Edit Button + Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: 'auto' }}>
              {rightAlignedId && (
                <CopyableId id={rightAlignedId} withBackground />
              )}
              
              {((lastUpdatedBy && lastUpdatedAt) || onEdit || actions) && (
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
                  
                  {(onEdit || editDropdown) && (
                    editDropdown ? (
                      <Dropdown
                        dropdownRender={editDropdown}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button 
                          type="default"
                          className="page-header-edit-button"
                          icon={editButtonIcon}
                        >
                          <span className="page-header-edit-button-text">
                            {editButtonText}
                          </span>
                        </Button>
                      </Dropdown>
                    ) : (
                      <Button 
                        type="default"
                        className="page-header-edit-button"
                        icon={editButtonIcon}
                        onClick={onEdit}
                      >
                        <span className="page-header-edit-button-text">
                          {editButtonText}
                        </span>
                      </Button>
                    )
                  )}

                  {actions && (
                    <Space wrap>{actions}</Space>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Bottom row: Channel-Billing Groups, Validity, and Experiments */}
          {(channelBillingGroups || channels.length > 0 || validityText || (lixKey && lixTreatment)) ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {channelBillingGroups ? (
                  // New logic: Each channel shows only its specific billing cycles
                  Object.entries(channelBillingGroups).map(([channel, cycles], index) => (
                    <React.Fragment key={channel}>
                      {index > 0 && <VerticalSeparator />}
                      <Space size={6} align="center">
                        {getChannelIconForPageHeader(channel as SalesChannel)}
                        <Text style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                          {cycles.join(', ')}
                        </Text>
                      </Space>
                    </React.Fragment>
                  ))
                ) : (
                  // Legacy logic: All billing cycles for all channels (backward compatibility)
                  channels.map((channel, index) => (
                    <React.Fragment key={channel}>
                      {index > 0 && <VerticalSeparator />}
                      <Space size={6} align="center">
                        {getChannelIconForPageHeader(channel)}
                        {billingCycles.length > 0 && (
                          <Text style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                            {billingCycles.join(', ')}
                          </Text>
                        )}
                      </Space>
                    </React.Fragment>
                  ))
                )}
                {validityText && (
                  <>
                    {(channelBillingGroups || channels.length > 0) && <VerticalSeparator />}
                    <Text 
                      style={{ 
                        fontSize: '13px', 
                        color: token.colorTextSecondary,
                        fontWeight: 500 
                      }}
                    >
                      {validityText}
                    </Text>
                  </>
                )}
                {lixKey && lixTreatment && (
                  <>
                    {(channelBillingGroups || channels.length > 0 || validityText) && <VerticalSeparator />}
                    <Space size={6} align="center">
                      <TestTubeDiagonal size={16} style={{ color: '#ff7a00' }} />
                      <Text style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                        {lixKey} ({lixTreatment})
                      </Text>
                    </Space>
                  </>
                )}
              </div>
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