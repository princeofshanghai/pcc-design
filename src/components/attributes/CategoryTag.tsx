import React from 'react';
import { Tag } from 'antd';
import { LOB_COLORS } from '../../theme';
import type { LOB } from '../../utils/types';

interface CategoryTagProps {
  category: string;
  lob: LOB;
}

const CategoryTag: React.FC<CategoryTagProps> = ({ category, lob }) => {
  const color = LOB_COLORS[lob];
  return <Tag color={color} bordered={false} style={{ borderRadius: '12px' }}>{category}</Tag>;
};

export default CategoryTag; 