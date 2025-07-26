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
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={false}
        // Enable horizontal scrolling for responsive behavior
        scroll={{ x: 'max-content' }}
        // Use smaller size on mobile devices
        size={window.innerWidth < 768 ? 'small' : 'middle'}
      />
    </div>
  );
};

export default DigitalGoodsTable; 