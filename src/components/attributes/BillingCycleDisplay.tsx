import React from 'react';
import type { BillingCycle } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';
import { TAILWIND_COLORS } from '../../theme';

interface BillingCycleDisplayProps {
  billingCycle: BillingCycle;
  variant?: ChipVariant;
  muted?: boolean;
}

const BillingCycleDisplay: React.FC<BillingCycleDisplayProps> = ({ 
  billingCycle, 
  variant = 'default',
  muted = false 
}) => {
  return (
    <BaseChip
      variant={variant}
      muted={muted}
      borderColor={TAILWIND_COLORS.gray[300]} // Match default button border color
    >
      {billingCycle}
    </BaseChip>
  );
};

export default BillingCycleDisplay; 