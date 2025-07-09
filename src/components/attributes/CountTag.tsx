import React from 'react';
import { Tag } from 'antd';

interface CountTagProps {
  count: number;
}

const CountTag: React.FC<CountTagProps> = ({ count }) => {
  return (
    <Tag style={{ borderRadius: '12px', margin: '0 0 0 4px' }}>{count}</Tag>
  );
};

export default CountTag; 