import React from 'react';
import { Card, Typography, Space, Tag, Button, Row, Col, Divider } from 'antd';
import { ExternalLink, Copy, MoreHorizontal } from 'lucide-react';
import type { ConfigurationRequest } from '../../utils/types';
import { ChangeRequestStatus } from './ChangeRequestStatus';
import { CompactTimeline } from './ConfigurationTimeline';

const { Text, Title } = Typography;

interface RequestHistoryItemProps {
  request: ConfigurationRequest;
  showTimeline?: boolean;
  onViewDetails?: (requestId: string) => void;
  onCopyId?: (requestId: string) => void;
  onViewSku?: (skuId: string) => void;
  compact?: boolean;
}

export const RequestHistoryItem: React.FC<RequestHistoryItemProps> = ({
  request,
  showTimeline = false,
  onViewDetails,
  onCopyId,
  onViewSku,
  compact = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = () => {
    switch (request.status) {
      case 'Live':
        return '#f6ffed';
      case 'Failed':
        return '#fff2f0';
      case 'In Staging':
        return '#f0f5ff';
      case 'Pending Review':
        return '#fff7e6';
      default:
        return '#fafafa';
    }
  };

  const getStatusBorderColor = () => {
    switch (request.status) {
      case 'Live':
        return '#b7eb8f';
      case 'Failed':
        return '#ffccc7';
      case 'In Staging':
        return '#91d5ff';
      case 'Pending Review':
        return '#ffd591';
      default:
        return '#d9d9d9';
    }
  };

  if (compact) {
    return (
      <Card 
        size="small" 
        style={{ 
          backgroundColor: getStatusColor(),
          border: `1px solid ${getStatusBorderColor()}`,
          marginBottom: 8
        }}
      >
        <Row align="middle" justify="space-between">
          <Col flex="auto">
            <Space direction="vertical" size={4}>
              <Space>
                <Text strong style={{ fontSize: '13px' }}>
                  {request.id}
                </Text>
                <ChangeRequestStatus status={request.status} />
                                 {request.lixKey && (
                   <Tag color="orange">LIX</Tag>
                 )}
               </Space>
               <Space wrap>
                 <Tag color="blue">{request.salesChannel}</Tag>
                 <Tag color="purple">{request.billingCycle}</Tag>
                 <Tag color="green">${request.priceAmount.toFixed(2)}</Tag>
                <Text type="secondary" style={{ fontSize: '11px' }}>
                  {formatDate(request.createdDate)}
                </Text>
              </Space>
            </Space>
          </Col>
          <Col>
            <Space>
              {request.generatedSkuId && (
                <Button 
                  type="text" 
                  size="small" 
                  icon={<ExternalLink size={12} />}
                  onClick={() => onViewSku?.(request.generatedSkuId!)}
                >
                  SKU
                </Button>
              )}
              <Button 
                type="text" 
                size="small" 
                icon={<MoreHorizontal size={12} />}
                onClick={() => onViewDetails?.(request.id)}
              />
            </Space>
          </Col>
        </Row>
      </Card>
    );
  }

  return (
    <Card 
      style={{ 
        backgroundColor: getStatusColor(),
        border: `1px solid ${getStatusBorderColor()}`,
        marginBottom: 16
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        {/* Header */}
        <Row align="middle" justify="space-between">
          <Col>
            <Space>
              <Title level={5} style={{ margin: 0 }}>
                Configuration Request
              </Title>
              <Text code style={{ fontSize: '12px' }}>
                {request.id}
              </Text>
              <Button 
                type="text" 
                size="small" 
                icon={<Copy size={12} />}
                onClick={() => onCopyId?.(request.id)}
              >
                Copy ID
              </Button>
            </Space>
          </Col>
          <Col>
            <ChangeRequestStatus status={request.status} tooltip />
          </Col>
        </Row>

        {/* Configuration Details */}
        <Row gutter={[16, 8]}>
          <Col span={12}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Configuration</Text>
              <Space wrap>
                <Tag color="blue">{request.salesChannel}</Tag>
                <Tag color="purple">{request.billingCycle}</Tag>
                <Tag color="green">${request.priceAmount.toFixed(2)}</Tag>
                {request.lixKey && (
                  <Tag color="orange">LIX: {request.lixKey}</Tag>
                )}
              </Space>
            </Space>
          </Col>
          <Col span={12}>
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Details</Text>
              <Space direction="vertical" size={2}>
                <Text style={{ fontSize: '13px' }}>
                  <Text type="secondary">Created:</Text> {formatDate(request.createdDate)}
                </Text>
                <Text style={{ fontSize: '13px' }}>
                  <Text type="secondary">By:</Text> {request.createdBy}
                </Text>
                <Text style={{ fontSize: '13px' }}>
                  <Text type="secondary">Product:</Text> {request.targetProductId}
                </Text>
              </Space>
            </Space>
          </Col>
        </Row>

        {/* Timeline */}
        {showTimeline && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <div>
              <Text type="secondary" style={{ fontSize: '12px', marginBottom: 8, display: 'block' }}>
                Progress Timeline
              </Text>
              <CompactTimeline status={request.status} showLabels />
            </div>
          </>
        )}

        {/* Generated Assets */}
        {(request.generatedSkuId || request.generatedPriceGroupId) && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <Space direction="vertical" size={4}>
              <Text type="secondary" style={{ fontSize: '12px' }}>Generated Assets</Text>
              <Space wrap>
                {request.generatedSkuId && (
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<ExternalLink size={12} />}
                    onClick={() => onViewSku?.(request.generatedSkuId!)}
                  >
                    SKU: {request.generatedSkuId}
                  </Button>
                )}
                {request.generatedPriceGroupId && (
                  <Button 
                    type="link" 
                    size="small" 
                    icon={<ExternalLink size={12} />}
                  >
                    Price Group: {request.generatedPriceGroupId}
                  </Button>
                )}
              </Space>
            </Space>
          </>
        )}

        {/* Experimental Configuration Notice */}
        {request.lixKey && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <div style={{ 
              background: '#fff7e6', 
              padding: '8px 12px', 
              borderRadius: '4px', 
              border: '1px solid #ffd591' 
            }}>
              <Space>
                <Text strong style={{ color: '#d46b08', fontSize: '12px' }}>
                  Experimental Configuration
                </Text>
              </Space>
              <div style={{ marginTop: 4 }}>
                <Text style={{ fontSize: '11px' }}>
                  LIX Key: {request.lixKey}
                  {request.lixTreatment && ` • Treatment: ${request.lixTreatment}`}
                </Text>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div style={{ marginTop: 8 }}>
          <Space>
            <Button 
              size="small" 
              onClick={() => onViewDetails?.(request.id)}
            >
              View Details
            </Button>
            {request.status === 'Failed' && (
              <Button size="small" type="primary">
                Retry
              </Button>
            )}
            {request.status === 'Live' && request.generatedSkuId && (
              <Button 
                size="small" 
                icon={<ExternalLink size={12} />}
                onClick={() => onViewSku?.(request.generatedSkuId!)}
              >
                View SKU
              </Button>
            )}
          </Space>
        </div>
      </Space>
    </Card>
  );
}; 