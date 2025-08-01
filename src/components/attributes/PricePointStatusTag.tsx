import React from 'react';
import { Tag } from 'antd';
import { Archive } from 'lucide-react';
import type { PricePoint } from '../../utils/types';

interface PricePointStatusTagProps {
  pricePoint: PricePoint;
  size?: 'small' | 'default';
}

const PricePointStatusTag: React.FC<PricePointStatusTagProps> = ({ 
  pricePoint, 
  size = 'small' 
}) => {
  // Only show tag for expired price points
  if (pricePoint.status !== 'Expired') {
    return null;
  }

  return (
    <Tag
      icon={<Archive size={12} />}
      color="default"
      style={{
        marginLeft: '8px',
        fontSize: size === 'small' ? '11px' : '12px',
        lineHeight: size === 'small' ? '16px' : '20px',
        color: '#64748b', // Muted gray text
        backgroundColor: '#f8fafc', // Very light gray background
        borderColor: '#e2e8f0', // Light gray border
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px'
      }}
    >
      Expired
    </Tag>
  );
};

export default PricePointStatusTag;