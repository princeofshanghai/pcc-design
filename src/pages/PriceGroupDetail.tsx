import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Space } from 'antd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import { usePricePointFilters } from '../hooks/usePricePointFilters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import {
  PageHeader,
  StatusTag,
  PageSection,
  FilterBar
} from '../components';


import PricePointTable from '../components/pricing/PricePointTable';
import { toSentenceCase, formatValidityRange } from '../utils/formatters';
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
  const location = useLocation();

  // Get the tab we came from (for smart back navigation)
  const searchParams = new URLSearchParams(location.search);
  const fromTab = searchParams.get('from') || 'overview';

  const [product, setProduct] = useState(mockProducts.find(p => p.id === productId));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Load enhanced product data with price groups from JSON files
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      setError(null);
      loadProductWithPricing(productId)
        .then(enhancedProduct => {
          console.log('Enhanced product loaded:', enhancedProduct);
          if (enhancedProduct) {
            setProduct(enhancedProduct);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error('Error loading product with pricing:', err);
          setError(err.message || 'Failed to load product data');
          setIsLoading(false);
        });
    }
  }, [productId]);
  
  // Find all SKUs that use this price group
  const skusWithPriceGroup = product?.skus.filter(sku => sku.priceGroup.id === priceGroupId) || [];
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;

  // IMPORTANT: All hooks must be called before any conditional returns
  // Price point filtering hook - must always be called even if priceGroup is null
  const {
    setSearchQuery: setPricePointSearchQuery,
    currencyFilters,
    setCurrencyFilters,
    statusFilter,
    setStatusFilter,
    currencyOptions,
    statusOptions,
    sortOrder: pricePointSortOrder,
    setSortOrder: setPricePointSortOrder,
    groupBy: pricePointGroupBy,
    setGroupBy: setPricePointGroupBy,
    filteredPricePoints,
    groupedPricePoints: groupedPricePointsData,
  } = usePricePointFilters(priceGroup?.pricePoints || []);

  // Default column visibility configuration for PricePointTable
  const pricePointDefaultVisibility = useMemo(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_POINT_COLUMNS.forEach(col => {
      // Hide currencyType, pricingRule, quantityRange, and priceType by default
      // ID column is now visible by default to match PriceGroupTable pattern
      if (col.key === 'currencyType' || col.key === 'pricingRule' || col.key === 'quantityRange' || col.key === 'priceType') {
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

  if (isLoading) {
    return (
      <div>
        <Title level={2}>Loading...</Title>
        <p>Loading price group data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Title level={2}>Error Loading Data</Title>
        <p>{error}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    );
  }

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
        <p>Available price groups: {product.skus.map(sku => sku.priceGroup.id).join(', ')}</p>
      </div>
    );
  }

  // Helper function for clearing filters

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setCurrencyFilters([]);
    setStatusFilter(null);
  };

  // Extract unique channels and billing cycles from associated SKUs
  const uniqueChannels = [...new Set(skusWithPriceGroup.map(sku => sku.salesChannel))];
  const uniqueBillingCycles = [...new Set(skusWithPriceGroup.map(sku => sku.billingCycle))];
  
  // Format the validity period for display
  const validityText = priceGroup ? formatValidityRange(priceGroup.validFrom, priceGroup.validTo) : null;



  return (
    <Space direction="vertical" style={{ width: '100%' }} size={48}>
      <PageHeader
        icon={<DollarSign />}
        iconSize={16}
        entityType="Price group"
        title={priceGroup.name || `Price group for ${product.name}`}
        onBack={() => {
          // Smart back navigation - return to the tab we came from
          if (fromTab === 'overview') {
            navigate(`/product/${productId}`);
          } else {
            navigate(`/product/${productId}?tab=${fromTab}`);
          }
        }}
        tagContent={priceGroup.status && <StatusTag status={priceGroup.status} />}
        rightAlignedId={priceGroup.id || ''}
        channels={uniqueChannels}
        billingCycles={uniqueBillingCycles}
        validityText={validityText || undefined}
        lastUpdatedBy="Luxi Kanazir"
        lastUpdatedAt={new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)} // 5 days ago
        compact
      />

      {/* Price Points */}
      <PageSection 
        title={toSentenceCase("Price points")}
      >
        <FilterBar
          filterSize="middle"
          searchAndViewSize="middle"
          search={{
            placeholder: "Search by currency or ID...",
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
            {
              placeholder: "All statuses",
              options: statusOptions,
              value: statusFilter,
              onChange: (value) => setStatusFilter(value ?? null),
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
              options: ['None', 'Category', 'Currency', 'Pricing rule', 'Price type', 'Validity'],
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