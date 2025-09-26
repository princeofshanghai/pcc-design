import React from 'react';
import { message, theme } from 'antd';
import { Copy, CheckCircle } from 'lucide-react';
import InfoPopover from './InfoPopover';
import './CopyableId.css';

interface CopyableIdProps {
  id: string;
  variant?: 'default' | 'prominent' | 'table';
  muted?: boolean;
  withBackground?: boolean; // New prop for PageHeader background styling
  readOnly?: boolean; // New prop to disable copy functionality and remove icon
  size?: 'default' | 'small'; // New prop for smaller size in dropdowns
}

const CopyableId: React.FC<CopyableIdProps> = ({ id, variant = 'default', muted = false, withBackground = false, readOnly = false, size = 'default' }) => {
  const { token } = theme.useToken();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id).then(
      () => {
        message.success({
          content: (
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52c41a" />
                <span>Copied to clipboard</span>
              </div>
              <div 
                className="tabular-nums"
                style={{ 
                  color: '#bfbfbf', 
                  fontSize: token.fontSizeSM, 
                  marginTop: '4px', 
                  marginLeft: '24px' // Align with text above (icon width + gap)
                }}
              >
                {id}
              </div>
            </div>
          ),
          duration: 2.5,
          icon: null, // Remove default icon since we're using custom one
        });
      },
      (err) => {
        message.error('Failed to copy');
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Different styles based on variant, muted state, and size
  const getTextStyles = () => {
    // Use even lighter gray when muted
    const mutedColor = '#c1c1c1'; // Lighter than token.colorTextTertiary
    
    // Base font size - adjust for small size (make it even smaller for select inputs)
    const baseFontSize = size === 'small' ? 12 : token.fontSize; // 12px for compact select display
    
    const baseStyles = {
      fontFamily: token.fontFamily, // Use main font family instead of code font
      fontSize: baseFontSize,
      fontVariantNumeric: 'tabular-nums' as const,
      lineHeight: size === 'small' ? '1.2' : '1.5715', // Tighter line height for small
    };
    
    if (variant === 'prominent') {
      return {
        ...baseStyles,
        color: muted ? mutedColor : token.colorText,
        fontWeight: 500,
      };
    }
    
    if (variant === 'table') {
      return {
        ...baseStyles,
        fontSize: token.fontSizeSM, // Always use small for tables
        color: muted ? mutedColor : token.colorTextSecondary,
      };
    }
    
    // Default variant
    return {
      ...baseStyles,
      color: muted ? mutedColor : token.colorTextSecondary,
    };
  };

  // Adjust padding for small size when withBackground is true
  const getPadding = () => {
    if (!withBackground) return undefined;
    if (size === 'small') return '1px 3px'; // Very compact padding for select inputs
    return '4px 6px'; // Default padding
  };

  const content = (
    <span
      className="copyable-id-container"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: readOnly ? '0px' : '4px', // No gap when read-only (no icon)
        cursor: readOnly ? 'default' : 'pointer',
        transition: readOnly ? 'none' : 'opacity 0.2s ease',
        verticalAlign: size === 'small' ? 'middle' : 'baseline', // Better alignment in select inputs
        ...(withBackground && {
          backgroundColor: token.colorBgLayout,
          padding: getPadding(),
          borderRadius: size === 'small' ? '3px' : token.borderRadiusSM, // Smaller radius for compact display
          border: `1px solid ${token.colorBorder}`,
        }),
        ...getTextStyles(),
      }}
      onClick={readOnly ? undefined : handleCopy}
      onMouseEnter={readOnly ? undefined : (e) => {
        e.currentTarget.style.opacity = '0.8';
      }}
      onMouseLeave={readOnly ? undefined : (e) => {
        e.currentTarget.style.opacity = '1';
      }}
    >
      <span className="copyable-id-text">{id}</span>
      {!readOnly && (
        <Copy 
          size={12} 
          strokeWidth={3}
          style={{ 
            opacity: 0.6,
          }}
        />
      )}
    </span>
  );

  return readOnly ? content : (
    <InfoPopover content="Click to copy" placement="top">
      {content}
    </InfoPopover>
  );
};

export default CopyableId; 