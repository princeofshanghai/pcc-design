import React from 'react';
import { Tooltip, theme } from 'antd';
import { CheckCircle2, ArchiveX } from 'lucide-react';
import type { PriceGroup } from '../../utils/types';

export type PriceGroupStatus = 'Active' | 'Expired';

interface PriceGroupStatusTagProps {
  status?: PriceGroupStatus;
  priceGroup?: PriceGroup;
  showLabel?: boolean;
  size?: number;
}

type ColorConfig = {
  icon: React.FC<any>;
  description: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};

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
    const validFrom = pricePoint.validFrom ? new Date(pricePoint.validFrom) : null;
    const validTo = pricePoint.validTo ? new Date(pricePoint.validTo) : null;

    // If no validFrom date, consider it active
    if (!validFrom) {
      return 'Active';
    }

    // If current time is before validFrom, it's not yet active
    if (now < validFrom) {
      return 'Expired';
    }

    // If no validTo date, it's active indefinitely
    if (!validTo) {
      return 'Active';
    }

    // If current time is after validTo, it's expired
    if (now > validTo) {
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
    icon: CheckCircle2,
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
  showLabel = true, 
  size = 13 
}) => {
  const { token } = theme.useToken();
  
  // Calculate status if not provided but priceGroup is available
  const calculatedStatus = status || (priceGroup ? calculatePriceGroupStatus(priceGroup) : 'Active');
  
  const { icon: Icon, description, antColorType } = statusConfig[calculatedStatus];
  
  // Get Ant Design color tokens based on status
  const getColorConfig = (): ColorConfig => {
    switch (antColorType) {
      case 'success':
        return {
          icon: Icon,
          description,
          backgroundColor: token.colorSuccessBg,
          textColor: token.colorSuccessText,
          borderColor: token.colorSuccessBorder,
        };
      default: // 'default' for expired/neutral
        return {
          icon: Icon,
          description,
          backgroundColor: token.colorFillTertiary,
          textColor: token.colorTextSecondary,
          borderColor: token.colorBorder,
        };
    }
  };

  const colorConfig = getColorConfig();

  // If showLabel is false, render just the icon without background
  if (!showLabel) {
    return (
      <Tooltip title={description}>
        <span style={{ color: colorConfig.textColor, display: 'flex', alignItems: 'center' }}>
          <Icon size={size} strokeWidth={3} />
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={description}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px 3px 7px',
          backgroundColor: colorConfig.backgroundColor,
          border: `1px solid ${colorConfig.borderColor}`,
          borderRadius: '50px',
          width: 'fit-content'
        }}
      >
        <span style={{ color: colorConfig.textColor, display: 'flex', alignItems: 'center' }}>
          <Icon size={size} strokeWidth={3} />
        </span>
        <span style={{ 
          color: colorConfig.textColor,
          fontSize: '13px'
        }}>
          {calculatedStatus}
        </span>
      </div>
    </Tooltip>
  );
};

export default PriceGroupStatusTag;
