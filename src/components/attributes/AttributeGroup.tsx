import React from 'react';
import './AttributeGroup.css';

interface AttributeGroupProps {
  children: React.ReactNode;
}

const AttributeGroup: React.FC<AttributeGroupProps> = ({ children }) => {
  return (
    <div className="content-panel">
      <div className="attribute-group-body">
        {children}
      </div>
    </div>
  );
};

export default AttributeGroup; 