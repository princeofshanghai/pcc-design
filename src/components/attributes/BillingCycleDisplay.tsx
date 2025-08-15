import React from 'react';
import { colors, fontSize, spacing, borderRadius } from '../../theme';
import type { BillingCycle } from '../../utils/types';

interface BillingCycleDisplayProps {
  billingCycle: BillingCycle;
  muted?: boolean;
}

const BillingCycleDisplay: React.FC<BillingCycleDisplayProps> = ({ billingCycle, muted = false }) => {
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
      <span style={{ color: muted ? colors.gray[500] : colors.neutral.black, fontSize: `${fontSize.base}px` }}>{billingCycle}</span>
    </div>
  );
};

export default BillingCycleDisplay; 