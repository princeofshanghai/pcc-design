import React from 'react';
import { RefreshCcw, ShoppingBag, ChartNoAxesColumn } from 'lucide-react';
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
      gap: '4px',
      padding: '3px 8px 3px 7px',
      border: `1px solid ${muted ? '#e8e8e8' : '#d9d9d9'}`,
      borderRadius: '50px',
      backgroundColor: muted ? '#f9f9f9' : '#fff',
      width: 'fit-content',
      opacity: muted ? 0.6 : 1
    }}>
      <span style={{ color: muted ? '#999999' : '#666666', display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span style={{ color: muted ? '#999999' : '#000', fontSize: '13px' }}>{model}</span>
    </div>
  );
};

export default BillingModelDisplay; 