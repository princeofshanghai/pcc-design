import React from 'react';
import { Button, message } from 'antd';
import { CopyOutlined } from '@ant-design/icons';

interface CopyableIdProps {
  id: string;
}

const CopyableId: React.FC<CopyableIdProps> = ({ id }) => {
  const handleCopy = () => {
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
      style={{
        color: '#666',
        borderColor: '#e0e0e0',
      }}
    >
      ID: {id}
    </Button>
  );
};

export default CopyableId; 