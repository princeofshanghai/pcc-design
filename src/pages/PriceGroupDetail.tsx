import React, { useEffect, useState } from 'react';
import { Typography, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';
import { usePricePointFilters } from '../hooks/usePricePointFilters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import {
  PageHeader,
  StatusTag,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  FilterBar,
  CopyableId
} from '../components';
import { SkuListTable } from '../components';
import PricePointTable from '../components/pricing/PricePointTable';
import { formatValidityRange, toSentenceCase } from '../utils/formatters';
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
  const { setMaxWidth } = useLayout();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  
  // Find all SKUs that use this price group
  const skusWithPriceGroup = product?.skus.filter(sku => sku.priceGroup.id === priceGroupId) || [];
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;

  // Column visibility state for PricePointTable - use centralized defaults
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_POINT_COLUMNS.forEach(col => {
      defaultVisibility[col.key] = true;
    });
    return defaultVisibility;
  });

  // Column order state for PricePointTable - use centralized defaults
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>(
    PRICE_POINT_COLUMNS.map(col => col.key)
  );



  // Column configuration for PricePointTable - use centralized configuration
  const columnOptions: ColumnConfig[] = PRICE_POINT_COLUMNS;

  // Sort options for PricePointTable - use centralized configuration
  const sortOptions = PRICE_POINT_SORT_OPTIONS;

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
    sortOrder: pricePointSortOrder,
    setSortOrder: setPricePointSortOrder,
    groupBy: pricePointGroupBy, 
    setGroupBy: setPricePointGroupBy,
    filteredPricePoints,
    groupedPricePoints: groupedPricePointsData,
  } = usePricePointFilters(priceGroup.pricePoints);

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setCurrencyFilter(null);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={48}>
      <PageHeader
        icon={<DollarSign />}
        iconSize={16}
        entityType="Price group"
        title={priceGroup.name}
        onBack={() => navigate(-1)}
        tagContent={priceGroup.status && <StatusTag status={priceGroup.status} />}
        subtitle={
          <CopyableId id={priceGroup.id || ''} size="small" />
        }
      />

      {/* SKUs Using This Price Group */}
      <PageSection 
        title={toSentenceCase("SKUs using this price group")}
      >
        <SkuListTable skus={skusWithPriceGroup} product={product} hidePriceGroupColumn={true} />
      </PageSection>

      {/* Price Points */}
      <PageSection 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{toSentenceCase("Price points")}</span>
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
              placeholder: "All currencies",
              options: currencyOptions,
              value: currencyFilter,
              onChange: setCurrencyFilter,
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
              options: ['None', 'Core / Long Tail'],
            },
            columnOptions,
            visibleColumns,
            setVisibleColumns,
            columnOrder,
            setColumnOrder,
          }}
          displayMode="drawer"
          filterSize="middle"
          searchAndViewSize="middle"
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