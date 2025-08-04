import React, { useEffect, useState } from 'react';
import { Typography, Space, Card, Row, Col, Button, Tag, Modal, message } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts, mockConfigurationRequests } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import {
  PageHeader,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  ChangeRequestTimeline,
  ChangeRequestStatus,
  ChangeRequestPreview,
  ExperimentalBadge
} from '../components';
import SalesChannelDisplay from '../components/attributes/SalesChannelDisplay';
import { updateChangeRequestStatus, getNextStatusOptions } from '../utils/configurationUtils';
import { getUserLdap } from '../utils/users';
import { GitPullRequestArrow, Copy, ExternalLink, Clock, User, Eye, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

const { Title, Text } = Typography;

const ChangeRequestDetail: React.FC = () => {
  const { productId, requestId } = useParams<{ productId: string; requestId: string }>();
  const { setProductName } = useBreadcrumb();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  
  // First try to find the configuration request in the product's requests (for newly created ones)
  // Then fall back to the global mock requests array (for existing mock data)
  const initialConfigRequest = product?.configurationRequests?.find(r => r.id === requestId) || 
                              mockConfigurationRequests.find(r => r.id === requestId);
  
  // State to track the current configuration request (can be updated)
  const [configRequest, setConfigRequest] = useState(initialConfigRequest);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);



  useEffect(() => {
    // Set breadcrumb to show change request icon + ID
    if (configRequest) {
      setProductName(configRequest.id);
    }

    return () => {
      setProductName(null);
    };
  }, [configRequest, setProductName]);

  if (!product || !configRequest) {
    return (
      <div>
        <Title level={2}>Change Request Not Found</Title>
        <p>The requested change request could not be found.</p>
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

  const handleStatusUpdate = (newStatus: 'Pending Review' | 'In EI' | 'Live' | 'Failed') => {
    if (!productId || !requestId) return;

    Modal.confirm({
      title: `Update Status to ${newStatus}`,
                  content: `Are you sure you want to update this change request status to "${newStatus}"?`,
      okText: 'Yes, Update',
      cancelText: 'Cancel',
      onOk: async () => {
        setIsUpdatingStatus(true);
        
        try {
          // Update the status in mock data
          const success = updateChangeRequestStatus(productId, requestId, newStatus);
          
          if (success) {
            // Update the local state to reflect the change
            setConfigRequest(prev => prev ? { ...prev, status: newStatus } : undefined);
            
            // Show success message
            message.success(`Change request status updated to ${newStatus}`);
            
            // Small delay to show the change
            setTimeout(() => {
              setIsUpdatingStatus(false);
            }, 500);
          } else {
            message.error('Failed to update change request status');
            setIsUpdatingStatus(false);
          }
        } catch (error) {
          console.error('Error updating status:', error);
          message.error('An error occurred while updating the status');
          setIsUpdatingStatus(false);
        }
      }
    });
  };

  const getStatusIcon = (iconName: string) => {
    switch (iconName) {
      case 'eye':
        return <Eye size={16} />;
      case 'check-circle':
        return <CheckCircle size={16} />;
      case 'x-circle':
        return <XCircle size={16} />;
      case 'refresh-cw':
        return <RefreshCw size={16} />;
      default:
        return null;
    }
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        icon={<GitPullRequestArrow />}
        iconSize={16}
        entityType="Change Request"
        title={configRequest.id}
        onBack={() => navigate(-1)}
        tagContent={<ChangeRequestStatus status={configRequest.status} />}
        subtitle={`for ${product.name}`}
        actions={(() => {
        const nextOptions = getNextStatusOptions(configRequest.status);
        
        if (nextOptions.length === 0) {
          return null; // No actions available for this status
        }
        
        return (
                <Space wrap>
                  {nextOptions.map((option) => (
                    <Button
                      key={option.status}
                      type={option.buttonType === 'danger' ? 'default' : option.buttonType}
                      danger={option.buttonType === 'danger'}
                      icon={getStatusIcon(option.icon)}
                      loading={isUpdatingStatus}
                      onClick={() => handleStatusUpdate(option.status)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </Space>
        );
      })()}
      />

      {/* Status Timeline */}
      <PageSection title="Progress Timeline">
        <ChangeRequestTimeline request={configRequest} showDetails />
      </PageSection>



              {/* Change Request Details */}
        <PageSection title="Change Request Details">
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
                    <Text>{getUserLdap(configRequest.createdBy)}</Text>
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
                            <Card size="small" title="Change Request Settings">
              <AttributeGroup>
                <AttributeDisplay layout="horizontal" label="Sales Channel">
                  <SalesChannelDisplay channel={configRequest.salesChannel} />
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
                                  This change request has generated the following assets:
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

              {/* Change Request Preview */}
        <PageSection title="Change Request Preview">
        <ChangeRequestPreview 
          product={product}
          configurationData={configRequest}
        />
      </PageSection>

      {/* Experimental Change Request Notice */}
      {configRequest.lixKey && (
        <PageSection title="Experimental Change Request Notice">
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
                                      This is an experimental change request
                </Text>
              </Space>
              <Text style={{ color: '#8c5600' }}>
                                    This change request is part of a LinkedIn Experiment (LIX) and will be used for A/B testing. 
                                    The change request includes experimental parameters and should be monitored closely for performance metrics.
              </Text>
              <div>
                <Text strong style={{ color: '#8c5600', fontSize: '12px' }}>
                  Experiment Details:
                </Text>
                <ul style={{ margin: '8px 0', paddingLeft: '20px', color: '#8c5600' }}>
                  <li>LIX Key: <Text code>{configRequest.lixKey}</Text></li>
                  <li>Treatment: <Text code>{configRequest.lixTreatment}</Text></li>
                                      <li>This change request will be applied to users in the specified treatment group</li>
                </ul>
              </div>
            </Space>
          </Card>
        </PageSection>
      )}
    </Space>
  );
};

export default ChangeRequestDetail; 