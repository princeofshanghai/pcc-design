import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Typography, Space, Table, Button, Tabs, Alert, Modal, Dropdown, theme, Switch, Tag } from 'antd';
import type { MenuProps } from 'antd';
// Importing only the needed icons from lucide-react, and making sure there are no duplicate imports elsewhere in the file.
// Note: Only import each icon once from lucide-react, and do not import icons from other libraries or use inline SVGs.
import { Download, Box, Pencil, Check, X } from 'lucide-react';
import { mockProducts } from '../utils/mock-data';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import PriceGroupTable from '../components/pricing/PriceGroupTable';
import { useSkuFilters } from '../hooks/useSkuFilters';
import { usePriceGroupFilters } from '../hooks/usePriceGroupFilters';
import type { SalesChannel, Status, ColumnConfig, ColumnVisibility, ColumnOrder, BillingCycle, PricePoint } from '../utils/types';
import { useBreadcrumb } from '../context/BreadcrumbContext';

import {
  PageHeader,
  SkuListTable,
  GroupedSkuListTable,
  AttributeDisplay,
  PageSection,
  AttributeGroup,
  StatusTag,
  BillingModelDisplay,
  SalesChannelDisplay,
  BillingCycleDisplay,
  FilterBar,
  CopyableId,
  PricePointStatusTag,
} from '../components';
import { toSentenceCase } from '../utils/formatters';
import { 
  PRICE_GROUP_COLUMNS, 
  PRICE_GROUP_SORT_OPTIONS, 
  SKU_SORT_OPTIONS,
  SKU_GROUP_BY_OPTIONS,
  PRICE_GROUP_GROUP_BY_OPTIONS} from '../utils/tableConfigurations';


const { Title } = Typography;

// Complete lists of all possible values
const ALL_SALES_CHANNELS: SalesChannel[] = ['Desktop', 'iOS', 'GPB', 'Field'];
const ALL_BILLING_CYCLES: BillingCycle[] = ['Monthly', 'Quarterly', 'Annual'];


const renderValue = (value: any, isBoolean = false, themeToken?: any) => {
  if (isBoolean) {
    return (
      <Space size="small" align="center">
        {value ? (
          <>
            <Check size={14} style={{ color: themeToken?.colorSuccess || '#22c55e' }} />
            <span>Yes</span>
          </>
        ) : (
          <>
            <X size={14} style={{ color: themeToken?.colorError || '#ef4444' }} />
            <span>No</span>
          </>
        )}
      </Space>
    );
  }
  if (Array.isArray(value)) {
    return (
      <Space direction="vertical" size={0}>
        {value.map(item => <span key={item}>- {item}</span>)}
      </Space>
    );
  }
  return value;
};




const ProductDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { productId } = useParams<{ productId: string }>();
  const { setProductName } = useBreadcrumb();
  const location = useLocation();
  const [product, setProduct] = useState(mockProducts.find(p => p.id === productId));
  const navigate = useNavigate();

  // Load enhanced product data with price groups from JSON files
  useEffect(() => {
    if (productId) {
      loadProductWithPricing(productId).then(enhancedProduct => {
        if (enhancedProduct) {
          setProduct(enhancedProduct);
        }
      });
    }
  }, [productId]);

  // Get URL parameters
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';
  const priceGroupFilter = searchParams.get('priceGroupFilter');
  

  
  // Alert dismissal state
  const [skuAlertDismissed, setSkuAlertDismissed] = useState(false);
  const [featuresAlertDismissed, setFeaturesAlertDismissed] = useState(false);

  // Price view toggle state
  const [showPricePointView, setShowPricePointView] = useState(false);

  // SKU filtering hook
  const {
    setSearchQuery,
    channelFilters, setChannelFilters, channelOptions,
    statusFilter, setStatusFilter, statusOptions,
    billingCycleFilter, setBillingCycleFilter, billingCycleOptions,
    lixKeyFilter, setLixKeyFilter, lixKeyOptions,

    sortOrder, setSortOrder,
    groupBy, setGroupBy,
    sortedSkus,
    groupedSkus,
  } = useSkuFilters(product?.skus || [], product);

  // Price Group filtering hook
  const {
    setSearchQuery: setPriceGroupSearchQuery,
        channelFilters: priceGroupChannelFilters,
    setChannelFilters: setPriceGroupChannelFilters,
    billingCycleFilter: priceGroupBillingCycleFilter, 
    setBillingCycleFilter: setPriceGroupBillingCycleFilter,
    experimentFilter: priceGroupExperimentFilter,
    setExperimentFilter: setPriceGroupExperimentFilter,
    statusFilters: priceGroupStatusFilters,
    setStatusFilters: setPriceGroupStatusFilters,
    groupBy: priceGroupGroupBy, 
    setGroupBy: setPriceGroupGroupBy,
    sortOrder: priceGroupSortOrder, 
    setSortOrder: setPriceGroupSortOrder,
    filteredPriceGroups,
    groupedPriceGroups,
    channelOptions: priceGroupChannelOptions,
    billingCycleOptions: priceGroupBillingCycleOptions,
    experimentOptions: priceGroupExperimentOptions,
    statusOptions: priceGroupStatusOptions,
  } = usePriceGroupFilters(product?.skus || []);

  // Default column visibility configuration for PriceGroupTable
  const priceGroupDefaultVisibility = useMemo(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_GROUP_COLUMNS.forEach(col => {
      // Hide Name column by default
      if (col.key === 'name') {
        defaultVisibility[col.key] = false;
      } else {
        defaultVisibility[col.key] = true;
      }
    });
    return defaultVisibility;
  }, []);

  // Column visibility state for PriceGroupTable
  const [priceGroupVisibleColumns, setPriceGroupVisibleColumns] = useState<ColumnVisibility>(() => {
    return priceGroupDefaultVisibility;
  });

  // Column order state for PriceGroupTable
  const [priceGroupColumnOrder, setPriceGroupColumnOrder] = useState<ColumnOrder>(
    PRICE_GROUP_COLUMNS.map(col => col.key)
  );

  // Column configuration for PriceGroupTable - use centralized configuration
  const priceGroupColumnOptions: ColumnConfig[] = PRICE_GROUP_COLUMNS;

  const clearAllPriceGroupFilters = () => {
    setPriceGroupSearchQuery('');
    setPriceGroupChannelFilters([]);
    setPriceGroupBillingCycleFilter(null);
    setPriceGroupExperimentFilter(null);
    setPriceGroupStatusFilters([]);
  };

  // Price point view filtering state
  const [pricePointSearchQuery, setPricePointSearchQuery] = useState('');
  const [pricePointCurrencyFilter, setPricePointCurrencyFilter] = useState<string | null>(null);
  const [pricePointStatusFilter, setPricePointStatusFilter] = useState<string | null>(null);
  const [pricePointChannelFilters, setPricePointChannelFilters] = useState<SalesChannel[]>([]);
  const [pricePointBillingCycleFilter, setPricePointBillingCycleFilter] = useState<string | null>(null);

  // Flatten price points with inferred SKU attributes for price point view
  const allFlattenedPricePoints = useMemo(() => {
    if (!showPricePointView) return [];
    
    return filteredPriceGroups.flatMap(({ priceGroup, skus }) => 
      priceGroup.pricePoints.map((pricePoint: PricePoint) => ({
        priceGroupId: priceGroup.id,
        priceGroupName: priceGroup.name,
        pricePoint,
        // Infer unique values from associated SKUs
        channels: [...new Set(skus.map(sku => sku.salesChannel))],
        billingCycles: [...new Set(skus.map(sku => sku.billingCycle))],
        // Get first LIX data found, or null if none
        lix: skus.find(sku => sku.lix)?.lix || null,
      }))
    );
  }, [showPricePointView, filteredPriceGroups]);

  // Filter the flattened price points based on price point view filters
  const filteredFlattenedPricePoints = useMemo(() => {
    if (!showPricePointView) return [];
    
    return allFlattenedPricePoints.filter(item => {
      // Search filter (currency or price point ID)
      if (pricePointSearchQuery) {
        const searchLower = pricePointSearchQuery.toLowerCase();
        const matchesSearch = 
          item.pricePoint.currencyCode?.toLowerCase().includes(searchLower) ||
          item.pricePoint.id?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Currency filter
      if (pricePointCurrencyFilter && item.pricePoint.currencyCode !== pricePointCurrencyFilter) {
        return false;
      }

      // Status filter
      if (pricePointStatusFilter && item.pricePoint.status !== pricePointStatusFilter) {
        return false;
      }

      // Channel filter (check if any of the item's channels match selected filters)
      if (pricePointChannelFilters.length > 0) {
        const hasMatchingChannel = pricePointChannelFilters.some(filter => 
          item.channels.includes(filter)
        );
        if (!hasMatchingChannel) return false;
      }

      // Billing cycle filter (check if any of the item's billing cycles match)
      if (pricePointBillingCycleFilter) {
        if (!item.billingCycles.includes(pricePointBillingCycleFilter as BillingCycle)) {
          return false;
        }
      }

      return true;
    });
  }, [
    showPricePointView,
    allFlattenedPricePoints,
    pricePointSearchQuery,
    pricePointCurrencyFilter,
    pricePointStatusFilter,
    pricePointChannelFilters,
    pricePointBillingCycleFilter,
  ]);

  // Generate filter options for price point view
  const pricePointFilterOptions = useMemo(() => {
    if (!showPricePointView || allFlattenedPricePoints.length === 0) {
      return {
        currencyOptions: [],
        statusOptions: [],
        channelOptions: [],
        billingCycleOptions: [],
      };
    }

    // Extract unique values from all flattened price points
    const currencies = [...new Set(allFlattenedPricePoints.map(item => item.pricePoint.currencyCode))];
    const statuses = [...new Set(allFlattenedPricePoints.map(item => item.pricePoint.status))];
    const channels = [...new Set(allFlattenedPricePoints.flatMap(item => item.channels))];
    const billingCycles = [...new Set(allFlattenedPricePoints.flatMap(item => item.billingCycles))];

    return {
      currencyOptions: currencies.sort().map(currency => ({ label: currency, value: currency })),
      statusOptions: statuses.sort().map(status => ({ label: status, value: status })),
      channelOptions: channels.sort().map(channel => ({ label: channel, value: channel })),
      billingCycleOptions: billingCycles.sort().map(cycle => ({ label: cycle, value: cycle })),
    };
  }, [showPricePointView, allFlattenedPricePoints]);

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setPricePointCurrencyFilter(null);
    setPricePointStatusFilter(null);
    setPricePointChannelFilters([]);
    setPricePointBillingCycleFilter(null);
  };

  // Price point view sorting and grouping options
  const PRICE_POINT_SORT_OPTIONS = [
    'None',
    'Currency (A-Z)',
    'Currency (Z-A)', 
    'Amount (Low to high)',
    'Amount (High to low)',
    'Status (A-Z)',
    'Status (Z-A)',
    'Validity (Earliest to latest)',
    'Validity (Latest to earliest)',
  ];

  // TODO: Group by options for future implementation
  // const PRICE_POINT_GROUP_BY_OPTIONS = [
  //   'None',
  //   'Currency',
  //   'Status', 
  //   'Channel',
  //   'Billing Cycle',
  //   'Price Group',
  // ];

  // Price point view state
  const [pricePointSortOrder, setPricePointSortOrder] = useState('None');
  // const [pricePointGroupBy, setPricePointGroupBy] = useState('None');

  // Sort price points based on selected sort order
  const sortedFlattenedPricePoints = useMemo(() => {
    if (!showPricePointView || pricePointSortOrder === 'None') {
      return filteredFlattenedPricePoints;
    }

    const sorted = [...filteredFlattenedPricePoints];

    switch (pricePointSortOrder) {
      case 'Currency (A-Z)':
        return sorted.sort((a, b) => a.pricePoint.currencyCode.localeCompare(b.pricePoint.currencyCode));
      case 'Currency (Z-A)':
        return sorted.sort((a, b) => b.pricePoint.currencyCode.localeCompare(a.pricePoint.currencyCode));
      case 'Amount (Low to high)':
        return sorted.sort((a, b) => a.pricePoint.amount - b.pricePoint.amount);
      case 'Amount (High to low)':
        return sorted.sort((a, b) => b.pricePoint.amount - a.pricePoint.amount);
      case 'Status (A-Z)':
        return sorted.sort((a, b) => (a.pricePoint.status || '').localeCompare(b.pricePoint.status || ''));
      case 'Status (Z-A)':
        return sorted.sort((a, b) => (b.pricePoint.status || '').localeCompare(a.pricePoint.status || ''));
      case 'Validity (Earliest to latest)':
        return sorted.sort((a, b) => {
          const aDate = new Date(a.pricePoint.validFrom || '').getTime();
          const bDate = new Date(b.pricePoint.validFrom || '').getTime();
          return aDate - bDate;
        });
      case 'Validity (Latest to earliest)':
        return sorted.sort((a, b) => {
          const aDate = new Date(a.pricePoint.validFrom || '').getTime();
          const bDate = new Date(b.pricePoint.validFrom || '').getTime();
          return bDate - aDate;
        });
      default:
        return sorted;
    }
  }, [showPricePointView, filteredFlattenedPricePoints, pricePointSortOrder]);

  // TODO: Group price points based on selected group by option
  // Implementation ready for when grouping UI is enabled

  // TODO: Implement grouping display like other tables
  // const finalPricePointData = groupedFlattenedPricePoints || sortedFlattenedPricePoints;

  const clearAllSkuFilters = () => {
    setChannelFilters([]);
    setStatusFilter(null);
    setBillingCycleFilter(null);
    setLixKeyFilter(null);

  };

  // Apply price group filtering if specified in URL
  const finalSortedSkus = priceGroupFilter ? 
    sortedSkus.filter(sku => sku.priceGroup.id === priceGroupFilter) : 
    sortedSkus;

  const finalGroupedSkus = priceGroupFilter ? 
    (groupedSkus ? Object.entries(groupedSkus).reduce((acc, [key, skus]) => {
      const filtered = skus.filter(sku => sku.priceGroup.id === priceGroupFilter);
      if (filtered.length > 0) {
        acc[key] = filtered;
      }
      return acc;
    }, {} as Record<string, any[]>) : null) : 
    groupedSkus;



  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    // Clear the product name when the component unmounts
    return () => {
      setProductName(null);
    };
  }, [product, setProductName]);

  if (!product) {
    return <Title level={2}>Product not found</Title>;
  }

  // Modal handlers for editing name and description
  const handleEditName = () => {
    Modal.info({
      title: 'Edit Product Name',
      content: (
        <div>
          <p>Here you can edit the public name for <strong>{product?.name}</strong>.</p>
          <p style={{ marginTop: 8, fontSize: '13px', color: token.colorTextSecondary }}>
            After making changes, you can save and push to a GTM motion for review and deployment.
          </p>
        </div>
      ),
      okText: 'Got it',
      width: 400,
    });
  };

  const handleEditDescription = () => {
    Modal.info({
      title: 'Edit Product Description',
      content: (
        <div>
          <p>Here you can edit the public description for <strong>{product?.name}</strong>.</p>
          <p style={{ marginTop: 8, fontSize: '13px', color: token.colorTextSecondary }}>
            After making changes, you can save and push to a GTM motion for review and deployment.
          </p>
        </div>
      ),
      okText: 'Got it',
      width: 400,
    });
  };

  // Dropdown menu items
  const editMenuItems: MenuProps['items'] = [
    {
      key: 'edit-name',
      label: 'Edit public name',
      onClick: handleEditName,
    },
    {
      key: 'edit-description', 
      label: 'Edit public description',
      onClick: handleEditDescription,
    },
  ];



  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection 
            title={toSentenceCase('General')}
            actions={
              <Dropdown menu={{ items: editMenuItems }} trigger={['click']}>
                <Button 
                  icon={<Pencil size={14} />}
                  size="middle"
                >
                  Edit...
                </Button>
              </Dropdown>
            }
          >
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Public name" tooltip="Appears to customers and internal LinkedIn employees in invoices, admin center, help center, chooser, checkout, solution builder, and order forms.">{product.name}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Public description" tooltip="Appears to customers and internal LinkedIn employees in invoices, admin center, help center, chooser, checkout, solution builder, and order forms.">{product.description}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Billing Model">
                <BillingModelDisplay model={product.billingModel} variant="small" />
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Is Bundle?">{renderValue(product.isBundle, true, token)}</AttributeDisplay>
              {product.code && (
                <AttributeDisplay layout="horizontal" label="Code">{product.code}</AttributeDisplay>
              )}
              {product.family && (
                <AttributeDisplay layout="horizontal" label="Family">{product.family}</AttributeDisplay>
              )}
            </AttributeGroup>
          </PageSection>

          <PageSection 
            title={toSentenceCase('Configurations')}
            subtitle="Shows the channels this product is currently being sold through and their corresponding billing cycles"
          >
            <Table
                dataSource={ALL_SALES_CHANNELS.map(channel => ({
                  key: channel,
                  channel,
                }))}
                columns={[
                  {
                    title: 'Channel',
                    dataIndex: 'channel',
                    key: 'channel',
                    width: 120,
                    render: (channel: SalesChannel) => {
                      const channelIsSupported = product.skus.some(sku => sku.salesChannel === channel);
                      return (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <SalesChannelDisplay channel={channel} variant="small" muted={!channelIsSupported} />
                        </div>
                      );
                    },
                  },
                  {
                    title: 'Billing Cycles',
                    key: 'cycles',
                    render: (_, record) => {
                      const channelIsSupported = product.skus.some(sku => sku.salesChannel === record.channel);
                      
                      if (!channelIsSupported) {
                        return (
                          <span style={{ color: token.colorTextTertiary, fontSize: token.fontSize }}>
                            This product is not currently sold through this channel
                          </span>
                        );
                      }

                      return (
                        <Space size={4}>
                          {ALL_BILLING_CYCLES.map(cycle => {
                            const hasConfiguration = product.skus.some(sku => 
                              sku.salesChannel === record.channel && sku.billingCycle === cycle
                            );
                            return (
                              <BillingCycleDisplay 
                                key={cycle}
                                billingCycle={cycle} 
                                variant="small"
                                muted={!hasConfiguration}
                              />
                            );
                          })}
                        </Space>
                      );
                    },
                  },
                ]}
                pagination={false}
                size="small"
                showHeader={false}
                style={{ border: 'none', marginTop: '-16px' }}
              />
          </PageSection>
        </Space>
      ),
    },
    // SKUs tab (moved to be second)
    {
      key: 'skus',
      label: (
        <span>
          SKUs <Tag color="orange" style={{ fontSize: '10px', padding: '0 4px', height: '16px', lineHeight: '16px', marginLeft: '4px' }}>WIP</Tag>
        </span>
      ),
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {!skuAlertDismissed && (
            <Alert
              message="Note from Charles - WIP exploration only, don't build"
              type="warning"
              showIcon
              closable
              onClose={() => setSkuAlertDismissed(true)}
            />
          )}
          <PageSection
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{toSentenceCase('SKUs')}</span>
                {priceGroupFilter && (
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    (filtered by price: {priceGroupFilter})
                  </Typography.Text>
                )}
              </div>
            }
        >
          <FilterBar
            filterSize="small"
            searchAndViewSize="middle"
            search={{
              placeholder: "Search by SKU ID or Name...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllSkuFilters}
            filters={[
              {
                placeholder: "All channels",
                options: channelOptions,
                value: channelFilters.length === 1 ? channelFilters[0] : null,
                onChange: (value) => {
                  if (value) {
                    setChannelFilters([value as SalesChannel]);
                  } else {
                    setChannelFilters([]);
                  }
                },
                multiSelect: true,
                multiValue: channelFilters,
                onMultiChange: (values: string[]) => setChannelFilters(values as SalesChannel[]),
              },
              {
                placeholder: "All cycles",
                options: billingCycleOptions,
                value: billingCycleFilter,
                onChange: (value) => setBillingCycleFilter(value as string ?? null),
              },
              {
                placeholder: "All LIX keys",
                options: lixKeyOptions,
                value: lixKeyFilter,
                onChange: (value) => setLixKeyFilter(value as string ?? null),
              },

              {
                placeholder: "All statuses",
                options: statusOptions,
                value: statusFilter,
                onChange: (value) => setStatusFilter(value as Status ?? null),
              },
            ]}
            viewOptions={{
              sortOrder: {
                value: sortOrder,
                setter: setSortOrder,
                options: SKU_SORT_OPTIONS,
              },
              groupBy: {
                value: groupBy,
                setter: setGroupBy,
                options: SKU_GROUP_BY_OPTIONS,
              },
            }}
            displayMode="inline"
          />
          {finalGroupedSkus ? (
            <GroupedSkuListTable groupedSkus={finalGroupedSkus} product={product} currentTab={currentTab} />
          ) : (
            <SkuListTable skus={finalSortedSkus} product={product} currentTab={currentTab} />
          )}
          </PageSection>
        </Space>
      ),
    },
    // New Prices tab
    {
      key: 'pricing',
      label: 'Prices',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection 
            title="Prices"
            actions={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography.Text 
                  style={{ 
                    fontSize: '13px', 
                    color: token.colorTextSecondary,
                    fontWeight: 400 
                  }}
                >
                  Show all price points
                </Typography.Text>
                <Switch
                  size="small"
                  checked={showPricePointView}
                  onChange={setShowPricePointView}
                />
              </div>
            }
          >
            <FilterBar
              filterSize="small"
              searchAndViewSize="middle"
              search={{
                placeholder: showPricePointView 
                  ? "Search by Currency or Price Point ID..." 
                  : "Search by Price Group ID...",
                onChange: showPricePointView 
                  ? setPricePointSearchQuery 
                  : setPriceGroupSearchQuery,
              }}
              filters={showPricePointView ? [
                {
                  placeholder: "All currencies",
                  options: pricePointFilterOptions.currencyOptions,
                  value: pricePointCurrencyFilter,
                  onChange: setPricePointCurrencyFilter,
                },
                {
                  placeholder: "All statuses", 
                  options: pricePointFilterOptions.statusOptions,
                  value: pricePointStatusFilter,
                  onChange: setPricePointStatusFilter,
                },
                {
                  placeholder: "All channels",
                  options: pricePointFilterOptions.channelOptions,
                  multiSelect: true,
                  multiValue: pricePointChannelFilters,
                  onMultiChange: (values: string[]) => setPricePointChannelFilters(values as SalesChannel[]),
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
                {
                  placeholder: "All billing cycles",
                  options: pricePointFilterOptions.billingCycleOptions,
                  value: pricePointBillingCycleFilter,
                  onChange: setPricePointBillingCycleFilter,
                },
              ] : [
                {
                  placeholder: "All channels",
                  options: priceGroupChannelOptions,
                  multiSelect: true,
                  multiValue: priceGroupChannelFilters,
                  onMultiChange: (values: string[]) => setPriceGroupChannelFilters(values as SalesChannel[]),
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
                {
                  placeholder: "All billing cycles",
                  options: priceGroupBillingCycleOptions,
                  value: priceGroupBillingCycleFilter,
                  onChange: setPriceGroupBillingCycleFilter,
                },
                {
                  placeholder: "All experiments",
                  options: priceGroupExperimentOptions,
                  value: priceGroupExperimentFilter,
                  onChange: setPriceGroupExperimentFilter,
                  dropdownStyle: { minWidth: '320px' },
                },
                {
                  placeholder: "All statuses",
                  options: priceGroupStatusOptions,
                  multiSelect: true,
                  multiValue: priceGroupStatusFilters,
                  onMultiChange: (values: string[]) => setPriceGroupStatusFilters(values as any[]),
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
              ]}
              onClearAll={showPricePointView 
                ? clearAllPricePointFilters 
                : clearAllPriceGroupFilters}
              viewOptions={showPricePointView ? {
                // TODO: Enable groupBy once grouping display is implemented
                // groupBy: {
                //   value: pricePointGroupBy,
                //   setter: setPricePointGroupBy,
                //   options: PRICE_POINT_GROUP_BY_OPTIONS,
                // },
                sortOrder: {
                  value: pricePointSortOrder,
                  setter: setPricePointSortOrder,
                  options: PRICE_POINT_SORT_OPTIONS,
                },
                // TODO: Add column options for price point view later
              } : {
                groupBy: {
                  value: priceGroupGroupBy,
                  setter: setPriceGroupGroupBy,
                  options: PRICE_GROUP_GROUP_BY_OPTIONS,
                },
                sortOrder: {
                  value: priceGroupSortOrder,
                  setter: setPriceGroupSortOrder,
                  options: PRICE_GROUP_SORT_OPTIONS,
                },
                columnOptions: priceGroupColumnOptions,
                visibleColumns: priceGroupVisibleColumns,
                setVisibleColumns: setPriceGroupVisibleColumns,
                columnOrder: priceGroupColumnOrder,
                setColumnOrder: setPriceGroupColumnOrder,
                defaultVisibleColumns: priceGroupDefaultVisibility,
              }}
              displayMode="inline"
              actions={[
                <Button 
                  key="export"
                  icon={<Download size={16} />}
                  size="middle"
                  onClick={() => {
                    Modal.info({
                      title: 'Export Price Groups',
                      content: (
                        <div>
                          <p>This would export all price group data for <strong>{product?.name}</strong> to CSV format.</p>
                          <p style={{ marginTop: 8, fontSize: '13px', color: token.colorTextSecondary }}>
                            Includes: Price group IDs, names, channels, billing cycles, USD prices, currency counts, and validity periods.
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
            {showPricePointView ? (
              <div style={{ marginTop: '16px' }}>
                <Table
                  size="small"
                  dataSource={sortedFlattenedPricePoints}
                  rowKey={record => `${record.priceGroupId}-${record.pricePoint.id}`}
                  columns={[
                    {
                      title: 'Price Point ID', 
                      dataIndex: ['pricePoint', 'id'],
                      key: 'pricePointId',
                      width: 150,
                      render: (_: any, record: any) => (
                        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                          <CopyableId id={record.pricePoint.id} variant="prominent" />
                        </div>
                      ),
                    },
                    {
                      title: 'Currency',
                      dataIndex: ['pricePoint', 'currencyCode'],
                      key: 'currency',
                      width: 100,
                      render: (currencyCode: string) => (
                        <Typography.Text style={{ fontWeight: 500 }}>
                          {currencyCode}
                        </Typography.Text>
                      ),
                    },
                    {
                      title: 'Amount',
                      dataIndex: ['pricePoint', 'amount'],
                      key: 'amount',
                      width: 120,
                      render: (amount: number) => (
                        <Typography.Text>
                          {amount.toFixed(2)}
                        </Typography.Text>
                      ),
                    },
                    {
                      title: 'Channels',
                      dataIndex: 'channels',
                      key: 'channels',
                      width: 200,
                      render: (channels: SalesChannel[]) => (
                        <Space size="small">
                          {channels.map((channel) => (
                            <SalesChannelDisplay key={channel} channel={channel} variant="small" />
                          ))}
                        </Space>
                      ),
                    },
                    {
                      title: 'Billing Cycles',
                      dataIndex: 'billingCycles',
                      key: 'billingCycles',
                      width: 180,
                      render: (billingCycles: BillingCycle[]) => (
                        <Space size="small">
                          {billingCycles.map((cycle) => (
                            <BillingCycleDisplay key={cycle} billingCycle={cycle} variant="small" />
                          ))}
                        </Space>
                      ),
                    },
                    {
                      title: 'LIX',
                      dataIndex: 'lix',
                      key: 'lix',
                      width: 150,
                      render: (lix: any) => {
                        if (!lix) {
                          return <Typography.Text style={{ color: token.colorTextSecondary }}>-</Typography.Text>;
                        }
                        
                        return (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
                            <Typography.Text>
                              {lix.key}
                            </Typography.Text>
                            <Typography.Text style={{ fontSize: token.fontSizeSM, color: token.colorTextSecondary }}>
                              {lix.treatment}
                            </Typography.Text>
                          </div>
                        );
                      },
                    },
                    {
                      title: 'Validity',
                      key: 'validity',
                      width: 180,
                      render: (_: any, record: any) => {
                        const validFrom = record.pricePoint.validFrom;
                        const validTo = record.pricePoint.validTo;
                        
                        if (!validFrom && !validTo) {
                          return <Typography.Text style={{ color: token.colorTextSecondary }}>-</Typography.Text>;
                        }
                        
                        const formatDate = (dateString: string) => {
                          if (!dateString) return '';
                          return new Date(dateString).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          });
                        };
                        
                        if (!validTo) {
                          return (
                            <Typography.Text style={{ color: token.colorTextSecondary }}>
                              From {formatDate(validFrom)}
                            </Typography.Text>
                          );
                        }
                        
                        if (!validFrom) {
                          return (
                            <Typography.Text style={{ color: token.colorTextSecondary }}>
                              Until {formatDate(validTo)}
                            </Typography.Text>
                          );
                        }
                        
                        return (
                          <Typography.Text style={{ color: token.colorTextSecondary }}>
                            {formatDate(validFrom)} - {formatDate(validTo)}
                          </Typography.Text>
                        );
                      },
                    },
                    {
                      title: 'Status',
                      dataIndex: ['pricePoint', 'status'],
                      key: 'status',
                      width: 100,
                      render: (_: any, record: any) => (
                        <PricePointStatusTag pricePoint={record.pricePoint} variant="small" />
                      ),
                    },
                  ]}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                />
              </div>
            ) : (
              <PriceGroupTable 
                priceGroups={filteredPriceGroups} 
                groupedPriceGroups={groupedPriceGroups}
                productId={product.id}
                visibleColumns={priceGroupVisibleColumns}
                columnOrder={priceGroupColumnOrder}
                currentTab={currentTab}
              />
            )}
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'features',
      label: (
        <span>
          Features <Tag color="orange" style={{ fontSize: '10px', padding: '0 4px', height: '16px', lineHeight: '16px', marginLeft: '4px' }}>WIP</Tag>
        </span>
      ),
      children: (
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {!featuresAlertDismissed && (
            <Alert
              message="Note from Charles - WIP exploration only, don't build"
              type="warning"
              showIcon
              closable
              onClose={() => setFeaturesAlertDismissed(true)}
            />
          )}
          <PageSection title={toSentenceCase('Features')}>
            {product.features && product.features.length > 0 ? (
              <Table
                columns={[{ title: '', dataIndex: 'feature', key: 'feature' }]}
                dataSource={product.features.map((feature, idx) => ({ key: idx, feature }))}
                pagination={false}
                size="small"
                rowKey="key"
                showHeader={false}
                style={{ marginTop: '-16px' }}
              />
            ) : (
              <span style={{ color: token.colorTextTertiary }}>No features listed for this product.</span>
            )}
          </PageSection>
        </Space>
      ),
    },
    // Settings tab
    {
      key: 'configurations',
      label: 'Settings',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          {/* Business Rules Section */}
          <PageSection title={toSentenceCase('Business Rules')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Tax Class">{product.taxClass}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Grace Period (Free-Paid)">{product.paymentFailureFreeToPaidGracePeriod} days</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Grace Period (Paid-Paid)">{product.paymentFailurePaidToPaidGracePeriod} days</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Type">{product.seatType}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Min">{product.seatMin}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Seat Max">{product.seatMax}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Visibility Controls Section */}
          <PageSection title={toSentenceCase('Visibility Controls')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Visible on Billing Emails?">{renderValue(product.isVisibleOnBillingEmails, true, token)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Visible on Renewal Emails?">{renderValue(product.isVisibleOnRenewalEmails, true, token)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Cancellable?">{renderValue(product.isCancellable, true, token)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Amendment?">{renderValue(product.isEligibleForAmendment, true, token)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Robo-Refund?">{renderValue(product.isEligibleForRoboRefund, true, token)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Pricing?">{renderValue(product.isPrimaryProductForPricing, true, token)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Grace Period?">{renderValue(product.isPrimaryForGracePeriod, true, token)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Contract Aggregation?">{renderValue(product.isPrimaryForContractAggregation, true, token)}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Links & Resources Section */}
          <PageSection title={toSentenceCase('Links & Resources')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Post-Purchase URL">
                <a href={product.postPurchaseLandingUrl} target="_blank" rel="noopener noreferrer">
                  {product.postPurchaseLandingUrl}
                </a>
              </AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Product URL"><a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Terms of Service"><a href={product.termsOfServiceUrl} target="_blank" rel="noopener noreferrer">{product.termsOfServiceUrl}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="How to Cancel"><a href={product.howToCancelUrl} target="_blank" rel="noopener noreferrer">{product.howToCancelUrl}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Refund Policy"><a href={product.refundPolicyUrl} target="_blank" rel="noopener noreferrer">{product.refundPolicyUrl}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Help Center"><a href={product.helpCenterUrl} target="_blank" rel="noopener noreferrer">{product.helpCenterUrl}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Contact Us"><a href={product.contactUsUrl} target="_blank" rel="noopener noreferrer">{product.contactUsUrl}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Account Link"><a href={product.accountLink} target="_blank" rel="noopener noreferrer">{product.accountLink}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="CTA Link"><a href={product.ctaLink} target="_blank" rel="noopener noreferrer">{product.ctaLink}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="CTA URL"><a href={product.ctaUrl} target="_blank" rel="noopener noreferrer">{product.ctaUrl}</a></AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Confirmation CTA URL"><a href={product.confirmationCtaUrl} target="_blank" rel="noopener noreferrer">{product.confirmationCtaUrl}</a></AttributeDisplay>
            </AttributeGroup>
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'activity',
      label: (
        <span>
          Activity <Tag color="orange" style={{ fontSize: '10px', padding: '0 4px', height: '16px', lineHeight: '16px', marginLeft: '4px' }}>WIP</Tag>
        </span>
      ),
      children: (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <h1>Activity</h1>
          <p>This is a placeholder for the Activity page, to show what currently exists in go/pcc.</p>
        </div>
      ),
    },
  ];



  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        icon={<Box />}
        iconSize={14}
        entityType="Product"
        title={product.name}
        onBack={() => navigate(-1)}
        tagContent={<StatusTag status={product.status} variant="small" />}
        rightAlignedId={product.id}
        compact
      />

      <Tabs
        activeKey={currentTab}
        items={tabItems}
        onChange={(key) => {
          // Update URL when tab changes
          const newSearchParams = new URLSearchParams(location.search);
          if (key === 'overview') {
            // Remove tab parameter for overview (default)
            newSearchParams.delete('tab');
          } else {
            newSearchParams.set('tab', key);
          }
          const newSearch = newSearchParams.toString();
          navigate(`/product/${productId}${newSearch ? `?${newSearch}` : ''}`, { replace: true });
        }}
      />
    </Space>
  );
};

export default ProductDetail; 