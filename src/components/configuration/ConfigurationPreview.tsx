import React from 'react';
import { Card, Typography, Space, Tag, Divider, Row, Col } from 'antd';
import { Eye, Package, DollarSign, Settings } from 'lucide-react';
import type { Product, ConfigurationRequest, SalesChannel, BillingCycle } from '../../utils/types';
import { generatePreviewSku } from '../../utils/configurationUtils';
import { formatCurrency } from '../../utils/formatters';

const { Title, Text } = Typography;

interface ConfigurationPreviewProps {
  product: Product;
  configurationData: {
    salesChannel?: string;
    billingCycle?: string;
    priceAmount?: number;
    lixKey?: string;
    lixTreatment?: string;
  };
}

export const ConfigurationPreview: React.FC<ConfigurationPreviewProps> = ({
  product,
  configurationData
}) => {
  const { salesChannel, billingCycle, priceAmount, lixKey, lixTreatment } = configurationData;

  // Generate preview SKU if we have enough data
  const previewSku = React.useMemo(() => {
    if (salesChannel && billingCycle && priceAmount) {
             const mockConfigRequest: ConfigurationRequest = {
         id: 'preview',
         targetProductId: product.id,
         salesChannel: salesChannel as SalesChannel,
         billingCycle: billingCycle as BillingCycle,
         priceAmount,
         lixKey,
         lixTreatment,
         status: 'Pending Review',
         createdBy: 'Current User',
         createdDate: new Date().toISOString()
       };
      return generatePreviewSku(product, mockConfigRequest);
    }
    return null;
  }, [product, salesChannel, billingCycle, priceAmount, lixKey, lixTreatment]);

  // Generate price group ID
  const priceGroupId = React.useMemo(() => {
    if (salesChannel && billingCycle) {
      return `PG-${product.id}-${salesChannel}-${billingCycle}`;
    }
    return null;
  }, [product.id, salesChannel, billingCycle]);

  if (!salesChannel && !billingCycle && !priceAmount) {
    return (
      <Card>
        <Space direction="vertical" align="center" style={{ width: '100%', padding: '40px 0' }}>
          <Eye size={48} color="#d9d9d9" />
          <Text type="secondary">
            Fill out the configuration form to see a preview of what will be created
          </Text>
        </Space>
      </Card>
    );
  }

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={4}>
            <Space>
              <Eye size={20} />
              Configuration Preview
            </Space>
          </Title>
          <Text type="secondary">
            This shows what will be created when you submit this configuration
          </Text>
        </div>

        <Divider />

        {/* SKU Preview */}
        {previewSku && (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <Package size={16} />
                  <Text strong>Generated SKU</Text>
                </Space>
                <Card size="small" style={{ backgroundColor: '#f6ffed', border: '1px solid #b7eb8f' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>{previewSku.id}</Text>
                    <Text type="secondary">{previewSku.name}</Text>
                    <Space wrap>
                      <Tag color="blue">{salesChannel}</Tag>
                      <Tag color="purple">{billingCycle}</Tag>
                                             <Tag color="green">${(priceAmount || 0).toFixed(2)}</Tag>
                      {lixKey && <Tag color="orange">LIX: {lixKey}</Tag>}
                    </Space>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        )}

        {/* Price Group Preview */}
        {priceGroupId && (
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Space>
                  <DollarSign size={16} />
                  <Text strong>Price Group</Text>
                </Space>
                <Card size="small" style={{ backgroundColor: '#f0f5ff', border: '1px solid #91d5ff' }}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong>{priceGroupId}</Text>
                                         <Text type="secondary">
                       {priceAmount ? `$${priceAmount.toFixed(2)}` : 'Price not set'} • {billingCycle}
                     </Text>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        )}

        {/* Inherited Attributes */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <Settings size={16} />
                <Text strong>Inherited from Product</Text>
              </Space>
              <Card size="small" style={{ backgroundColor: '#fafafa', border: '1px solid #d9d9d9' }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Row gutter={[16, 8]}>
                    <Col span={8}>
                      <Text type="secondary">Billing Model:</Text>
                    </Col>
                    <Col span={16}>
                      <Text>{product.billingModel}</Text>
                    </Col>
                  </Row>
                  <Row gutter={[16, 8]}>
                    <Col span={8}>
                      <Text type="secondary">LOB:</Text>
                    </Col>
                    <Col span={16}>
                      <Text>{product.lob}</Text>
                    </Col>
                  </Row>
                                     <Row gutter={[16, 8]}>
                     <Col span={8}>
                       <Text type="secondary">Folder:</Text>
                     </Col>
                     <Col span={16}>
                       <Text>{product.folder}</Text>
                     </Col>
                   </Row>
                  <Row gutter={[16, 8]}>
                    <Col span={8}>
                      <Text type="secondary">Status:</Text>
                    </Col>
                    <Col span={16}>
                      <Tag color={product.status === 'Active' ? 'green' : 'red'}>
                        {product.status}
                      </Tag>
                    </Col>
                  </Row>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>

        {/* Experimental Configuration Notice */}
        {lixKey && (
          <Card size="small" style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
            <Space>
              <Text strong style={{ color: '#d46b08' }}>Experimental Configuration</Text>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                This configuration includes experimental parameters and will be marked accordingly in the system.
              </Text>
            </div>
          </Card>
        )}
      </Space>
    </Card>
  );
}; 