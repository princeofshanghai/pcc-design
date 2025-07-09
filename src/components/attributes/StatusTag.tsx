import React from 'react';
import { Typography, Tooltip, theme, Space } from 'antd';
import type { Status } from '../../utils/types';
import { CheckCircle2, Archive, XCircle } from 'lucide-react';

const { Text } = Typography;

interface StatusTagProps {
  status: Status;
  showLabel?: boolean;
  size?: number;
}

type ColorToken = 'colorSuccessText' | 'colorTextSecondary' | 'colorErrorText';

const statusConfig: Record<Status, { icon: React.FC<any>; description: string; colorToken: ColorToken }> = {
  Active: {
    icon: CheckCircle2,
    description: 'Currently live and being offered/used.',
    colorToken: 'colorSuccessText',
  },
  Legacy: {
    icon: Archive,
    description: 'No longer offered to new customers, but still used by existing customers.',
    colorToken: 'colorTextSecondary',
  },
  Retired: {
    icon: XCircle,
    description: 'Completely shut off and no longer in use.',
    colorToken: 'colorErrorText',
  },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, showLabel = true, size = 14 }) => {
  const { token } = theme.useToken();
  const { icon: Icon, description, colorToken } = statusConfig[status];
  const color = token[colorToken];

  return (
    <Tooltip title={description}>
      <Space size={4} style={{ alignItems: 'center' }}>
        <Icon size={size} color={color} />
        {showLabel && <Text style={{ lineHeight: '1' }}>{status}</Text>}
      </Space>
    </Tooltip>
  );
};

export default StatusTag;