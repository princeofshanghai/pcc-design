import React from 'react';
import { Button, message, theme } from 'antd';
import { Copy } from 'lucide-react';
import './CopyableId.css';

interface CopyableIdProps {
  id: string;
  size?: 'small' | 'medium';
  showId?: boolean;
}

const CopyableId: React.FC<CopyableIdProps> = ({ id, size = 'small', showId = true }) => {
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
    <Button
      type="default"
      size={isMedium ? 'middle' : 'small'}
      icon={<Copy size={isMedium ? 14 : 12} />}
      onClick={handleCopy}
      className="copyable-id-button"
      style={{
        fontFamily: token.fontFamilyCode,
        fontSize: isMedium ? 14 : 13,
      }}
    >
      {showId && id}
    </Button>
  );
};

export default CopyableId; 