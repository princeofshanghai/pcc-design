import React from 'react';
import { Monitor, Headset } from 'lucide-react';
import type { SalesChannel } from '../../utils/types';
import BaseChip, { type ChipVariant } from '../shared/BaseChip';
import { TAILWIND_COLORS } from '../../theme';

interface SalesChannelDisplayProps {
  channel: SalesChannel;
  variant?: ChipVariant;
  muted?: boolean;
  iconOnly?: boolean; // New prop for icon-only display
}

// Apple iOS icon (simplified Apple logo) - for chips
const AppleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle' }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// Apple iOS icon optimized for icon-only usage (PageHeader)
const AppleIconOnly = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ verticalAlign: 'middle', transform: 'translateY(-2px)' }}>
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

// Google Play icon (simplified Google Play triangle) - for chips
const GooglePlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" style={{ verticalAlign: 'middle' }}>
    {/* Blue triangle (left) */}
    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5" fill="#01A9FC"/>
    {/* Green triangle (top right) */}
    <path d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12" fill="#00D95F"/>
    {/* Yellow triangle (right) */}
    <path d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81" fill="#FFBC00"/>
    {/* Red triangle (bottom right) */}
    <path d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66" fill="#FF5722"/>
  </svg>
);

// Google Play icon optimized for icon-only usage (PageHeader)
const GooglePlayIconOnly = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" style={{ verticalAlign: 'middle', transform: 'translateY(-1px)' }}>
    {/* Blue triangle (left) */}
    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.61 3,21.09 3,20.5" fill="#01A9FC"/>
    {/* Green triangle (top right) */}
    <path d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12" fill="#00D95F"/>
    {/* Yellow triangle (right) */}
    <path d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81" fill="#FFBC00"/>
    {/* Red triangle (bottom right) */}
    <path d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66" fill="#FF5722"/>
  </svg>
);

// Icon mapping for regular chip usage
const iconMapping: Record<SalesChannel, React.ReactNode> = {
  Desktop: <Monitor size={16} />,
  iOS: <AppleIcon />,
  GPB: <GooglePlayIcon />,
  Field: <Headset size={16} />,
};

// Icon mapping for icon-only usage (optimized for PageHeader)
const iconOnlyMapping: Record<SalesChannel, React.ReactNode> = {
  Desktop: <Monitor size={16} />,
  iOS: <AppleIconOnly />,
  GPB: <GooglePlayIconOnly />,
  Field: <Headset size={16} />,
};

const SalesChannelDisplay: React.FC<SalesChannelDisplayProps> = ({ 
  channel, 
  variant = 'default',
  muted = false,
  iconOnly = false
}) => {
  // Use appropriate icon mapping based on usage
  const icon = iconOnly ? iconOnlyMapping[channel] : iconMapping[channel];

  // Icon-only display: just return the icon
  if (iconOnly) {
    return <span style={{ color: muted ? TAILWIND_COLORS.gray[400] : 'inherit' }}>{icon}</span>;
  }

  // Default display: icon + text in chip
  return (
    <BaseChip
      variant={variant}
      muted={muted}
      icon={icon}
      borderColor={TAILWIND_COLORS.gray[300]} // Match default button border color
    >
      {channel}
    </BaseChip>
  );
};

export default SalesChannelDisplay; 