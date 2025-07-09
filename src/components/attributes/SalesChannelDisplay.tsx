import React from 'react';
import { Space } from 'antd';
import { Monitor, Smartphone, Headset } from 'lucide-react';
import type { SalesChannel } from '../../utils/types';

interface SalesChannelDisplayProps {
  channel: SalesChannel;
}

const iconMapping: Record<SalesChannel, React.ReactNode> = {
  Desktop: <Monitor size={16} />,
  Mobile: <Smartphone size={16} />,
  Field: <Headset size={16} />,
};

const SalesChannelDisplay: React.FC<SalesChannelDisplayProps> = ({ channel }) => {
  const icon = iconMapping[channel];

  return (
    <Space>
      {icon}
      <span>{channel}</span>
    </Space>
  );
};

export default SalesChannelDisplay; 