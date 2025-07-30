import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import { usePricePointFilters } from '../hooks/usePricePointFilters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import {
  PageHeader,
  StatusTag,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  FilterBar
} from '../components';
import SalesChannelDisplay from '../components/attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../components/attributes/BillingCycleDisplay';

import PricePointTable from '../components/pricing/PricePointTable';
import { toSentenceCase } from '../utils/formatters';
import { 
  PRICE_POINT_COLUMNS, 
  PRICE_POINT_SORT_OPTIONS,
  DEFAULT_PRICE_POINT_COLUMNS
} from '../utils/tableConfigurations';
import { DollarSign } from 'lucide-react';

const { Title } = Typography;

const PriceGroupDetail: React.FC = () => {
  const { productId, priceGroupId } = useParams<{ productId: string; priceGroupId: string }>();
  const { setProductName, setPriceGroupId, setPriceGroupName } = useBreadcrumb();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  
  // Find all SKUs that use this price group
  const skusWithPriceGroup = product?.skus.filter(sku => sku.priceGroup.id === priceGroupId) || [];
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;

  // Default column visibility configuration for PricePointTable
  const pricePointDefaultVisibility = useMemo(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_POINT_COLUMNS.forEach(col => {
      // Hide currencyType, pricingRule, and quantityRange by default
      // ID column is now visible by default to match PriceGroupTable pattern
      if (col.key === 'currencyType' || col.key === 'pricingRule' || col.key === 'quantityRange') {
        defaultVisibility[col.key] = false;
      } else {
        defaultVisibility[col.key] = true;
      }
    });
    return defaultVisibility;
  }, []);

  // Column visibility state for PricePointTable
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(() => {
    return pricePointDefaultVisibility;
  });

  // Column order state for PricePointTable - use default order from table configurations
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>(
    DEFAULT_PRICE_POINT_COLUMNS
  );



  // Column configuration for PricePointTable - use centralized configuration
  const columnOptions: ColumnConfig[] = PRICE_POINT_COLUMNS;

  // Sort options for PricePointTable - use centralized configuration
  const sortOptions = PRICE_POINT_SORT_OPTIONS;



  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    if (priceGroupId) {
      setPriceGroupId(priceGroupId);
    }
    if (priceGroup) {
      setPriceGroupName(priceGroup.name || null);
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
    currencyFilters,
    setCurrencyFilters,
    currencyOptions,
    sortOrder: pricePointSortOrder,
    setSortOrder: setPricePointSortOrder,
    groupBy: pricePointGroupBy,
    setGroupBy: setPricePointGroupBy,
    filteredPricePoints,
    groupedPricePoints: groupedPricePointsData,
  } = usePricePointFilters(priceGroup?.pricePoints || []);

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setCurrencyFilters([]);
  };

  // Extract unique channels and billing cycles from associated SKUs
  const uniqueChannels = [...new Set(skusWithPriceGroup.map(sku => sku.salesChannel))];
  const uniqueBillingCycles = [...new Set(skusWithPriceGroup.map(sku => sku.billingCycle))];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={48}>
      <PageHeader
        icon={<DollarSign />}
        iconSize={16}
        entityType="Price group"
        title={priceGroup.name || `Price group for ${product.name}`}
        onBack={() => navigate(-1)}
        tagContent={priceGroup.status && <StatusTag status={priceGroup.status} />}
        rightAlignedId={priceGroup.id || ''}
        channels={uniqueChannels}
        billingCycles={uniqueBillingCycles}
        lastUpdatedBy="Luxi Kanazir"
        lastUpdatedAt={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)} // 5 days ago
        compact
      />

      {/* General Section */}
      <PageSection title={toSentenceCase('General')}>
        <AttributeGroup>
          <AttributeDisplay
            layout="horizontal"
            label="Associated product"
          >
            <a onClick={() => navigate(`/product/${productId}`)}>
              {productId}
            </a>
          </AttributeDisplay>
          <AttributeDisplay
            layout="horizontal"
            label="Associated SKUs"
          >
            <Space size={4}>
              {skusWithPriceGroup.map((sku, index) => (
                <React.Fragment key={sku.id}>
                  <a onClick={() => navigate(`/product/${productId}/sku/${sku.id}`)}>
                    {sku.id}
                  </a>
                  {index < skusWithPriceGroup.length - 1 && <span>, </span>}
                </React.Fragment>
              ))}
            </Space>
          </AttributeDisplay>
        </AttributeGroup>
      </PageSection>

      {/* Price Points */}
      <PageSection 
        title={toSentenceCase("Price points")}
      >
        <FilterBar
          filterSize="middle"
          searchAndViewSize="middle"
          search={{
            placeholder: "Search by currency...",
            onChange: setPricePointSearchQuery,
          }}
          filters={[
            {
              placeholder: "All currencies",
              options: currencyOptions,
              multiSelect: true,
              multiValue: currencyFilters,
              onMultiChange: (values: string[]) => setCurrencyFilters(values),
              // Required for TypeScript interface compatibility
              value: null,
              onChange: () => {},
            },
          ]}
          onClearAll={clearAllPricePointFilters}
          viewOptions={{
            sortOrder: {
              value: pricePointSortOrder,
              setter: setPricePointSortOrder,
              options: sortOptions,
            },
            groupBy: {
              value: pricePointGroupBy,
              setter: setPricePointGroupBy,
              options: ['None', 'Category', 'Currency', 'Pricing rule', 'Validity'],
            },
            columnOptions,
            visibleColumns,
            setVisibleColumns,
            columnOrder,
            setColumnOrder,
            defaultVisibleColumns: pricePointDefaultVisibility,
          }}
          displayMode="inline"
        />
        <PricePointTable 
          pricePoints={filteredPricePoints} 
          groupedPricePoints={groupedPricePointsData}
          visibleColumns={visibleColumns}
          columnOrder={columnOrder}
          sortOrder={pricePointSortOrder}
        />
      </PageSection>
    </Space>
  );
};

export default PriceGroupDetail; 