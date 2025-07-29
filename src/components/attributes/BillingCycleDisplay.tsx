import React from 'react';
import { Calendar, BarChart3, CalendarCheck } from 'lucide-react';
import type { BillingCycle } from '../../utils/types';

interface BillingCycleDisplayProps {
  billingCycle: BillingCycle;
}

const iconMapping: Record<BillingCycle, React.ReactNode> = {
  Monthly: <Calendar size={13} />,
  Quarterly: <BarChart3 size={13} />,
  Annual: <CalendarCheck size={13} />,
};

const BillingCycleDisplay: React.FC<BillingCycleDisplayProps> = ({ billingCycle }) => {
  const icon = iconMapping[billingCycle];

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
      <span style={{ color: '#666', display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span style={{ color: '#000', fontSize: '13px' }}>{billingCycle}</span>
    </div>
  );
};

export default BillingCycleDisplay; 