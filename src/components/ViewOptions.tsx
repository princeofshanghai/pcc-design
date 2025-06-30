import React from 'react';
import { Badge, Button, Dropdown, Segmented, Space, Typography, Divider } from 'antd';
import { Settings2, Check, LayoutGrid, List } from 'lucide-react';
import type { MenuProps } from 'antd';

const { Text } = Typography;

export type ViewMode = 'card' | 'list';

interface ViewOptionsProps {
  groupBy: string;
  setGroupBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  groupByOptions: string[];
  sortOptions: string[];
  viewMode: ViewMode;
  setViewMode: (value: ViewMode) => void;
  isGroupingDisabled?: boolean;
}

const ViewOptions: React.FC<ViewOptionsProps> = ({
  groupBy,
  setGroupBy,
  sortOrder,
  setSortOrder,
  groupByOptions,
  sortOptions,
  viewMode,
  setViewMode,
  isGroupingDisabled = false,
}) => {
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGroupBy('None');
    setSortOrder('None');
  };

  const isViewActive = groupBy !== 'None' || sortOrder !== 'None';

  const menuItems: MenuProps['items'] = [
    {
      key: 'group-by-group',
      label: 'Group by',
      type: 'group',
      children: groupByOptions.map(opt => ({
        key: `group-${opt}`,
        disabled: isGroupingDisabled,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {opt === 'None' ? 'None' : `By ${opt}`}
            {groupBy === opt && !isGroupingDisabled && <Check size={16} />}
          </div>
        ),
        onClick: () => !isGroupingDisabled && setGroupBy(opt),
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
      menu={{ items: menuItems }}
      trigger={['click']}
      overlayStyle={{ minWidth: 200 }}
      dropdownRender={(menu) => (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08)' }}>
          <div style={{ padding: '8px 12px' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text type="secondary" style={{ padding: '0 4px', marginBottom: '4px' }}>View as</Text>
              <Segmented
                options={[
                  { value: 'card', icon: <LayoutGrid size={16} /> },
                  { value: 'list', icon: <List size={16} /> },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as ViewMode)}
                block
              />
            </Space>
          </div>
          <Divider style={{ margin: 0 }} />
          {React.cloneElement(menu as React.ReactElement<any>, { style: { boxShadow: 'none' } })}
        </div>
      )}
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