import React from 'react';
import { RefreshCcw, ShoppingBag, ChartNoAxesColumn } from 'lucide-react';
import type { BillingModel } from '../../utils/types';

interface BillingModelDisplayProps {
  model: BillingModel;
}

const iconMapping: Record<BillingModel, React.ReactNode> = {
  Subscription: <RefreshCcw size={13} strokeWidth={3} />,
  'One-time': <ShoppingBag size={13} strokeWidth={3} />,
  Usage: <ChartNoAxesColumn size={13} strokeWidth={3} />,
};

const BillingModelDisplay: React.FC<BillingModelDisplayProps> = ({ model }) => {
  const icon = iconMapping[model];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 8px 3px 7px',
      border: '1px solid #d9d9d9',
      borderRadius: '50px',
      backgroundColor: '#fff',
      width: 'fit-content'
    }}>
      <span style={{ color: '#666666', display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span style={{ color: '#000', fontSize: '13px' }}>{model}</span>
    </div>
  );
};

export default BillingModelDisplay; 