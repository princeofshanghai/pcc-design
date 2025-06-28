import React from 'react';
import { Button, message, theme } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
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
    <Button
      type="default"
      size={isMedium ? 'middle' : 'small'}
      icon={<CopyOutlined />}
      onClick={handleCopy}
      className="copyable-id-button"
      style={{
        fontFamily: token.fontFamilyCode,
        fontSize: isMedium ? 14 : 13,
      }}
    >
      {id}
    </Button>
  );
};

export default CopyableId; 