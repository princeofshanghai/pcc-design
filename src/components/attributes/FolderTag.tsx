import React from 'react';
import { Tag } from 'antd';
import { LOB_COLORS } from '../../theme';
import type { LOB } from '../../utils/types';

interface FolderTagProps {
  folder: string;
  lob: LOB;
}

const FolderTag: React.FC<FolderTagProps> = ({ folder, lob }) => {
  const color = LOB_COLORS[lob];
  return <Tag color={color} bordered={false} style={{ borderRadius: '12px' }}>{folder}</Tag>;
};

export default FolderTag; 