import React from 'react';
import { message, theme } from 'antd';
import { Copy } from 'lucide-react';
import { colors, fontSize, spacing } from '../../theme';
import './CopyableId.css';

interface CopyableIdProps {
  id: string;
  variant?: 'default' | 'prominent';
  muted?: boolean;
}

const CopyableId: React.FC<CopyableIdProps> = ({ id, variant = 'default', muted = false }) => {
  const { token } = theme.useToken();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id).then(
      () => {
        message.success({
          content: (
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: `${spacing.lg}px` }}>
                <span>Copied to clipboard</span>
              </div>
              <div style={{ 
                color: token.colorTextSecondary, 
                fontSize: `${fontSize.sm}px`, 
                marginTop: `${spacing.sm}px`, 
                marginLeft: '24px' // Align with text above (icon width + gap)
              }}>
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

  // Different styles based on variant and muted state
  const getTextStyles = () => {
    // Use even lighter gray when muted
    const mutedColor = colors.gray[900]; // Lighter than token.colorTextTertiary
    
    if (variant === 'prominent') {
      return {
        fontFamily: token.fontFamilyCode,
        fontSize: `${fontSize.md}px`,
        color: muted ? mutedColor : token.colorText,
        fontWeight: 500,
      };
    }
    
    // Default variant (existing behavior)
    return {
      fontFamily: token.fontFamilyCode,
      fontSize: `${fontSize.base}px`,
      color: muted ? mutedColor : token.colorTextSecondary,
    };
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: `${spacing.sm}px`,
        ...getTextStyles(),
      }}
    >
      <span>{id}</span>
      <Copy 
        size={12} 
        style={{ 
          cursor: 'pointer',
          opacity: 0.6,
          transition: 'opacity 0.2s ease'
        }}
        onClick={handleCopy}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.6';
        }}
      />
    </span>
  );
};

export default CopyableId;