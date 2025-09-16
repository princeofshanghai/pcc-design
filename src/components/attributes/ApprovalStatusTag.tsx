import React from 'react';
import { theme } from 'antd';
import { Check, Clock, CircleDashed, X } from 'lucide-react';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';
import type { ApprovalStatus } from '../../utils/types';

// Extended approval statuses for the UI
export type ExtendedApprovalStatus = ApprovalStatus | 'Not requested';

interface ApprovalStatusTagProps {
  status: ExtendedApprovalStatus;
  variant?: ChipVariant;
  showLabel?: boolean;
  showIcon?: boolean;
}

const statusConfig: Record<ExtendedApprovalStatus, { 
  icon: React.FC<any>; 
  description: string; 
  antColorType: 'success' | 'warning' | 'error' | 'default' 
}> = {
  'Not requested': {
    icon: CircleDashed,
    description: 'Approval has not been requested yet',
    antColorType: 'default',
  },
  'Pending': {
    icon: Clock,
    description: 'Approval has been requested and is pending review',
    antColorType: 'warning',
  },
  'Approved': {
    icon: Check,
    description: 'Team has approved this change',
    antColorType: 'success',
  },
  'Rejected': {
    icon: X,
    description: 'Team has rejected this change',
    antColorType: 'error',
  },
};

const ApprovalStatusTag: React.FC<ApprovalStatusTagProps> = ({ 
  status, 
  variant = 'default',
  showLabel = true,
  showIcon = true
}) => {
  const { token } = theme.useToken();
  
  const { icon: Icon, description, antColorType } = statusConfig[status];
  
  // Get color configuration based on status
  const getColors = () => {
    switch (antColorType) {
      case 'success':
        return {
          backgroundColor: token.colorSuccessBg,
          textColor: token.colorSuccessText,
          borderColor: token.colorSuccessBorder,
        };
      case 'warning':
        return {
          backgroundColor: token.colorWarningBg,
          textColor: token.colorWarning,
          borderColor: token.colorWarningBorder,
        };
      case 'error':
        return {
          backgroundColor: token.colorErrorBg,
          textColor: token.colorErrorText,
          borderColor: token.colorErrorBorder,
        };
      default: // 'default' for not requested/neutral
        return {
          backgroundColor: token.colorFillTertiary,
          textColor: token.colorTextSecondary,
          borderColor: token.colorBorder,
        };
    }
  };

  const colors = getColors();

  // If showLabel is false, render just the icon without background
  if (!showLabel) {
    const iconSize = variant === 'small' ? 12 : 14;
    return (
      <span style={{ color: colors.textColor, display: 'flex', alignItems: 'center' }}>
        <Icon size={iconSize} strokeWidth={variant === 'small' ? 2.5 : 2} />
      </span>
    );
  }

  return (
    <BaseChip
      variant={variant}
      icon={showIcon ? <Icon /> : undefined}
      tooltip={description}
      backgroundColor={colors.backgroundColor}
      textColor={colors.textColor}
      borderColor={colors.borderColor}
      style={{ whiteSpace: 'nowrap' }}
    >
      {status}
    </BaseChip>
  );
};

export default ApprovalStatusTag;
