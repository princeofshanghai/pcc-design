import React from 'react';
import { RefreshCcw, ShoppingBag, ChartNoAxesColumn } from 'lucide-react';
import { colors, fontSize, spacing, borderRadius } from '../../theme';
import type { BillingModel } from '../../utils/types';

interface BillingModelDisplayProps {
  model: BillingModel;
  muted?: boolean;
}

const iconMapping: Record<BillingModel, React.ReactNode> = {
  Subscription: <RefreshCcw size={13} strokeWidth={3} />,
  'One-time': <ShoppingBag size={13} strokeWidth={3} />,
  Usage: <ChartNoAxesColumn size={13} strokeWidth={3} />,
};

const BillingModelDisplay: React.FC<BillingModelDisplayProps> = ({ model, muted = false }) => {
  const icon = iconMapping[model];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: `${spacing.sm}px`,
      padding: spacing.badge,
      border: `1px solid ${muted ? colors.gray[300] : colors.gray[400]}`,
      borderRadius: `${borderRadius.pill}px`,
      backgroundColor: muted ? colors.gray[100] : colors.neutral.white,
      width: 'fit-content',
      opacity: muted ? 0.6 : 1
    }}>
      <span style={{ color: muted ? colors.gray[500] : colors.gray[600], display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span style={{ color: muted ? colors.gray[500] : colors.neutral.black, fontSize: `${fontSize.base}px` }}>{model}</span>
    </div>
  );
};

export default BillingModelDisplay; 