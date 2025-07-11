import React from 'react';
import { Table, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../utils/types';
import LobTag from './LobTag';
import CategoryTag from './CategoryTag';
import StatusTag from './StatusTag';
import CopyableId from './CopyableId';
import type { ColumnsType } from 'antd/es/table';

interface ProductListTableProps {
  products: Product[];
}

export const getProductListTableColumns = (navigate: (path: string) => void): ColumnsType<Product> => [
  {
    title: 'Product Name',
    dataIndex: 'name',
    key: 'name',
    render: (text: string, record: Product) => (
      <a onClick={(e) => { e.stopPropagation(); navigate(`/product/${record.id}`); }}>{text}</a>
    ),
  },
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    render: (id: string) => (
      <Space onClick={(e) => e.stopPropagation()}>
        <span>{id}</span>
        <CopyableId id={id} showId={false} />
      </Space>
    ),
  },
  {
    title: 'LOB',
    dataIndex: 'lob',
    key: 'lob',
    render: (lob: Product['lob']) => <LobTag lob={lob} />,
  },
  {
    title: 'Category',
    dataIndex: 'category',
    key: 'category',
    render: (category: string, record: Product) => (
      <CategoryTag category={category} lob={record.lob} />
    ),
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

const ProductListTable: React.FC<ProductListTableProps> = ({ products }) => {
  const navigate = useNavigate();
  const columns = getProductListTableColumns(navigate);

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