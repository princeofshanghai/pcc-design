import React from 'react';
import { Space } from 'antd';
import { Repeat2, Tag, ChartNoAxesColumnIncreasing } from 'lucide-react';
import type { BillingModel } from '../../utils/types';

interface BillingModelDisplayProps {
  model: BillingModel;
}

const iconMapping: Record<BillingModel, React.ReactNode> = {
  Subscription: <Repeat2 size={16} />,
  'One-time': <Tag size={16} />,
  Usage: <ChartNoAxesColumnIncreasing size={16} />,
};

const BillingModelDisplay: React.FC<BillingModelDisplayProps> = ({ model }) => {
  const icon = iconMapping[model];

  return (
    <Space>
      {icon}
      <span>{model}</span>
    </Space>
  );
};

export default BillingModelDisplay; 