import React from 'react';
import { Card, Typography, Space, Tag, Alert, Divider } from 'antd';
import { Plus, RefreshCw, Info } from 'lucide-react';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';
import type { Product, BillingCycle } from '../../utils/types';

const { Title, Text } = Typography;

interface PriceGroupImpactProps {
  product: Product;
  configurationData: {
    salesChannel?: string;
    billingCycle?: string;
    priceAmount?: number;
  };
}

export const PriceGroupImpact: React.FC<PriceGroupImpactProps> = ({
  product,
  configurationData
}) => {
  const { salesChannel, billingCycle, priceAmount } = configurationData;

  // Find existing price groups that match the configuration
  const existingPriceGroups = React.useMemo(() => {
    if (!salesChannel || !billingCycle) return [];

    return product.skus
      .filter(sku => 
        sku.salesChannel === salesChannel && 
        sku.billingCycle === billingCycle
      )
      .map(sku => sku.priceGroup)
      .filter((group, index, self) => 
        // Remove duplicates by comparing IDs
        index === self.findIndex(g => g.id === group.id)
      );
  }, [product.skus, salesChannel, billingCycle]);

  // Check if the price matches any existing price group
  const matchingPriceGroup = React.useMemo(() => {
    if (!priceAmount) return null;

    return existingPriceGroups.find(group => 
      group.pricePoints.some(point => 
        point.currencyCode === 'USD' && point.amount === priceAmount
      )
    );
  }, [existingPriceGroups, priceAmount]);

  // Generate the expected price group ID
  const expectedPriceGroupId = React.useMemo(() => {
    if (salesChannel && billingCycle) {
      return `PG-${product.id}-${salesChannel}-${billingCycle}`;
    }
    return null;
  }, [product.id, salesChannel, billingCycle]);

  if (!salesChannel || !billingCycle) {
    return (
      <Card>
        <Space direction="vertical" align="center" style={{ width: '100%', padding: '20px 0' }}>
          <Info size={32} color="#d9d9d9" />
          <Text type="secondary">
            Select sales channel and billing cycle to see price group impact
          </Text>
        </Space>
      </Card>
    );
  }

  const willCreateNewPriceGroup = !matchingPriceGroup && priceAmount;
  const willUseExistingPriceGroup = !!matchingPriceGroup;

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={4}>
            <Space>
              <RefreshCw size={20} />
              Price Group Impact
            </Space>
          </Title>
          <Text type="secondary">
            Analysis of how this configuration will affect price groups
          </Text>
        </div>

        <Divider />

        {/* New Price Group Creation */}
        {willCreateNewPriceGroup && (
          <Alert
            type="info"
            showIcon
            icon={<Plus size={16} />}
            message="New Price Group Will Be Created"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  A new price group will be created because no existing price group matches this configuration.
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Text strong>Price Group ID: </Text>
                  <Tag color="blue">{expectedPriceGroupId}</Tag>
                </div>
                <div>
                  <Text strong>Price: </Text>
                  <Tag color="green">${priceAmount.toFixed(2)}</Tag>
                </div>
              </Space>
            }
          />
        )}

        {/* Existing Price Group Usage */}
        {willUseExistingPriceGroup && (
          <Alert
            type="success"
            showIcon
            message="Existing Price Group Will Be Used"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  This configuration matches an existing price group. No new price group will be created.
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Text strong>Price Group ID: </Text>
                  <Tag color="green">{matchingPriceGroup.id}</Tag>
                </div>
                <div>
                  <Text strong>Price Group Name: </Text>
                  <Text>{matchingPriceGroup.name}</Text>
                </div>
                <div>
                  <Text strong>Shared with: </Text>
                  <Text type="secondary">
                    {product.skus.filter(sku => sku.priceGroup.id === matchingPriceGroup.id).length} other SKU(s)
                  </Text>
                </div>
              </Space>
            }
          />
        )}

        {/* Price Conflict Warning */}
        {existingPriceGroups.length > 0 && priceAmount && !willUseExistingPriceGroup && (
          <Alert
            type="warning"
            showIcon
            message="Price Conflict Detected"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>
                  Other price groups exist for this sales channel and billing cycle combination, but with different prices.
                </Text>
                <div style={{ marginTop: 8 }}>
                  <Text strong>Existing prices: </Text>
                  <Space wrap>
                    {existingPriceGroups.map(group => (
                      <Tag key={group.id} color="orange">
                        {group.pricePoints.find(p => p.currencyCode === 'USD') 
                          ? `$${group.pricePoints.find(p => p.currencyCode === 'USD')?.amount.toFixed(2)}`
                          : 'No USD price'
                        }
                      </Tag>
                    ))}
                  </Space>
                </div>
                <div>
                  <Text strong>Your price: </Text>
                  <Tag color="red">${priceAmount.toFixed(2)}</Tag>
                </div>
              </Space>
            }
          />
        )}

        {/* Summary Information */}
        <div style={{ 
          background: '#fafafa', 
          padding: '16px', 
          borderRadius: '8px', 
          border: '1px solid #d9d9d9' 
        }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Summary:</Text>
            <div>
              <Text type="secondary">Sales Channel & Billing Cycle: </Text>
              <Tag color="blue">{salesChannel}</Tag>
                             <BillingCycleDisplay billingCycle={billingCycle as BillingCycle} />
            </div>
            <div>
              <Text type="secondary">Existing Price Groups: </Text>
              <Text>{existingPriceGroups.length}</Text>
            </div>
            <div>
              <Text type="secondary">Action: </Text>
              <Text>
                {willCreateNewPriceGroup 
                  ? 'Create new price group'
                  : willUseExistingPriceGroup 
                    ? 'Use existing price group'
                    : 'Waiting for price amount'
                }
              </Text>
            </div>
          </Space>
        </div>
      </Space>
    </Card>
  );
}; 