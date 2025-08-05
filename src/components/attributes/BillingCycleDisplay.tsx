import React from 'react';
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
      gap: '4px',
      padding: '3px 8px 3px 7px',
      border: `1px solid ${muted ? '#e8e8e8' : '#d9d9d9'}`,
      borderRadius: '50px',
      backgroundColor: muted ? '#f9f9f9' : '#fff',
      width: 'fit-content',
      opacity: muted ? 0.6 : 1
    }}>
      <span style={{ color: muted ? '#999999' : '#000', fontSize: '13px' }}>{billingCycle}</span>
    </div>
  );
};

export default BillingCycleDisplay; 