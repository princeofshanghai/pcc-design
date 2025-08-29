import React from 'react';
import { RefreshCcw, ShoppingBag, ChartNoAxesColumn } from 'lucide-react';
import type { BillingModel } from './types';

// Icon mapping for billing models
export const getBillingModelIcon = (model: BillingModel): React.ReactNode => {
  switch (model) {
    case 'Subscription':
      return <RefreshCcw size={16} />;
    case 'One-time':
      return <ShoppingBag size={16} />;
    case 'Usage':
      return <ChartNoAxesColumn size={16} />;
    default:
      return null;
  }
};
