import React from 'react';
import { Tooltip, theme } from 'antd';
import { CheckCircle2, ArchiveX } from 'lucide-react';
import type { Product } from '../../utils/types';

export type ProductStatus = 'Active' | 'Retired';


interface StatusTagProps {
  status?: ProductStatus;
  product?: Product;
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
    icon: CheckCircle2,
    description: 'Product has at least one active price group and is available for purchase.',
    antColorType: 'success',
  },
  Retired: {
    icon: ArchiveX,
    description: 'Product has no active price groups and is no longer available for purchase.',
    antColorType: 'default',
  },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, product, showLabel = true, size = 13 }) => {
  const { token } = theme.useToken();
  
  // Calculate status if not provided but product is available
  const calculatedStatus = status || (product ? calculateProductStatus(product) : 'Active');
  
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
      default: // 'default' for retired/neutral
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
          padding: '3px 8px 3px 7px', // Match SalesChannelDisplay padding
          backgroundColor: colorConfig.backgroundColor,
          border: `1px solid ${colorConfig.borderColor}`,
          borderRadius: '50px', // Match SalesChannelDisplay border radius
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

export default StatusTag;