import React from 'react';
import { Tooltip } from 'antd';
import { Info } from 'lucide-react';

/**
 * Creates a column title with an optional tooltip icon.
 * This helper ensures consistent tooltip styling across all tables.
 * 
 * @param label - The column label text
 * @param tooltip - Optional tooltip text to display on hover
 * @returns React node with label and optional info icon
 */
export const getColumnTitleWithTooltip = (label: string, tooltip?: string): React.ReactNode => {
  if (!tooltip) return label;
  
  return React.createElement(
    'span',
    { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
    label,
    React.createElement(
      Tooltip,
      { title: tooltip, placement: 'top' },
      React.createElement(Info, {
        size: 14,
        style: {
          color: '#9ca3af', // Tailwind Gray 400 (tertiary text color)
          cursor: 'default',  // Normal cursor, not help cursor
          flexShrink: 0
        }
      })
    )
  );
};