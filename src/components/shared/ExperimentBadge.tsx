import React from 'react';
import { Tag, Tooltip } from 'antd';

interface ExperimentBadgeProps {
  lixKey?: string;
  lixTreatment?: string;
  variant?: 'default' | 'compact';
  customTooltipContent?: React.ReactNode;
  children?: React.ReactNode;
}

export const ExperimentBadge: React.FC<ExperimentBadgeProps> = ({ 
  lixKey, 
  lixTreatment,
  variant = 'default',
  customTooltipContent,
  children
}) => {
  if (!lixKey && !children) return null;
  
  const text = children || (variant === 'compact' ? 'LIX' : `LIX: ${lixKey}`);
  const tooltipText = customTooltipContent || (lixKey && lixTreatment ? `${lixKey}: ${lixTreatment}` : lixKey);
  
  const badge = (
    <Tag 
      color="orange"
      style={{ 
        fontSize: '11px',
        lineHeight: '16px',
        padding: '2px 6px',
        margin: '0 4px 0 0',
        height: '20px',
        display: 'inline-flex',
        alignItems: 'center'
      }}
    >
      {text}
    </Tag>
  );

  return tooltipText ? (
    <Tooltip title={tooltipText}>
      {badge}
    </Tooltip>
  ) : badge;
};

// For backward compatibility
export const ExperimentalBadge = ExperimentBadge;
export const ExperimentalTableCell = ExperimentBadge;
