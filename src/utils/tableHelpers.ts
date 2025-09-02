import React from 'react';
import InfoPopover from '../components/shared/InfoPopover';

/**
 * Creates a column title with an optional info popover icon.
 * This helper ensures consistent popover styling across all tables.
 * 
 * @param label - The column label text
 * @param tooltip - Optional rich content to display in popover on hover
 * @returns React node with label and optional info icon
 */
export const getColumnTitleWithTooltip = (label: string, tooltip?: React.ReactNode): React.ReactNode => {
  if (!tooltip) return label;
  
  return React.createElement(
    'span',
    { style: { display: 'flex', alignItems: 'center', gap: '6px' } },
    label,
    React.createElement(InfoPopover, {
      content: tooltip,
      placement: 'top'
    })
  );
};