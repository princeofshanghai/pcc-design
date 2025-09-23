import React from 'react';
import { Tag } from 'antd';

const OverrideIndicator: React.FC = () => (
  <Tag 
    color="orange" 
    style={{ fontSize: '11px', marginLeft: '8px' }}
  >
    Override
  </Tag>
);

export default OverrideIndicator; 