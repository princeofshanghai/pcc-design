import React from 'react';
import { Typography, Space, Card, Divider, Row, Col, theme } from 'antd';


// Import all the components we want to showcase
import StatusTag from '../components/attributes/StatusTag';
import LobTag from '../components/attributes/LobTag';
import CountTag from '../components/attributes/CountTag';

import OverrideIndicator from '../components/pricing/OverrideIndicator';
import CopyableId from '../components/shared/CopyableId';
import UserAvatar from '../components/shared/UserAvatar';

// Import additional components
import BillingCycleDisplay from '../components/attributes/BillingCycleDisplay';
import SalesChannelDisplay from '../components/attributes/SalesChannelDisplay';
import PricePointStatusTag from '../components/attributes/PricePointStatusTag';
import FolderTag from '../components/attributes/FolderTag';



const { Title, Text } = Typography;

interface ComponentSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const ComponentSection: React.FC<ComponentSectionProps> = ({ title, description, children }) => {
  
  return (
    <Card 
      className="content-panel"
      style={{ marginBottom: 24 }}
      bordered={false}
    >
      <Space direction="vertical" size={16} style={{ width: '100%' }}>
        <div>
          <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
            {title}
          </Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            {description}
          </Text>
        </div>
        <Divider style={{ margin: 0 }} />
        {children}
      </Space>
    </Card>
  );
};

interface VariationRowProps {
  label: string;
  description?: string;
  children: React.ReactNode;
}

const VariationRow: React.FC<VariationRowProps> = ({ label, description, children }) => {
  return (
    <Row align="middle" style={{ marginBottom: 16 }}>
      <Col span={6}>
        <div>
          <Text strong style={{ fontSize: '13px' }}>{label}</Text>
          {description && (
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {description}
              </Text>
            </div>
          )}
        </div>
      </Col>
      <Col span={18}>
        <Space size={12} wrap>
          {children}
        </Space>
      </Col>
    </Row>
  );
};

const Storybook: React.FC = () => {
  const { token } = theme.useToken();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={1} style={{ margin: 0, marginBottom: 8 }}>
          Component Storybook
        </Title>
        <Text type="secondary" style={{ fontSize: '16px' }}>
          A comprehensive showcase of all UI components and their various states. 
          This helps designers and engineers understand how each component should look and behave.
        </Text>
      </div>

      {/* Attributes Section */}
      <ComponentSection
        title="Attributes & Status"
        description="Components that display product attributes, statuses, and categorizations"
      >
        <VariationRow 
          label="StatusTag" 
          description="Product lifecycle status"
        >
          <StatusTag status="Active" />
          <StatusTag status="Legacy" />
          <StatusTag status="Retired" />
          <StatusTag status="Active" showLabel={false} />
          <StatusTag status="Legacy" showLabel={false} />
          <StatusTag status="Retired" showLabel={false} />
        </VariationRow>

        <VariationRow 
          label="LobTag" 
          description="Line of Business categorization"
        >
          <LobTag lob="Premium" />
          <LobTag lob="LTS" />
          <LobTag lob="LMS" />
          <LobTag lob="LSS" />
          <LobTag lob="Other" />
        </VariationRow>

        <VariationRow 
          label="CountTag" 
          description="Numeric counters and quantities"
        >
          <CountTag count={1} />
          <CountTag count={5} />
          <CountTag count={25} />
          <CountTag count={100} />
        </VariationRow>

        <VariationRow 
          label="BillingCycleDisplay" 
          description="Billing frequency options"
        >
          <BillingCycleDisplay billingCycle="Monthly" />
          <BillingCycleDisplay billingCycle="Quarterly" />
          <BillingCycleDisplay billingCycle="Annual" />
        </VariationRow>

        <VariationRow 
          label="SalesChannelDisplay" 
          description="Sales platform channels"
        >
          <SalesChannelDisplay channel="Desktop" />
          <SalesChannelDisplay channel="Field" />
          <SalesChannelDisplay channel="iOS" />
          <SalesChannelDisplay channel="GPB" />
        </VariationRow>

        <VariationRow 
          label="PricePointStatusTag" 
          description="Price point validity status"
        >
          <PricePointStatusTag pricePoint={{id: '1', currencyCode: 'USD', amount: 100, validFrom: '2024-01-01', pricingRule: 'NONE', status: 'Active'}} />
          <PricePointStatusTag pricePoint={{id: '2', currencyCode: 'USD', amount: 50, validFrom: '2023-01-01', validTo: '2023-12-31', pricingRule: 'NONE', status: 'Expired'}} />
        </VariationRow>

        <VariationRow 
          label="FolderTag" 
          description="Product folder organization"
        >
          <FolderTag folder="Core Products" lob="Premium" />
          <FolderTag folder="Enterprise Solutions" lob="LTS" />
          <FolderTag folder="Marketing Tools" lob="LMS" />
        </VariationRow>
      </ComponentSection>



      {/* Shared/Utility Section */}
      <ComponentSection
        title="Shared & Utility"
        description="Reusable utility components used throughout the application"
      >
        <VariationRow 
          label="CopyableId" 
          description="Clickable IDs that copy to clipboard"
        >
          <CopyableId id="PROD-12345" />
          <CopyableId id="SKU-67890" variant="prominent" />
          <CopyableId id="PG-54321" muted />
          <CopyableId id="CR-98765" variant="prominent" muted />
        </VariationRow>

        <VariationRow 
          label="UserAvatar" 
          description="User profile representations"
        >
          <UserAvatar user="john.doe" />
          <UserAvatar user="jane.smith" />
          <UserAvatar user="mike.wilson" />
        </VariationRow>
      </ComponentSection>

      {/* Pricing Section */}
      <ComponentSection
        title="Pricing & Financial"
        description="Components related to pricing, overrides, and financial data"
      >
        <VariationRow 
          label="OverrideIndicator" 
          description="Shows when pricing has manual overrides"
        >
          <OverrideIndicator />
          <span style={{ color: token.colorTextSecondary, fontSize: '13px' }}>
            (Appears when price differs from standard rules)
          </span>
        </VariationRow>
      </ComponentSection>

      {/* Component Usage Guidelines */}
      <ComponentSection
        title="Usage Guidelines"
        description="Best practices for implementing these components"
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Text strong>Component States:</Text>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li><Text type="secondary">Most components support different visual states (active, muted, prominent)</Text></li>
              <li><Text type="secondary">Icons can often be hidden or shown independently of labels</Text></li>
              <li><Text type="secondary">Tooltips provide additional context without cluttering the interface</Text></li>
            </ul>
          </div>
          
          <div>
            <Text strong>Design Consistency:</Text>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li><Text type="secondary">All components use the design system theme tokens for colors</Text></li>
              <li><Text type="secondary">Icons come from Lucide React for consistency</Text></li>
              <li><Text type="secondary">Typography follows the Inter font hierarchy</Text></li>
            </ul>
          </div>

          <div>
            <Text strong>Engineering Notes:</Text>
            <ul style={{ marginTop: 8, marginBottom: 0 }}>
              <li><Text type="secondary">Components are fully typed with TypeScript interfaces</Text></li>
              <li><Text type="secondary">All interactive components handle accessibility (ARIA labels, keyboard navigation)</Text></li>
              <li><Text type="secondary">Styling uses Ant Design's theme system for automatic dark mode support</Text></li>
            </ul>
          </div>
        </Space>
      </ComponentSection>
    </div>
  );
};

export default Storybook;