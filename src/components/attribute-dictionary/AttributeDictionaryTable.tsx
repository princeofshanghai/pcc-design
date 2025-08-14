import React from 'react';
import { Table, Tooltip, Space } from 'antd';
import { Info } from 'lucide-react';
import type { Attribute } from '../../utils/types';
import type { ColumnsType } from 'antd/es/table';

interface AttributeDictionaryTableProps {
  attributes: Attribute[];
}

const AttributeDictionaryTable: React.FC<AttributeDictionaryTableProps> = ({ attributes }) => {
  const columns: ColumnsType<Attribute> = [
    {
      title: 'Attribute name',
      dataIndex: 'name',
      key: 'name',
      minWidth: 200,
    },
    {
      title: (
        <Space size={4}>
          <span>Domain</span>
          <Tooltip title="This is the domain owner of the attribute. All other domains will read from the SOT for the values of this attribute">
            <Info size={14} style={{ color: '#999' }} />
          </Tooltip>
        </Space>
      ),
      dataIndex: 'domain',
      key: 'domain',
      width: 150,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <span style={{ fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
          {type}
        </span>
      ),
    },
    {
      title: 'Default value',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 120,
      render: (value: any) => {
        if (value === null) return <span style={{ color: '#999', fontStyle: 'italic' }}>null</span>;
        if (typeof value === 'boolean') return value ? 'true' : 'false';
        return String(value);
      },
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      minWidth: 300,
      render: (description: string) => (
        <span style={{ color: '#666' }}>
          {description}
        </span>
      ),
    },
  ];

  return (
    <Table
      dataSource={attributes}
      columns={columns}
      rowKey="id"
      size="middle"
      pagination={false}
      scroll={{ x: 'max-content' }}
      style={{
        background: 'white',
        borderRadius: '8px',
      }}
    />
  );
};

export default AttributeDictionaryTable;
