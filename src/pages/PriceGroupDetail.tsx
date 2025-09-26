import React, { useEffect, useState, useMemo } from 'react';
import { Typography, Space, Button, Modal, Tag, theme, Tabs } from 'antd';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import { usePricePointFilters } from '../hooks/usePricePointFilters';
import type { ColumnConfig, ColumnVisibility, ColumnOrder, SalesChannel, BillingCycle } from '../utils/types';
import {
  PageHeader,
  PriceGroupStatusTag,
  PageSection,
  FilterBar,
  AttributeDisplay,
  AttributeGroup,
  AnalyticsChart,
  ChannelTag,
  BillingCycleTag,
  BillingModelTag
} from '../components';
import ValiditySelector from '../components/shared/ValiditySelector';
import { getDefaultColumnVisibility, getAvailableGroupByOptions } from '../utils/channelConfigurations';


import PricePointTable from '../components/pricing/PricePointTable';
import PivotTable from '../components/pricing/PivotTable';
import { toSentenceCase } from '../utils/formatters';
import { 
  PRICE_POINT_COLUMNS, 
  PRICE_POINT_SORT_OPTIONS,
  DEFAULT_PRICE_POINT_COLUMNS,
  getFilterPlaceholder
} from '../utils/tableConfigurations';
import { Download, Rows2, Table2 } from 'lucide-react';
import PriceEditorModal from '../components/pricing/PriceEditor/PriceEditorModal';

const { Title } = Typography;

const PriceGroupDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { productId, priceGroupId } = useParams<{ productId: string; priceGroupId: string }>();
  const { setProductName, setPriceGroupId, setPriceGroupName, setFolderName } = useBreadcrumb();
  const navigate = useNavigate();
  const location = useLocation();

  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'pricing';

  const [product, setProduct] = useState(mockProducts.find(p => p.id === productId));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  
  // View mode toggle state - only for Field products
  const [viewMode, setViewMode] = useState(() => {
    // Load from localStorage on initial mount
    const saved = localStorage.getItem('pricePointViewMode');
    return (saved === 'list' || saved === 'pivot') ? saved : 'pivot';
  });


  // Wrapper function that also saves to localStorage
  const handleViewModeChange = (newMode: string) => {
    setViewMode(newMode);
    localStorage.setItem('pricePointViewMode', newMode);
  };
  
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
  const skusWithPriceGroup = product?.skus.filter(sku => String(sku.priceGroup.id) === String(priceGroupId)) || [];
  
  console.log('PriceGroupDetail - productId:', productId, 'priceGroupId:', priceGroupId);
  console.log('Product SKUs:', product?.skus.map(sku => ({ id: sku.id, priceGroupId: sku.priceGroup.id, priceGroupIdType: typeof sku.priceGroup.id })));
  console.log('Matching SKUs:', skusWithPriceGroup.length);
  console.log('📋 Sales channels in price group:', skusWithPriceGroup.map(sku => sku.salesChannel));
  
  // Additional debugging for price group 117005
  if (String(priceGroupId) === '117005') {
    console.log('🔍 DEBUG 117005 - URL priceGroupId type:', typeof priceGroupId, 'value:', priceGroupId);
    console.log('🔍 DEBUG 117005 - Available price group IDs:', product?.skus.map(sku => ({ id: sku.priceGroup.id, type: typeof sku.priceGroup.id })));
    console.log('🔍 DEBUG 117005 - Price group data from first matching SKU:', skusWithPriceGroup[0]?.priceGroup);
  }
  
  // Get the price group data from the first SKU (all SKUs with same price group have same price data)
  const priceGroup = skusWithPriceGroup[0]?.priceGroup;

  // Extract unique channels early for channel configuration
  const uniqueChannels = [...new Set(skusWithPriceGroup.map(sku => sku.salesChannel))];

  // Debug: Log channel detection for troubleshooting
  console.log('PriceGroupDetail - Detected channels:', uniqueChannels, 'for price group:', priceGroupId);

  // Set channel-specific default view mode when product loads (only if no localStorage preference exists)
  useEffect(() => {
    // Only set default if no saved preference exists and we have channel information
    const saved = localStorage.getItem('pricePointViewMode');
    if (!saved && uniqueChannels.length > 0) {
      const isFieldPriceGroup = uniqueChannels.includes('Field');
      const channelDefault = isFieldPriceGroup ? 'pivot' : 'list';
      setViewMode(channelDefault);
    }
  }, [uniqueChannels]);

  // IMPORTANT: All hooks must be called before any conditional returns
  // Price point filtering hook - must always be called even if priceGroup is null
  const {
    setSearchQuery: setPricePointSearchQuery,
    currencyFilters,
    setCurrencyFilters,
    statusFilters,
    setStatusFilters,
    setCategoryFilters,
    seatFilters,
    setSeatFilters,
    tierFilters,
    setTierFilters,
    validityMode,
    setValidityMode,
    customValidityDate,
    setCustomValidityDate,
    selectedValidityDate,
    currencyOptions,
    statusOptions,
    seatOptions,
    tierOptions,
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

  // Update column visibility when channel configuration changes
  useEffect(() => {
    setVisibleColumns(pricePointDefaultVisibility);
  }, [pricePointDefaultVisibility]);

  // Column order state for PricePointTable - use default order from table configurations
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>(
    DEFAULT_PRICE_POINT_COLUMNS
  );

  // USD equivalent toggle state for PricePointTable
  const [showUsdEquivalent, setShowUsdEquivalent] = useState<boolean>(false);



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

  // Handle edit price points button click
  const handleEditPricePoints = () => {
    console.log('Edit price points clicked');
    setEditModalOpen(true);
  };


  // Helper function for clearing filters

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setCurrencyFilters([]);
    setStatusFilters([]);
    setCategoryFilters([]);
    setSeatFilters([]);
    setTierFilters([]);
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
  




  // Helper function to sort billing cycles in consistent order
  const sortBillingCycles = (cycles: BillingCycle[]): BillingCycle[] => {
    const order: BillingCycle[] = ['Monthly', 'Quarterly', 'Annual'];
    return cycles.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  // Group billing cycles by channel from SKU data  
  const channelBillingGroups = skusWithPriceGroup.reduce((groups, sku) => {
    const channel = sku.salesChannel;
    const billingCycle = sku.billingCycle;
    
    if (!groups[channel]) {
      groups[channel] = [];
    }
    
    // Add billing cycle if not already present for this channel
    if (!groups[channel].includes(billingCycle)) {
      groups[channel].push(billingCycle);
    }
    
    return groups;
  }, {} as Record<SalesChannel, BillingCycle[]>);

  // Sort billing cycles for each channel
  Object.keys(channelBillingGroups).forEach(channel => {
    channelBillingGroups[channel as SalesChannel] = sortBillingCycles(channelBillingGroups[channel as SalesChannel]);
  });

  const tabItems = [
    // Price Points tab (first tab)
    {
      key: 'pricing',
      label: 'Price points',
      children: (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <FilterBar
              useCustomFilters={true}
              search={{
                placeholder: "Search by currency or ID...",
                onChange: setPricePointSearchQuery,
              }}
              filters={[
                {
                  placeholder: getFilterPlaceholder('validity'),
                  customComponent: (
                    <ValiditySelector
                      validityMode={validityMode}
                      onValidityModeChange={setValidityMode}
                      customValidityDate={customValidityDate}
                      onCustomValidityDateChange={setCustomValidityDate}
                    />
                  ),
                  // Required for TypeScript interface compatibility but not used with customComponent
                  options: [],
                  multiSelect: false,
                  value: null,
                  onChange: () => {},
                  multiValue: [],
                  onMultiChange: () => {},
                  excludeFromClearAll: true, // Don't clear the validity selector when "Clear All" is clicked
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
                // Only show seat and tier filters for Field price groups
                ...(uniqueChannels.includes('Field') ? [
                  {
                    placeholder: getFilterPlaceholder('quantityRange'),
                    options: seatOptions,
                    multiSelect: true,
                    multiValue: seatFilters,
                    onMultiChange: (values: string[]) => setSeatFilters(values),
                    disableSearch: true,
                    // Required for TypeScript interface compatibility
                    value: null,
                    onChange: () => {},
                  },
                  {
                    placeholder: getFilterPlaceholder('pricingTier'),
                    options: tierOptions,
                    multiSelect: true,
                    multiValue: tierFilters,
                    onMultiChange: (values: string[]) => setTierFilters(values),
                    // Tier filter is now searchable
                    // Required for TypeScript interface compatibility
                    value: null,
                    onChange: () => {},
                  },
                ] : []),
                // Show status filter for: non-Field products (always) OR Field products in list view (not pivot view)
                ...(!uniqueChannels.includes('Field') || viewMode === 'list' ? [{
                  placeholder: getFilterPlaceholder('status'),
                  options: statusOptions,
                  multiSelect: true,
                  multiValue: statusFilters,
                  onMultiChange: (values: string[]) => setStatusFilters(values),
                  disableSearch: true,
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                }] : []),
              ]}
              onClearAll={clearAllPricePointFilters}
              viewOptions={{
                // Only show view mode toggle for Field products
                ...(uniqueChannels.includes('Field') ? {
                  viewMode: {
                    value: viewMode,
                    setter: handleViewModeChange,
                    options: [
                      { key: 'pivot', label: 'View by matrix', icon: <Table2 size={20} /> },
                      { key: 'list', label: 'View by list', icon: <Rows2 size={20} /> }
                    ],
                    storageKey: 'pricePointViewMode'
                  }
                } : {}),
                // Show sort/group/column options for: non-Field products (always) OR Field products in list view (not pivot view)
                ...(!uniqueChannels.includes('Field') || viewMode === 'list' ? {
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
                } : {}),
                // USD equivalent toggle - always show regardless of product type or view mode  
                showUsdEquivalent: showUsdEquivalent,
                setShowUsdEquivalent: setShowUsdEquivalent,
              }}

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
            {viewMode === 'pivot' && uniqueChannels.includes('Field') ? (
              <PivotTable 
                pricePoints={filteredPricePoints}
                selectedValidityDate={selectedValidityDate}
                showUsdEquivalent={showUsdEquivalent}
              />
            ) : (
              <PricePointTable 
                pricePoints={filteredPricePoints} 
                groupedPricePoints={groupedPricePointsData}
                visibleColumns={visibleColumns}
                columnOrder={columnOrder}
                sortOrder={pricePointSortOrder}
                isTaxInclusive={isMobileOnlyPriceGroup}
                showUsdEquivalent={showUsdEquivalent}
              />
            )}
        </Space>
      ),
    },
    // Analytics tab (Field products only)
    ...(uniqueChannels.includes('Field') ? [{
      key: 'analytics',
      label: 'Analytics',
      children: (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <AnalyticsChart 
            pricePoints={filteredPricePoints}
            validityOptions={[]}
          />
        </Space>
      ),
    }] : []),
    // Details tab
    {
      key: 'details',
      label: 'Details',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection title={toSentenceCase('General')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Configuration">
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  <BillingModelTag billingModel={product?.billingModel} variant="small" showIcon={false} />
                  {uniqueChannels.map((channel) => (
                    <ChannelTag key={channel} channel={channel} variant="small" showIcon={false} />
                  ))}
                  {uniqueBillingCycles.map((cycle) => (
                    <BillingCycleTag key={cycle} billingCycle={cycle} variant="small" showIcon={false} />
                  ))}
                </div>
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

              <AttributeDisplay layout="horizontal" label="LIX experiment">
                {(lixKey || lixTreatment) ? (
                  <span style={{ 
                    fontSize: token.fontSize,
                    color: token.colorText
                  }}>
                    {lixKey} ({lixTreatment})
                  </span>
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
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="Price group"
        title={`Price group for ${product.name}`}
        tagContent={
          <Space size={8} wrap>
            <PriceGroupStatusTag priceGroup={priceGroup} variant="small" showIcon={false} />
            {uniqueChannels.map((channel) => (
              <ChannelTag key={channel} channel={channel} variant="small" showIcon={false} />
            ))}
            {uniqueBillingCycles.map((cycle) => (
              <BillingCycleTag key={cycle} billingCycle={cycle} variant="small" showIcon={false} />
            ))}
          </Space>
        }
        rightAlignedId={priceGroup.id || ''}
        lixKey={lixKey || "None"}
        lixTreatment={lixTreatment}
        actions={
          <Button
            type="primary"
            onClick={handleEditPricePoints}
            size="middle"
          >
            Edit price points
          </Button>
        }
        compact
      />

      <Tabs
        activeKey={currentTab}
        items={tabItems}
        size="middle"
        onChange={(key) => {
          // Update URL when tab changes
          const newSearchParams = new URLSearchParams(location.search);
          if (key === 'pricing') {
            // Remove tab parameter for pricing (default)
            newSearchParams.delete('tab');
          } else {
            newSearchParams.set('tab', key);
          }
          const newSearch = newSearchParams.toString();
          navigate(`/product/${productId}/price-group/${priceGroupId}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
        }}
      />

      {/* Edit Prices Modal - Unified Component */}
      <PriceEditorModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
        }}
        productName={product.name}
        productId={product.id}
        product={product}
        directEditMode={true} // Always edit mode in PriceGroupDetail
        prefilledContext={{
          channel: uniqueChannels[0], // Use first channel
          billingCycle: uniqueBillingCycles[0], // Use first billing cycle
          priceGroupAction: 'update',
          existingPriceGroup: priceGroup,
          lixKey: lixKey || undefined,
          lixTreatment: lixTreatment || undefined,
        }}
      />
    </Space>
  );
};

export default PriceGroupDetail; 