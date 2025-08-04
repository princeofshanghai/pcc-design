import React from 'react';
import { Table, Space, Button, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { ConfigurationRequest } from '../../utils/types';
import { ChangeRequestStatus } from '../index';
import { getUserLdap } from '../../utils/users';
import { Copy, CheckCircle } from 'lucide-react';

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
    navigator.clipboard.writeText(text).then(
      () => {
        message.success({
          content: (
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={16} color="#52c41a" />
                <span>Copied to clipboard</span>
              </div>
              <div style={{ 
                color: '#bfbfbf', 
                fontSize: '12px', 
                marginTop: '4px', 
                marginLeft: '24px' // Align with text above (icon width + gap)
              }}>
                {text}
              </div>
            </div>
          ),
          duration: 2.5,
          icon: null, // Remove default icon since we're using custom one
        });
      },
      (err) => {
        message.error('Failed to copy');
        console.error('Could not copy text: ', err);
      }
    );
  };

  return [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
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
        size="small"
        columns={columns}
        dataSource={requests}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
        onRow={(record) => ({
          onClick: () => navigate(`/product/${record.targetProductId}/configuration/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default ChangeRequestListTable; 