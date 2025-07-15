import React, { useEffect } from 'react';
import { Typography, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import { usePricePointFilters } from '../hooks/usePricePointFilters';
import {
  PageHeader,
  StatusTag,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  CountTag,
  FilterBar
} from '../components';
import { SkuListTable } from '../components';
import PricePointTable from '../components/pricing/PricePointTable';
import { formatEffectiveDateRange, toSentenceCase } from '../utils/formatters';
import { DollarSign } from 'lucide-react';

const { Title } = Typography;

const PriceGroupDetail: React.FC = () => {
  const { productId, priceGroupId } = useParams<{ productId: string; priceGroupId: string }>();
  const { setProductName, setPriceGroupId, setPriceGroupName } = useBreadcrumb();
  const { setMaxWidth } = useLayout();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  
  // Find all SKUs that use this price group
  const skusWithPriceGroup = product?.skus.filter(sku => sku.priceGroup.id === priceGroupId) || [];
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;

  useEffect(() => {
    // Set wider max-width for detail pages to accommodate data tables
    setMaxWidth('1200px');

    return () => {
      setMaxWidth('1024px'); // Reset to default width
    };
  }, [setMaxWidth]);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    if (priceGroupId) {
      setPriceGroupId(priceGroupId);
    }
    if (priceGroup) {
      setPriceGroupName(priceGroup.name);
    }

    return () => {
      setProductName(null);
      setPriceGroupId(null);
      setPriceGroupName(null);
    };
  }, [product, priceGroupId, setProductName, setPriceGroupId, priceGroup, setPriceGroupName]);

  if (!product) {
    return (
      <div>
        <Title level={2}>Product Not Found</Title>
        <p>The requested product could not be found.</p>
      </div>
    );
  }

  if (!priceGroup || skusWithPriceGroup.length === 0) {
    return (
      <div>
        <Title level={2}>Price Group Not Found</Title>
        <p>The requested price group could not be found in this product.</p>
      </div>
    );
  }

  // Group core currencies vs others
  const {
    setSearchQuery: setPricePointSearchQuery,
    currencyFilter, 
    setCurrencyFilter,
    currencyOptions,
    sortOrder, 
    setSortOrder,
    groupBy: pricePointGroupBy, 
    setGroupBy: setPricePointGroupBy,
    filteredPricePoints,
    groupedPricePoints: groupedPricePointsData,
    pricePointCount,
  } = usePricePointFilters(priceGroup.pricePoints);

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setCurrencyFilter(null);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={48}>
      <PageHeader
        icon={<DollarSign />}
        iconSize={24}
        title={priceGroup.name}
        onBack={() => navigate(-1)}
        tagContent={priceGroup.status && <StatusTag status={priceGroup.status} />}
        subtitle={formatEffectiveDateRange(priceGroup.startDate, priceGroup.endDate)}
      />

      {/* Price Group Information */}
      <PageSection title={toSentenceCase("Price Group Details")}>
        <AttributeGroup>
          <AttributeDisplay label="Price Group ID" layout="horizontal">
            <Typography.Text code>{priceGroup.id}</Typography.Text>
          </AttributeDisplay>
          
          {priceGroup.status && (
            <AttributeDisplay label="Status" layout="horizontal">
              <StatusTag status={priceGroup.status} />
            </AttributeDisplay>
          )}
          
          {(priceGroup.startDate || priceGroup.endDate) && (
            <AttributeDisplay label="Effective Period" layout="horizontal">
              {formatEffectiveDateRange(priceGroup.startDate, priceGroup.endDate)}
            </AttributeDisplay>
          )}
        </AttributeGroup>
      </PageSection>

      {/* SKUs Using This Price Group */}
      <PageSection 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{toSentenceCase("SKUs Using This Price Group")}</span>
            <CountTag count={skusWithPriceGroup.length} />
          </div>
        }
      >
        <SkuListTable skus={skusWithPriceGroup} product={product} hidePriceGroupColumn={true} />
      </PageSection>

      {/* Price Points */}
      <PageSection 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{toSentenceCase("Price Points")}</span>
            <CountTag count={pricePointCount} />
            <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
              currencies
            </Typography.Text>
          </div>
        }
      >
        <FilterBar
          search={{
            placeholder: "Search by currency...",
            onChange: setPricePointSearchQuery,
          }}
          filters={[
            {
              placeholder: "All Currencies",
              options: currencyOptions,
              value: currencyFilter,
              onChange: setCurrencyFilter,
            },
          ]}
          onClearAll={clearAllPricePointFilters}
          viewOptions={{
            sortOrder: {
              value: sortOrder,
              setter: setSortOrder,
              options: ['None', 'Amount (High to Low)', 'Amount (Low to High)', 'Alphabetical A-Z'],
            },
            groupBy: {
              value: pricePointGroupBy,
              setter: setPricePointGroupBy,
              options: ['None', 'Core / Long Tail'],
            },
          }}
          displayMode="drawer"
          filterSize="middle"
          searchAndViewSize="large"
        />
        <PricePointTable 
          pricePoints={filteredPricePoints} 
          groupedPricePoints={groupedPricePointsData}
        />
      </PageSection>
    </Space>
  );
};

export default PriceGroupDetail; 