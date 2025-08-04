import React from 'react';
import { Tooltip } from 'antd';
import { FlaskRound } from 'lucide-react';
import type { Sku } from '../../utils/types';

interface PriceGroupExperimentalIndicatorProps {
  skus: Sku[];
}

export const PriceGroupExperimentalIndicator: React.FC<PriceGroupExperimentalIndicatorProps> = ({ skus }) => {
  // Check if any SKU in this price group has experimental data
  const hasExperimentalSkus = skus.some(sku => sku.lix?.key);
  
  if (!hasExperimentalSkus) {
    return null;
  }

  return (
    <Tooltip title="This price group is part of an experiment" placement="top">
      <FlaskRound size={20} color="#fa8c16" />
    </Tooltip>
  );
};

export default PriceGroupExperimentalIndicator;