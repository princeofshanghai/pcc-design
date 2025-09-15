import React from 'react';
import { theme } from 'antd';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';
import { getBillingModelIcon } from '../../utils/billingModelIcons';
import type { BillingModel } from '../../utils/types';

interface BillingModelTagProps {
  billingModel: BillingModel;
  variant?: ChipVariant;
  showLabel?: boolean;
  showIcon?: boolean;
}

const BillingModelTag: React.FC<BillingModelTagProps> = ({ 
  billingModel, 
  variant = 'default',
  showLabel = true,
  showIcon = true
}) => {
  const { token } = theme.useToken();
  
  // White background with primary text color
  const colors = {
    backgroundColor: token.colorBgContainer, // White background
    textColor: token.colorText, // Primary text color
    borderColor: token.colorBorder,
  };

  const icon = getBillingModelIcon(billingModel);

  // If showLabel is false, render just the icon without background
  if (!showLabel) {
    return (
      <span style={{ color: token.colorText, display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
    );
  }

  return (
    <BaseChip
      variant={variant}
      icon={showIcon ? icon : undefined}
      backgroundColor={colors.backgroundColor}
      textColor={colors.textColor}
      borderColor={colors.borderColor}
    >
      {billingModel}
    </BaseChip>
  );
};

export default BillingModelTag;
