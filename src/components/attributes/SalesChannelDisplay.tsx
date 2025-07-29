import React from 'react';
import { Monitor, Smartphone, Headset } from 'lucide-react';
import type { SalesChannel } from '../../utils/types';

interface SalesChannelDisplayProps {
  channel: SalesChannel;
}

const iconMapping: Record<SalesChannel, React.ReactNode> = {
  Desktop: <Monitor size={13} />,
  iOS: <Smartphone size={13} />,
  GPB: <Smartphone size={13} />,
  Field: <Headset size={13} />,
};

const colorMapping: Record<SalesChannel, string> = {
  Desktop: '#1677ff', // geekblue
  iOS: '#722ed1',     // purple
  GPB: '#eb2f96',     // magenta
  Field: '#fa8c16',   // orange
};

const SalesChannelDisplay: React.FC<SalesChannelDisplayProps> = ({ channel }) => {
  const icon = iconMapping[channel];
  const color = colorMapping[channel];

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
      <span style={{ color: color, display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span style={{ color: '#000', fontSize: '13px' }}>{channel}</span>
    </div>
  );
};

export default SalesChannelDisplay; 