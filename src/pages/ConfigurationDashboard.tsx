import React, { useEffect, useMemo } from 'react';
import { Typography, Space, Table, Button, Tag, Card, Statistic, Row, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useLayout } from '../context/LayoutContext';
import {
  PageHeader,
  PageSection,
  ChangeRequestStatus,
  ExperimentalBadge,
  CountTag
} from '../components';
import { Settings, ExternalLink, Copy, Eye, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import type { ConfigurationRequest } from '../utils/types';

const { Text } = Typography;

interface ConfigurationRequestWithProduct extends ConfigurationRequest {
  productName: string;
}

const ConfigurationDashboard: React.FC = () => {
  const { setMaxWidth } = useLayout();
  const navigate = useNavigate();

  useEffect(() => {
    // Set wider max-width for dashboard with table
    setMaxWidth('1400px');

    return () => {
      setMaxWidth('1024px'); // Reset to default width
    };
  }, [setMaxWidth]);

  // Combine all configuration requests with their product information
  const allConfigurationRequests = useMemo(() => {
    const requests: ConfigurationRequestWithProduct[] = [];
    
    mockProducts.forEach(product => {
      if (product.configurationRequests) {
        product.configurationRequests.forEach(request => {
          requests.push({
            ...request,
            productName: product.name
          });
        });
      }
    });

    return requests.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = allConfigurationRequests.length;
    const pending = allConfigurationRequests.filter(r => ['Draft', 'Pending Review', 'In Staging'].includes(r.status)).length;
    const live = allConfigurationRequests.filter(r => r.status === 'Live').length;
    const failed = allConfigurationRequests.filter(r => r.status === 'Failed').length;
    const experimental = allConfigurationRequests.filter(r => r.lixKey).length;

    return { total, pending, live, failed, experimental };
  }, [allConfigurationRequests]);

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

  const columns: ColumnsType<ConfigurationRequestWithProduct> = [
    {
      title: 'Request ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      render: (id: string, record) => (
        <Space>
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
      width: 200,
      render: (productName: string, record) => (
        <Button
          type="link"
          size="small"
          icon={<ExternalLink size={12} />}
          onClick={() => navigate(`/product/${record.targetProductId}`)}
        >
          {productName}
        </Button>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => <ChangeRequestStatus status={status} />,
    },
    {
      title: 'Configuration',
      key: 'configuration',
      width: 200,
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
      width: 150,
      render: (createdBy: string) => (
        <Text style={{ fontSize: '13px' }}>{createdBy}</Text>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 180,
      render: (createdDate: string) => (
        <Text style={{ fontSize: '13px' }}>{formatDate(createdDate)}</Text>
      ),
    },
    {
      title: 'Generated Assets',
      key: 'generatedAssets',
      width: 150,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          {record.generatedSkuId && (
            <Button
              type="link"
              size="small"
              icon={<ExternalLink size={10} />}
              onClick={() => navigate(`/product/${record.targetProductId}/sku/${record.generatedSkuId}`)}
            >
              SKU
            </Button>
          )}
          {record.generatedPriceGroupId && (
            <Button
              type="link"
              size="small"
              icon={<ExternalLink size={10} />}
              onClick={() => navigate(`/product/${record.targetProductId}/price-group/${record.generatedPriceGroupId}`)}
            >
              Price Group
            </Button>
          )}
          {!record.generatedSkuId && !record.generatedPriceGroupId && (
            <Text type="secondary" style={{ fontSize: '11px' }}>None</Text>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<Eye size={12} />}
            onClick={() => navigate(`/product/${record.targetProductId}/configuration/${record.id}`)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        preTitle={
          <Space size="small">
            <Settings size={14} />
            <span>Configuration Dashboard</span>
          </Space>
        }
        title="Configuration Requests"
        subtitle="All configuration requests across products"
      />

      {/* Statistics Cards */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Total Requests"
              value={stats.total}
              prefix={<TrendingUp size={16} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Pending"
              value={stats.pending}
              prefix={<Clock size={16} />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Live"
              value={stats.live}
              prefix={<CheckCircle size={16} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="Experimental"
              value={stats.experimental}
              prefix={<AlertCircle size={16} />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Configuration Requests Table */}
      <PageSection 
        title={
          <Space>
            <span>All Configuration Requests</span>
            <CountTag count={allConfigurationRequests.length} />
          </Space>
        }
      >
        <div className="content-panel">
          <Table
            columns={columns}
            dataSource={allConfigurationRequests}
            rowKey="id"
            pagination={{
              pageSize: 50,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} requests`,
            }}
            size="small"
            scroll={{ x: 1200 }}
          />
        </div>
      </PageSection>
    </Space>
  );
};

export default ConfigurationDashboard; 