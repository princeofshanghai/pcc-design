import React from 'react';
import { Popover, theme } from 'antd';
import { Info } from 'lucide-react';

interface InfoPopoverProps {
  /** Rich content to display in the popover - supports text, JSX, links, buttons */
  content: React.ReactNode;
  /** Optional custom placement - defaults to 'top' with auto-adjustment */
  placement?: 'top' | 'topLeft' | 'topRight' | 'bottom' | 'bottomLeft' | 'bottomRight' | 'left' | 'right';
  /** Custom icon size - defaults to 13px */
  iconSize?: number;
  /** Custom icon color - defaults to theme secondary text color */
  iconColor?: string;
  /** Custom trigger element - if not provided, uses Info icon */
  trigger?: React.ReactNode;
  /** Element to wrap with popover - alternative to trigger */
  children?: React.ReactNode;
  /** Whether the popover is disabled */
  disabled?: boolean;
  /** Custom max width - defaults to 280px for optimal readability */
  maxWidth?: number | string;
}

/**
 * A reusable popover component for displaying rich information content.
 * Follows modern web app UX patterns with hover trigger, subtle styling, and flexible content support.
 * 
 * Features:
 * - Hover trigger with 200ms delay to prevent accidental activation
 * - Auto-positioning with fallback placements
 * - Support for rich content including links, buttons, and formatting
 * - Consistent styling with design system
 * - Accessible with proper ARIA attributes
 */
const InfoPopover: React.FC<InfoPopoverProps> = ({
  content,
  placement = 'top',
  iconSize = 13,
  iconColor,
  trigger,
  children,
  disabled = false,
  maxWidth = 280,
}) => {
  const { token } = theme.useToken();

  // If disabled or no content, just return the children/trigger or icon without popover
  if (disabled || !content) {
    return (
      <>
        {children || trigger || (
          <Info 
            size={iconSize} 
            strokeWidth={2.5} 
            style={{ 
              color: iconColor || token.colorTextTertiary, 
              flexShrink: 0,
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'default' : 'help'
            }} 
          />
        )}
      </>
    );
  }

  // Custom popover content wrapper with consistent styling
  const popoverContent = (
    <div style={{
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
      fontSize: '13px',
      lineHeight: '1.5',
      color: token.colorText,
      // Support for rich content styling
      '& a': {
        color: token.colorPrimary,
        textDecoration: 'none',
      },
      '& a:hover': {
        textDecoration: 'underline',
      },
      '& button': {
        fontSize: '12px',
      }
    } as React.CSSProperties}>
      {content}
    </div>
  );

  return (
    <Popover
      content={popoverContent}
      placement={placement}
      trigger="hover"
      mouseEnterDelay={0.2} // 200ms delay to prevent accidental triggers
      mouseLeaveDelay={0.1} // Quick hide for responsive feel
      overlayClassName="info-popover"
      overlayInnerStyle={{
        padding: '12px 16px',
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowSecondary,
      }}
      // Auto-adjust placement if there's not enough space
      autoAdjustOverflow={{
        adjustX: 1,
        adjustY: 1,
      }}
      // Accessibility
      aria-describedby="info-popover-content"
    >
      {children || (
        <span style={{ 
          display: 'inline-flex', 
          alignItems: 'center',
          cursor: 'help'
        }}>
          {trigger || (
            <Info 
              size={iconSize} 
              strokeWidth={2.5} 
              style={{ 
                color: iconColor || token.colorTextTertiary, 
                flexShrink: 0,
                transition: 'color 0.2s ease'
              }} 
            />
          )}
        </span>
      )}
    </Popover>
  );
};

export default InfoPopover;
