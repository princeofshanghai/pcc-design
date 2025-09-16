import React, { useState, useMemo } from 'react';
import { Space } from 'antd';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { mockGTMMotions } from '../utils/mock-data';
import type { GTMMotionStatus, ColumnVisibility, ColumnOrder } from '../utils/types';
import { 
  GTM_MOTION_COLUMNS, 
  DEFAULT_GTM_MOTION_COLUMNS, 
  GTM_MOTION_SORT_OPTIONS, 
  GTM_MOTION_GROUP_BY_OPTIONS,
  getFilterPlaceholder 
} from '../utils/tableConfigurations';
import { toSentenceCase } from '../utils/formatters';
import {
  PageHeader,
  FilterBar,
  GTMMotionTable,
} from '../components';



const GTMMotionList: React.FC = () => {
  const { setFolderName } = useBreadcrumb();

  // Clear breadcrumb since this is a top-level page
  React.useEffect(() => {
    setFolderName(null);
    return () => setFolderName(null);
  }, [setFolderName]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilters, setStatusFilters] = useState<GTMMotionStatus[]>([]);
  const [createdByFilter, setCreatedByFilter] = useState<string | null>(null);

  // Sort and group state
  const [sortOrder, setSortOrder] = useState('Created date (Latest to earliest)');
  const [groupBy, setGroupBy] = useState('None');

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    name: true,
    types: true,
    status: true,
    activationDate: true,
    createdBy: true,
    createdDate: false,
  });

  // Column order state
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>(DEFAULT_GTM_MOTION_COLUMNS);

  // Filter GTM motions based on search and filters
  const filteredGTMMotions = useMemo(() => {
    return mockGTMMotions.filter(motion => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          motion.id.toLowerCase().includes(query) ||
          motion.name.toLowerCase().includes(query) ||
          motion.description.toLowerCase().includes(query) ||
          motion.createdBy.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (statusFilters.length > 0 && !statusFilters.includes(motion.status)) {
        return false;
      }

      // Created by filter
      if (createdByFilter && motion.createdBy !== createdByFilter) {
        return false;
      }

      return true;
    });
  }, [mockGTMMotions, searchQuery, statusFilters, createdByFilter]);

  // Sort GTM motions
  const sortedGTMMotions = useMemo(() => {
    if (sortOrder === 'None') return filteredGTMMotions;

    const sorted = [...filteredGTMMotions];
    switch (sortOrder) {
      case 'Name (A-Z)':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'Name (Z-A)':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'Motion ID (A-Z)':
        return sorted.sort((a, b) => a.id.localeCompare(b.id));
      case 'Motion ID (Z-A)':
        return sorted.sort((a, b) => b.id.localeCompare(a.id));
      case 'Status (A-Z)':
        return sorted.sort((a, b) => a.status.localeCompare(b.status));
      case 'Status (Z-A)':
        return sorted.sort((a, b) => b.status.localeCompare(a.status));
      case 'Activation date (Earliest to latest)':
        return sorted.sort((a, b) => new Date(a.activationDate).getTime() - new Date(b.activationDate).getTime());
      case 'Activation date (Latest to earliest)':
        return sorted.sort((a, b) => new Date(b.activationDate).getTime() - new Date(a.activationDate).getTime());
      case 'Created date (Earliest to latest)':
        return sorted.sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());
      case 'Created date (Latest to earliest)':
        return sorted.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
      case 'Created by (A-Z)':
        return sorted.sort((a, b) => a.createdBy.localeCompare(b.createdBy));
      case 'Created by (Z-A)':
        return sorted.sort((a, b) => b.createdBy.localeCompare(a.createdBy));
      default:
        return sorted;
    }
  }, [filteredGTMMotions, sortOrder]);

  // Generate dynamic filter options with counts
  const statusOptions = useMemo(() => {
    const statusCounts = mockGTMMotions.reduce((acc, motion) => {
      acc[motion.status] = (acc[motion.status] || 0) + 1;
      return acc;
    }, {} as Record<GTMMotionStatus, number>);

    return Object.entries(statusCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([status, count]) => ({
        label: `${toSentenceCase(status)} (${count})`,
        value: status
      }));
  }, []);

  const createdByOptions = useMemo(() => {
    const createdByCounts = mockGTMMotions.reduce((acc, motion) => {
      acc[motion.createdBy] = (acc[motion.createdBy] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(createdByCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([creator, count]) => ({
        label: `${creator} (${count})`,
        value: creator
      }));
  }, []);

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilters([]);
    setCreatedByFilter(null);
    setSortOrder('Created date (Latest to earliest)');
    
    // Reset columns to defaults
    setVisibleColumns({
      id: true,
      name: true,
      types: true,
      status: true,
      activationDate: true,
      createdBy: true,
      createdDate: false,
    });
    setColumnOrder(DEFAULT_GTM_MOTION_COLUMNS);
  };

  const pageTitle = 'GTM motions';
  const pageSubtitle = `${filteredGTMMotions.length} motion${filteredGTMMotions.length !== 1 ? 's' : ''}`;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <PageHeader
            title={pageTitle}
            subtitle={pageSubtitle}
          />

          <FilterBar
            useCustomFilters={true}
            search={{
              placeholder: "Search by Motion ID, Name, or Description...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllFilters}
            filters={[
              {
                placeholder: getFilterPlaceholder('status'),
                options: statusOptions,
                multiSelect: true,
                multiValue: statusFilters,
                onMultiChange: (values: string[]) => setStatusFilters(values as GTMMotionStatus[]),
                disableSearch: true,
                value: null,
                onChange: () => {},
              },
              {
                placeholder: getFilterPlaceholder('createdBy'),
                options: createdByOptions,
                value: createdByFilter,
                onChange: setCreatedByFilter,
                disableSearch: true,
              },
            ]}
            viewOptions={{
              groupBy: {
                value: groupBy,
                setter: setGroupBy,
                options: GTM_MOTION_GROUP_BY_OPTIONS,
              },
              sortOrder: {
                value: sortOrder,
                setter: setSortOrder,
                options: GTM_MOTION_SORT_OPTIONS,
              },
              columnOptions: GTM_MOTION_COLUMNS,
              visibleColumns,
              setVisibleColumns,
              columnOrder,
              setColumnOrder,
              defaultVisibleColumns: {
                id: true,
                name: true,
                types: true,
                status: true,
                activationDate: true,
                createdBy: true,
                createdDate: false,
              },
              defaultColumnOrder: DEFAULT_GTM_MOTION_COLUMNS,
              defaultSortOrder: 'Created date (Latest to earliest)',
            }}
          />
        </Space>
      </div>

      <div>
        {/* TODO: Add grouping support when needed */}
        <GTMMotionTable 
          gtmMotions={sortedGTMMotions} 
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
        />
      </div>
    </div>
  );
};

export default GTMMotionList;
