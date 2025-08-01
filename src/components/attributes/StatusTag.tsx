import React from 'react';
import { Tooltip, theme } from 'antd';
import type { Status } from '../../utils/types';
import { CheckCircle2, Archive, XCircle } from 'lucide-react';


interface StatusTagProps {
  status: Status;
  showLabel?: boolean;
  size?: number;
}

type ColorConfig = {
  icon: React.FC<any>;
  description: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
};

const statusConfig: Record<Status, { icon: React.FC<any>; description: string; antColorType: 'success' | 'default' | 'error' }> = {
  Active: {
    icon: CheckCircle2,
    description: 'Product is actively being sold.',
    antColorType: 'success',
  },
  Legacy: {
    icon: Archive,
    description: 'Product is no longer being sold, but still has grandfathered customers.',
    antColorType: 'default',
  },
  Retired: {
    icon: XCircle,
    description: 'Product is no longer being sold and has no grandfathered customers.',
    antColorType: 'error',
  },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, showLabel = true, size = 13 }) => {
  const { token } = theme.useToken();
  const { icon: Icon, description, antColorType } = statusConfig[status];
  
  // Get Ant Design color tokens based on status
  const getColorConfig = (): ColorConfig => {
    switch (antColorType) {
      case 'success':
        return {
          icon: Icon,
          description,
          backgroundColor: token.colorSuccessBg,
          textColor: token.colorSuccessText,
          borderColor: token.colorSuccessBorder,
        };
      case 'error':
        return {
          icon: Icon,
          description,
          backgroundColor: token.colorErrorBg,
          textColor: token.colorErrorText,
          borderColor: token.colorErrorBorder,
        };
      default: // 'default'
        return {
          icon: Icon,
          description,
          backgroundColor: token.colorFillTertiary,
          textColor: token.colorTextSecondary,
          borderColor: token.colorBorder,
        };
    }
  };

  const colorConfig = getColorConfig();

  // If showLabel is false, render just the icon without background
  if (!showLabel) {
    return (
      <Tooltip title={description}>
        <span style={{ color: colorConfig.textColor, display: 'flex', alignItems: 'center' }}>
          <Icon size={size} strokeWidth={3} />
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip title={description}>
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 8px 3px 7px', // Match SalesChannelDisplay padding
          backgroundColor: colorConfig.backgroundColor,
          border: `1px solid ${colorConfig.borderColor}`,
          borderRadius: '50px', // Match SalesChannelDisplay border radius
          width: 'fit-content'
        }}
      >
        <span style={{ color: colorConfig.textColor, display: 'flex', alignItems: 'center' }}>
          <Icon size={size} strokeWidth={3} />
        </span>
        <span style={{ 
          color: colorConfig.textColor,
          fontSize: '13px' // Match SalesChannelDisplay text size
        }}>
          {status}
        </span>
      </div>
    </Tooltip>
  );
};

export default StatusTag;