import React from 'react';
import { message, theme } from 'antd';
import { Copy, CheckCircle } from 'lucide-react';
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

  // Different styles based on variant and muted state
  const getTextStyles = () => {
    // Use even lighter gray when muted
    const mutedColor = '#c1c1c1'; // Lighter than token.colorTextTertiary
    
    if (variant === 'prominent') {
      return {
        fontFamily: token.fontFamily, // Use main font family instead of code font
        fontSize: token.fontSize,
        color: muted ? mutedColor : token.colorText,
        fontWeight: 500,
        fontVariantNumeric: 'tabular-nums',
      };
    }
    
    // Default variant
    return {
      fontFamily: token.fontFamily, // Use main font family instead of code font
      fontSize: token.fontSize,
      color: muted ? mutedColor : token.colorTextSecondary,
      fontVariantNumeric: 'tabular-nums',
    };
  };

  return (
    <span
      className="copyable-id-container"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        ...getTextStyles(),
      }}
    >
      <span className="copyable-id-text">{id}</span>
      <Copy 
        size={12} 
        strokeWidth={3}
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