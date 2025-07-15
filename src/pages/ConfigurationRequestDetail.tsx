import React, { useEffect } from 'react';
import { Typography, Space, Card, Row, Col, Button, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts, mockConfigurationRequests } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import {
  PageHeader,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  ConfigurationTimeline,
  ChangeRequestStatus,
  ConfigurationPreview,
  ExperimentalBadge
} from '../components';
import { Settings, Copy, ExternalLink, Clock, User } from 'lucide-react';

const { Title, Text } = Typography;

const ConfigurationRequestDetail: React.FC = () => {
  const { productId, requestId } = useParams<{ productId: string; requestId: string }>();
  const { setProductName } = useBreadcrumb();
  const { setMaxWidth } = useLayout();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  const configRequest = mockConfigurationRequests.find(r => r.id === requestId);

  useEffect(() => {
    // Set wider max-width for detail pages
    setMaxWidth('1200px');

    return () => {
      setMaxWidth('1024px'); // Reset to default width
    };
  }, [setMaxWidth]);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }

    return () => {
      setProductName(null);
    };
  }, [product, setProductName]);

  if (!product || !configRequest) {
    return (
      <div>
        <Title level={2}>Configuration Request Not Found</Title>
        <p>The requested configuration request could not be found.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // TODO: Show success toast
    console.log('Copied to clipboard:', text);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        preTitle={
          <Space size="small">
            <Settings size={14} />
            <span>Configuration Request</span>
          </Space>
        }
        title={configRequest.id}
        onBack={() => navigate(`/product/${product.id}`)}
        tagContent={<ChangeRequestStatus status={configRequest.status} />}
        subtitle={`for ${product.name}`}
      />

      {/* Status Timeline */}
      <PageSection title="Progress Timeline">
        <ConfigurationTimeline request={configRequest} showDetails />
      </PageSection>

      {/* Configuration Details */}
      <PageSection title="Configuration Details">
        <Row gutter={[32, 24]}>
          <Col span={12}>
            <Card size="small" title="Request Information">
              <AttributeGroup>
                <AttributeDisplay layout="horizontal" label="Request ID">
                  <Space>
                    <Text code>{configRequest.id}</Text>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<Copy size={12} />}
                      onClick={() => copyToClipboard(configRequest.id)}
                    />
                  </Space>
                </AttributeDisplay>
                <AttributeDisplay layout="horizontal" label="Status">
                  <ChangeRequestStatus status={configRequest.status} tooltip />
                </AttributeDisplay>
                <AttributeDisplay layout="horizontal" label="Product">
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<ExternalLink size={12} />}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.name}
                  </Button>
                </AttributeDisplay>
                <AttributeDisplay layout="horizontal" label="Created By">
                  <Space>
                    <User size={12} />
                    <Text>{configRequest.createdBy}</Text>
                  </Space>
                </AttributeDisplay>
                <AttributeDisplay layout="horizontal" label="Created Date">
                  <Space>
                    <Clock size={12} />
                    <Text>{formatDate(configRequest.createdDate)}</Text>
                  </Space>
                </AttributeDisplay>
              </AttributeGroup>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Configuration Settings">
              <AttributeGroup>
                <AttributeDisplay layout="horizontal" label="Sales Channel">
                  <Tag color="blue">{configRequest.salesChannel}</Tag>
                </AttributeDisplay>
                <AttributeDisplay layout="horizontal" label="Billing Cycle">
                  <Tag color="purple">{configRequest.billingCycle}</Tag>
                </AttributeDisplay>
                <AttributeDisplay layout="horizontal" label="Price">
                  <Tag color="green">${configRequest.priceAmount.toFixed(2)}</Tag>
                </AttributeDisplay>
                {configRequest.lixKey && (
                  <>
                    <AttributeDisplay layout="horizontal" label="Experimental">
                      <ExperimentalBadge 
                        lixKey={configRequest.lixKey} 
                        lixTreatment={configRequest.lixTreatment}
                        variant="default"
                      />
                    </AttributeDisplay>
                    <AttributeDisplay layout="horizontal" label="LIX Key">
                      <Text code>{configRequest.lixKey}</Text>
                    </AttributeDisplay>
                    <AttributeDisplay layout="horizontal" label="LIX Treatment">
                      <Text code>{configRequest.lixTreatment}</Text>
                    </AttributeDisplay>
                  </>
                )}
              </AttributeGroup>
            </Card>
          </Col>
        </Row>
      </PageSection>

      {/* Generated Assets */}
      {(configRequest.generatedSkuId || configRequest.generatedPriceGroupId) && (
        <PageSection title="Generated Assets">
          <Card size="small">
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Text type="secondary">
                This configuration request has generated the following assets:
              </Text>
              <Row gutter={[16, 16]}>
                {configRequest.generatedSkuId && (
                  <Col span={12}>
                    <AttributeDisplay layout="horizontal" label="Generated SKU">
                      <Space>
                        <Text code>{configRequest.generatedSkuId}</Text>
                        <Button 
                          type="link" 
                          size="small" 
                          icon={<ExternalLink size={12} />}
                          onClick={() => navigate(`/product/${product.id}/sku/${configRequest.generatedSkuId}`)}
                        >
                          View SKU
                        </Button>
                      </Space>
                    </AttributeDisplay>
                  </Col>
                )}
                {configRequest.generatedPriceGroupId && (
                  <Col span={12}>
                    <AttributeDisplay layout="horizontal" label="Generated Price Group">
                      <Space>
                        <Text code>{configRequest.generatedPriceGroupId}</Text>
                        <Button 
                          type="link" 
                          size="small" 
                          icon={<ExternalLink size={12} />}
                          onClick={() => navigate(`/product/${product.id}/price-group/${configRequest.generatedPriceGroupId}`)}
                        >
                          View Price Group
                        </Button>
                      </Space>
                    </AttributeDisplay>
                  </Col>
                )}
              </Row>
            </Space>
          </Card>
        </PageSection>
      )}

      {/* Configuration Preview */}
      <PageSection title="Configuration Preview">
        <ConfigurationPreview 
          product={product}
          configurationData={configRequest}
        />
      </PageSection>

      {/* Experimental Configuration Notice */}
      {configRequest.lixKey && (
        <PageSection title="Experimental Configuration Notice">
          <Card 
            size="small" 
            style={{ 
              backgroundColor: '#fff7e6',
              borderColor: '#ffd591' 
            }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Space>
                <ExperimentalBadge 
                  lixKey={configRequest.lixKey} 
                  lixTreatment={configRequest.lixTreatment}
                  variant="default"
                />
                <Text strong style={{ color: '#d46b08' }}>
                  This is an experimental configuration
                </Text>
              </Space>
              <Text style={{ color: '#8c5600' }}>
                This configuration is part of a LinkedIn Experiment (LIX) and will be used for A/B testing. 
                The configuration includes experimental parameters and should be monitored closely for performance metrics.
              </Text>
              <div>
                <Text strong style={{ color: '#8c5600', fontSize: '12px' }}>
                  Experiment Details:
                </Text>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', color: '#8c5600' }}>
                  <li>LIX Key: <Text code>{configRequest.lixKey}</Text></li>
                  <li>Treatment: <Text code>{configRequest.lixTreatment}</Text></li>
                  <li>This configuration will be applied to users in the specified treatment group</li>
                </ul>
              </div>
            </Space>
          </Card>
        </PageSection>
      )}
    </Space>
  );
};

export default ConfigurationRequestDetail; 