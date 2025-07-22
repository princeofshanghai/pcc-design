import React from 'react';
import { Table, Space, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { ConfigurationRequest } from '../../utils/types';
import { ChangeRequestStatus } from '../index';
import { getUserLdap } from '../../utils/users';
import { formatColumnTitles } from '../../utils/formatters';
import { Copy } from 'lucide-react';

const { Text } = Typography;

interface ConfigurationRequestWithProduct extends ConfigurationRequest {
  productName: string;
}

interface ChangeRequestListTableProps {
  requests: ConfigurationRequestWithProduct[];
}

export const getChangeRequestListTableColumns = (navigate: (path: string) => void): ColumnsType<ConfigurationRequestWithProduct> => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  };

  return [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id: string) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Text>{id}</Text>
          <Button
            type="text"
            size="small"
            icon={<Copy size={12} />}
            onClick={() => copyToClipboard(id)}
          />
        </Space>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <ChangeRequestStatus status={status} />,
    },
    {
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (productName: string, record) => (
        <Button
          type="link"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${record.targetProductId}`);
          }}
        >
          {productName}
        </Button>
      ),
    },

    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: string) => (
        <Text>{getUserLdap(createdBy)}</Text>
      ),
    },
    {
      title: 'Created date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (createdDate: string) => (
        <Text>{formatDate(createdDate)}</Text>
      ),
    },
  ];
};

const ChangeRequestListTable: React.FC<ChangeRequestListTableProps> = ({ requests }) => {
  const navigate = useNavigate();
  const columns = getChangeRequestListTableColumns(navigate);

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={requests}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1000 }}
        onRow={(record) => ({
          onClick: () => navigate(`/product/${record.targetProductId}/configuration/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default ChangeRequestListTable; 