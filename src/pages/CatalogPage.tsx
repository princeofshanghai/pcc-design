import React from 'react';
import { Table } from 'antd';
import PageTitle from '../components/PageTitle';
import mockProducts from '../mockProducts.json';

const columns = [
  { title: 'Product Name', dataIndex: 'displayName', key: 'displayName',
    render: (text: string, record: any) => text || record.name },
  { title: 'LOB', dataIndex: 'lineOfBusiness', key: 'lineOfBusiness' },
  { title: 'Product Status', dataIndex: 'status', key: 'status',
    render: (text: string, record: any) => text || record.publishingStatus || '—' },
  { title: 'Category', dataIndex: 'category', key: 'category' },
];

const dataSource = mockProducts.map((product: any, idx: number) => ({
  key: product.id || idx,
  ...product,
}));

const CatalogPage: React.FC = () => {
  return (
    <div style={{ padding: 0, background: 'transparent' }}>
      <PageTitle>Product Catalog</PageTitle>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        style={{ marginTop: 32, background: 'transparent', border: 'none' }}
        bordered={false}
      />
    </div>
  );
};

export default CatalogPage; 