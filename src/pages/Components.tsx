import React, { useState } from 'react';
import { Typography, Space, Divider, Card, Row, Col, Button, Tag } from 'antd';
import { Heart, Star, Table, List } from 'lucide-react';

// Import components to showcase
import BaseChip from '../components/shared/BaseChip';
import StatusTag from '../components/attributes/StatusTag';
import InfoPopover from '../components/shared/InfoPopover';
import CopyableId from '../components/shared/CopyableId';
import MetricCard from '../components/shared/MetricCard';
import UserAvatar from '../components/shared/UserAvatar';
import SecondaryText from '../components/shared/SecondaryText';
import TruncatedText from '../components/shared/TruncatedText';
import VerticalSeparator from '../components/shared/VerticalSeparator';
import ApprovalStatusTag from '../components/attributes/ApprovalStatusTag';
import BillingCycleTag from '../components/attributes/BillingCycleTag';
import ChannelTag from '../components/attributes/ChannelTag';
import CountTag from '../components/attributes/CountTag';

// Import filter components
import SearchBar from '../components/filters/SearchBar';
import FilterDropdown from '../components/filters/FilterDropdown';
import CustomFilterButton from '../components/filters/CustomFilterButton';
import ViewModeToggle from '../components/shared/ViewModeToggle';
import ModeSelectorButton from '../components/shared/ModeSelectorButton';

// Import list/table components
import ProductListItem from '../components/product/ProductListItem';
import SkuListItem from '../components/sku/SkuListItem';
import GroupHeader from '../components/shared/GroupHeader';
import OverrideIndicator from '../components/pricing/OverrideIndicator';

// Import sample data
import { mockProducts } from '../utils/mock-data';

const { Title, Text, Paragraph } = Typography;

interface ComponentShowcaseProps {
  title: string;
  component: React.ReactNode;
  code: string;
  description?: string;
}

const ComponentShowcase: React.FC<ComponentShowcaseProps> = ({ title, component, code, description }) => (
  <Card size="small" style={{ marginBottom: 16 }}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <div>
        <Title level={5} style={{ margin: 0, marginBottom: 4 }}>{title}</Title>
        {description && <Text type="secondary" style={{ fontSize: 12 }}>{description}</Text>}
      </div>
      
      <div style={{ padding: '12px 16px', backgroundColor: '#fafafa', borderRadius: 6, border: '1px solid #f0f0f0' }}>
        {component}
      </div>
      
      <div style={{ backgroundColor: '#f6f8fa', borderRadius: 4, padding: 12 }}>
        <pre style={{ 
          margin: 0, 
          fontSize: 12, 
          fontFamily: 'Monaco, Menlo, monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          <Text copyable={{ text: code }}>{code}</Text>
        </pre>
      </div>
    </Space>
  </Card>
);

const Components: React.FC = () => {
  // State for interactive examples
  const [_searchValue, setSearchValue] = useState('');
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [multiFilterValue, setMultiFilterValue] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('table');
  const [groupExpanded, setGroupExpanded] = useState(false);
  
  // Sample data for interactive examples
  const sampleFilterOptions = [
    { label: 'Active (15)', value: 'active' },
    { label: 'Inactive (8)', value: 'inactive' },
    { label: 'Archived (3)', value: 'archived' },
  ];
  
  const sampleGroupedOptions = [
    {
      label: 'Status',
      options: [
        { label: 'Active (15)', value: 'active' },
        { label: 'Inactive (8)', value: 'inactive' },
      ]
    },
    {
      label: 'Type',
      options: [
        { label: 'Premium (12)', value: 'premium' },
        { label: 'Standard (6)', value: 'standard' },
      ]
    }
  ];

  // Get sample products and SKUs for realistic examples
  const sampleProducts = mockProducts.slice(0, 2); // First 2 products
  const sampleSku = sampleProducts[0]?.skus[0]; // First SKU from first product

  return (
    <div style={{ padding: '24px 0' }}>
      <div style={{ marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
          Components <Tag color="orange" style={{ marginLeft: 8 }}>Internal</Tag>
        </Title>
        <Paragraph type="secondary">
          Interactive component library for engineers. All components are fully functional - click, hover, and interact with them.
        </Paragraph>
      </div>

      {/* Shared Components */}
      <Title level={3}>Shared Components</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="BaseChip"
            description="Basic chip component with icon and tooltip support"
            component={
              <Space wrap>
                <BaseChip icon={<Heart />}>Default Chip</BaseChip>
                <BaseChip variant="small" icon={<Star />}>Small Chip</BaseChip>
                <BaseChip muted tooltip="This is a tooltip">Muted with Tooltip</BaseChip>
              </Space>
            }
            code={`import { BaseChip } from '@/components/shared/BaseChip'
<BaseChip icon={<Heart />}>Default Chip</BaseChip>`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="InfoPopover"
            description="Shows helpful information on hover"
            component={
              <InfoPopover content="This provides additional context and help information">
                <Button type="link">Hover me for info ℹ️</Button>
              </InfoPopover>
            }
            code={`import { InfoPopover } from '@/components/shared/InfoPopover'
<InfoPopover content="Help text here">
  <Button>Hover me</Button>
</InfoPopover>`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="CopyableId"
            description="ID that can be copied to clipboard"
            component={
              <CopyableId id="PG-12345" />
            }
            code={`import { CopyableId } from '@/components/shared/CopyableId'
<CopyableId id="PG-12345" />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="MetricCard"
            description="Display key metrics with labels"
            component={
              <Space>
                <MetricCard title="Active Products" value="1,247" />
                <MetricCard title="Revenue" value="$2.3M" />
              </Space>
            }
            code={`import { MetricCard } from '@/components/shared/MetricCard'
<MetricCard title="Active Products" value="1,247" />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="UserAvatar"
            description="User profile picture with fallback"
            component={
              <Space>
                <UserAvatar user="Sarah Johnson" />
                <UserAvatar user="Mike Chen" size="small" />
              </Space>
            }
            code={`import { UserAvatar } from '@/components/shared/UserAvatar'
<UserAvatar user="Sarah Johnson" />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="TruncatedText"
            description="Text that truncates with tooltip on hover"
            component={
              <div style={{ width: 200 }}>
                <TruncatedText text="This is a very long text that will be truncated when it exceeds the available space" />
              </div>
            }
            code={`import { TruncatedText } from '@/components/shared/TruncatedText'
<TruncatedText text="Long text..." />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="SecondaryText"
            description="Muted text for secondary information"
            component={
              <Space direction="vertical">
                <SecondaryText>Secondary information</SecondaryText>
                <div>Primary text <SecondaryText>with secondary context</SecondaryText></div>
              </Space>
            }
            code={`import { SecondaryText } from '@/components/shared/SecondaryText'
<SecondaryText>Secondary information</SecondaryText>`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="VerticalSeparator"
            description="Visual separator between elements"
            component={
              <Space>
                <span>Item 1</span>
                <VerticalSeparator />
                <span>Item 2</span>
                <VerticalSeparator />
                <span>Item 3</span>
              </Space>
            }
            code={`import { VerticalSeparator } from '@/components/shared/VerticalSeparator'
<span>Item 1</span>
<VerticalSeparator />
<span>Item 2</span>`}
          />
        </Col>
      </Row>

      <Divider />

      {/* Attribute/Status Components */}
      <Title level={3}>Attribute & Status Components</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="StatusTag"
            description="Product status with color coding"
            component={
              <Space wrap>
                <StatusTag status="Active" />
                <StatusTag status="Inactive" />
                <StatusTag status="Archived" />
                <StatusTag status="Active" variant="small" showIcon={false} />
              </Space>
            }
            code={`import { StatusTag } from '@/components/attributes/StatusTag'
<StatusTag status="Active" />
<StatusTag status="Inactive" variant="small" />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="ApprovalStatusTag"
            description="Shows approval workflow status"
            component={
              <Space wrap>
                <ApprovalStatusTag status="Approved" />
                <ApprovalStatusTag status="Pending" />
                <ApprovalStatusTag status="Rejected" />
                <ApprovalStatusTag status="Not requested" />
              </Space>
            }
            code={`import { ApprovalStatusTag } from '@/components/attributes/ApprovalStatusTag'
<ApprovalStatusTag status="Approved" />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="BillingCycleTag"
            description="Shows billing cycle information"
            component={
              <Space wrap>
                <BillingCycleTag billingCycle="Monthly" />
                <BillingCycleTag billingCycle="Annual" />
                <BillingCycleTag billingCycle="Quarterly" />
              </Space>
            }
            code={`import { BillingCycleTag } from '@/components/attributes/BillingCycleTag'
<BillingCycleTag billingCycle="Monthly" />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="ChannelTag"
            description="Sales channel indicator"
            component={
              <Space wrap>
                <ChannelTag channel="Desktop" />
                <ChannelTag channel="Field" />
                <ChannelTag channel="iOS" />
                <ChannelTag channel="GPB" />
              </Space>
            }
            code={`import { ChannelTag } from '@/components/attributes/ChannelTag'
<ChannelTag channel="Desktop" />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="CountTag"
            description="Simple count display tag"
            component={
              <Space wrap>
                <CountTag count={42} />
                <CountTag count={156} />
                <CountTag count={8} />
              </Space>
            }
            code={`import { CountTag } from '@/components/attributes/CountTag'
<CountTag count={42} />`}
          />
        </Col>
      </Row>

      <Divider />

      {/* Filter & Search Components */}
      <Title level={3}>Filter & Search Components</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="SearchBar"
            description="Search input with icon and clear functionality"
            component={
              <SearchBar 
                placeholder="Search products..."
                onChange={setSearchValue}
              />
            }
            code={`import { SearchBar } from '@/components/filters/SearchBar'
<SearchBar 
  placeholder="Search products..." 
  onChange={handleChange} 
/>`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="FilterDropdown"
            description="Single or multi-select dropdown with search"
            component={
              <Space wrap>
                <FilterDropdown
                  placeholder="Status"
                  options={sampleFilterOptions}
                  value={filterValue}
                  onChange={setFilterValue}
                />
                <FilterDropdown
                  placeholder="Categories"
                  options={sampleGroupedOptions}
                  multiSelect
                  multiValue={multiFilterValue}
                  onMultiChange={setMultiFilterValue}
                />
              </Space>
            }
            code={`import { FilterDropdown } from '@/components/filters/FilterDropdown'
<FilterDropdown
  placeholder="Status"
  options={options}
  value={value}
  onChange={onChange}
/>`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="CustomFilterButton"
            description="Advanced filter button with multiple modes"
            component={
              <Space wrap>
                <CustomFilterButton
                  placeholder="All Statuses"
                  options={sampleFilterOptions}
                  value={filterValue}
                  onChange={setFilterValue}
                />
                <CustomFilterButton
                  placeholder="All Types"
                  options={sampleGroupedOptions}
                  multiSelect
                  multiValue={multiFilterValue}
                  onMultiChange={setMultiFilterValue}
                />
              </Space>
            }
            code={`import { CustomFilterButton } from '@/components/filters/CustomFilterButton'
<CustomFilterButton
  placeholder="All Statuses"
  options={options}
  value={value}
  onChange={onChange}
/>`}
          />
        </Col>
      </Row>

      <Divider />

      {/* View & Selection Components */}
      <Title level={3}>View & Selection Components</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="ViewModeToggle"
            description="Toggle between different view modes"
            component={
              <ViewModeToggle
                value={viewMode}
                onChange={setViewMode}
                options={[
                  { key: 'table', label: 'Table View', icon: <Table size={16} /> },
                  { key: 'list', label: 'List View', icon: <List size={16} /> },
                ]}
              />
            }
            code={`import { ViewModeToggle } from '@/components/shared/ViewModeToggle'
<ViewModeToggle
  value={viewMode}
  onChange={setViewMode}
  options={viewOptions}
/>`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="ModeSelectorButton"
            description="Dropdown button with mode selection"
            component={
              <ModeSelectorButton
                options={[
                  { key: 'create', label: 'Create New', description: 'Create a new item' },
                  { key: 'edit', label: 'Edit Existing', description: 'Modify an existing item' },
                ]}
                defaultSelected="create"
                onExecute={(mode) => console.log('Execute:', mode)}
                onSelectionChange={(mode) => console.log('Selected:', mode)}
              />
            }
            code={`import { ModeSelectorButton } from '@/components/shared/ModeSelectorButton'
<ModeSelectorButton
  options={options}
  defaultSelected="create"
  onExecute={handleExecute}
/>`}
          />
        </Col>
      </Row>

      <Divider />

      {/* List & Table Components */}
      <Title level={3}>List & Table Components</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <ComponentShowcase
            title="ProductListItem"
            description="Interactive product card for lists - hover and click!"
            component={
              <Space direction="vertical" style={{ width: '100%' }}>
                {sampleProducts.map(product => (
                  <ProductListItem key={product.id} product={product} />
                ))}
              </Space>
            }
            code={`import { ProductListItem } from '@/components/product/ProductListItem'
<ProductListItem product={product} />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="SkuListItem"
            description="Compact SKU display card"
            component={
              sampleSku ? <SkuListItem sku={sampleSku} /> : <div>No SKU data available</div>
            }
            code={`import { SkuListItem } from '@/components/sku/SkuListItem'
<SkuListItem sku={sku} />`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="GroupHeader"
            description="Collapsible section header with count - try clicking!"
            component={
              <Space direction="vertical" style={{ width: '100%' }}>
                <GroupHeader 
                  title="Active Products" 
                  count={15} 
                  isExpandable 
                  isExpanded={groupExpanded}
                  onToggle={() => setGroupExpanded(!groupExpanded)}
                />
                <GroupHeader 
                  title="Premium Tier" 
                  count={8} 
                  isExpandable={false}
                />
              </Space>
            }
            code={`import { GroupHeader } from '@/components/shared/GroupHeader'
<GroupHeader 
  title="Active Products" 
  count={15}
  isExpandable
  isExpanded={expanded}
  onToggle={handleToggle}
/>`}
          />
        </Col>
        
        <Col xs={24} lg={12}>
          <ComponentShowcase
            title="OverrideIndicator"
            description="Simple pricing override tag"
            component={
              <Space>
                <span>Base Price: $99.99</span>
                <OverrideIndicator />
              </Space>
            }
            code={`import { OverrideIndicator } from '@/components/pricing/OverrideIndicator'
<OverrideIndicator />`}
          />
        </Col>
      </Row>

      <Divider />

      {/* Usage Guidelines */}
      <div style={{ backgroundColor: '#f6f8fa', padding: 20, borderRadius: 8, marginTop: 32 }}>
        <Title level={4}>Usage Guidelines</Title>
        <Space direction="vertical">
          <Text>• All components are fully interactive - test them by clicking, hovering, etc.</Text>
          <Text>• Copy the code snippets and customize props as needed</Text>
          <Text>• Most components support size variants (default, small) and theming</Text>
          <Text>• List items use real product data - perfect for seeing actual behavior</Text>
          <Text>• Build complex tables and lists by composing these component parts</Text>
          <Text>• Check component source code for full prop definitions and TypeScript interfaces</Text>
        </Space>
      </div>
    </div>
  );
};

export default Components;
