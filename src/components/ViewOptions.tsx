import React from 'react';
import { Badge, Button, Dropdown } from 'antd';
import { Settings2, Check } from 'lucide-react';
import type { MenuProps } from 'antd';
import { toSentenceCase } from '../utils/formatters';


interface ViewOptionsProps {
  groupBy?: string;
  setGroupBy?: (value: string) => void;
  groupByOptions?: string[];
  sortOrder?: string;
  setSortOrder?: (value: string) => void;
  sortOptions?: string[];
  isGroupingDisabled?: boolean;
}

const ViewOptions: React.FC<ViewOptionsProps> = ({
  groupBy,
  setGroupBy,
  sortOrder,
  setSortOrder,
  groupByOptions,
  sortOptions,
  isGroupingDisabled = false,
}) => {
  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setGroupBy) setGroupBy('None');
    if (setSortOrder) setSortOrder('None');
  };

  const isViewActive = (groupBy && groupBy !== 'None') || (sortOrder && sortOrder !== 'None');

  const showGroupBy = groupBy !== undefined && setGroupBy && groupByOptions;
  const showSortBy = sortOrder !== undefined && setSortOrder && sortOptions;
  
  const menuItems: MenuProps['items'] = [];

  if (showGroupBy) {
    menuItems.push({
      key: 'group-by-group',
      label: toSentenceCase('Group by'),
      type: 'group',
      children: groupByOptions.map(opt => ({
        key: `group-${opt}`,
        disabled: isGroupingDisabled,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {toSentenceCase(opt)}
            {groupBy === opt && !isGroupingDisabled && <Check size={16} />}
          </div>
        ),
        onClick: () => !isGroupingDisabled && setGroupBy(opt),
      })),
    });
  }

  if (showGroupBy && showSortBy) {
    menuItems.push({ type: 'divider' });
  }

  if (showSortBy) {
    menuItems.push({
      key: 'sort-by-group',
      label: toSentenceCase('Sort by'),
      type: 'group',
      children: sortOptions.map(opt => ({
        key: `sort-${opt}`,
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {toSentenceCase(opt)}
            {sortOrder === opt && <Check size={16} />}
          </div>
        ),
        onClick: () => setSortOrder(opt),
      })),
    });
  }

  if ((showGroupBy || showSortBy) && isViewActive) {
    menuItems.push({ type: 'divider' });
    menuItems.push({
      key: 'clear-all',
      label: (
        <Button 
          type="link" 
          danger
          size="small" 
          onClick={handleClearAll}
          style={{ paddingLeft: 4 }}
        >
          {toSentenceCase('Clear all')}
        </Button>
      ),
      style: { padding: '4px 8px', height: 'auto' },
    });
  }
  
  const isDisabled = menuItems.length === 0;

  if (isDisabled) {
    return null;
  }

  return (
    <Dropdown 
      menu={{ items: menuItems }}
      trigger={['click']}
      overlayStyle={{ minWidth: 200 }}
      disabled={isDisabled}
    >
      <Button 
        icon={
          <Badge dot={isViewActive || false}>
            <Settings2 size={16} />
          </Badge>
        } 
        size="large"
      >
        {toSentenceCase('Display')}
      </Button>
    </Dropdown>
  );
};

export default ViewOptions; 