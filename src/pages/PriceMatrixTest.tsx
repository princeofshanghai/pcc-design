import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Space, Card, Row, Col, theme, Tabs } from 'antd';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import { usePricePointFilters } from '../hooks/usePricePointFilters';

import {
  PageHeader,
  FilterBar,
} from '../components';
import { getDefaultValidityFilter } from '../utils/channelConfigurations';
import PricePointMatrix from '../components/pricing/PricePointMatrix';
import VolumeDiscountChart from '../components/pricing/VolumeDiscountChart';
import { 
  getFilterPlaceholder
} from '../utils/tableConfigurations';

const { Title, Text } = Typography;

// Helper function to create mock pricing tier data for demonstration
const createMockPricingTierData = (originalPricePoints: any[]) => {
  const mockData: any[] = [];
  const pricingTiers = ['STFF', 'CORP EM', 'GVT', 'B', 'T1', 'T2', 'T3'];
  
  // Only use USD and EUR for the demo to keep it manageable
  const demoPoints = originalPricePoints.filter(p => ['USD', 'EUR'].includes(p.currencyCode));
  
  demoPoints.forEach((originalPoint) => {
    pricingTiers.forEach((tier, index) => {
      // Create variation in prices based on tier
      const priceMultiplier = {
        'STFF': 0.7,      // Staff discount
        'CORP EM': 1.0,   // Corp base price
        'GVT': 0.85,      // Government discount
        'B': 1.1,         // Business tier
        'T1': 1.15,       // Tier 1
        'T2': 1.2,        // Tier 2
        'T3': 1.25,       // Tier 3
      }[tier] || 1.0;

      mockData.push({
        ...originalPoint,
        id: `${originalPoint.id}-${tier}`,
        pricingTier: tier,
        amount: Math.round(originalPoint.amount * priceMultiplier),
      });
    });
  });
  
  return mockData;
};

const PriceMatrixTest: React.FC = () => {
  const { token } = theme.useToken();
  
  // Use the same product and price group as in your screenshot
  const productId = "130200";
  const priceGroupId = "1602004";
  
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load product data
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    loadProductWithPricing(productId)
      .then(enhancedProduct => {
        console.log('Test page - Enhanced product loaded:', enhancedProduct);
        if (enhancedProduct) {
          setProduct(enhancedProduct);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Test page - Error loading product with pricing:', err);
        setError(err.message || 'Failed to load product data');
        setIsLoading(false);
      });
  }, []);
  
  // Find SKUs with the specific price group
  const skusWithPriceGroup = product?.skus.filter(sku => sku.priceGroup.id === priceGroupId) || [];
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;
  const uniqueChannels = [...new Set(skusWithPriceGroup.map(sku => sku.salesChannel))];

  // Use the same filtering logic as PriceGroupDetail
  const {
    setSearchQuery: setPricePointSearchQuery,
    currencyFilters,
    setCurrencyFilters,
    statusFilters,
    setStatusFilters,
    categoryFilters,
    setCategoryFilters,
    validityFilter,
    setValidityFilter,
    currencyOptions,
    statusOptions,
    categoryOptions,
    validityOptions,
    sortOrder: pricePointSortOrder,
    setSortOrder: setPricePointSortOrder,
    groupBy: pricePointGroupBy,
    setGroupBy: setPricePointGroupBy,
    filteredPricePoints,
    groupedPricePoints: groupedPricePointsData,
  } = usePricePointFilters(priceGroup?.pricePoints || [], uniqueChannels);



  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setCurrencyFilters([]);
    setStatusFilters([]);
    setCategoryFilters([]);
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>Loading Test Data...</Title>
        <Text>Loading price group data for matrix testing...</Text>
      </div>
    );
  }

  if (error || !product || !priceGroup) {
    return (
      <div style={{ padding: '24px' }}>
        <Title level={2}>Test Setup Error</Title>
        <Text>{error || 'Could not load test data'}</Text>
      </div>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%', padding: '24px' }} size={32}>
      <PageHeader
        entityType="Matrix Test"
        title={`Testing Matrix View - ${priceGroup.name}`}
        rightAlignedId={priceGroup.id || ''}
        compact
      />

      <div>
        <Title level={4} style={{ marginBottom: '16px', color: token.colorPrimary }}>
          🧪 Matrix Refinement Lab
        </Title>
        <Text style={{ color: token.colorTextSecondary }}>
          Isolated environment for testing matrix and chart views. All filters affect both tabs.
          Try filtering currencies, searching, or changing validity periods to see real-time updates.
        </Text>
      </div>

      {/* Matrix Filters */}
      <Card title="🔍 Matrix Filters" size="small">
        <FilterBar
          useCustomFilters={true}
          search={{
            placeholder: "Search by currency or ID...",
            onChange: setPricePointSearchQuery,
          }}
          filters={[
            {
              placeholder: getFilterPlaceholder('validity'),
              options: validityOptions.filter(option => option.value !== 'All periods'),
              multiSelect: false,
              value: validityFilter,
              onChange: (value: string | null) => {
                if (value) {
                  setValidityFilter(value);
                } else {
                  // Reset to most recent period when cleared
                  const availablePeriods = validityOptions.filter(opt => opt.value !== 'All periods');
                  const newestPeriod = availablePeriods[0]?.value;
                  if (newestPeriod) {
                    setValidityFilter(newestPeriod);
                  }
                }
              },
              disableSearch: true,
              excludeFromClearAll: true,
              hideClearButton: true,
              preventDeselection: true,
              multiValue: [],
              onMultiChange: () => {},
            },
            {
              placeholder: getFilterPlaceholder('currency'),
              options: currencyOptions,
              multiSelect: true,
              multiValue: currencyFilters,
              onMultiChange: (values: string[]) => setCurrencyFilters(values),
              value: null,
              onChange: () => {},
            },
            {
              placeholder: getFilterPlaceholder('status'),
              options: statusOptions,
              multiSelect: true,
              multiValue: statusFilters,
              onMultiChange: (values: string[]) => setStatusFilters(values),
              disableSearch: true,
              value: null,
              onChange: () => {},
            },
          ]}
          onClearAll={clearAllPricePointFilters}
          displayMode="inline"
        />
      </Card>

      {/* Tabbed Interface */}
      <Card size="small" bodyStyle={{ padding: '0' }}>
        <Tabs
          defaultActiveKey="matrix"
          size="large"
          style={{ padding: '0 24px' }}
          items={[
            {
              key: 'matrix',
              label: '📊 Matrix View',
              children: (
                <div style={{ padding: '0 0 24px 0' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text style={{ color: token.colorTextSecondary }}>
                      <strong>Spreadsheet-style matrix matching your Excel structure:</strong><br/>
                      <strong>Rows:</strong> Volume tiers (1-2 seats, 3-10 seats, etc.) • 
                      <strong>Columns:</strong> Currencies with nested pricing tiers (Staff, Corp EM, Gov't, B, T1, T2, T3)
                    </Text>
                  </div>
                  
                  <PricePointMatrix 
                    pricePoints={createMockPricingTierData(filteredPricePoints)}
                    isTaxInclusive={false}
                  />
                </div>
              ),
            },
            {
              key: 'charts',
              label: '📈 Volume Chart',
              children: (
                <div style={{ padding: '0 0 24px 0' }}>
                  <div style={{ marginBottom: '16px' }}>
                    <Text style={{ color: token.colorTextSecondary }}>
                      <strong>Volume discount visualization:</strong><br/>
                      Shows how price per seat decreases with higher volume tiers. Select currency to see pricing patterns.
                    </Text>
                  </div>
                  
                  <VolumeDiscountChart 
                    pricePoints={createMockPricingTierData(filteredPricePoints)}
                    currencies={currencyOptions.map(c => c.value)}
                  />
                </div>
              ),
            },
          ]}
        />
      </Card>

      {/* Debug Info */}
      <Card title="Debug Info" size="small" style={{ marginTop: '32px' }}>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <Text strong>Total Price Points:</Text> {priceGroup?.pricePoints?.length || 0}
          </Col>
          <Col span={8}>
            <Text strong>Filtered Price Points:</Text> {filteredPricePoints.length}
          </Col>
          <Col span={8}>
            <Text strong>Channels:</Text> {uniqueChannels.join(', ')}
          </Col>
        </Row>
        <div style={{ marginTop: '12px' }}>
          <Text strong>Available Currencies:</Text>
          <div style={{ marginTop: '4px' }}>
            {currencyOptions.map(curr => (
              <span 
                key={curr.value}
                style={{ 
                  display: 'inline-block',
                  margin: '2px 4px',
                  padding: '2px 8px',
                  backgroundColor: token.colorFillTertiary,
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {curr.value}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </Space>
  );
};

export default PriceMatrixTest;
