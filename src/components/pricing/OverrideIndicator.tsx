import React from 'react';
import { Tag } from 'antd';
import { AlertCircle } from 'lucide-react';

const OverrideIndicator: React.FC = () => (
  <Tag 
    icon={<AlertCircle size={12} style={{ marginRight: '4px' }} />} 
    color="orange" 
    style={{ fontSize: '11px', marginLeft: '8px' }}
  >
    Override
  </Tag>
);

export default OverrideIndicator; 