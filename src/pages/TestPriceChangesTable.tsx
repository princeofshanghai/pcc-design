import React, { useState } from 'react';
import { Space, Card, Switch, Typography, Divider } from 'antd';
import PriceChangesTable from '../components/pricing/PriceEditor/PriceChangesTable';
import { PageHeader } from '../components';

const { Text } = Typography;

// Sample data for non-field product (like 5095285 - Desktop)
const sampleSimpleChanges = [
  {
    id: 'usd-change',
    type: 'simple' as const,
    currency: 'USD',
    currencyName: 'US Dollar',
    context: 'Base price' as const,
    currentPrice: 39.99,
    newPrice: 49.99,
    change: {
      amount: 10.00,
      percentage: 25.0
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  },
  {
    id: 'eur-change',
    type: 'simple' as const,
    currency: 'EUR',
    currencyName: 'Euro',
    context: 'Base price' as const,
    currentPrice: null, // New currency
    newPrice: 44.99,
    change: {
      amount: 44.99,
      percentage: 100
    },
    validity: 'Jan 15, 2025 - present',
    status: 'new' as const
  },
  {
    id: 'gbp-change',
    type: 'simple' as const,
    currency: 'GBP',
    currencyName: 'British Pound',
    context: 'Base price' as const,
    currentPrice: 34.99,
    newPrice: 39.99,
    change: {
      amount: 5.00,
      percentage: 14.3
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  },
  {
    id: 'jpy-change',
    type: 'simple' as const,
    currency: 'JPY',
    currencyName: 'Japanese Yen',
    context: 'Base price' as const,
    currentPrice: 4900,
    newPrice: 5500,
    change: {
      amount: 600,
      percentage: 12.2
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  },
  {
    id: 'cad-change',
    type: 'simple' as const,
    currency: 'CAD',
    currencyName: 'Canadian Dollar',
    context: 'Base price' as const,
    currentPrice: 54.99,
    newPrice: 49.99,
    change: {
      amount: -5.00,
      percentage: -9.1
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  },
  {
    id: 'brl-change',
    type: 'simple' as const,
    currency: 'BRL',
    currencyName: 'Brazilian Real',
    context: 'Base price' as const,
    currentPrice: null,
    newPrice: 179.99,
    change: {
      amount: 179.99,
      percentage: 100
    },
    validity: 'Jan 15, 2025 - present',
    status: 'new' as const
  }
];

// Sample data for field product (complex pricing)
const sampleFieldChanges = [
  {
    id: 'usd-1-100-basic',
    type: 'field' as const,
    currency: 'USD',
    currencyName: 'US Dollar',
    context: '1-100 seats, Basic',
    seatRange: '1-100',
    tier: 'Basic',
    currentPrice: 89.00,
    newPrice: 99.00,
    change: {
      amount: 10.00,
      percentage: 11.2
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  },
  {
    id: 'usd-1-100-premium',
    type: 'field' as const,
    currency: 'USD',
    currencyName: 'US Dollar',
    context: '1-100 seats, Premium',
    seatRange: '1-100',
    tier: 'Premium',
    currentPrice: 149.00,
    newPrice: 159.00,
    change: {
      amount: 10.00,
      percentage: 6.7
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  },
  {
    id: 'usd-101-500-basic',
    type: 'field' as const,
    currency: 'USD',
    currencyName: 'US Dollar',
    context: '101-500 seats, Basic',
    seatRange: '101-500',
    tier: 'Basic',
    currentPrice: 79.00,
    newPrice: 89.00,
    change: {
      amount: 10.00,
      percentage: 12.7
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  },
  {
    id: 'eur-1-100-basic',
    type: 'field' as const,
    currency: 'EUR',
    currencyName: 'Euro',
    context: '1-100 seats, Basic',
    seatRange: '1-100',
    tier: 'Basic',
    currentPrice: null,
    newPrice: 89.00,
    change: {
      amount: 89.00,
      percentage: 100
    },
    validity: 'Jan 15, 2025 - present',
    status: 'new' as const
  },
  {
    id: 'eur-1-100-premium',
    type: 'field' as const,
    currency: 'EUR',
    currencyName: 'Euro',
    context: '1-100 seats, Premium',
    seatRange: '1-100',
    tier: 'Premium',
    currentPrice: null,
    newPrice: 149.00,
    change: {
      amount: 149.00,
      percentage: 100
    },
    validity: 'Jan 15, 2025 - present',
    status: 'new' as const
  },
  {
    id: 'gbp-1-100-basic',
    type: 'field' as const,
    currency: 'GBP',
    currencyName: 'British Pound',
    context: '1-100 seats, Basic',
    seatRange: '1-100',
    tier: 'Basic',
    currentPrice: 79.00,
    newPrice: 74.99,
    change: {
      amount: -4.01,
      percentage: -5.1
    },
    validity: 'Jan 15, 2025 - present',
    status: 'updated' as const
  }
];

const TestPriceChangesTable: React.FC = () => {
  const [showFieldExample, setShowFieldExample] = useState(false);
  const [showGTMMode, setShowGTMMode] = useState(false);

  const handleEdit = (changeId: string) => {
    console.log('Edit requested for change:', changeId);
    // In real implementation, this would navigate to price editor
  };

  const currentChanges = showFieldExample ? sampleFieldChanges : sampleSimpleChanges;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        entityType="Test Page"
        title="New Unified Price Changes Table"
        compact
      />

      {/* Controls */}
      <Card title="Test Controls" size="small">
        <Space direction="vertical" size="middle">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Switch 
              checked={showFieldExample}
              onChange={setShowFieldExample}
            />
            <Text>Show field product example (complex pricing matrix)</Text>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Switch 
              checked={showGTMMode}
              onChange={setShowGTMMode}
            />
            <Text>Show GTM mode (with edit buttons)</Text>
          </div>
        </Space>
      </Card>

      {/* Example Description */}
      <Card title="What you're seeing" size="small">
        <Space direction="vertical" size="small">
          <Text>
            <strong>Current Example:</strong> {showFieldExample ? 'Field Product (Complex)' : 'Desktop Product (Simple)'}
          </Text>
          <Text>
            <strong>Data Source:</strong> Based on product 5095285 pricing patterns
          </Text>
          <Text>
            <strong>Key Features:</strong>
          </Text>
          <ul style={{ marginLeft: '16px', marginBottom: 0 }}>
            <li>Professional status badges (NEW, UPDATED) instead of emojis</li>
            <li>Clean typography and consistent spacing</li>
            <li>Progressive disclosure for field products (click currency to expand)</li>
            <li>Large change warnings (&gt;10% gets warning icon)</li>
            <li>Scalable design (search, pagination for many changes)</li>
            <li>Same design works for Review step AND GTM detail pages</li>
          </ul>
        </Space>
      </Card>

      <Divider />

      {/* The actual component */}
      <PriceChangesTable
        changes={currentChanges}
        title={showFieldExample ? "Field Product Price Changes" : "Desktop Product Price Changes"}
        mode={showGTMMode ? 'gtm' : 'review'}
        onEdit={showGTMMode ? handleEdit : undefined}
        showSummary={true}
        showFiltering={true}
        skuContext={{
          action: 'update',
          productName: 'LinkedIn Premium',
          channel: showFieldExample ? 'Field' : 'Desktop',
          billingCycle: 'Monthly',
          skuIds: showFieldExample ? ['premium-field-001', 'premium-field-002'] : ['premium-desktop-001', 'premium-desktop-002', 'premium-desktop-003']
        }}
      />

      {/* Usage Notes */}
      <Card title="Design Notes" size="small" style={{ marginTop: '24px' }}>
        <Space direction="vertical" size="small">
          <Text><strong>Scalability:</strong> Try the search box with "USD" or "Euro" to see filtering in action</Text>
          <Text><strong>Field Products:</strong> Click on currency headers to expand/collapse detailed breakdowns</Text>
          <Text><strong>Professional Look:</strong> No emojis, clean status badges, subtle color coding</Text>
          <Text><strong>Consistency:</strong> Same component works for both Review step and GTM motion pages</Text>
          <Text><strong>Performance:</strong> Ready for pagination when there are 100+ changes</Text>
        </Space>
      </Card>
    </Space>
  );
};

export default TestPriceChangesTable;
