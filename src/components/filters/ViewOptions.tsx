import React, { useState, useMemo } from 'react';
import { Badge, Button, Dropdown, theme, Select, Checkbox } from 'antd';
import { Settings2, List, LayoutGrid, GripVertical, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
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
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '4px 0',
        borderRadius: '4px',
        cursor: column.required ? 'default' : 'pointer',
      }}>
        <div
          {...listeners}
          style={{
            cursor: 'grab',
            display: 'flex',
            alignItems: 'center',
            color: colorTextTertiary,
            padding: '2px',
          }}
        >
          <GripVertical size={12} />
        </div>
        <Checkbox
          checked={isChecked}
          disabled={column.required}
          onChange={(e) => onVisibilityChange(column.key, e.target.checked)}
          style={{ flex: 1 }}
        >
          {toSentenceCase(column.label || column.key)}
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
  // Default column visibility for this specific context
  defaultVisibleColumns?: ColumnVisibility;
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
  defaultVisibleColumns,
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleClearAll = () => {
    // Don't reset view mode - it's a display preference, not a filter
    if (setGroupBy) {
      setGroupBy('None');
    }
    if (setSortOrder) {
      setSortOrder('None');
    }
    if (setVisibleColumns && columnOptions) {
      // Use contextual default if provided, otherwise fall back to "all visible" default
      const resetVisibility: ColumnVisibility = {};
      columnOptions.forEach(col => {
        resetVisibility[col.key] = defaultVisibleColumns ? 
          (defaultVisibleColumns[col.key] ?? true) : 
          true;
      });
      setVisibleColumns(resetVisibility);
    }
    if (setColumnOrder && columnOptions) {
      const defaultOrder = columnOptions.map(col => col.key);
      setColumnOrder(defaultOrder);
    }
    // Don't close dropdown - keep it open so user can see the changes
  };

  // Check if any non-default column visibility is active
  const hasColumnChanges = columnOptions && visibleColumns ? 
    columnOptions.some(col => {
      if (col.required) return false; // Required columns don't count as changes
      
      // Use contextual default if provided, otherwise fall back to "all visible" default
      const contextualDefault = defaultVisibleColumns ? 
        (defaultVisibleColumns[col.key] ?? true) : 
        true;
      
      // Column is considered changed if current visibility differs from contextual default
      const currentVisibility = visibleColumns[col.key] ?? true;
      return currentVisibility !== contextualDefault;
    }) : false;

  // Check if column order has been modified from default
  const hasColumnOrderChanges = columnOptions && columnOrder ? 
    !columnOptions.every((col, index) => columnOrder[index] === col.key) : false;

  const isViewActive = 
    (groupBy && groupBy !== 'None') || 
    (sortOrder && sortOrder !== 'None') ||
    hasColumnChanges ||
    hasColumnOrderChanges;

  const showGroupBy = groupBy !== undefined && setGroupBy && groupByOptions;
  const showSortBy = sortOrder !== undefined && setSortOrder && sortOptions;
  const showViewMode = viewMode !== undefined && setViewMode;
  const showColumnOptions = columnOptions !== undefined && visibleColumns !== undefined && setVisibleColumns;
  
  const isDisabled = !showViewMode && !showGroupBy && !showSortBy && !showColumnOptions;

  if (isDisabled) {
    return null;
  }

  const handleColumnVisibilityChange = (columnKey: string, checked: boolean) => {
    if (setVisibleColumns && visibleColumns) {
      setVisibleColumns({
        ...visibleColumns,
        [columnKey]: checked,
      });
    }
  };

  // Create ordered columns list with alphabetical sorting
  const orderedColumns = useMemo(() => {
    if (!columnOptions) return [];
    
    if (columnOrder) {
      // Sort columns by the provided order
      const orderedCols = columnOrder
        .map(key => columnOptions.find(col => col.key === key))
        .filter(Boolean) as ColumnConfig[];
      
      // Add any columns not in the order array at the end, sorted alphabetically
      const remainingCols = columnOptions
        .filter(col => !columnOrder.includes(col.key))
        .sort((a, b) => (a.label || a.key).localeCompare(b.label || b.key));
      
      return [...orderedCols, ...remainingCols];
    }
    
    // No order specified, sort alphabetically by label (or key if no label)
    return [...columnOptions].sort((a, b) => (a.label || a.key).localeCompare(b.label || b.key));
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

  // Prepare group by options with 'None' first
  const sortedGroupByOptions = groupByOptions
    ? [
        ...groupByOptions.filter(opt => opt === 'None'),
        ...groupByOptions.filter(opt => opt !== 'None').sort((a, b) => a.localeCompare(b))
      ]
    : [];

  // Transform sort options to separate field from direction
  const transformedSortOptions = useMemo(() => {
    if (!sortOptions) return { fields: [], directions: new Map() };

    const fieldMap = new Map<string, { ascending: string; descending: string }>();
    const nonDirectionalFields = new Set<string>();

    sortOptions.forEach(option => {
      if (option === 'None') {
        nonDirectionalFields.add(option);
        return;
      }

      // Detect directional patterns
      let baseField: string;
      let isAscending: boolean;

      if (option.includes('(A-Z)') || option.includes('A-Z')) {
        baseField = option.replace(/\s*\(A-Z\)|\s*A-Z/g, '').trim();
        isAscending = true;
      } else if (option.includes('(Z-A)') || option.includes('Z-A')) {
        baseField = option.replace(/\s*\(Z-A\)|\s*Z-A/g, '').trim();
        isAscending = false;
      } else if (option.includes('(Low to High)') || option.includes('Low to High') || option.includes('(Low to high)') || option.includes('Low to high')) {
        baseField = option.replace(/\s*\(Low to High\)|\s*Low to High|\s*\(Low to high\)|\s*Low to high/g, '').trim();
        isAscending = true;
      } else if (option.includes('(High to Low)') || option.includes('High to Low') || option.includes('(High to low)') || option.includes('High to low')) {
        baseField = option.replace(/\s*\(High to Low\)|\s*High to Low|\s*\(High to low\)|\s*High to low/g, '').trim();
        isAscending = false;

      } else {
        // Non-directional or single option - try to detect if it could have directions
        baseField = option;
        if (option.toLowerCase().includes('name') || 
            option.toLowerCase().includes('alphabetical') ||
            option.toLowerCase().includes('amount')) {
          // These could potentially have directions, treat as ascending by default
          isAscending = true;
        } else {
          nonDirectionalFields.add(option);
          return;
        }
      }

      if (!fieldMap.has(baseField)) {
        fieldMap.set(baseField, { ascending: option, descending: option });
      }

      const existing = fieldMap.get(baseField)!;
      if (isAscending) {
        existing.ascending = option;
      } else {
        existing.descending = option;
      }
    });

    // Sort fields alphabetically while keeping 'None' first
    const sortedFields = [
      'None', 
      ...Array.from(fieldMap.keys()).sort((a, b) => a.localeCompare(b)), 
      ...Array.from(nonDirectionalFields).filter(field => field !== 'None').sort((a, b) => a.localeCompare(b))
    ].filter((field, index, arr) => arr.indexOf(field) === index);
    
    return { fields: sortedFields, directions: fieldMap };
  }, [sortOptions]);

  // Parse current sort to determine field and direction
  const currentSortField = useMemo(() => {
    if (!sortOrder || sortOrder === 'None') return 'None';
    
    for (const [field, directions] of transformedSortOptions.directions) {
      if (directions.ascending === sortOrder || directions.descending === sortOrder) {
        return field;
      }
    }
    return sortOrder; // Fallback for non-directional options
  }, [sortOrder, transformedSortOptions.directions]);

  const currentSortDirection = useMemo(() => {
    if (!sortOrder || sortOrder === 'None') return 'asc';
    
    for (const [, directions] of transformedSortOptions.directions) {
      if (directions.ascending === sortOrder) return 'asc';
      if (directions.descending === sortOrder) return 'desc';
    }
    return 'asc'; // Default for non-directional
  }, [sortOrder, transformedSortOptions.directions]);

  const handleSortFieldChange = (field: string) => {
    if (!setSortOrder) return;
    
    if (field === 'None') {
      setSortOrder('None');
      return;
    }

    const directions = transformedSortOptions.directions.get(field);
    if (directions) {
      // Use current direction preference, default to ascending
      const newSortOrder = currentSortDirection === 'desc' ? directions.descending : directions.ascending;
      setSortOrder(newSortOrder);
    } else {
      // Non-directional field
      setSortOrder(field);
    }
  };

  const handleSortDirectionToggle = () => {
    if (!setSortOrder || currentSortField === 'None') return;
    
    const directions = transformedSortOptions.directions.get(currentSortField);
    if (directions) {
      const newSortOrder = currentSortDirection === 'asc' ? directions.descending : directions.ascending;
      setSortOrder(newSortOrder);
    }
  };

  const showSortDirectionToggle = currentSortField !== 'None' && transformedSortOptions.directions.has(currentSortField);

  // Custom dropdown content combining standalone components
  const dropdownContent = (
    <div style={{ 
      minWidth: 320, // Increased width to accommodate horizontal layout
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

      {/* Group By Section - Horizontal Layout */}
      {showGroupBy && (
        <>
          {showViewMode && (
            <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }} />
          )}
          <div style={{ 
            padding: '12px 16px',
            backgroundColor: token.colorBgElevated,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 400,
                color: token.colorTextTertiary,
                lineHeight: token.lineHeightSM,
                minWidth: '70px'
              }}>
                Group by
              </span>
              <Select
                value={groupBy}
                onChange={setGroupBy}
                disabled={isGroupingDisabled}
                style={{ flex: 1, minWidth: 120 }}
                size="small"
              >
                {sortedGroupByOptions.map(option => (
                  <Select.Option key={option} value={option}>
                    {toSentenceCase(option)}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
        </>
      )}

      {/* Sort By Section - Linear Style with Direction Toggle */}
      {showSortBy && (
        <>
          {(showViewMode || showGroupBy) && (
            <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }} />
          )}
          <div style={{ 
            padding: '12px 16px',
            backgroundColor: token.colorBgElevated,
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <span style={{
                fontSize: '14px',
                fontWeight: 400,
                color: token.colorTextTertiary,
                lineHeight: token.lineHeightSM,
                minWidth: '70px'
              }}>
                Sort by
              </span>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                flex: 1 
              }}>
                <Select
                  value={currentSortField}
                  onChange={handleSortFieldChange}
                  style={{ flex: 1, minWidth: 120 }}
                  size="small"
                >
                  {transformedSortOptions.fields.map(field => (
                    <Select.Option key={field} value={field}>
                      {toSentenceCase(field)}
                    </Select.Option>
                  ))}
                </Select>
                {showSortDirectionToggle && (
                  <Button
                    type="text"
                    size="small"
                    icon={currentSortDirection === 'asc' ? 
                      <ArrowUpNarrowWide size={14} /> : 
                      <ArrowDownWideNarrow size={14} />
                    }
                    onClick={handleSortDirectionToggle}
                    style={{
                      border: `1px solid ${token.colorBorder}`,
                      borderRadius: token.borderRadius,
                      width: '28px',
                      height: '24px',
                      minWidth: '28px',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: token.colorText
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Show Columns Section - Standalone (Last Section) - Only in list view */}
      {showColumnOptions && viewMode !== 'card' && (
        <>
          {/* Divider before Show Columns if there are other sections */}
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
      {(showViewMode || showGroupBy || showSortBy || (showColumnOptions && viewMode !== 'card')) && (
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
              {toSentenceCase('Reset to default')}
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