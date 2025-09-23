import React, { useEffect, useMemo } from 'react';
import { Typography, Space, Tabs, theme, Tag } from 'antd';
import { useParams } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { toSentenceCase } from '../utils/formatters';
import type { SalesChannel, BillingCycle } from '../utils/types';

import {
  PageHeader,
  StatusTag,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  OverrideIndicator,
  OverrideComparison,
  ChannelTag,
  BillingCycleTag,
  BillingModelTag,
  CopyableId,
  InfoPopover,
} from '../components';
import PriceGroupTable from '../components/pricing/PriceGroupTable';
import { AlertCircle, Check } from 'lucide-react';

const { Title } = Typography;

const SkuDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { productId, skuId } = useParams<{ productId: string; skuId: string }>();
  const { setProductName, setSkuId, setFolderName } = useBreadcrumb();
  const [product, setProduct] = React.useState(mockProducts.find(p => p.id === productId));
  
  const sku = product?.skus.find(s => s.id === skuId);
  
  // Load enhanced product data with price groups from JSON files
  useEffect(() => {
    if (productId) {
      loadProductWithPricing(productId).then(enhancedProduct => {
        if (enhancedProduct) {
          setProduct(enhancedProduct);
        }
      });
    }
  }, [productId]);



  useEffect(() => {
    if (product) {
      setProductName(product.name);
      // Also set the folder name if available
      if (product.folder) {
        setFolderName(product.folder);
      }
    }
    if (sku) {
      setSkuId(sku.id);
    }

    return () => {
      setProductName(null);
      setSkuId(null);
      setFolderName(null);
    };
  }, [product, sku, setProductName, setSkuId, setFolderName]);

  if (!product || !sku) {
    return (
      <div>
        <Title level={2}>SKU Not Found</Title>
        <p>The requested product or SKU could not be found.</p>
      </div>
    );
  }

  // Helper function to check if an attribute is overridden
  const isOverridden = (skuValue: any) => {
    return skuValue !== undefined && skuValue !== null;
  };

  // Function to detect all SKU overrides for summary
  const getSkuOverrides = () => {
    if (!sku || !product) return [];
    
    const overrides = [];
    
    if (isOverridden(sku.taxClass)) {
      overrides.push("Tax Class");
    }
    
    if (isOverridden(sku.seatMin) || isOverridden(sku.seatMax)) {
      overrides.push("Seat Range");
    }
    
    if (isOverridden(sku.paymentFailureFreeToPaidGracePeriod)) {
      overrides.push("Free-to-Paid Grace Period");
    }
    
    if (isOverridden(sku.paymentFailurePaidToPaidGracePeriod)) {
      overrides.push("Paid-to-Paid Grace Period");
    }
    
    return overrides;
  };

  const skuOverrides = getSkuOverrides();
  
  // Helper function to render boolean values with check/x icons
  const renderValue = (value: any, isBoolean = false) => {
    if (isBoolean) {
      return (
        <Space size="small" align="center">
          {value ? (
            <>
              <Check size={14} style={{ color: token.colorSuccess }} />
              <span>Yes</span>
            </>
          ) : (
            <>
              <span style={{ color: token.colorError, fontSize: '14px', fontWeight: 'bold' }}>✗</span>
              <span>No</span>
            </>
          )}
        </Space>
      );
    }
    if (Array.isArray(value)) {
      return (
        <Space direction="vertical" size={0}>
          {value.map(item => <span key={item}>- {item}</span>)}
        </Space>
      );
    }
    return value;
  };
  
  // Prepare price group data for single-row table
  const priceGroupData = useMemo(() => {
    if (!sku?.priceGroup) return [];
    
    // Find all SKUs that use the same price group
    const skusWithSamePriceGroup = product?.skus.filter(s => s.priceGroup.id === sku.priceGroup.id) || [];
    
    return [{
      priceGroup: sku.priceGroup,
      skus: skusWithSamePriceGroup
    }];
  }, [sku, product]);

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size={48}>
          {/* Override Summary - MOST PROMINENT */}
          <PageSection 
            title={
              <Space size="small">
                <span>{toSentenceCase("Override Summary")}</span>
                {skuOverrides.length > 0 && (
                  <Tag color="orange" style={{ marginLeft: '8px' }}>
                    {skuOverrides.length} override{skuOverrides.length !== 1 ? 's' : ''}
                  </Tag>
                )}
              </Space>
            }
          >
            {skuOverrides.length > 0 ? (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fff7e6', 
                border: '1px solid #ffd591', 
                borderRadius: '8px' 
              }}>
                <Space align="center" size="small" style={{ marginBottom: '12px' }}>
                  <AlertCircle size={16} color="#fa8c16" />
                  <Typography.Text strong style={{ color: '#ad6800' }}>
                    This SKU overrides the following product defaults:
                  </Typography.Text>
                </Space>
                <div style={{ marginLeft: '24px' }}>
                  {skuOverrides.map((override, index) => (
                    <div key={override} style={{ marginBottom: '4px' }}>
                      <Typography.Text style={{ color: '#ad6800' }}>• {override}</Typography.Text>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '8px' 
              }}>
                <Space align="center" size="small">
                  <Check size={16} color="#52c41a" />
                  <Typography.Text style={{ color: '#389e0d' }}>
                    This SKU uses all product defaults with no overrides.
                  </Typography.Text>
                </Space>
              </div>
            )}
          </PageSection>

          {/* Basic SKU Information */}
          <PageSection title={toSentenceCase("SKU Information")}>
            <AttributeGroup>
              <AttributeDisplay label="Product" layout="horizontal">
                {product?.name}
              </AttributeDisplay>
              
              <AttributeDisplay label="LOB" layout="horizontal">
                {product?.lob}
              </AttributeDisplay>
              
              <AttributeDisplay label="Folder" layout="horizontal">
                {product?.folder}
              </AttributeDisplay>
              
              <AttributeDisplay label="Status" layout="horizontal">
                <StatusTag status={sku?.status} variant="small" showIcon={false} />
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>

          {/* Configuration Section */}
          <PageSection title={toSentenceCase("Configuration")}>
            <AttributeGroup>
              <AttributeDisplay label="Sales Channel" layout="horizontal">
                <ChannelTag channel={sku?.salesChannel} showIcon={false} />
              </AttributeDisplay>
              
              <AttributeDisplay label="Billing Cycle" layout="horizontal">
                <BillingCycleTag billingCycle={sku?.billingCycle} showIcon={false} />
              </AttributeDisplay>
              
              <AttributeDisplay label="Revenue Recognition" layout="horizontal">
                {sku?.revenueRecognition}
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'attributes',
      label: 'Attributes',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          {/* General Section */}
          <PageSection title={toSentenceCase('General')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Product ID">
                <CopyableId id={product?.id || ''} />
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Status">
                <StatusTag status={sku?.status} variant="small" showIcon={false} />
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Billing Model">
                <BillingModelTag billingModel={product?.billingModel} variant="small" showIcon={false} />
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Sales Channel">
                <ChannelTag channel={sku?.salesChannel} variant="small" showIcon={false} />
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Is Bundle?">{renderValue(product?.isBundle, true)}</AttributeDisplay>
              {product?.code && (
                <AttributeDisplay layout="horizontal" label="Code">{product.code}</AttributeDisplay>
              )}
              {product?.family && (
                <AttributeDisplay layout="horizontal" label="Family">{product.family}</AttributeDisplay>
              )}
            </AttributeGroup>
          </PageSection>
          
          {/* Business Rules Section */}
          <PageSection title={toSentenceCase('Business Rules')}>
            <AttributeGroup>
              <AttributeDisplay label="Tax Class" layout="horizontal">
                <Space size="small">
                  <span>{sku?.taxClass || product?.taxClass}</span>
                  {isOverridden(sku?.taxClass) && <OverrideIndicator />}
                </Space>
                {isOverridden(sku?.taxClass) && (
                  <OverrideComparison skuValue={sku?.taxClass} productValue={product?.taxClass} />
                )}
              </AttributeDisplay>
              
              <AttributeDisplay label="Grace Period (Free-Paid)" layout="horizontal">
                <Space size="small">
                  <span>{(sku?.paymentFailureFreeToPaidGracePeriod ?? product?.paymentFailureFreeToPaidGracePeriod)} days</span>
                  {isOverridden(sku?.paymentFailureFreeToPaidGracePeriod) && <OverrideIndicator />}
                </Space>
                {isOverridden(sku?.paymentFailureFreeToPaidGracePeriod) && (
                  <OverrideComparison 
                    skuValue={`${sku?.paymentFailureFreeToPaidGracePeriod} days`} 
                    productValue={`${product?.paymentFailureFreeToPaidGracePeriod} days`} 
                  />
                )}
              </AttributeDisplay>
              
              <AttributeDisplay label="Grace Period (Paid-Paid)" layout="horizontal">
                <Space size="small">
                  <span>{(sku?.paymentFailurePaidToPaidGracePeriod ?? product?.paymentFailurePaidToPaidGracePeriod)} days</span>
                  {isOverridden(sku?.paymentFailurePaidToPaidGracePeriod) && <OverrideIndicator />}
                </Space>
                {isOverridden(sku?.paymentFailurePaidToPaidGracePeriod) && (
                  <OverrideComparison 
                    skuValue={`${sku?.paymentFailurePaidToPaidGracePeriod} days`} 
                    productValue={`${product?.paymentFailurePaidToPaidGracePeriod} days`} 
                  />
                )}
              </AttributeDisplay>
              
              <AttributeDisplay label="Seat Type" layout="horizontal">
                <Space size="small">
                  <span>{sku?.seatType || product?.seatType}</span>
                  {isOverridden(sku?.seatType) && <OverrideIndicator />}
                </Space>
                {isOverridden(sku?.seatType) && (
                  <OverrideComparison skuValue={sku?.seatType} productValue={product?.seatType} />
                )}
              </AttributeDisplay>
              
              <AttributeDisplay label="Seat Range" layout="horizontal">
                <Space size="small">
                  <span>{(sku?.seatMin ?? product?.seatMin)} - {(sku?.seatMax ?? product?.seatMax)}</span>
                  {(isOverridden(sku?.seatMin) || isOverridden(sku?.seatMax)) && <OverrideIndicator />}
                </Space>
                {(isOverridden(sku?.seatMin) || isOverridden(sku?.seatMax)) && (
                  <OverrideComparison 
                    skuValue={`${(sku?.seatMin ?? product?.seatMin)} - ${(sku?.seatMax ?? product?.seatMax)}`} 
                    productValue={`${product?.seatMin} - ${product?.seatMax}`} 
                  />
                )}
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Visibility Controls Section */}
          <PageSection title={toSentenceCase('Visibility Controls')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Visible on Billing Emails?">{renderValue(product?.isVisibleOnBillingEmails, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Visible on Renewal Emails?">{renderValue(product?.isVisibleOnRenewalEmails, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Cancellable?">{renderValue(product?.isCancellable, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Amendment?">{renderValue(product?.isEligibleForAmendment, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Robo-Refund?">{renderValue(product?.isEligibleForRoboRefund, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Pricing?">{renderValue(product?.isPrimaryProductForPricing, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Grace Period?">{renderValue(product?.isPrimaryForGracePeriod, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Contract Aggregation?">{renderValue(product?.isPrimaryForContractAggregation, true)}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Links & Resources Section */}
          <PageSection title={toSentenceCase('Links & Resources')}>
            <AttributeGroup>
              {product?.postPurchaseLandingUrl && (
                <AttributeDisplay layout="horizontal" label="Post-Purchase URL">
                  <a href={product.postPurchaseLandingUrl} target="_blank" rel="noopener noreferrer">
                    {product.postPurchaseLandingUrl}
                  </a>
                </AttributeDisplay>
              )}
              {product?.productUrl && (
                <AttributeDisplay layout="horizontal" label="Product URL">
                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a>
                </AttributeDisplay>
              )}
              {product?.termsOfServiceUrl && (
                <AttributeDisplay layout="horizontal" label="Terms of Service">
                  <a href={product.termsOfServiceUrl} target="_blank" rel="noopener noreferrer">{product.termsOfServiceUrl}</a>
                </AttributeDisplay>
              )}
              {product?.howToCancelUrl && (
                <AttributeDisplay layout="horizontal" label="How to Cancel">
                  <a href={product.howToCancelUrl} target="_blank" rel="noopener noreferrer">{product.howToCancelUrl}</a>
                </AttributeDisplay>
              )}
              {product?.refundPolicyUrl && (
                <AttributeDisplay layout="horizontal" label="Refund Policy">
                  <a href={product.refundPolicyUrl} target="_blank" rel="noopener noreferrer">{product.refundPolicyUrl}</a>
                </AttributeDisplay>
              )}
              {product?.helpCenterUrl && (
                <AttributeDisplay layout="horizontal" label="Help Center">
                  <a href={product.helpCenterUrl} target="_blank" rel="noopener noreferrer">{product.helpCenterUrl}</a>
                </AttributeDisplay>
              )}
              {product?.contactUsUrl && (
                <AttributeDisplay layout="horizontal" label="Contact Us">
                  <a href={product.contactUsUrl} target="_blank" rel="noopener noreferrer">{product.contactUsUrl}</a>
                </AttributeDisplay>
              )}
              {product?.accountLink && (
                <AttributeDisplay layout="horizontal" label="Account Link">
                  <a href={product.accountLink} target="_blank" rel="noopener noreferrer">{product.accountLink}</a>
                </AttributeDisplay>
              )}
              {product?.ctaLink && (
                <AttributeDisplay layout="horizontal" label="CTA Link">
                  <a href={product.ctaLink} target="_blank" rel="noopener noreferrer">{product.ctaLink}</a>
                </AttributeDisplay>
              )}
              {product?.ctaUrl && (
                <AttributeDisplay layout="horizontal" label="CTA URL">
                  <a href={product.ctaUrl} target="_blank" rel="noopener noreferrer">{product.ctaUrl}</a>
                </AttributeDisplay>
              )}
              {product?.confirmationCtaUrl && (
                <AttributeDisplay layout="horizontal" label="Confirmation CTA URL">
                  <a href={product.confirmationCtaUrl} target="_blank" rel="noopener noreferrer">{product.confirmationCtaUrl}</a>
                </AttributeDisplay>
              )}
            </AttributeGroup>
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'pricing',
      label: 'Pricing',
      children: (
        <Space direction="vertical" style={{ width: '100%' }} size={48}>
          <PageSection 
            title={toSentenceCase("Price Group for this SKU")}
          >
            {/* Price Group Relationship Info */}
            {sku?.priceGroup && product && (() => {
              const skusWithSamePriceGroup = product.skus.filter(s => s.priceGroup.id === sku.priceGroup.id);
              const otherSkusCount = skusWithSamePriceGroup.length - 1;
              
              return otherSkusCount > 0 ? (
                <div style={{ marginBottom: '24px' }}>
                  <InfoPopover 
                    content={`${otherSkusCount} other SKU${otherSkusCount !== 1 ? 's' : ''} in ${product.name} use${otherSkusCount === 1 ? 's' : ''} the same price group. Click the row below to see all price points and related SKUs.`}
                  >
                    <Typography.Text style={{ color: token.colorTextSecondary }}>
                      ℹ️ {otherSkusCount} other SKU{otherSkusCount !== 1 ? 's' : ''} use{otherSkusCount === 1 ? 's' : ''} this price group
                    </Typography.Text>
                  </InfoPopover>
                </div>
              ) : null;
            })()}
            
            {/* Single-row Price Group Table */}
            <PriceGroupTable 
              priceGroups={priceGroupData}
              productId={productId || ''}
              productName={product?.name}
              product={product}
              currentTab="pricing"
            />
          </PageSection>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="SKU"
        title={sku?.id || ''}
        tagContent={<StatusTag status={sku?.status} showIcon={false} />}
        rightAlignedId={sku?.id}
        channels={sku?.salesChannel ? [sku.salesChannel] : []}
        billingCycles={sku?.billingCycle ? [sku.billingCycle] : []}
        lastUpdatedBy="Anthony Homan"
        lastUpdatedAt={new Date(Date.now() - 45 * 60 * 1000)} // 45 minutes ago
        onEdit={() => console.log('Edit SKU clicked')}
        compact
      />

      <Tabs defaultActiveKey="overview" items={tabItems} />
    </Space>
  );
};

export default SkuDetail; 