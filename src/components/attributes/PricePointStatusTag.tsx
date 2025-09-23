import React from 'react';
import { theme } from 'antd';
import { Check, ArchiveX } from 'lucide-react';
import type { PricePoint } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';

export type PricePointStatus = 'Active' | 'Expired';

interface PricePointStatusTagProps {
  status?: PricePointStatus;
  pricePoint?: PricePoint;
  variant?: ChipVariant;
  showLabel?: boolean;
  showIcon?: boolean;
}



/**
 * Calculates the status of a price point based on validity dates
 */
const calculatePricePointStatus = (pricePoint: PricePoint): PricePointStatus => {
  const now = new Date();
  const validFrom = new Date(pricePoint.validFrom);
  const validUntil = pricePoint.validUntil ? new Date(pricePoint.validUntil) : null;

  // If current time is before validFrom, it's not yet active (treat as expired)
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
};

const statusConfig: Record<PricePointStatus, { icon: React.FC<any>; description: string; antColorType: 'success' | 'default' }> = {
  Active: {
    icon: Check,
    description: 'Price point is currently valid and can be used for new purchases.',
    antColorType: 'success',
  },
  Expired: {
    icon: ArchiveX,
    description: 'Price point is no longer valid and cannot be used for new purchases.',
    antColorType: 'default',
  },
};

const PricePointStatusTag: React.FC<PricePointStatusTagProps> = ({ 
  status, 
  pricePoint, 
  variant = 'default',
  showLabel = true,
  showIcon = true
}) => {
  const { token } = theme.useToken();
  
  // Use pre-calculated status from data first, fallback to prop status, then date calculation
  const calculatedStatus = (pricePoint?.status as PricePointStatus) || status || (pricePoint ? calculatePricePointStatus(pricePoint) : 'Active');
  
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

export default PricePointStatusTag;