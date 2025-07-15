import React from 'react';
import { Table, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../../utils/types';
import StatusTag from '../attributes/StatusTag';
import CopyableId from '../shared/CopyableId';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface ProductListTableProps {
  products: Product[];
  hideRedundantColumns?: boolean;
}

export const getProductListTableColumns = (_navigate: (path: string) => void, hideRedundantColumns?: boolean): ColumnsType<Product> => {
  const allColumns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: Product) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div>
            <Space size="small" onClick={(e) => e.stopPropagation()}>
              <Text type="secondary" style={{ fontSize: '13px', fontFamily: 'monospace' }}>{record.id}</Text>
              <CopyableId id={record.id} showId={false} />
            </Space>
          </div>
        </div>
      ),
      className: 'table-col-first',
    },
    {
      title: 'LOB',
      dataIndex: 'lob',
      key: 'lob',
      render: (lob: Product['lob']) => <span>{lob}</span>,
    },
    {
      title: 'Folder',
      dataIndex: 'folder',
      key: 'folder',
      render: (folder: string) => <span>{folder}</span>,
    },
    {
      title: 'SKUs',
      dataIndex: 'skus',
      key: 'skus',
      render: (skus: any[]) => skus.length,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Product['status']) => <StatusTag status={status} />,
    },
  ];

  // Filter out LOB and Folder columns when on folder pages
  if (hideRedundantColumns) {
    return allColumns.filter(col => col.key !== 'lob' && col.key !== 'folder');
  }

  return allColumns;
};

const ProductListTable: React.FC<ProductListTableProps> = ({ products, hideRedundantColumns }) => {
  const navigate = useNavigate();
  const columns = getProductListTableColumns(navigate, hideRedundantColumns);

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