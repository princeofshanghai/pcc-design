import React from 'react';
import { Table, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product, ColumnVisibility, ColumnOrder } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import { formatColumnTitles } from '../../utils/formatters';
import type { ColumnsType } from 'antd/es/table';


interface ProductListTableProps {
  products: Product[];
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
}

export const getProductListTableColumns = (
  _navigate: (path: string) => void, 
  visibleColumns: ColumnVisibility = {},
  columnOrder: ColumnOrder = ['name', 'lob', 'folder', 'skus', 'status']
): ColumnsType<Product> => {
  // Define all possible columns
  const allColumnsMap: Record<string, any> = {
    name: {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
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
    lob: visibleColumns.lob !== false ? {
      title: 'LOB',
      dataIndex: 'lob',
      key: 'lob',
      render: (lob: Product['lob']) => <span>{lob}</span>,
    } : null,
    folder: visibleColumns.folder !== false ? {
      title: 'Folder',
      dataIndex: 'folder',
      key: 'folder',
      render: (folder: string) => <span>{folder}</span>,
    } : null,
    skus: visibleColumns.skus !== false ? {
      title: 'SKUs',
      dataIndex: 'skus',
      key: 'skus',
      render: (skus: any[]) => skus.length,
    } : null,
    status: visibleColumns.status !== false ? {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
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
  columnOrder = ['name', 'lob', 'folder', 'skus', 'status']
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
        onRow={(record) => ({
          onClick: () => navigate(`/product/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default ProductListTable; 