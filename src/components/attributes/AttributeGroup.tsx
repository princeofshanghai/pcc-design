import React from 'react';
import './AttributeGroup.css';

interface AttributeGroupProps {
  children: React.ReactNode;
}

const AttributeGroup: React.FC<AttributeGroupProps> = ({ children }) => {
  return (
    <div className="attribute-group-body">
      {children}
    </div>
  );
};

export default AttributeGroup; 