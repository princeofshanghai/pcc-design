import React, { useState } from 'react';
import { Badge, Button, Dropdown, theme } from 'antd';
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
  const { token } = theme.useToken();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (flag: boolean, info?: { source?: 'trigger' | 'menu' }) => {
    if (info?.source === 'menu' && !flag) {
      return;
    }
    setIsOpen(flag);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (setGroupBy) setGroupBy('None');
    if (setSortOrder) setSortOrder('None');
    setIsOpen(false);
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
            {groupBy === opt && !isGroupingDisabled && <Check size={16} color={token.colorPrimary} />}
          </div>
        ),
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
            {sortOrder === opt && <Check size={16} color={token.colorPrimary} />}
          </div>
        ),
      })),
    });
  }

  if (showGroupBy || showSortBy) {
    menuItems.push({ type: 'divider' });
    menuItems.push({
      key: 'clear-all',
      label: (
        <Button
          type="link"
          danger
          size="small"
          onClick={handleClearAll}
          disabled={!isViewActive}
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

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key.startsWith('group-')) {
      const value = key.replace('group-', '');
      if (!isGroupingDisabled && setGroupBy) {
        setGroupBy(value);
      }
    } else if (key.startsWith('sort-')) {
      const value = key.replace('sort-', '');
      if (setSortOrder) {
        setSortOrder(value);
      }
    }
  };

  return (
    <Dropdown 
      open={isOpen}
      onOpenChange={handleOpenChange}
      menu={{ items: menuItems, onClick: handleMenuClick }}
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