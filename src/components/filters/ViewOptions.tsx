import React, { useState, useMemo } from 'react';
import { Badge, Button, Dropdown, theme, Menu, Checkbox } from 'antd';
import { Settings2, Check, List, LayoutGrid, GripVertical } from 'lucide-react';
import type { MenuProps } from 'antd';
import { toSentenceCase } from '../../utils/formatters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../../utils/types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export type ViewMode = 'card' | 'list';

// Sortable column item component
interface SortableColumnItemProps {
  column: ColumnConfig;
  isChecked: boolean;
  onVisibilityChange: (columnKey: string, checked: boolean) => void;
  colorTextTertiary: string;
}

const SortableColumnItem: React.FC<SortableColumnItemProps> = ({
  column,
  isChecked,
  onVisibilityChange,
  colorTextTertiary,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="sortable-column-item"
    >
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 8,
        padding: '4px 0',
        borderRadius: 4,
        cursor: column.required ? 'not-allowed' : 'grab',
        transition: 'background-color 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!column.required) {
          e.currentTarget.style.backgroundColor = '#f5f5f5';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
      >
        <div
          {...listeners}
          style={{
            cursor: column.required ? 'not-allowed' : 'grab',
            padding: '4px',
            borderRadius: '4px',
            color: column.required ? colorTextTertiary : '#666',
            display: 'flex',
            alignItems: 'center',
            transition: 'background-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!column.required) {
              e.currentTarget.style.backgroundColor = '#e6f7ff';
              e.currentTarget.style.color = '#1677ff';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = column.required ? colorTextTertiary : '#666';
          }}
        >
          <GripVertical size={14} />
        </div>
        <Checkbox
          checked={isChecked}
          onChange={(e) => onVisibilityChange(column.key, e.target.checked)}
          disabled={column.required}
          style={{ 
            fontSize: '14px',
            flex: 1,
            ...(column.required && { 
              color: colorTextTertiary,
              cursor: 'not-allowed'
            })
          }}
        >
          {column.label}
        </Checkbox>
      </div>
    </div>
  );
};


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
  size?: 'small' | 'middle' | 'large';
  // Column visibility props
  columnOptions?: ColumnConfig[];
  visibleColumns?: ColumnVisibility;
  setVisibleColumns?: (columns: ColumnVisibility) => void;
  // Column ordering props
  columnOrder?: ColumnOrder;
  setColumnOrder?: (order: ColumnOrder) => void;
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
  size = 'large',
  columnOptions,
  visibleColumns,
  setVisibleColumns,
  columnOrder,
  setColumnOrder,
}) => {
  const { token } = theme.useToken();
  const [isOpen, setIsOpen] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
    // Reset columns to show all toggleable columns
    if (setVisibleColumns && columnOptions) {
      const resetColumns: ColumnVisibility = {};
      columnOptions.forEach(col => {
        resetColumns[col.key] = true;
      });
      setVisibleColumns(resetColumns);
    }
    // Reset column order to original order
    if (setColumnOrder && columnOptions) {
      const originalOrder = columnOptions.map(col => col.key);
      setColumnOrder(originalOrder);
    }
    setIsOpen(false);
  };

  // Check if any non-default column visibility is active
  const hasColumnChanges = columnOptions && visibleColumns ? 
    columnOptions.some(col => !col.required && !visibleColumns[col.key]) : false;

  const isViewActive = viewMode === 'card' || 
    (groupBy && groupBy !== 'None') || 
    (sortOrder && sortOrder !== 'None') ||
    hasColumnChanges;

  const showGroupBy = groupBy !== undefined && setGroupBy && groupByOptions;
  const showSortBy = sortOrder !== undefined && setSortOrder && sortOptions;
  const showViewMode = viewMode !== undefined && setViewMode;
  const showColumnOptions = columnOptions !== undefined && visibleColumns !== undefined && setVisibleColumns;
  
  // Create menu items only for Group by and Sort by
  const menuItems: MenuProps['items'] = [];

  if (showGroupBy) {
    // Ensure 'None' is first, rest alphabetical
    const sortedGroupByOptions = groupByOptions
      ? [
          ...groupByOptions.filter(opt => opt === 'None'),
          ...groupByOptions.filter(opt => opt !== 'None').sort((a, b) => a.localeCompare(b))
        ]
      : [];
    menuItems.push({
      key: 'group-by-group',
      label: toSentenceCase('Group by'),
      type: 'group',
      children: sortedGroupByOptions.map(opt => ({
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
  
  const isDisabled = !showViewMode && !showGroupBy && !showSortBy && !showColumnOptions;

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

  const handleColumnVisibilityChange = (columnKey: string, checked: boolean) => {
    if (setVisibleColumns && visibleColumns) {
      setVisibleColumns({
        ...visibleColumns,
        [columnKey]: checked,
      });
    }
  };

  // Create ordered columns list
  const orderedColumns = useMemo(() => {
    if (!columnOptions) return [];
    
    if (columnOrder) {
      // Sort columns by the provided order
      const orderedCols = columnOrder
        .map(key => columnOptions.find(col => col.key === key))
        .filter(Boolean) as ColumnConfig[];
      
      // Add any columns not in the order array at the end
      const remainingCols = columnOptions.filter(
        col => !columnOrder.includes(col.key)
      );
      
      return [...orderedCols, ...remainingCols];
    }
    
    // No order specified, use original order
    return columnOptions;
  }, [columnOptions, columnOrder]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !setColumnOrder || !columnOptions) {
      return;
    }

    if (active.id !== over.id) {
      const oldIndex = orderedColumns.findIndex(col => col.key === active.id);
      const newIndex = orderedColumns.findIndex(col => col.key === over.id);
      
      const reorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      const newOrder = reorderedColumns.map(col => col.key);
      
      setColumnOrder(newOrder);
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
            display: 'flex',
            gap: '8px',
            width: '100%'
          }}>
            {/* List Option */}
            <div
              onClick={() => setViewMode('list')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 12px',
                borderRadius: token.borderRadius,
                border: `1px solid ${token.colorBorder}`,
                backgroundColor: viewMode === 'list' ? token.colorPrimaryBg : token.colorBgContainer,
                borderColor: viewMode === 'list' ? token.colorPrimary : token.colorBorder,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '64px'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'list') {
                  e.currentTarget.style.backgroundColor = token.colorFillTertiary;
                  e.currentTarget.style.borderColor = token.colorPrimaryHover;
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'list') {
                  e.currentTarget.style.backgroundColor = token.colorBgContainer;
                  e.currentTarget.style.borderColor = token.colorBorder;
                }
              }}
            >
              <List 
                size={20} 
                color={viewMode === 'list' ? token.colorPrimary : token.colorText} 
                style={{ marginBottom: '4px' }}
              />
              <span style={{ 
                fontSize: '13px',
                color: viewMode === 'list' ? token.colorPrimary : token.colorText,
                fontWeight: viewMode === 'list' ? 500 : 400
              }}>
                List
              </span>
            </div>

            {/* Card Option */}
            <div
              onClick={() => setViewMode('card')}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px 12px',
                borderRadius: token.borderRadius,
                border: `1px solid ${token.colorBorder}`,
                backgroundColor: viewMode === 'card' ? token.colorPrimaryBg : token.colorBgContainer,
                borderColor: viewMode === 'card' ? token.colorPrimary : token.colorBorder,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '64px'
              }}
              onMouseEnter={(e) => {
                if (viewMode !== 'card') {
                  e.currentTarget.style.backgroundColor = token.colorFillTertiary;
                  e.currentTarget.style.borderColor = token.colorPrimaryHover;
                }
              }}
              onMouseLeave={(e) => {
                if (viewMode !== 'card') {
                  e.currentTarget.style.backgroundColor = token.colorBgContainer;
                  e.currentTarget.style.borderColor = token.colorBorder;
                }
              }}
            >
              <LayoutGrid 
                size={20} 
                color={viewMode === 'card' ? token.colorPrimary : token.colorText}
                style={{ marginBottom: '4px' }}
              />
                             <span style={{ 
                 fontSize: '13px',
                 color: viewMode === 'card' ? token.colorPrimary : token.colorText,
                 fontWeight: viewMode === 'card' ? 500 : 400
               }}>
                 Card
               </span>
            </div>
          </div>
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

      {/* Show Columns Section - Standalone (Last Section) */}
      {showColumnOptions && (
        <>
          {/* Divider before Show Columns if there are menu items or view mode */}
          {(showViewMode || showGroupBy || showSortBy) && (
            <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }} />
          )}
          
          <div style={{ 
            padding: '12px 16px',
            backgroundColor: token.colorBgElevated,
          }}>
            <div style={{ 
              marginBottom: 8, 
              fontSize: '14px', 
              fontWeight: 400, 
              color: token.colorTextTertiary,
              lineHeight: token.lineHeightSM
            }}>
              {toSentenceCase('Show columns')}
            </div>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedColumns.map(col => col.key)}
                strategy={verticalListSortingStrategy}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {orderedColumns.map(column => (
                    <SortableColumnItem
                      key={column.key}
                      column={column}
                      isChecked={visibleColumns?.[column.key] ?? true}
                      onVisibilityChange={handleColumnVisibilityChange}
                      colorTextTertiary={token.colorTextTertiary}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </>
      )}

      {/* Clear All Section - Standalone */}
      {(showViewMode || showGroupBy || showSortBy || showColumnOptions) && (
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
        size={size}
      >
        {toSentenceCase('Display')}
      </Button>
    </Dropdown>
  );
};

export default ViewOptions; 