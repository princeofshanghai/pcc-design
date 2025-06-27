import React from 'react';
import { Button, message, theme } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import './CopyableId.css';

interface CopyableIdProps {
  id: string;
}

const CopyableId: React.FC<CopyableIdProps> = ({ id }) => {
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

  return (
    <Button
      type="default"
      size="small"
      icon={<CopyOutlined />}
      onClick={handleCopy}
      className="copyable-id-button"
      style={{
        fontFamily: token.fontFamilyCode,
        fontSize: 13,
      }}
    >
      {id}
    </Button>
  );
};

export default CopyableId; 