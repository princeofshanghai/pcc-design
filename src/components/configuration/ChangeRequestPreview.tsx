import React from 'react';
import { Card, Typography, Space, Tag, Divider, Row, Col, Skeleton, Alert } from 'antd';
import { Eye, DollarSign, Clock, Plus, Users, AlertTriangle } from 'lucide-react';
import type { Product, ConfigurationRequest, SalesChannel, BillingCycle, ChangeRequestStatus } from '../../utils/types';
import { generatePreviewSku, generatePriceGroupName } from '../../utils/configurationUtils';

const { Title, Text } = Typography;

interface ChangeRequestPreviewProps {
  product: Product;
  configurationData: {
    priceGroupName?: string;
    salesChannel?: string;
    billingCycle?: string;
    priceAmount?: number;
    lixKey?: string;
    lixTreatment?: string;
  };
  isRealTimeUpdate?: boolean;
}

export const ChangeRequestPreview: React.FC<ChangeRequestPreviewProps> = ({
  product,
  configurationData,
  isRealTimeUpdate = false
}) => {
  const { priceGroupName, salesChannel, billingCycle, priceAmount, lixKey, lixTreatment } = configurationData;

  // Generate preview SKU if we have enough data
  const previewSku = React.useMemo(() => {
    if (salesChannel && billingCycle && priceAmount) {
      const mockConfigRequest: ConfigurationRequest = {
        id: 'preview',
        targetProductId: product.id,
        salesChannel: salesChannel as SalesChannel,
        billingCycle: billingCycle as BillingCycle,
        priceAmount,
        priceGroupName,
        lixKey,
        lixTreatment,
        status: 'Draft' as ChangeRequestStatus,
        createdBy: 'Current User',
        createdDate: new Date().toISOString()
      };
      return generatePreviewSku(product, mockConfigRequest);
    }
    return null;
  }, [product, priceGroupName, salesChannel, billingCycle, priceAmount, lixKey, lixTreatment]);



  const previewPriceGroupName = React.useMemo(() => {
    // Use user-provided name if available
    if (priceGroupName && priceGroupName.trim()) {
      return priceGroupName.trim();
    }
    
    // Fall back to auto-generation if we have required fields
    if (salesChannel && billingCycle) {
      const mockConfigRequest: ConfigurationRequest = {
        id: 'preview',
        targetProductId: product.id,
        salesChannel: salesChannel as SalesChannel,
        billingCycle: billingCycle as BillingCycle,
        priceAmount: priceAmount || 0,
        status: 'Draft' as ChangeRequestStatus,
        createdBy: 'Current User',
        createdDate: new Date().toISOString()
      };
      return generatePriceGroupName(product, mockConfigRequest);
    }
    return null;
  }, [product, priceGroupName, salesChannel, billingCycle]);

  // Price group impact analysis
  const priceGroupAnalysis = React.useMemo(() => {
    if (!salesChannel || !billingCycle) return null;

    // Find existing price groups that match the configuration
    const existingPriceGroups = product.skus
      .filter(sku => 
        sku.salesChannel === salesChannel && 
        sku.billingCycle === billingCycle
      )
      .map(sku => sku.priceGroup)
      .filter((group, index, self) => 
        index === self.findIndex(g => g.id === group.id)
      );

    // Check if the price matches any existing price group
    const matchingPriceGroup = priceAmount ? existingPriceGroups.find(group => 
      group.pricePoints.some(point => 
        point.currencyCode === 'USD' && point.amount === priceAmount
      )
    ) : null;

    const willCreateNewPriceGroup = !matchingPriceGroup && priceAmount;
    const willUseExistingPriceGroup = !!matchingPriceGroup;
    const hasPriceConflicts = existingPriceGroups.length > 0 && priceAmount && !willUseExistingPriceGroup;

    // Count total SKUs that would share this price group
    const sharedSkuCount = matchingPriceGroup ? 
      product.skus.filter(sku => sku.priceGroup.id === matchingPriceGroup.id).length : 0;

    return {
      existingPriceGroups,
      matchingPriceGroup,
      willCreateNewPriceGroup,
      willUseExistingPriceGroup,
      hasPriceConflicts,
      sharedSkuCount
    };
  }, [product.skus, salesChannel, billingCycle, priceAmount]);

  // Calculate completion percentage
  const completionPercentage = React.useMemo(() => {
    let completed = 0;
    const total = 3; // salesChannel, billingCycle, priceAmount
    
    if (salesChannel) completed++;
    if (billingCycle) completed++;
    if (priceAmount && priceAmount > 0) completed++;
    
    return (completed / total) * 100;
  }, [salesChannel, billingCycle, priceAmount]);

  const hasBasicData = salesChannel || billingCycle || priceAmount;
  const hasCompleteData = salesChannel && billingCycle && priceAmount && priceAmount > 0;

  if (!hasBasicData) {
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
      <div style={{ width: '100%' }}>
        <Title level={4} style={{ marginBottom: 8 }}>
          <Space>
            Preview
            {isRealTimeUpdate && completionPercentage < 100 && (
              <Clock size={16} style={{ color: '#1890ff' }} />
            )}
          </Space>
        </Title>
        
        {/* Completion Progress */}
        {completionPercentage < 100 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ 
              width: '100%', 
              height: '4px', 
              backgroundColor: '#f0f0f0', 
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: `${completionPercentage}%`, 
                height: '100%', 
                backgroundColor: '#1890ff',
                transition: 'width 0.3s ease'
              }} />
            </div>
            <Text type="secondary" style={{ fontSize: '12px', marginTop: '4px' }}>
              {Math.round(completionPercentage)}% complete
            </Text>
          </div>
        )}

        <Divider style={{ margin: '16px 0' }} />

        <Space direction="vertical" style={{ width: '100%' }} size="middle">



        {/* Price Group Preview with Impact Analysis */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Space>
                <DollarSign size={16} />
                <Text strong>Price Group</Text>
                {priceGroupAnalysis && (
                  <Tag color={priceGroupAnalysis.willCreateNewPriceGroup ? "blue" : "green"}>
                    {priceGroupAnalysis.willCreateNewPriceGroup ? "New" : "Existing"}
                  </Tag>
                )}
              </Space>
              
              <Card size="small" style={{ 
                backgroundColor: hasCompleteData ? '#f0f5ff' : '#fafafa', 
                border: hasCompleteData ? '1px solid #91d5ff' : '1px solid #d9d9d9'
              }}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <div>
                    <Text strong style={{ color: hasCompleteData ? '#1890ff' : '#8c8c8c' }}>
                      {previewSku?.priceGroup.id || <Skeleton.Input style={{ width: 140 }} active size="small" />}
                    </Text>
                    {!hasCompleteData && (
                      <Text type="secondary" style={{ fontSize: '12px', marginLeft: '8px' }}>
                        (Generated after form completion)
                      </Text>
                    )}
                  </div>
                  
                  <div>
                    <Text type="secondary">
                      {previewPriceGroupName || (
                        <Text type="secondary" style={{ fontStyle: 'italic' }}>
                          Enter sales channel and billing cycle to see name
                        </Text>
                      )}
                    </Text>
                  </div>
                  
                  <Text type="secondary">
                    {priceAmount && priceAmount > 0 ? `$${priceAmount.toFixed(2)}` : 'Price not set'} • {billingCycle || 'Billing cycle not set'}
                  </Text>

                  {/* Price Group Impact Details */}
                  {priceGroupAnalysis && priceAmount && (
                    <div style={{ marginTop: 8 }}>
                      {priceGroupAnalysis.willCreateNewPriceGroup && (
                        <Alert
                          type="info"
                          showIcon
                          icon={<Plus size={14} />}
                          message="New price group will be created"
                          style={{ marginBottom: 8 }}
                        />
                      )}
                      
                      {priceGroupAnalysis.willUseExistingPriceGroup && (
                        <Alert
                          type="success"
                          showIcon
                          message={
                            <Space>
                              <Text>Using existing price group</Text>
                              {priceGroupAnalysis.sharedSkuCount > 1 && (
                                <Space size={4}>
                                  <Users size={12} />
                                  <Text type="secondary" style={{ fontSize: '11px' }}>
                                    Shared with {priceGroupAnalysis.sharedSkuCount - 1} other SKU{priceGroupAnalysis.sharedSkuCount > 2 ? 's' : ''}
                                  </Text>
                                </Space>
                              )}
                            </Space>
                          }
                          style={{ marginBottom: 8 }}
                        />
                      )}
                      
                      {priceGroupAnalysis.hasPriceConflicts && (
                        <Alert
                          type="warning"
                          showIcon
                          icon={<AlertTriangle size={14} />}
                          message={
                            <Space direction="vertical" size={4}>
                              <Text>Price conflicts detected</Text>
                              <Space wrap>
                                <Text type="secondary" style={{ fontSize: '11px' }}>
                                  Existing prices:
                                </Text>
                                {priceGroupAnalysis.existingPriceGroups.map((group, index) => (
                                  <Tag key={index} color="orange" style={{ fontSize: '10px' }}>
                                    {group.pricePoints.find(p => p.currencyCode === 'USD') 
                                      ? `$${group.pricePoints.find(p => p.currencyCode === 'USD')?.amount.toFixed(2)}`
                                      : 'No USD price'
                                    }
                                  </Tag>
                                ))}
                              </Space>
                            </Space>
                          }
                          style={{ marginBottom: 8 }}
                        />
                      )}
                    </div>
                  )}
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>



        {/* Experimental Configuration Notice */}
        {(lixKey || lixTreatment) && (
          <Card size="small" style={{ backgroundColor: '#fff7e6', border: '1px solid #ffd591' }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong style={{ color: '#d46b08' }}>Experimental Configuration</Text>
              <div>
                <Text type="secondary">
                  This configuration includes experimental parameters and will be marked accordingly in the system.
                </Text>
                {lixKey && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">LIX Key: </Text>
                    <Text code>{lixKey}</Text>
                  </div>
                )}
                {lixTreatment && (
                  <div style={{ marginTop: 4 }}>
                    <Text type="secondary">LIX Treatment: </Text>
                    <Text code>{lixTreatment}</Text>
                  </div>
                )}
              </div>
            </Space>
          </Card>
        )}
        
        </Space>
      </div>
    </Card>
  );
}; 