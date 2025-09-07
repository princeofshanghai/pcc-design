import React, { useState, useMemo } from 'react';
import { Space, Table, Typography, Tag, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { mockGTMMotions } from '../utils/mock-data';
import type { GTMMotion, GTMMotionStatus, ColumnVisibility, ColumnOrder } from '../utils/types';
import { 
  GTM_MOTION_COLUMNS, 
  DEFAULT_GTM_MOTION_COLUMNS, 
  GTM_MOTION_SORT_OPTIONS, 
  GTM_MOTION_GROUP_BY_OPTIONS,
  getFilterPlaceholder 
} from '../utils/tableConfigurations';
import { toSentenceCase, formatFullDate } from '../utils/formatters';
import {
  PageHeader,
  FilterBar,
  CopyableId,
  InfoPopover,
} from '../components';

const { Text } = Typography;

// GTM Motion status colors mapping
const getStatusColor = (status: GTMMotionStatus): string => {
  switch (status) {
    case 'Draft': return 'default';           // Gray - still working on it
    case 'Submitted': return 'processing';    // Blue - in the system
    case 'Pending approvals': return 'warning';  // Orange - waiting for people
    case 'Approved': return 'success';        // Green - good to go
    case 'Pending to prod': return 'purple';  // Purple - technical deployment
    case 'Complete': return 'success';        // Green - all done
    default: return 'default';
  }
};

// Status descriptions for tooltips
const getStatusDescription = (status: GTMMotionStatus): string => {
  switch (status) {
    case 'Draft': 
      return 'Product managers and business stakeholders can collaborate and add/remove price changes. All fields are editable.';
    case 'Submitted': 
      return 'Motion has been submitted for processing. Only name, description, and activation date can be edited. Price changes are locked.';
    case 'Pending approvals': 
      return 'Waiting for required approvals from stakeholders. No changes can be made except to cancel the motion.';
    case 'Approved': 
      return 'All approvals completed. Motion is ready for production deployment on the scheduled activation date.';
    case 'Pending to prod': 
      return 'Deployment to production is in progress. This process takes up to 24 hours. Motion cannot be cancelled.';
    case 'Complete': 
      return 'All price changes have been successfully deployed to production. Motion is now historical.';
    default: 
      return 'Unknown status';
  }
};

interface GTMMotionTableProps {
  gtmMotions: GTMMotion[];
  visibleColumns: ColumnVisibility;
  columnOrder: ColumnOrder;
}

const GTMMotionTable: React.FC<GTMMotionTableProps> = ({ 
  gtmMotions, 
  visibleColumns, 
  columnOrder 
}) => {
  const { token } = theme.useToken();

  const columns: ColumnsType<GTMMotion> = [
    {
      title: 'Motion ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      render: (id: string) => (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <CopyableId id={id} variant="default" />
        </div>
      ),
      className: 'table-col-first',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: GTMMotion) => (
        <div>
          <Text style={{ fontWeight: 500 }}>{name}</Text>
          <br />
          <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
            {record.items.length} change{record.items.length !== 1 ? 's' : ''}
          </Text>
        </div>
      ),
    },
    {
      title: 'Product',
      key: 'product',
      render: (_, record: GTMMotion) => {
        // Get unique products from the motion items
        const uniqueProducts = Array.from(
          new Map(record.items.map(item => [item.productId, item])).values()
        );

        if (uniqueProducts.length === 0) {
          return (
            <Text style={{ color: token.colorTextTertiary, fontSize: token.fontSizeSM }}>
              No products
            </Text>
          );
        }

        if (uniqueProducts.length === 1) {
          const product = uniqueProducts[0];
          return (
            <div>
              <Text style={{ fontWeight: 500 }}>{product.productName}</Text>
              <br />
              <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
                {product.productId}
              </Text>
            </div>
          );
        }

        // Multiple products
        return (
          <div>
            <Text style={{ fontWeight: 500 }}>{uniqueProducts[0].productName}</Text>
            <br />
            <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
              +{uniqueProducts.length - 1} more product{uniqueProducts.length > 2 ? 's' : ''}
            </Text>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: GTMMotionStatus) => (
        <InfoPopover 
          content={getStatusDescription(status)}
          placement="top"
          maxWidth={320}
        >
          <Tag color={getStatusColor(status)} style={{ cursor: 'help' }}>
            {status}
          </Tag>
        </InfoPopover>
      ),
    },
    {
      title: 'Activation Date',
      dataIndex: 'activationDate',
      key: 'activationDate',
      render: (date: string) => (
        <Text style={{ color: token.colorTextSecondary }}>
          {formatFullDate(date)}
        </Text>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: string) => (
        <Text>{createdBy}</Text>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (date: string) => (
        <Text style={{ color: token.colorTextSecondary }}>
          {formatFullDate(date)}
        </Text>
      ),
    },
  ];

  // Filter columns based on visibility and reorder them
  const visibleOrderedColumns = columnOrder
    .filter(key => visibleColumns[key])
    .map(key => columns.find(col => col.key === key))
    .filter((col): col is NonNullable<typeof col> => col !== undefined);

  return (
    <Table
      size="small"
      columns={visibleOrderedColumns}
      dataSource={gtmMotions}
      rowKey="id"
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} motions`,
        defaultPageSize: 50,
        pageSizeOptions: ['25', '50', '100', '200'],
      }}
      onRow={(record) => ({
        onClick: () => {
          window.location.href = `/gtm-motions/${record.id}`;
        },
        style: { cursor: 'pointer' }
      })}
    />
  );
};

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
  const [sortOrder, setSortOrder] = useState('None');
  const [groupBy, setGroupBy] = useState('None');

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,
    name: true,
    product: true,
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
    
    // Reset columns to defaults
    setVisibleColumns({
      id: true,
      name: true,
      product: true,
      status: true,
      activationDate: true,
      createdBy: true,
      createdDate: false,
    });
    setColumnOrder(DEFAULT_GTM_MOTION_COLUMNS);
  };

  const pageTitle = 'GTM Motions';
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
                product: true,
                status: true,
                activationDate: true,
                createdBy: true,
                createdDate: false,
              },
              defaultColumnOrder: DEFAULT_GTM_MOTION_COLUMNS,
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
