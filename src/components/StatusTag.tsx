import React from 'react';
import { Tag, Tooltip, theme } from 'antd';
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
  const { token } = theme.useToken();
  const { description } = statusConfig[status];

  const styleMapping: Record<Status, React.CSSProperties> = {
    Active: {
      backgroundColor: token.colorSuccessBg,
      color: token.colorSuccessText,
    },
    Retired: {
      backgroundColor: token.colorErrorBg,
      color: token.colorErrorText,
    },
    Legacy: {
      backgroundColor: token.colorFillAlter,
      color: token.colorTextSecondary,
    },
  };

  const tagStyle = styleMapping[status];

  return (
    <Tooltip title={description}>
      <Tag
        bordered={false}
        style={{
          ...tagStyle,
          borderRadius: '999px',
          border: 'none',
        }}
      >
        {status}
      </Tag>
    </Tooltip>
  );
};

export default StatusTag;