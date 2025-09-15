import React from 'react';
import { theme } from 'antd';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';
import type { BillingCycle } from '../../utils/types';

interface BillingCycleTagProps {
  billingCycle: BillingCycle;
  variant?: ChipVariant;
  showIcon?: boolean; // For consistency with other chip components
}

const BillingCycleTag: React.FC<BillingCycleTagProps> = ({ 
  billingCycle, 
  variant = 'default'
  // Note: showIcon prop exists for consistency but is unused since BillingCycleTag has no icons
}) => {
  const { token } = theme.useToken();
  
  // White background with primary text color
  const colors = {
    backgroundColor: token.colorBgContainer, // White background
    textColor: token.colorText, // Primary text color
    borderColor: token.colorBorder,
  };

  return (
    <BaseChip
      variant={variant}
      backgroundColor={colors.backgroundColor}
      textColor={colors.textColor}
      borderColor={colors.borderColor}
    >
      {billingCycle}
    </BaseChip>
  );
};

export default BillingCycleTag;
