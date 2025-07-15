import React from 'react';
import { Table, Space, Button, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import type { ConfigurationRequest } from '../../utils/types';
import { ChangeRequestStatus, ExperimentalBadge } from '../index';
import { ExternalLink, Copy } from 'lucide-react';

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
      render: (id: string, record) => (
        <Space onClick={(e) => e.stopPropagation()}>
          <Button
            type="link"
            size="small"
            onClick={() => navigate(`/product/${record.targetProductId}/configuration/${id}`)}
          >
            {id}
          </Button>
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
      title: 'Product',
      dataIndex: 'productName',
      key: 'productName',
      render: (productName: string, record) => (
        <Button
          type="link"
          size="small"
          icon={<ExternalLink size={12} />}
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
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <ChangeRequestStatus status={status} />,
    },
    {
      title: 'Change Request',
      key: 'configuration',
      render: (_, record) => (
        <Space direction="vertical" size={4}>
          <Space wrap>
            <Tag color="blue">{record.salesChannel}</Tag>
            <Tag color="purple">{record.billingCycle}</Tag>
            <Tag color="green">${record.priceAmount.toFixed(2)}</Tag>
          </Space>
          {record.lixKey && (
            <ExperimentalBadge
              lixKey={record.lixKey}
              lixTreatment={record.lixTreatment}
              variant="compact"
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: string) => (
        <Text style={{ fontSize: '13px' }}>{createdBy}</Text>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      render: (createdDate: string) => (
        <Text style={{ fontSize: '13px' }}>{formatDate(createdDate)}</Text>
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