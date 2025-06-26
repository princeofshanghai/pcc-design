import React from 'react';
import { Tag, Tooltip } from 'antd';
import type { Status } from '../utils/types';

interface StatusTagProps {
  status: Status;
}

const statusConfig: Record<Status, { color: string; description: string }> = {
  Active: {
    color: 'green',
    description: 'Currently live and being offered/used.',
  },
  Legacy: {
    color: 'default',
    description: 'No longer offered to new customers, but still used by existing customers.',
  },
  Retired: {
    color: 'red',
    description: 'Completely shut off and no longer in use.',
  },
};

const StatusTag: React.FC<StatusTagProps> = ({ status }) => {
  const { color, description } = statusConfig[status];

  return (
    <Tooltip title={description}>
      <Tag color={color}>{status}</Tag>
    </Tooltip>
  );
};

export default StatusTag;