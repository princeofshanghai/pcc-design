import React from 'react';
import type { BillingCycle } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';

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
    >
      {billingCycle}
    </BaseChip>
  );
};

export default BillingCycleDisplay; 