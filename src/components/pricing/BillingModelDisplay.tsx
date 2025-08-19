import React from 'react';
import { RefreshCcw, ShoppingBag, ChartNoAxesColumn } from 'lucide-react';
import type { BillingModel } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';
import { TAILWIND_COLORS } from '../../theme';

interface BillingModelDisplayProps {
  model: BillingModel;
  variant?: ChipVariant;
  muted?: boolean;
}

const iconMapping: Record<BillingModel, React.ReactNode> = {
  Subscription: <RefreshCcw />,
  'One-time': <ShoppingBag />,
  Usage: <ChartNoAxesColumn />,
};

const BillingModelDisplay: React.FC<BillingModelDisplayProps> = ({ 
  model, 
  variant = 'default',
  muted = false 
}) => {
  const icon = iconMapping[model];

  return (
    <BaseChip
      variant={variant}
      muted={muted}
      icon={icon}
      borderColor={TAILWIND_COLORS.gray[300]} // Match default button border color
    >
      {model}
    </BaseChip>
  );
};

export default BillingModelDisplay; 