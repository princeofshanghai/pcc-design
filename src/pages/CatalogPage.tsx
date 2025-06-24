import React from 'react';
import { Table } from 'antd';
import PageTitle from '../components/PageTitle';
import PageContainer from '../components/PageContainer';
import mockProducts from '../mockProducts.json';

const columns = [
  { 
    title: 'Product Name', 
    dataIndex: 'displayName', 
    key: 'displayName',
    render: (text: string, record: any) => (
      <span style={{ 
        fontSize: '14px',
        fontWeight: 500,
        color: '#0f172a',
        lineHeight: '1.4'
      }}>
        {text || record.name}
      </span>
    )
  },
  { 
    title: 'LOB', 
    dataIndex: 'lineOfBusiness', 
    key: 'lineOfBusiness',
    render: (text: string) => (
      <span style={{ 
        fontSize: '12px',
        color: '#64748b',
        fontWeight: 400,
        letterSpacing: '0.05em'
      }}>
        {text || '—'}
      </span>
    )
  },
  { 
    title: 'Product Status', 
    dataIndex: 'status', 
    key: 'status',
    render: (text: string, record: any) => (
      <span style={{ 
        fontSize: '12px',
        color: '#64748b',
        fontWeight: 400
      }}>
        {text || record.publishingStatus || '—'}
      </span>
    )
  },
  { 
    title: 'Category', 
    dataIndex: 'category', 
    key: 'category',
    render: (text: string) => (
      <span style={{ 
        fontSize: '12px',
        color: '#64748b',
        fontWeight: 400,
        letterSpacing: '0.05em'
      }}>
        {text || '—'}
      </span>
    )
  },
];

const dataSource = mockProducts.map((product: any, idx: number) => ({
  key: product.id || idx,
  ...product,
}));

const CatalogPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Product Catalog</PageTitle>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
        style={{ 
          marginTop: 0, // Remove margin since PageContainer handles spacing
          background: 'transparent', 
          border: 'none',
          fontSize: '14px',
          lineHeight: '1.4'
        }}
        bordered={false}
        rowClassName={() => 'vercel-table-row'}
      />
    </PageContainer>
  );
};

export default CatalogPage; 