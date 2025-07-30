import React from 'react';
import { message, theme } from 'antd';
import { Copy } from 'lucide-react';
import './CopyableId.css';

interface CopyableIdProps {
  id: string;
  variant?: 'default' | 'prominent';
}

const CopyableId: React.FC<CopyableIdProps> = ({ id, variant = 'default' }) => {
  const { token } = theme.useToken();

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id).then(
      () => {
        message.success('Copied to clipboard!');
      },
      (err) => {
        message.error('Failed to copy');
        console.error('Could not copy text: ', err);
      }
    );
  };

  // Different styles based on variant
  const getTextStyles = () => {
    if (variant === 'prominent') {
      return {
        fontFamily: token.fontFamilyCode,
        fontSize: '14px',
        color: token.colorText, // Default/darker text color
        fontWeight: 500,
      };
    }
    
    // Default variant (existing behavior)
    return {
      fontFamily: token.fontFamilyCode,
      fontSize: '13px',
      color: token.colorTextSecondary,
    };
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
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