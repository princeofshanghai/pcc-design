import React, { useState } from 'react';
import { Badge, Button, Dropdown, theme, Segmented, Menu } from 'antd';
import { Settings2, Check, List, LayoutGrid } from 'lucide-react';
import type { MenuProps } from 'antd';
import { toSentenceCase } from '../../utils/formatters';

export type ViewMode = 'card' | 'list';


interface ViewOptionsProps {
  viewMode?: ViewMode;
  setViewMode?: (value: ViewMode) => void;
  groupBy?: string;
  setGroupBy?: (value: string) => void;
  groupByOptions?: string[];
  sortOrder?: string;
  setSortOrder?: (value: string) => void;
  sortOptions?: string[];
  isGroupingDisabled?: boolean;
}

const ViewOptions: React.FC<ViewOptionsProps> = ({
  viewMode,
  setViewMode,
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
    if (setViewMode) setViewMode('list');
    if (setGroupBy) setGroupBy('None');
    if (setSortOrder) setSortOrder('None');
    setIsOpen(false);
  };

  const isViewActive = viewMode === 'card' || (groupBy && groupBy !== 'None') || (sortOrder && sortOrder !== 'None');

  const showGroupBy = groupBy !== undefined && setGroupBy && groupByOptions;
  const showSortBy = sortOrder !== undefined && setSortOrder && sortOptions;
  const showViewMode = viewMode !== undefined && setViewMode;
  
  // Create menu items only for Group by and Sort by
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
  
  const isDisabled = !showViewMode && !showGroupBy && !showSortBy;

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

  // Custom dropdown content combining standalone components with menu
  const dropdownContent = (
    <div style={{ 
      minWidth: 200,
      backgroundColor: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowSecondary
    }}>
      {/* View Mode Section - Standalone */}
      {showViewMode && (
        <div style={{ 
          padding: '12px 16px',
          backgroundColor: token.colorBgElevated,
          borderTopLeftRadius: token.borderRadiusLG,
          borderTopRightRadius: token.borderRadiusLG
        }}>
          <div style={{ 
            marginBottom: 8, 
            fontSize: '14px', 
            fontWeight: 400, 
            color: token.colorTextTertiary,
            lineHeight: token.lineHeightSM
          }}>
            {toSentenceCase('View mode')}
          </div>
          <Segmented
            options={[
              { 
                value: 'list', 
                icon: <List size={16} />, 
                label: 'List' 
              },
              { 
                value: 'card', 
                icon: <LayoutGrid size={16} />, 
                label: 'Card' 
              },
            ]}
            value={viewMode}
            onChange={(value) => setViewMode(value as ViewMode)}
            size="middle"
            style={{ width: '100%' }}
          />
        </div>
      )}

      {/* Divider between view mode and menu items */}
      {showViewMode && (showGroupBy || showSortBy) && (
        <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }} />
      )}

      {/* Menu Items for Group by and Sort by */}
      {(showGroupBy || showSortBy) && (
        <Menu
          items={menuItems}
          onClick={handleMenuClick}
          selectable={false}
          style={{ border: 'none', boxShadow: 'none', backgroundColor: 'transparent' }}
        />
      )}

      {/* Clear All Section - Standalone */}
      {(showViewMode || showGroupBy || showSortBy) && (
        <>
          <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }} />
          <div style={{ 
            padding: '8px 16px',
            backgroundColor: token.colorBgElevated,
            borderBottomLeftRadius: token.borderRadiusLG,
            borderBottomRightRadius: token.borderRadiusLG
          }}>
            <Button
              type="link"
              danger
              size="small"
              onClick={handleClearAll}
              disabled={!isViewActive}
              style={{ padding: 0 }}
            >
              {toSentenceCase('Clear all')}
            </Button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <Dropdown 
      open={isOpen}
      onOpenChange={handleOpenChange}
      dropdownRender={() => dropdownContent}
      trigger={['click']}
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