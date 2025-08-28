import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Space, Button, Modal, Tooltip, Tag, theme } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import { usePricePointFilters } from '../hooks/usePricePointFilters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import {
  PageHeader,
  PriceGroupStatusTag,
  PageSection,
  FilterBar,
  AttributeDisplay,
  AttributeGroup,
  SalesChannelDisplay,
  BillingCycleDisplay,
  BillingModelDisplay
} from '../components';
import { getDefaultColumnVisibility, getAvailableGroupByOptions, getDefaultValidityFilter } from '../utils/channelConfigurations';


import PricePointTable from '../components/pricing/PricePointTable';
import FieldPricingView from '../components/pricing/FieldPricingView';
import { toSentenceCase } from '../utils/formatters';
import { 
  PRICE_POINT_COLUMNS, 
  PRICE_POINT_SORT_OPTIONS,
  DEFAULT_PRICE_POINT_COLUMNS,
  getFilterPlaceholder
} from '../utils/tableConfigurations';
import { Download, Calendar } from 'lucide-react';

const { Title } = Typography;

const PriceGroupDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { productId, priceGroupId } = useParams<{ productId: string; priceGroupId: string }>();
  const { setProductName, setPriceGroupId, setPriceGroupName, setFolderName } = useBreadcrumb();
  const navigate = useNavigate();



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
  
  // Field pricing detection - check if any SKU uses Field sales channel
  const isFieldPricing = skusWithPriceGroup.some(sku => sku.salesChannel === 'Field');
  
  console.log('PriceGroupDetail - productId:', productId, 'priceGroupId:', priceGroupId);
  console.log('Product SKUs:', product?.skus.map(sku => ({ id: sku.id, priceGroupId: sku.priceGroup.id })));
  console.log('Matching SKUs:', skusWithPriceGroup.length);
  console.log('🔍 Field pricing detected:', isFieldPricing, 'for price group:', priceGroupId);
  console.log('📋 Sales channels in price group:', skusWithPriceGroup.map(sku => sku.salesChannel));
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;

  // Extract unique channels early for channel configuration
  const uniqueChannels = [...new Set(skusWithPriceGroup.map(sku => sku.salesChannel))];

  // Debug: Log channel detection for troubleshooting
  console.log('PriceGroupDetail - Detected channels:', uniqueChannels, 'for price group:', priceGroupId);

  // IMPORTANT: All hooks must be called before any conditional returns
  // Price point filtering hook - must always be called even if priceGroup is null
  const {
    setSearchQuery: setPricePointSearchQuery,
    currencyFilters,
    setCurrencyFilters,
    statusFilters,
    setStatusFilters,
    setCategoryFilters,
    validityFilter,
    setValidityFilter,
    currencyOptions,
    statusOptions,
    validityOptions,
    sortOrder: pricePointSortOrder,
    setSortOrder: setPricePointSortOrder,
    groupBy: pricePointGroupBy,
    setGroupBy: setPricePointGroupBy,
    filteredPricePoints,
    groupedPricePoints: groupedPricePointsData,
  } = usePricePointFilters(priceGroup?.pricePoints || [], uniqueChannels);

  // Default column visibility configuration for PricePointTable - use channel configuration
  const pricePointDefaultVisibility = useMemo(() => {
    return getDefaultColumnVisibility(uniqueChannels);
  }, [uniqueChannels]);

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
      // Also set the folder name if available
      if (product.folder) {
        setFolderName(product.folder);
      }
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
      setFolderName(null);
    };
  }, [product, priceGroupId, setProductName, setPriceGroupId, priceGroup, setPriceGroupName, setFolderName]);

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
    setStatusFilters([]);
    setCategoryFilters([]);
    // Validity filter is excluded from clear all - it's a view selector, not a filter
    // It maintains its current selection when other filters are cleared
  };

  // Extract unique billing cycles from associated SKUs 
  const uniqueBillingCycles = [...new Set(skusWithPriceGroup.map(sku => sku.billingCycle))];
  
  // Check if this price group has mobile channels (iOS or GPB)
  const hasMobileChannels = uniqueChannels.some(channel => channel === 'iOS' || channel === 'GPB');
  
  // Check if this price group is exclusively mobile channels (iOS and/or GPB only)
  const isMobileOnlyPriceGroup = uniqueChannels.length > 0 && 
    uniqueChannels.every(channel => channel === 'iOS' || channel === 'GPB');
  
  // Mock app data for mobile channels - based on actual app store listings
  const getAppInfo = (channel: string) => {
    switch (channel) {
      case 'iOS':
        return {
          name: 'LinkedIn: Network & Job Finder', // From App Store
          icon: 'https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg'
        };
      case 'GPB':
        return {
          name: 'LinkedIn: Jobs & Business News', // From Google Play Store  
          icon: 'https://upload.wikimedia.org/wikipedia/commons/8/81/LinkedIn_icon.svg'
        };
      default:
        return null;
    }
  };
  
  // Get app info for mobile channels
  const appInfo = hasMobileChannels ? 
    uniqueChannels
      .filter(channel => channel === 'iOS' || channel === 'GPB')
      .map(channel => ({ channel, ...getAppInfo(channel) }))
      .filter(info => info.name && info.icon) 
    : [];
  
  // Get LIX key and treatment from the first SKU's lix property
  const firstSku = skusWithPriceGroup[0];
  const lixKey = firstSku?.lix?.key;
  const lixTreatment = firstSku?.lix?.treatment;
  
  // Find other price groups with the same LIX key (excluding current one)
  const otherPriceGroupsInExperiment = lixKey ? 
    product?.skus
      .filter(sku => sku.lix?.key === lixKey && sku.priceGroup.id !== priceGroupId)
      .map(sku => sku.priceGroup)
      .filter((priceGroup, index, self) => 
        // Remove duplicates based on price group ID
        index === self.findIndex(pg => pg.id === priceGroup.id)
      ) || []
    : [];
  




  return (
    <Space direction="vertical" style={{ width: '100%' }} size={48}>
      <PageHeader
        entityType="Price group"
        title={priceGroup.name || `Price group for ${product.name}`}
        tagContent={<PriceGroupStatusTag priceGroup={priceGroup} />}
        rightAlignedId={priceGroup.id || ''}
        compact
      />

      {/* Details Section */}
      <PageSection title={toSentenceCase('Details')}>
        <AttributeGroup>
          <AttributeDisplay layout="horizontal" label="Configuration">
            <Space size={4}>
              {product?.billingModel && (
                <BillingModelDisplay model={product.billingModel} variant="small" />
              )}
              {uniqueChannels.map(channel => (
                <SalesChannelDisplay key={channel} channel={channel} variant="small" />
              ))}
              {uniqueBillingCycles.map(cycle => (
                <BillingCycleDisplay key={cycle} billingCycle={cycle} variant="small" />
              ))}
            </Space>
          </AttributeDisplay>
          
          {appInfo.length > 0 && (
            <AttributeDisplay layout="horizontal" label="App">
              <Space size="small">
                {appInfo.map(app => (
                  <Space key={app.channel} size={6} align="center">
                    <img 
                      src={app.icon} 
                      alt={`${app.name} icon`}
                      style={{ 
                        width: 24, 
                        height: 24, 
                        borderRadius: '4px',
                        objectFit: 'cover'
                      }}
                    />
                    <span>{app.name}</span>
                  </Space>
                ))}
              </Space>
            </AttributeDisplay>
          )}
          
          {hasMobileChannels && (
            <AttributeDisplay layout="horizontal" label="External product identifier">
              <Tag 
                style={{ fontSize: '11px', margin: 0, padding: '0 6px', lineHeight: '18px' }}
              >
                ext_prod_id
              </Tag>
            </AttributeDisplay>
          )}

          <AttributeDisplay layout="horizontal" label="Tax">
            <span style={{ 
              fontSize: token.fontSize,
              color: token.colorText
            }}>
              {isMobileOnlyPriceGroup ? 'Tax inclusive' : 'Tax exclusive'}
            </span>
          </AttributeDisplay>

          <AttributeDisplay layout="horizontal" label="Experiment">
            {(lixKey || lixTreatment) ? (
              <Space size="small" align="center">
                {lixKey && (
                  <Tooltip title="LIX Key" mouseEnterDelay={0.5}>
                    <span style={{ 
                      fontSize: token.fontSize,
                      color: token.colorText,
                      cursor: 'default'
                    }}>
                      {lixKey}
                    </span>
                  </Tooltip>
                )}
                {lixKey && lixTreatment && <span>/</span>}
                {lixTreatment && (
                  <Tooltip title="LIX Treatment" mouseEnterDelay={0.5}>
                    <span style={{ 
                      fontSize: token.fontSize,
                      color: token.colorText,
                      cursor: 'default'
                    }}>
                      {lixTreatment}
                    </span>
                  </Tooltip>
                )}
              </Space>
            ) : (
              <span style={{ color: token.colorTextTertiary }}>None</span>
            )}
          </AttributeDisplay>
          {otherPriceGroupsInExperiment.length > 0 && (
            <AttributeDisplay layout="horizontal" label="Other prices in experiment">
              <Space size="small" wrap>
                {otherPriceGroupsInExperiment.map(pg => (
                  <a
                    key={pg.id}
                    href={`/product/${productId}/price-group/${pg.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/product/${productId}/price-group/${pg.id}`);
                    }}
                    style={{
                      color: token.colorPrimary,
                      textDecoration: 'none',
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textDecoration = 'underline';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textDecoration = 'none';
                    }}
                  >
                    {pg.id}
                  </a>
                ))}
              </Space>
            </AttributeDisplay>
          )}
        </AttributeGroup>
      </PageSection>

      {/* Price Points */}
      <PageSection 
        title={toSentenceCase("Price points")}
      >
        {isFieldPricing ? (
          <FieldPricingView 
            pricePoints={priceGroup?.pricePoints || []} 
            visibleColumns={visibleColumns}
            columnOrder={columnOrder}
            sortOrder={pricePointSortOrder}
            isTaxInclusive={isMobileOnlyPriceGroup}
          />
        ) : (
          <>
            <FilterBar
              useCustomFilters={true}
              search={{
                placeholder: "Search by currency or ID...",
                onChange: setPricePointSearchQuery,
              }}
              filters={[
                {
                  placeholder: getFilterPlaceholder('validity'),
                  options: validityOptions,
                  multiSelect: false,
                  value: validityFilter,
                  onChange: (value: string | null) => {
                    if (value) {
                      setValidityFilter(value);
                    } else {
                      // Reset to channel-specific default when cleared
                      const channelDefault = getDefaultValidityFilter(uniqueChannels);
                      if (channelDefault === 'most-recent') {
                        const newestPeriod = validityOptions.find(opt => opt.value !== 'All periods')?.value;
                        setValidityFilter(newestPeriod || 'All periods');
                      } else {
                        setValidityFilter('All periods');
                      }
                    }
                  },
                  disableSearch: true,
                  // View selector behavior - validity is not a filter, it's a view mode
                  excludeFromClearAll: true,
                  hideClearButton: true,
                  preventDeselection: true,
                  // Custom display: show "All" instead of "All periods" on button
                  customDisplayValue: (value) => {
                    return value === 'All periods' ? 'All' : value || 'All';
                  },
                  // Add Calendar icon
                  icon: <Calendar size={12} />,
                  // Required for TypeScript interface compatibility
                  multiValue: [],
                  onMultiChange: () => {},
                },
                {
                  placeholder: getFilterPlaceholder('currency'),
                  options: currencyOptions,
                  multiSelect: true,
                  multiValue: currencyFilters,
                  onMultiChange: (values: string[]) => setCurrencyFilters(values),
                  // Required for TypeScript interface compatibility
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
                  primary: false, // Put Status behind "More filters" button
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
                  options: getAvailableGroupByOptions(uniqueChannels),
                },
                columnOptions,
                visibleColumns,
                setVisibleColumns,
                columnOrder,
                setColumnOrder,
                defaultVisibleColumns: pricePointDefaultVisibility,
                defaultColumnOrder: DEFAULT_PRICE_POINT_COLUMNS,
              }}
              displayMode="inline"
              rightActions={[
                <Button 
                  key="export"
                  icon={<Download size={16} />}
                  size="middle"

                  onClick={() => {
                    Modal.info({
                      title: 'Export Price Points',
                      content: (
                        <div>
                          <p>This would export all price point data for <strong>{priceGroup?.name}</strong> to CSV format.</p>
                          <p style={{ marginTop: 8, fontSize: '13px', color: token.colorTextSecondary }}>
                            Includes: Price point IDs, currencies, amounts, pricing rules, quantity ranges, USD equivalents, and validity periods.
                          </p>
                        </div>
                      ),
                      okText: 'Got it',
                      width: 400,
                    });
                  }}
                >
                  Export
                </Button>
              ]}
            />
            <PricePointTable 
              pricePoints={filteredPricePoints} 
              groupedPricePoints={groupedPricePointsData}
              visibleColumns={visibleColumns}
              columnOrder={columnOrder}
              sortOrder={pricePointSortOrder}
              isTaxInclusive={isMobileOnlyPriceGroup}
            />
          </>
        )}
      </PageSection>
    </Space>
  );
};

export default PriceGroupDetail; 