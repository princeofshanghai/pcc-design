import React from 'react';
import { Tag } from 'antd';
import { LOB_COLORS } from '../../theme';
import { toSentenceCase } from '../../utils/formatters';
import type { LOB } from '../../utils/types';

interface LobTagProps {
  lob: LOB;
}

const LobTag: React.FC<LobTagProps> = ({ lob }) => {
  const color = LOB_COLORS[lob];
  return <Tag color={color} bordered={false} style={{ borderRadius: '12px', marginRight: '4px' }}>{toSentenceCase(lob)}</Tag>;
};

export default LobTag; 