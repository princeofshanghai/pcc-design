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
    <Segmented
      options={[
        { value: 'card', icon: <LayoutGrid size={16} /> },
        { value: 'list', icon: <List size={16} /> },
      ]}
      value={viewMode}
      onChange={(value) => onChange(value as ViewMode)}
      size="large"
    />
  );
};

export default ViewToggle; 