import React from 'react';
import { theme } from 'antd';
import { Check, ArchiveX } from 'lucide-react';
import type { Product } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';

export type ProductStatus = 'Active' | 'Retired';

interface StatusTagProps {
  status?: ProductStatus;
  product?: Product;
  variant?: ChipVariant;
  showLabel?: boolean;
}



/**
 * Calculates the status of a product based on its price groups
 * Logic: Active if ANY price group is Active, Retired if ALL price groups are Expired
 */
const calculateProductStatus = (product: Product): ProductStatus => {
  if (!product.skus || product.skus.length === 0) {
    return 'Retired';
  }

  const now = new Date();

  // Get all unique price groups from SKUs
  const priceGroups = product.skus.map(sku => sku.priceGroup);

  // Check each price group's status
  const priceGroupStatuses = priceGroups.map(priceGroup => {
    if (!priceGroup.pricePoints || priceGroup.pricePoints.length === 0) {
      return 'Expired';
    }

    // Check if any price point in this group is active
    const hasActivePoint = priceGroup.pricePoints.some(pricePoint => {
      const validFrom = pricePoint.validFrom ? new Date(pricePoint.validFrom) : null;
      const validTo = pricePoint.validTo ? new Date(pricePoint.validTo) : null;

      // If no validFrom date, consider it active
      if (!validFrom) {
        return true;
      }

      // If current time is before validFrom, it's not yet active
      if (now < validFrom) {
        return false;
      }

      // If no validTo date, it's active indefinitely
      if (!validTo) {
        return true;
      }

      // If current time is after validTo, it's expired
      if (now > validTo) {
        return false;
      }

      // Otherwise, it's active
      return true;
    });

    return hasActivePoint ? 'Active' : 'Expired';
  });

  // If ANY price group is active, the product is active
  const hasActivePriceGroups = priceGroupStatuses.some(status => status === 'Active');
  
  return hasActivePriceGroups ? 'Active' : 'Retired';
};

const statusConfig: Record<ProductStatus, { icon: React.FC<any>; description: string; antColorType: 'success' | 'default' }> = {
  Active: {
    icon: Check,
    description: 'Product has at least one active price group and is available for purchase.',
    antColorType: 'success',
  },
  Retired: {
    icon: ArchiveX,
    description: 'Product has no active price groups and is no longer available for purchase.',
    antColorType: 'default',
  },
};

const StatusTag: React.FC<StatusTagProps> = ({ 
  status, 
  product, 
  variant = 'default',
  showLabel = true 
}) => {
  const { token } = theme.useToken();
  
  // Calculate status if not provided but product is available
  const calculatedStatus = status || (product ? calculateProductStatus(product) : 'Active');
  
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
      default: // 'default' for retired/neutral
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
    // For icon-only, we'll use a simple span with the icon
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
      icon={<Icon />}
      tooltip={description}
      backgroundColor={colors.backgroundColor}
      textColor={colors.textColor}
      borderColor={colors.borderColor}
    >
      {calculatedStatus}
    </BaseChip>
  );
};

export default StatusTag;