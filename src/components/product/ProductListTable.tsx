import React from 'react';
import { Table, Space, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product, ColumnVisibility, ColumnOrder } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import SecondaryText from '../shared/SecondaryText';
import { formatColumnTitles, toSentenceCase } from '../../utils/formatters';
import { PRODUCT_COLUMNS, DEFAULT_PRODUCT_COLUMNS } from '../../utils/tableConfigurations';
import { getColumnTitleWithTooltip } from '../../utils/tableHelpers';
import type { ColumnsType } from 'antd/es/table';


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
      minWidth: 150,
      render: (_: any, record: Product) => (
        <div onClick={(e) => e.stopPropagation()}>
          <CopyableId id={record.id} variant="prominent" />
        </div>
      ),
      className: 'table-col-first',
    },
    name: visibleColumns.name === true ? {
      title: getColumnLabel('name'),
      dataIndex: 'name',
      key: 'name',
      minWidth: 200,
      render: (name: string) => (
        <div>{name}</div>
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
          <div>{folder}</div>
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
          <Space size={4} wrap>
            {uniqueChannels.map(channel => (
              <SalesChannelDisplay key={channel} channel={channel} variant="small" />
            ))}
          </Space>
        );
      },
    } : null,
    skus: visibleColumns.skus === true ? {
      title: getColumnTitleWithTooltip(getColumnLabel('skus'), 'Number of SKUs in this product'),
      dataIndex: 'skus',
      key: 'skus',
      // Hide on screens smaller than 576px (mobile)
      responsive: ['sm'],
      render: (skus: any[]) => skus.length,
    } : null,
    status: visibleColumns.status === true ? {
      title: getColumnLabel('status'),
      dataIndex: 'status',
      key: 'status',
      // Status is important, keep visible on all screens
      render: (status: Product['status']) => <StatusTag status={status} variant="small" />,
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
  
  return formatColumnTitles(
    orderedColumnKeys
      .map(key => allColumnsMap[key])
      .filter(Boolean)
  );
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