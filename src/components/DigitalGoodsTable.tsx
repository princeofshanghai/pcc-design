import React from 'react';
import { Table } from 'antd';
import type { Product } from '../utils/types';
import { toSentenceCase } from '../utils/formatting';

interface DigitalGoodsTableProps {
  product: Product;
}

const DigitalGoodsTable: React.FC<DigitalGoodsTableProps> = ({ product }) => {
  if (!product.digitalGoods || product.digitalGoods.length === 0) {
    return null;
  }

  // Antd table expects an array of objects. We need to map the string[] to it.
  const dataSource = product.digitalGoods.map((good, index) => ({
    key: index, // Use index as key since the string might not be unique
    name: good,
  }));

  const columns = [
    {
      title: toSentenceCase('Name'),
      dataIndex: 'name',
      key: 'name',
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey="key"
      pagination={false}
      size="small"
    />
  );
};

export default DigitalGoodsTable; 