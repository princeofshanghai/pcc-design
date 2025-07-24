import React from 'react';
import { message, theme } from 'antd';
import { Copy } from 'lucide-react';
import './CopyableId.css';

interface CopyableIdProps {
  id: string;
  size?: 'small' | 'medium';
}

const CopyableId: React.FC<CopyableIdProps> = ({ id, size = 'small' }) => {
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

  const isMedium = size === 'medium';

  return (
    <div
      onClick={handleCopy}
      className="copyable-id-tag"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: isMedium ? '4px 8px' : '2px 6px',
        backgroundColor: token.colorBgContainer,
        border: `1px solid ${token.colorBorder}`,
        borderRadius: token.borderRadius,
        cursor: 'pointer',
        fontFamily: token.fontFamilyCode,
        fontSize: isMedium ? 13 : 12,
        lineHeight: isMedium ? '16px' : '14px',
        color: token.colorText,
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        e.currentTarget.style.borderColor = token.colorPrimary;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = token.colorBgContainer;
        e.currentTarget.style.borderColor = token.colorBorder;
      }}
    >
      <span>{id}</span>
      <Copy size={isMedium ? 12 : 10} style={{ opacity: 0.6 }} />
    </div>
  );
};

export default CopyableId; 