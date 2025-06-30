import React from 'react';
import { Table } from 'antd';
import type { Product } from '../utils/types';


interface DigitalGoodsTableProps {
  product: Product;
}

const columns = [
  {
    title: 'Digital Good',
    dataIndex: 'id',
    key: 'id',
    className: 'table-col-first',
  },
];

const DigitalGoodsTable: React.FC<DigitalGoodsTableProps> = ({ product }) => {
  if (!product.digitalGoods || product.digitalGoods.length === 0) {
    return null;
  }

  const dataSource = product.digitalGoods.map(dg => ({ id: dg, key: dg }));

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      size="small"
    />
  );
};

export default DigitalGoodsTable; 