import React from 'react';
import { theme } from 'antd';
import InfoPopover from './InfoPopover';

export type ChipVariant = 'default' | 'small';

interface BaseChipProps {
  variant?: ChipVariant;
  muted?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  style?: React.CSSProperties;
}

const BaseChip: React.FC<BaseChipProps> = ({
  variant = 'default',
  muted = false,
  icon,
  children,
  tooltip,
  backgroundColor,
  textColor,
  borderColor,
  style,
}) => {
  const { token } = theme.useToken();

  // Size configurations based on variant
  const sizeConfig = {
    default: {
      height: 28,
      fontSize: token.fontSize, // 14px
      iconSize: 14,
      paddingHorizontal: 6,
      paddingVertical: 6,
      gap: 4,
    },
    small: {
      height: 24,
      fontSize: token.fontSizeSM, // 12px
      iconSize: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      gap: 4,
    },
  };

  const config = sizeConfig[variant];

  // Note: We use fixed height in the style instead of calculated padding

  // Default colors
  const defaultBackgroundColor = muted ? token.colorFillQuaternary : token.colorBgContainer;
  const defaultTextColor = muted ? token.colorTextTertiary : token.colorText;
  const defaultBorderColor = muted ? token.colorBorderSecondary : token.colorBorder;

  const chipContent = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${config.gap}px`,
        height: `${config.height}px`,
        paddingLeft: `${config.paddingHorizontal}px`,
        paddingRight: `${config.paddingHorizontal}px`,
        backgroundColor: backgroundColor || defaultBackgroundColor,
        border: `1px solid ${borderColor || defaultBorderColor}`,
        borderRadius: '50px',
        width: 'fit-content',
        opacity: muted ? 0.7 : 1,
        boxSizing: 'border-box',
        ...style, // Merge custom styles
      }}
    >
      {icon && (
        <span 
          style={{ 
            color: textColor || defaultTextColor,
            display: 'flex', 
            alignItems: 'center',
            lineHeight: 1,
          }}
        >
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement<any>, { 
                size: config.iconSize,
                strokeWidth: variant === 'small' ? 2.5 : 2,
              } as any)
            : icon
          }
        </span>
      )}
      <span 
        style={{ 
          color: textColor || defaultTextColor,
          fontSize: `${config.fontSize}px`,
          fontWeight: 'normal',
          lineHeight: 1,
        }}
      >
        {children}
      </span>
    </div>
  );

  if (tooltip) {
    return (
      <InfoPopover content={tooltip} placement="top">
        {chipContent}
      </InfoPopover>
    );
  }

  return chipContent;
};

export default BaseChip;
