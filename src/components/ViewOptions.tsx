import React from 'react';
import { Badge, Button, Dropdown } from 'antd';
import { Settings2, Check } from 'lucide-react';
import type { MenuProps } from 'antd';

interface ViewOptionsProps {
  groupBy: string;
  setGroupBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  groupByOptions: string[];
  sortOptions: string[];
}

const ViewOptions: React.FC<ViewOptionsProps> = ({
  groupBy,
  setGroupBy,
  sortOrder,
  setSortOrder,
  groupByOptions,
  sortOptions,
}) => {
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGroupBy('None');
    setSortOrder('None');
  };

  const isViewActive = groupBy !== 'None' || sortOrder !== 'None';

  const items: MenuProps['items'] = [
    {
      key: 'group-by-group',
      label: 'Group by',
      type: 'group',
      children: groupByOptions.map(opt => ({
        key: `group-${opt}`,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {opt === 'None' ? 'None' : `By ${opt}`}
            {groupBy === opt && <Check size={16} />}
          </div>
        ),
        onClick: () => setGroupBy(opt),
      })),
    },
    {
      type: 'divider',
    },
    {
      key: 'sort-by-group',
      label: 'Sort by',
      type: 'group',
      children: sortOptions.map(opt => ({
        key: `sort-${opt}`,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {opt}
            {sortOrder === opt && <Check size={16} />}
          </div>
        ),
        onClick: () => setSortOrder(opt),
      })),
    },
    {
      type: 'divider',
    },
    {
      key: 'clear-all',
      label: (
        <Button size="small" onClick={handleClearAll}>
          Clear all
        </Button>
      ),
      style: { padding: '8px 12px', height: 'auto' },
    }
  ];

  return (
    <Dropdown 
      menu={{ items }}
      trigger={['click']}
      overlayStyle={{ minWidth: 200 }}
    >
      <Button 
        icon={
          <Badge dot={isViewActive}>
            <Settings2 size={16} />
          </Badge>
        } 
        size="large"
      >
        View
      </Button>
    </Dropdown>
  );
};

export default ViewOptions; 