import React from 'react';
import { Segmented } from 'antd';
import { LayoutGrid, List } from 'lucide-react';

export type ViewMode = 'card' | 'list';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (value: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onChange }) => {
  return (
    <div style={{
      border: '1px solid #d9d9d9',
      borderRadius: '8px',
      display: 'inline-block',
      backgroundColor: '#ffffff'
    }}>
      <Segmented
        options={[
          { value: 'list', icon: <List size={16} /> },
          { value: 'card', icon: <LayoutGrid size={16} /> },
        ]}
        value={viewMode}
        onChange={(value) => onChange(value as ViewMode)}
        size="large"
        style={{ 
          border: 'none',
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

export default ViewToggle; 