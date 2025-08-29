import React from 'react';
import { theme, Tooltip } from 'antd';
import { Check, Archive, ArchiveX, CirclePause, CircleCheckBig } from 'lucide-react';

import BaseChip, { type ChipVariant } from '../shared/BaseChip';

export type ProductStatus = 'Active' | 'Inactive' | 'Archived';

interface StatusTagProps {
  status?: ProductStatus;
  variant?: ChipVariant;
  showLabel?: boolean;
}





const statusConfig: Record<ProductStatus, { icon: React.FC<any>; description: string; antColorType: 'success' | 'warning' | 'default' }> = {
  Active: {
    icon: CircleCheckBig,
    description: 'Product is actively being sold',
    antColorType: 'success',
  },
  Inactive: {
    icon: CirclePause,
    description: 'This product is no longer sold but still has active, grandfathered customers.',
    antColorType: 'warning',
  },
  Archived: {
    icon: ArchiveX,
    description: 'This product is no longer sold and does not have any active customers remaining.',
    antColorType: 'default',
  },
};

const StatusTag: React.FC<StatusTagProps> = ({ 
  status, 
  variant = 'default',
  showLabel = true 
}) => {
  const { token } = theme.useToken();
  
  // Use provided status or default to Active
  const calculatedStatus = status || 'Active';
  
  const { icon: Icon, description, antColorType } = statusConfig[calculatedStatus];
  
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
      default: // 'default' for legacy/neutral
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
    // For icon-only, we'll use a simple span with the icon wrapped in a tooltip
    const iconSize = variant === 'small' ? 12 : 16;
    return (
      <Tooltip title={description}>
        <span style={{ color: colors.textColor, display: 'flex', alignItems: 'center' }}>
          <Icon size={iconSize} strokeWidth={variant === 'small' ? 2.5 : 2} />
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={description}>
      <span 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: variant === 'small' ? '4px' : '6px',
          fontSize: '13px',
          color: token.colorText
        }}
      >
        <Icon 
          size={variant === 'small' ? 12 : 16} 
          strokeWidth={variant === 'small' ? 2.5 : 2}
          color={colors.textColor}
        />
        {calculatedStatus}
      </span>
    </Tooltip>
  );
};

export default StatusTag;