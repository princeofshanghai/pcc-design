import React from 'react';
import { Table, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product, ColumnVisibility, ColumnOrder } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import { formatColumnTitles, toSentenceCase } from '../../utils/formatters';
import type { ColumnsType } from 'antd/es/table';


interface ProductListTableProps {
  products: Product[];
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
}

export const getProductListTableColumns = (
  _navigate: (path: string) => void, 
  visibleColumns: ColumnVisibility = {},
  columnOrder: ColumnOrder = ['name', 'folder', 'channel', 'skus', 'status']
): ColumnsType<Product> => {
  // Define all possible columns
  const allColumnsMap: Record<string, any> = {
    name: {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // Name column always visible and has minimum width
      fixed: 'left',
      minWidth: 200,
      render: (name: string, record: Product) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '4px' }}>
            <CopyableId id={record.id} size="small" />
          </div>
        </div>
      ),
      className: 'table-col-first',
    },
    folder: visibleColumns.folder !== false ? {
      title: 'Folder',
      dataIndex: 'folder',
      key: 'folder',
      // Hide on screens smaller than 1024px (desktop)
      responsive: ['lg'],
      render: (folder: string, record: Product) => (
        <div>
          <div>{folder}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>{toSentenceCase(record.lob)}</div>
        </div>
      ),
    } : null,
    channel: visibleColumns.channel !== false ? {
      title: 'Channel',
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
              <SalesChannelDisplay key={channel} channel={channel} />
            ))}
          </Space>
        );
      },
    } : null,
    skus: visibleColumns.skus !== false ? {
      title: 'SKUs',
      dataIndex: 'skus',
      key: 'skus',
      // Hide on screens smaller than 576px (mobile)
      responsive: ['sm'],
      render: (skus: any[]) => skus.length,
    } : null,
    status: visibleColumns.status !== false ? {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      // Status is important, keep visible on all screens
      render: (status: Product['status']) => <StatusTag status={status} />,
    } : null,
  };

  // Build columns in the specified order, filtering out hidden/null columns
  return formatColumnTitles(
    columnOrder
      .map(key => allColumnsMap[key])
      .filter(Boolean)
  );
};

const ProductListTable: React.FC<ProductListTableProps> = ({ 
  products, 
  visibleColumns = {},
  columnOrder = ['name', 'folder', 'channel', 'skus', 'status']
}) => {
  const navigate = useNavigate();
  const columns = getProductListTableColumns(navigate, visibleColumns, columnOrder);

  return (
    <div className="content-panel">
      <Table
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