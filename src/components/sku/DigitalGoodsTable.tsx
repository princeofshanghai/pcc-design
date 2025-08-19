import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DigitalGoodRecord {
  key: string;
  name: string;
}

interface DigitalGoodsTableProps {
  digitalGoods: string[];
}

const DigitalGoodsTable: React.FC<DigitalGoodsTableProps> = ({ digitalGoods }) => {
  const dataSource: DigitalGoodRecord[] = digitalGoods.map((good, index) => ({
    key: `${good}-${index}`,
    name: good,
  }));

  const columns: ColumnsType<DigitalGoodRecord> = [
    {
      title: 'Digital goods',
      dataIndex: 'name',
      key: 'name',
      className: 'table-col-first',
    },
  ];

  return (
    <div style={{ marginTop: '16px' }}>
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  );
};

export default DigitalGoodsTable; 