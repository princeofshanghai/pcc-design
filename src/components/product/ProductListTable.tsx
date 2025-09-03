import React from 'react';
import { Table, theme, Tag, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';
import type { Product, ColumnVisibility, ColumnOrder } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import SecondaryText from '../shared/SecondaryText';
import VerticalSeparator from '../shared/VerticalSeparator';
import { getChannelIcon } from '../../utils/channelIcons';
import { formatColumnTitles, toSentenceCase, formatCustomerNumber, generateFakePercentageChange } from '../../utils/formatters';
import { PRODUCT_COLUMNS, DEFAULT_PRODUCT_COLUMNS } from '../../utils/tableConfigurations';
import type { ColumnsType } from 'antd/es/table';

// Format folder names with special rules for proper names and placeholders
const formatFolderName = (folderName: string): string => {
  if (!folderName) return folderName;
  
  // Handle specific placeholder patterns
  if (folderName.toLowerCase() === 'all lms products') {
    return 'All LMS products';
  }
  if (folderName.toLowerCase() === 'all other products') {
    return 'All other products';
  }
  
  // Check if it's likely a proper name (contains multiple capital letters)
  // This handles cases like "Premium Company Page"
  const hasMultipleCapitals = (folderName.match(/[A-Z]/g) || []).length > 1;
  if (hasMultipleCapitals) {
    return folderName; // Keep proper names as-is
  }
  
  // Apply sentence case for other folders
  return toSentenceCase(folderName);
};


interface ProductListTableProps {
  products: Product[];
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
}

export const getProductListTableColumns = (
  _navigate: (path: string) => void, 
  visibleColumns: ColumnVisibility = {},
  columnOrder: ColumnOrder = DEFAULT_PRODUCT_COLUMNS
): ColumnsType<Product> => {
  const { token } = theme.useToken();
  // Create a helper to get column label from centralized config
  const getColumnLabel = (key: string): string => {
    const column = PRODUCT_COLUMNS.find(col => col.key === key);
    return column?.label || toSentenceCase(key);
  };

  // Define all possible columns
  const allColumnsMap: Record<string, any> = {
    id: {
      title: getColumnLabel('id'),
      dataIndex: 'id',
      key: 'id',
      // ID column always visible and fixed left
      fixed: 'left',
      render: (_: any, record: Product) => (
        <div onClick={(e) => e.stopPropagation()}>
          <CopyableId id={record.id} variant="default" />
        </div>
      ),
      className: 'table-col-first',
    },
    name: visibleColumns.name === true ? {
      title: getColumnLabel('name'),
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontWeight: 500 }}>{name}</span>
            <StatusTag status={record.status} showLabel={false} variant="small" />
            {record.isBundle && (
              <Tag>Bundle</Tag>
            )}
          </div>
          <SecondaryText style={{ fontSize: token.fontSizeSM }}>
            {record.skus ? record.skus.length : 0} SKUs
          </SecondaryText>
        </div>
      ),
    } : null,

    folder: visibleColumns.folder === true ? {
      title: getColumnLabel('folder'),
      dataIndex: 'folder',
      key: 'folder',
      // Hide on screens smaller than 1024px (desktop)
      responsive: ['lg'],
      render: (folder: string, record: Product) => (
        <div>
          <div>{formatFolderName(folder)}</div>
          <SecondaryText style={{ fontSize: token.fontSizeSM }}>{toSentenceCase(record.lob)}</SecondaryText>
        </div>
      ),
    } : null,
    channel: visibleColumns.channel === true ? {
      title: getColumnLabel('channel'),
      dataIndex: 'channel',
      key: 'channel',
      // Hide on screens smaller than 768px (tablet)
      responsive: ['md'],
      render: (_: any, record: Product) => {
        if (!record.skus || record.skus.length === 0) return null;
        const uniqueChannels = [...new Set(record.skus.map(sku => sku.salesChannel))];
        return (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {uniqueChannels.map((channel, index) => (
              <React.Fragment key={channel}>
                {index > 0 && <VerticalSeparator />}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {getChannelIcon(channel)}
                  {channel}
                </span>
              </React.Fragment>
            ))}
          </div>
        );
      },
    } : null,

    status: visibleColumns.status === true ? {
      title: getColumnLabel('status'),
      dataIndex: 'status',
      key: 'status',
      // Status is important, keep visible on all screens
      render: (status: Product['status']) => <StatusTag status={status} variant="small" />,
    } : null,

    customers: visibleColumns.customers === true ? {
      title: getColumnLabel('customers'),
      key: 'customers',
      // Hide on screens smaller than 1024px (desktop)
      responsive: ['lg'],
      render: (_: any, record: Product) => {
        // Determine if this product has field channels or online channels
        const hasFieldChannel = record.skus?.some(sku => sku.salesChannel === 'Field') || false;
        const hasOnlineChannels = record.skus?.some(sku => 
          ['Desktop', 'iOS', 'GPB'].includes(sku.salesChannel)
        ) || false;
        
        // If product has both field and online, prioritize the dominant one
        // If only field, show contracts; if only online or mixed, show subscriptions
        const showContracts = hasFieldChannel && !hasOnlineChannels;
        const totalCustomers = showContracts ? 
          (record.totalActiveContracts || 0) : 
          (record.totalSubscriptions || 0);
        
        const isActive = record.status === 'Active';
        const percentageChange = generateFakePercentageChange(isActive);
        
        return (
          <Tooltip title="Updated a week ago" placement="top">
            <div>
              {/* First row: Number + percentage change indicator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 500 }}>
                  {formatCustomerNumber(totalCustomers)}
                </span>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2px',
                  color: percentageChange.isPositive ? token.colorSuccess : token.colorError,
                  fontSize: '12px'
                }}>
                  {percentageChange.isPositive ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  {percentageChange.value.toFixed(1)}%
                </div>
              </div>
              
              {/* Second row: Secondary text */}
              <SecondaryText style={{ fontSize: token.fontSizeSM }}>
                {showContracts ? 'contracts' : 'subscriptions'}
              </SecondaryText>
            </div>
          </Tooltip>
        );
      },
    } : null,
  };

  // Build columns in the specified order, filtering out hidden/null columns
  // Include all possible columns that are visible, not just those in columnOrder
  const allVisibleColumnKeys = Object.keys(allColumnsMap).filter(key => {
    const column = allColumnsMap[key];
    return column !== null && column !== undefined;
  });
  
  // Create ordered list: first use columnOrder, then append any missing visible columns
  const orderedColumnKeys = [
    ...columnOrder.filter(key => allVisibleColumnKeys.includes(key)),
    ...allVisibleColumnKeys.filter(key => !columnOrder.includes(key))
  ];
  
  const baseColumns = formatColumnTitles(
    orderedColumnKeys
      .map(key => allColumnsMap[key])
      .filter(Boolean)
  );

  // Action column (always visible, fixed to right) - visual indicator for clickability
  const actionColumn = {
    title: '', // No column title
    key: 'actions',
    fixed: 'right' as const,
    width: 48,
    render: (_: any, _record: Product) => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
        <ChevronRight 
          size={16} 
          style={{ 
            color: token.colorTextTertiary,
          }} 
        />
      </div>
    ),
  };

  // Combine base columns with action column
  return [...baseColumns, actionColumn];
};

const ProductListTable: React.FC<ProductListTableProps> = ({ 
  products, 
  visibleColumns = {},
  columnOrder = DEFAULT_PRODUCT_COLUMNS
}) => {
  const navigate = useNavigate();
  const columns = getProductListTableColumns(navigate, visibleColumns, columnOrder);

  return (
    <div style={{ marginTop: '16px' }}>
      <Table
        size="small"
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => navigate(`/product/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default ProductListTable; 