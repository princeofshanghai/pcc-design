import React from 'react';
import { theme } from 'antd';
import { Check, ArchiveX } from 'lucide-react';
import type { PriceGroup } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';

export type PriceGroupStatus = 'Active' | 'Expired';

interface PriceGroupStatusTagProps {
  status?: PriceGroupStatus;
  priceGroup?: PriceGroup;
  variant?: ChipVariant;
  showLabel?: boolean;
  showIcon?: boolean;
}



/**
 * Calculates the status of a price group based on its price points
 * Logic: Active if ANY price point is Active, Expired if ALL price points are Expired
 */
const calculatePriceGroupStatus = (priceGroup: PriceGroup): PriceGroupStatus => {
  if (!priceGroup.pricePoints || priceGroup.pricePoints.length === 0) {
    return 'Expired';
  }

  const now = new Date();

  // Check each price point's status
  const pricePointStatuses = priceGroup.pricePoints.map(pricePoint => {
    const validFrom = new Date(pricePoint.validFrom);
    const validUntil = pricePoint.validUntil ? new Date(pricePoint.validUntil) : null;

    // If current time is before validFrom, it's not yet active
    if (now < validFrom) {
      return 'Expired';
    }

    // If no validUntil date, it's active indefinitely
    if (!validUntil) {
      return 'Active';
    }

    // If current time is after validUntil, it's expired
    if (now > validUntil) {
      return 'Expired';
    }

    // Otherwise, it's active
    return 'Active';
  });

  // If ANY price point is active, the price group is active
  const hasActivePoints = pricePointStatuses.some(status => status === 'Active');
  
  return hasActivePoints ? 'Active' : 'Expired';
};

const statusConfig: Record<PriceGroupStatus, { icon: React.FC<any>; description: string; antColorType: 'success' | 'default' }> = {
  Active: {
    icon: Check,
    description: 'Price group has at least one active price point and can be used for new purchases.',
    antColorType: 'success',
  },
  Expired: {
    icon: ArchiveX,
    description: 'Price group has no active price points and cannot be used for new purchases.',
    antColorType: 'default',
  },
};

const PriceGroupStatusTag: React.FC<PriceGroupStatusTagProps> = ({ 
  status, 
  priceGroup, 
  variant = 'default',
  showLabel = true,
  showIcon = true
}) => {
  const { token } = theme.useToken();
  
  // Calculate status if not provided but priceGroup is available
  const calculatedStatus = status || (priceGroup ? calculatePriceGroupStatus(priceGroup) : 'Active');
  
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
      default: // 'default' for expired/neutral
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
    >
      {calculatedStatus}
    </BaseChip>
  );
};

export default PriceGroupStatusTag;
