import React, { useState, useMemo } from 'react';
import { Badge, Button, Dropdown, theme, Select, Tag } from 'antd';
import { Settings2, ArrowDownWideNarrow, ArrowUpNarrowWide } from 'lucide-react';
import { toSentenceCase, formatGroupHeader } from '../../utils/formatters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { CUSTOM_COLORS } from '../../theme';

const { CheckableTag } = Tag;

interface ViewOptionsProps {
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
  // Default column order for this specific context
  defaultColumnOrder?: ColumnOrder;
}

const ViewOptions: React.FC<ViewOptionsProps> = ({
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
  setColumnOrder: _setColumnOrder,
  defaultVisibleColumns,
  defaultColumnOrder,
}) => {
  const { token } = theme.useToken();
  const [isOpen, setIsOpen] = useState(false);

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
      
      // Always include required columns as visible
      columnOptions
        .filter(col => col.required)
        .forEach(col => {
          resetVisibility[col.key] = true;
        });
      
      // Reset non-required columns based on defaults
      columnOptions
        .filter(col => !col.required)
        .forEach(col => {
          resetVisibility[col.key] = defaultVisibleColumns ? 
            (defaultVisibleColumns[col.key] ?? true) : 
            true;
        });
      
      setVisibleColumns(resetVisibility);
    }
    if (_setColumnOrder && defaultColumnOrder) {
      // Reset column order to the provided default
      _setColumnOrder(defaultColumnOrder);
    }
    // Don't close dropdown - keep it open so user can see the changes
  };

  // Check if any non-default column visibility is active
  const hasColumnChanges = columnOptions && visibleColumns ? 
    columnOptions
      .filter(col => !col.required) // Only check non-required columns
      .some(col => {
        // Use contextual default if provided, otherwise fall back to "all visible" default
        const contextualDefault = defaultVisibleColumns ? 
          (defaultVisibleColumns[col.key] ?? true) : 
          true;
        
        // Column is considered changed if current visibility differs from contextual default
        const currentVisibility = visibleColumns[col.key] ?? true;
        return currentVisibility !== contextualDefault;
      }) : false;

  // Check if column order has changed from default
  const hasColumnOrderChanges = columnOrder && defaultColumnOrder ? 
    columnOrder.length !== defaultColumnOrder.length ||
    columnOrder.some((key, index) => key !== defaultColumnOrder[index]) : false;

  const isViewActive = 
    (groupBy && groupBy !== 'None') || 
    (sortOrder && sortOrder !== 'None') ||
    hasColumnChanges ||
    hasColumnOrderChanges;

  const showGroupBy = groupBy !== undefined && setGroupBy && groupByOptions;
  const showSortBy = sortOrder !== undefined && setSortOrder && sortOptions;
  const showColumnOptions = columnOptions !== undefined && visibleColumns !== undefined && setVisibleColumns;
  
  const isDisabled = !showGroupBy && !showSortBy && !showColumnOptions;

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

  // Order columns based on columnOrder prop, excluding required columns
  const sortedColumns = useMemo(() => {
    if (!columnOptions) return [];
    
    // Filter out required columns first
    const nonRequiredColumns = columnOptions.filter(col => !col.required);
    
    if (columnOrder && columnOrder.length > 0) {
      // Sort columns by the provided order
      const orderedCols = columnOrder
        .map(key => nonRequiredColumns.find(col => col.key === key))
        .filter(Boolean) as ColumnConfig[];
      
      // Add any columns not in the order array at the end, sorted alphabetically
      const remainingCols = nonRequiredColumns
        .filter(col => !columnOrder.includes(col.key))
        .sort((a, b) => (a.label || a.key).localeCompare(b.label || b.key));
      
      return [...orderedCols, ...remainingCols];
    }
    
    // Fallback: sort alphabetically by label (or key if no label) if no order specified
    return [...nonRequiredColumns].sort((a, b) => (a.label || a.key).localeCompare(b.label || b.key));
  }, [columnOptions, columnOrder]);

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
      } else if (option.includes('(Earliest to latest)') || option.includes('Earliest to latest')) {
        baseField = option.replace(/\s*\(Earliest to latest\)|\s*Earliest to latest/g, '').trim();
        isAscending = true;
      } else if (option.includes('(Latest to earliest)') || option.includes('Latest to earliest')) {
        baseField = option.replace(/\s*\(Latest to earliest\)|\s*Latest to earliest/g, '').trim();
        isAscending = false;

      } else {
        // Non-directional or single option - try to detect if it could have directions
        baseField = option;
        if (option.toLowerCase().includes('name') || 
            option.toLowerCase().includes('alphabetical') ||
            option.toLowerCase().includes('amount') ||
            option.toLowerCase().includes('validity') ||
            option.toLowerCase().includes('category')) {
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
      minWidth: 320,
      maxWidth: 400, // Prevent dropdown from becoming too wide
      backgroundColor: token.colorBgElevated,
      borderRadius: token.borderRadiusLG,
      boxShadow: token.boxShadowSecondary
    }}>


      {/* Group By Section - Horizontal Layout */}
      {showGroupBy && (
        <div style={{ 
          padding: '12px 16px',
          backgroundColor: token.colorBgElevated,
          borderTopLeftRadius: token.borderRadiusLG,
          borderTopRightRadius: token.borderRadiusLG
        }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <span style={{
                fontSize: token.fontSize,
                fontWeight: 400,
                color: token.colorTextSecondary,
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
                    {formatGroupHeader(option)}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>
      )}

      {/* Sort By Section - Linear Style with Direction Toggle */}
      {showSortBy && (
        <>
          {showGroupBy && (
            <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }} />
          )}
          <div style={{ 
            padding: '12px 16px',
            backgroundColor: token.colorBgElevated,
            ...(!showGroupBy && {
              borderTopLeftRadius: token.borderRadiusLG,
              borderTopRightRadius: token.borderRadiusLG
            })
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <span style={{
                fontSize: token.fontSize,
                fontWeight: 400,
                color: token.colorTextSecondary,
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
                      {formatGroupHeader(field)}
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

      {/* Show Columns Section - Standalone (Last Section) */}
      {showColumnOptions && (
        <>
          {/* Divider before Show Columns if there are other sections */}
          {(showGroupBy || showSortBy) && (
            <div style={{ borderTop: `1px solid ${token.colorBorderSecondary}` }} />
          )}
          
          <div style={{ 
            padding: '12px 16px',
            backgroundColor: token.colorBgElevated,
            ...(!showGroupBy && !showSortBy && {
              borderTopLeftRadius: token.borderRadiusLG,
              borderTopRightRadius: token.borderRadiusLG
            })
          }}>
            <div style={{ 
              marginBottom: 8, 
              fontSize: token.fontSize, 
              fontWeight: 400, 
              color: token.colorTextSecondary,
              lineHeight: token.lineHeightSM
            }}>
              {toSentenceCase('Show columns')}
            </div>
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              alignItems: 'flex-start'
            }}>
              {sortedColumns.map(column => {
                const isChecked = visibleColumns?.[column.key] ?? true;
                
                return (
                  <CheckableTag
                    key={column.key}
                    checked={isChecked}
                    onChange={(checked) => {
                      handleColumnVisibilityChange(column.key, checked);
                    }}
                    style={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: token.borderRadius,
                      lineHeight: '16px',
                      userSelect: 'none',
                      margin: 0,
                      // Minimal styling - same background, only border differs
                      backgroundColor: token.colorBgContainer,
                      border: `1px solid ${isChecked 
                        ? CUSTOM_COLORS.borderSelected 
                        : token.colorBorderSecondary}`,
                      color: token.colorText,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {toSentenceCase(column.label || column.key)}
                  </CheckableTag>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Clear All Section - Standalone */}
      {(showGroupBy || showSortBy || showColumnOptions) && (
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
              size="small"
              onClick={handleClearAll}
              disabled={!isViewActive}
              style={{ 
                padding: 0,
                // Only apply primary color when enabled, let Ant Design handle disabled styling
                ...(isViewActive ? { color: token.colorPrimary } : {})
              }}
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
        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
      >
        {toSentenceCase('Display')}
      </Button>
    </Dropdown>
  );
};

export default ViewOptions; 