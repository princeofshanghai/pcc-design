import React, { useEffect, useMemo } from 'react';
import { Typography, Space, Tabs, theme, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Rows2, Rows4 } from 'lucide-react';
import { mockProducts } from '../utils/mock-data';
import { loadProductWithPricing } from '../utils/demoDataLoader';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { toSentenceCase, formatValidityRange } from '../utils/formatters';
import type { ColumnVisibility, PricePoint } from '../utils/types';
import { PRICE_GROUP_COLUMNS, DEFAULT_PRICE_GROUP_COLUMNS, PRICE_POINT_COLUMNS, DEFAULT_PRICE_POINT_COLUMNS, FLATTENED_PRICE_POINT_SORT_OPTIONS, FLATTENED_PRICE_POINT_GROUP_BY_OPTIONS, getFilterPlaceholder } from '../utils/tableConfigurations';
import type { Dayjs } from 'dayjs';

import {
  PageHeader,
  StatusTag,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  OverrideIndicator,
  ChannelTag,
  BillingCycleTag,
  BillingModelTag,
  CopyableId,
  InfoPopover,
  FilterBar,
} from '../components';
import PriceGroupTable from '../components/pricing/PriceGroupTable';
import PricePointTable from '../components/pricing/PricePointTable';
import ValiditySelector from '../components/shared/ValiditySelector';
import { AlertCircle, Check } from 'lucide-react';

const { Title } = Typography;

const SkuDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { productId, skuId } = useParams<{ productId: string; skuId: string }>();
  const { setProductName, setSkuId, setFolderName } = useBreadcrumb();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(mockProducts.find(p => p.id === productId));
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasLoadedEnhancedData, setHasLoadedEnhancedData] = React.useState(false);
  
  // Price view toggle state - starts with 'price' (price group view by default) 
  const [priceViewMode, setPriceViewMode] = React.useState(() => {
    // Load from localStorage on initial mount
    const saved = localStorage.getItem('priceViewMode');
    return (saved === 'price' || saved === 'pricePoints') ? saved : 'price';
  });

  // Wrapper function that also saves to localStorage
  const handlePriceViewModeChange = (newMode: string) => {
    setPriceViewMode(newMode);
    localStorage.setItem('priceViewMode', newMode);
  };
  
  // Price point view filtering state - initialize with saved values from localStorage
  const getInitialPricePointFilterState = () => {
    if (!skuId) return {};
    
    const savedState = localStorage.getItem(`skuPricePointFilters_${skuId}`);
    if (savedState) {
      try {
        return JSON.parse(savedState);
      } catch (error) {
        console.warn('Failed to parse saved price points filter state:', error);
        return {};
      }
    }
    return {};
  };

  const initialPricePointFilterState = getInitialPricePointFilterState();
  
  const [pricePointSortOrder, setPricePointSortOrder] = React.useState(initialPricePointFilterState.pricePointSortOrder || 'None');
  const [pricePointGroupBy, setPricePointGroupBy] = React.useState(initialPricePointFilterState.pricePointGroupBy || 'None');
  
  // Price point view filtering state
  const [pricePointSearchQuery, setPricePointSearchQuery] = React.useState('');
  const [pricePointCurrencyFilters, setPricePointCurrencyFilters] = React.useState<string[]>(initialPricePointFilterState.pricePointCurrencyFilters || []);
  const [pricePointStatusFilter, setPricePointStatusFilter] = React.useState<string | null>(initialPricePointFilterState.pricePointStatusFilter || null);
  
  // Validity filtering state - matching PriceGroupDetail.tsx logic
  const [validityMode, setValidityMode] = React.useState<'current' | 'custom'>(initialPricePointFilterState.validityMode || 'current');
  const [customValidityDate, setCustomValidityDate] = React.useState<Dayjs | null>(initialPricePointFilterState.customValidityDate || null);
  
  // Column visibility for price points
  const pricePointDefaultVisibility = useMemo(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_POINT_COLUMNS.forEach(col => {
      defaultVisibility[col.key] = col.key !== 'validity' && col.key !== 'pricingTier' && col.key !== 'priceType';
    });
    return defaultVisibility;
  }, []);
  
  const [pricePointVisibleColumns, setPricePointVisibleColumns] = React.useState<ColumnVisibility>(() => {
    return initialPricePointFilterState.pricePointVisibleColumns || pricePointDefaultVisibility;
  });
  
  const [pricePointColumnOrder, setPricePointColumnOrder] = React.useState(() => {
    return initialPricePointFilterState.pricePointColumnOrder || DEFAULT_PRICE_POINT_COLUMNS;
  });

  // USD equivalent toggle
  const [showUsdEquivalent, setShowUsdEquivalent] = React.useState<boolean>(initialPricePointFilterState.showUsdEquivalent || false);
  
  const sku = product?.skus.find(s => s.id === skuId);
  
  // Prepare price group data for single-row table (MOVED UP to fix Hooks Rules)
  const priceGroupData = useMemo(() => {
    if (!sku?.priceGroup) return [];
    
    // Find all SKUs that use the same price group
    const skusWithSamePriceGroup = product?.skus.filter(s => s.priceGroup.id === sku.priceGroup.id) || [];
    
    return [{
      priceGroup: sku.priceGroup,
      skus: skusWithSamePriceGroup
    }];
  }, [sku, product]);

  // Column visibility configuration for PriceGroupTable (MOVED UP to fix Hooks Rules)
  const priceGroupDefaultVisibility = useMemo(() => {
    const defaultVisibility: ColumnVisibility = {};
    PRICE_GROUP_COLUMNS.forEach(col => {
      // Show all columns except name (not needed for single SKU context)
      if (col.key === 'name') {
        defaultVisibility[col.key] = false;
      } else {
        defaultVisibility[col.key] = true;
      }
    });
    return defaultVisibility;
  }, []);

  // Compute the selected date for filtering
  const selectedValidityDate = useMemo(() => {
    if (validityMode === 'current') {
      return new Date(); // Today
    } else {
      return customValidityDate ? customValidityDate.toDate() : new Date();
    }
  }, [validityMode, customValidityDate]);

  // Get all price points from the SKU's price group
  const allSkuPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints' || !sku?.priceGroup?.pricePoints) return [];
    
    return sku.priceGroup.pricePoints;
  }, [priceViewMode, sku]);

  // Filter the price points based on price point view filters
  const filteredSkuPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints') return [];
    
    return allSkuPricePoints.filter(pricePoint => {
      // Validity filter - check if price point is active on selectedValidityDate
      const validFrom = new Date(pricePoint.validFrom);
      const validUntil = pricePoint.validUntil ? new Date(pricePoint.validUntil) : null;
      
      // Check if price point is active on the selected date
      const isActiveOnDate = 
        (selectedValidityDate >= validFrom) &&
        (!validUntil || selectedValidityDate <= validUntil);
      
      if (!isActiveOnDate) {
        return false;
      }

      // Search filter (currency, price point ID)
      if (pricePointSearchQuery) {
        const searchLower = pricePointSearchQuery.toLowerCase();
        const matchesSearch = 
          pricePoint.currencyCode?.toLowerCase().includes(searchLower) ||
          pricePoint.id?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Currency filter (multiselect)
      if (pricePointCurrencyFilters.length > 0 && !pricePointCurrencyFilters.includes(pricePoint.currencyCode)) {
        return false;
      }

      // Status filter
      if (pricePointStatusFilter && pricePoint.status !== pricePointStatusFilter) {
        return false;
      }

      return true;
    });
  }, [
    priceViewMode,
    allSkuPricePoints,
    selectedValidityDate,
    pricePointSearchQuery,
    pricePointCurrencyFilters,
    pricePointStatusFilter,
  ]);

  // Generate filter options for price point view with counts
  const pricePointFilterOptions = useMemo(() => {
    if (priceViewMode !== 'pricePoints' || allSkuPricePoints.length === 0) {
      return {
        currencyOptions: [],
        statusOptions: [],
      };
    }

    // Currency options with counts
    const currencyCounts = allSkuPricePoints.reduce((acc, point) => {
      acc[point.currencyCode] = (acc[point.currencyCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const currencyOptions = Object.keys(currencyCounts).sort().map(currency => ({ 
      label: `${currency} (${currencyCounts[currency]})`, 
      value: currency 
    }));

    // Status options with counts
    const statusCounts = allSkuPricePoints.reduce((acc, point) => {
      const status = point.status || 'Unspecified';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const statusOptions = Object.keys(statusCounts).sort().map(status => ({ 
      label: `${toSentenceCase(status)} (${statusCounts[status]})`, 
      value: status 
    }));

    return {
      currencyOptions,
      statusOptions,
    };
  }, [priceViewMode, allSkuPricePoints]);

  // Sort price points based on selected sort order
  const sortedSkuPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints' || pricePointSortOrder === 'None') {
      return filteredSkuPricePoints;
    }

    const sorted = [...filteredSkuPricePoints];

    switch (pricePointSortOrder) {
      case 'Currency (A-Z)':
        return sorted.sort((a, b) => a.currencyCode.localeCompare(b.currencyCode));
      case 'Currency (Z-A)':
        return sorted.sort((a, b) => b.currencyCode.localeCompare(a.currencyCode));
      case 'Amount (Low to high)':
        return sorted.sort((a, b) => a.amount - b.amount);
      case 'Amount (High to low)':
        return sorted.sort((a, b) => b.amount - a.amount);
      case 'Validity (Earliest to latest)':
        return sorted.sort((a, b) => {
          const aDate = new Date(a.validFrom || '').getTime();
          const bDate = new Date(b.validFrom || '').getTime();
          return aDate - bDate;
        });
      case 'Validity (Latest to earliest)':
        return sorted.sort((a, b) => {
          const aDate = new Date(a.validFrom || '').getTime();
          const bDate = new Date(b.validFrom || '').getTime();
          return bDate - aDate;
        });
      case 'Status (A-Z)':
        return sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      case 'Status (Z-A)':
        return sorted.sort((a, b) => (b.status || '').localeCompare(a.status || ''));
      default:
        return sorted;
    }
  }, [priceViewMode, filteredSkuPricePoints, pricePointSortOrder]);

  // Group price points based on selected group by option
  const groupedSkuPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints' || pricePointGroupBy === 'None') {
      return null;
    }

    const grouped: Record<string, PricePoint[]> = {};

    sortedSkuPricePoints.forEach(pricePoint => {
      let groupKey: string;

      switch (pricePointGroupBy) {
        case 'Currency':
          groupKey = pricePoint.currencyCode;
          break;
        case 'Validity':
          groupKey = formatValidityRange(pricePoint.validFrom, pricePoint.validUntil);
          break;
        case 'Status':
          groupKey = pricePoint.status || 'No Status';
          break;
        default:
          groupKey = 'Other';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(pricePoint);
    });

    return grouped;
  }, [priceViewMode, sortedSkuPricePoints, pricePointGroupBy]);

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setPricePointCurrencyFilters([]);
    setPricePointStatusFilter(null);
  };

  // Load enhanced product data with price groups from JSON files
  useEffect(() => {
    if (productId) {
      setIsLoading(true);
      
      loadProductWithPricing(productId).then(enhancedProduct => {
        if (enhancedProduct) {
          setProduct(enhancedProduct);
        }
        setHasLoadedEnhancedData(true);
        setIsLoading(false);
      }).catch(() => {
        // Even if enhanced loading fails, we should stop loading
        setHasLoadedEnhancedData(true);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [productId, skuId]);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
      // Also set the folder name if available
      if (product.folder) {
        setFolderName(product.folder);
      }
    }
    if (sku) {
      setSkuId(sku.id);
    }

    return () => {
      setProductName(null);
      setSkuId(null);
      setFolderName(null);
    };
  }, [product, sku, setProductName, setSkuId, setFolderName]);

  // Save price points filter states to localStorage whenever they change
  useEffect(() => {
    if (!skuId) return;
    
    const filterState = {
      validityMode,
      customValidityDate,
      pricePointCurrencyFilters,
      pricePointStatusFilter,
      pricePointSortOrder,
      pricePointGroupBy,
      pricePointVisibleColumns,
      pricePointColumnOrder,
      showUsdEquivalent,
    };
    
    localStorage.setItem(`skuPricePointFilters_${skuId}`, JSON.stringify(filterState));
  }, [skuId, validityMode, customValidityDate, pricePointCurrencyFilters, pricePointStatusFilter, 
      pricePointSortOrder, pricePointGroupBy, pricePointVisibleColumns, pricePointColumnOrder, showUsdEquivalent]);

  // Show loading state while enhanced data is being loaded
  // BUT: if we already have the SKU in the initial data, we can render immediately
  const hasSkuInInitialData = product && sku;
  if ((isLoading || !hasLoadedEnhancedData) && !hasSkuInInitialData) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <Title level={2}>Loading SKU...</Title>
        <p style={{ color: token.colorTextSecondary }}>
          Loading enhanced product data and SKU information...
        </p>
      </div>
    );
  }

  // Only show "Not Found" after enhanced data has fully loaded
  if (hasLoadedEnhancedData && (!product || !sku)) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <Title level={2}>SKU Not Found</Title>
        <p>The requested product or SKU could not be found.</p>
        <p style={{ color: token.colorTextSecondary, fontSize: '14px', marginTop: '16px' }}>
          Product ID: {productId} | SKU ID: {skuId}
        </p>
      </div>
    );
  }

  // Helper function to check if an attribute is overridden
  const isOverridden = (skuValue: any, productValue: any) => {
    return skuValue !== undefined && skuValue !== null && skuValue !== productValue;
  };

  // Function to detect all SKU overrides for summary
  const getSkuOverrides = () => {
    if (!sku || !product) return [];
    
    const overrides = [];
    
    if (isOverridden(sku.taxClass, product.taxClass)) {
      overrides.push("Tax Class");
    }
    
    if (isOverridden(sku.seatMin, product.seatMin) || isOverridden(sku.seatMax, product.seatMax)) {
      overrides.push("Seat Range");
    }
    
    if (isOverridden(sku.paymentFailureFreeToPaidGracePeriod, product.paymentFailureFreeToPaidGracePeriod)) {
      overrides.push("Free-to-Paid Grace Period");
    }
    
    if (isOverridden(sku.paymentFailurePaidToPaidGracePeriod, product.paymentFailurePaidToPaidGracePeriod)) {
      overrides.push("Paid-to-Paid Grace Period");
    }
    
    if (isOverridden(sku.isVisibleOnRenewalEmails, product.isVisibleOnRenewalEmails)) {
      overrides.push("Visible on Renewal Emails");
    }
    
    return overrides;
  };

  const skuOverrides = getSkuOverrides();
  
  // Helper function to render override values inline with crossed-out product default
  const renderOverrideValue = (skuValue: any, productValue: any, formatter?: (val: any) => string, isBoolean = false) => {
    const formatValue = formatter || ((val: any) => String(val));
    
    return (
      <>
        {isBoolean ? renderValue(skuValue, true) : formatValue(skuValue)}
        <span style={{ 
          marginLeft: '8px',
          textDecoration: 'line-through',
          color: token.colorTextTertiary 
        }}>
          {isBoolean ? (productValue ? "Yes" : "No") : formatValue(productValue)}
        </span>
      </>
    );
  };

  // Helper function to format price display (matching PriceGroupTable.tsx logic)
  const formatPriceDisplay = (priceGroup: any) => {
    if (!priceGroup || !priceGroup.pricePoints) return 'No price data';
    
    // Filter for active price points only
    const activePricePoints = priceGroup.pricePoints.filter((p: any) => p.status === 'Active');
    
    if (activePricePoints.length === 0) {
      return 'No active price points';
    }
    
    // Look for USD first
    const usdPrice = activePricePoints.find((p: any) => p.currencyCode === 'USD');
    
    // Format currency with tabular-nums (same as PriceGroupTable.tsx)
    const formatPriceWithTabularNums = (pricePoint: any) => {
      const zeroDecimalCurrencies = new Set([
        'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
        'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
      ]);
      
      const amount = zeroDecimalCurrencies.has(pricePoint.currencyCode) 
        ? Math.round(pricePoint.amount) 
        : pricePoint.amount.toFixed(2);
      
      return (
        <span style={{ fontWeight: 500 }}>
          {pricePoint.currencyCode}{' '}
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{amount}</span>
        </span>
      );
    };
    
    if (usdPrice) {
      // If USD exists, show USD price with additional count
      const additionalActivePricePoints = activePricePoints.length - 1;
      return (
        <span>
          {formatPriceWithTabularNums(usdPrice)}
          {additionalActivePricePoints > 0 && (
            <span style={{ 
              color: token.colorTextSecondary,
              fontSize: token.fontSizeSM 
            }}> +{additionalActivePricePoints} more</span>
          )}
        </span>
      );
    } else {
      // If no USD, just show count of non-USD price points
      const count = activePricePoints.length;
      return (
        <span style={{ color: token.colorText, fontWeight: 500 }}>
          {count} non-USD price point{count === 1 ? '' : 's'}
        </span>
      );
    }
  };
  
  // Helper function to render boolean values with check/x icons
  const renderValue = (value: any, isBoolean = false) => {
    if (isBoolean) {
      return (
        <Space size="small" align="center">
          {value ? (
            <>
              <Check size={14} style={{ color: token.colorSuccess }} />
              <span>Yes</span>
            </>
          ) : (
            <>
              <span style={{ color: token.colorError, fontSize: '14px', fontWeight: 'bold' }}>✗</span>
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

  const tabItems = [
    {
      key: 'attributes',
      label: 'Attributes',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          {/* Override Summary - MOST PROMINENT */}
          <PageSection 
            title={toSentenceCase("Override Summary")}
          >
            {skuOverrides.length > 0 ? (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fff7e6', 
                border: '1px solid #ffd591', 
                borderRadius: '8px' 
              }}>
                <Space align="center" size="small" style={{ marginBottom: '12px' }}>
                  <AlertCircle size={16} color="#fa8c16" />
                  <Typography.Text strong style={{ color: '#ad6800' }}>
                    This SKU overrides the following product defaults:
                  </Typography.Text>
                </Space>
                <div style={{ marginLeft: '24px' }}>
                  {skuOverrides.map((override) => (
                    <div key={override} style={{ marginBottom: '4px' }}>
                      <Typography.Text style={{ color: '#ad6800' }}>• {override}</Typography.Text>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f', 
                borderRadius: '8px' 
              }}>
                <Space align="center" size="small">
                  <Check size={16} color="#52c41a" />
                  <Typography.Text style={{ color: '#389e0d' }}>
                    This SKU uses all product defaults with no overrides.
                  </Typography.Text>
                </Space>
              </div>
            )}
          </PageSection>
          
          {/* General Section */}
          <PageSection title={toSentenceCase("General")}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="SKU ID">
                <CopyableId id={sku?.id || ''} />
              </AttributeDisplay>
              
              <AttributeDisplay layout="horizontal" label="Configuration">
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                  {product?.billingModel && (
                    <BillingModelTag billingModel={product.billingModel} variant="small" showIcon={false} />
                  )}
                  {sku?.salesChannel && (
                    <ChannelTag channel={sku.salesChannel} variant="small" showIcon={false} />
                  )}
                  {sku?.billingCycle && (
                    <BillingCycleTag billingCycle={sku.billingCycle} variant="small" showIcon={false} />
                  )}
                </div>
              </AttributeDisplay>
              
              <AttributeDisplay layout="horizontal" label="Associated price group">
                {sku?.priceGroup ? (
                  <span>
                    <Typography.Link
                      onClick={() => {
                        navigate(`/product/${productId}/price-group/${sku.priceGroup.id}`);
                      }}
                      style={{ 
                        fontSize: token.fontSize,
                        fontWeight: '400'
                      }}
                    >
                      ID: {sku.priceGroup.id}
                    </Typography.Link>
                    <span style={{ marginLeft: '8px' }}>
                      ({formatPriceDisplay(sku.priceGroup)})
                    </span>
                  </span>
                ) : (
                  <span style={{ color: token.colorTextSecondary }}>N/A</span>
                )}
              </AttributeDisplay>
              
              <AttributeDisplay layout="horizontal" label="Status">
                <StatusTag status={sku?.status} variant="small" showIcon={false} />
              </AttributeDisplay>
              
              <AttributeDisplay layout="horizontal" label="LIX experiment">
                {(sku?.lix?.key || sku?.lix?.treatment) ? (
                  <span style={{ 
                    fontSize: token.fontSize,
                    color: token.colorText
                  }}>
                    {sku?.lix?.key} ({sku?.lix?.treatment})
                  </span>
                ) : (
                  <span style={{ color: token.colorTextTertiary }}>None</span>
                )}
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Business Rules Section */}
          <PageSection title={toSentenceCase('Business Rules')}>
            <AttributeGroup>
              <AttributeDisplay label="Tax Class" layout="horizontal">
                <Space size="small">
                  <span>
                    {isOverridden(sku?.taxClass, product?.taxClass) ? 
                      renderOverrideValue(sku?.taxClass, product?.taxClass) :
                      (sku?.taxClass || product?.taxClass)
                    }
                  </span>
                  {isOverridden(sku?.taxClass, product?.taxClass) && <OverrideIndicator />}
                </Space>
              </AttributeDisplay>
              
              <AttributeDisplay label="Grace Period (Free-Paid)" layout="horizontal">
                <Space size="small">
                  <span>
                    {isOverridden(sku?.paymentFailureFreeToPaidGracePeriod, product?.paymentFailureFreeToPaidGracePeriod) ? 
                      renderOverrideValue(
                        sku?.paymentFailureFreeToPaidGracePeriod, 
                        product?.paymentFailureFreeToPaidGracePeriod,
                        (val) => `${val} days`
                      ) :
                      `${(sku?.paymentFailureFreeToPaidGracePeriod ?? product?.paymentFailureFreeToPaidGracePeriod)} days`
                    }
                  </span>
                  {isOverridden(sku?.paymentFailureFreeToPaidGracePeriod, product?.paymentFailureFreeToPaidGracePeriod) && <OverrideIndicator />}
                </Space>
              </AttributeDisplay>
              
              <AttributeDisplay label="Grace Period (Paid-Paid)" layout="horizontal">
                <Space size="small">
                  <span>
                    {isOverridden(sku?.paymentFailurePaidToPaidGracePeriod, product?.paymentFailurePaidToPaidGracePeriod) ? 
                      renderOverrideValue(
                        sku?.paymentFailurePaidToPaidGracePeriod, 
                        product?.paymentFailurePaidToPaidGracePeriod,
                        (val) => `${val} days`
                      ) :
                      `${(sku?.paymentFailurePaidToPaidGracePeriod ?? product?.paymentFailurePaidToPaidGracePeriod)} days`
                    }
                  </span>
                  {isOverridden(sku?.paymentFailurePaidToPaidGracePeriod, product?.paymentFailurePaidToPaidGracePeriod) && <OverrideIndicator />}
                </Space>
              </AttributeDisplay>
              
              <AttributeDisplay label="Seat Range" layout="horizontal">
                <Space size="small">
                  <span>
                    {(isOverridden(sku?.seatMin, product?.seatMin) || isOverridden(sku?.seatMax, product?.seatMax)) ? 
                      renderOverrideValue(
                        `${(sku?.seatMin ?? product?.seatMin)} - ${(sku?.seatMax ?? product?.seatMax)}`, 
                        `${product?.seatMin} - ${product?.seatMax}`
                      ) :
                      `${(sku?.seatMin ?? product?.seatMin)} - ${(sku?.seatMax ?? product?.seatMax)}`
                    }
                  </span>
                  {(isOverridden(sku?.seatMin, product?.seatMin) || isOverridden(sku?.seatMax, product?.seatMax)) && <OverrideIndicator />}
                </Space>
              </AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Visibility Controls Section */}
          <PageSection title={toSentenceCase('Visibility Controls')}>
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Visible on Billing Emails?">{renderValue(product?.isVisibleOnBillingEmails, true)}</AttributeDisplay>
              
              <AttributeDisplay layout="horizontal" label="Visible on Renewal Emails?">
                <Space size="small">
                  <span>
                    {isOverridden(sku?.isVisibleOnRenewalEmails, product?.isVisibleOnRenewalEmails) ? 
                      renderOverrideValue(
                        sku?.isVisibleOnRenewalEmails, 
                        product?.isVisibleOnRenewalEmails,
                        undefined, // No formatter needed for boolean
                        true       // This is a boolean value
                      ) :
                      renderValue(sku?.isVisibleOnRenewalEmails ?? product?.isVisibleOnRenewalEmails, true)
                    }
                  </span>
                  {isOverridden(sku?.isVisibleOnRenewalEmails, product?.isVisibleOnRenewalEmails) && <OverrideIndicator />}
                </Space>
              </AttributeDisplay>
              
              <AttributeDisplay layout="horizontal" label="Cancellable?">{renderValue(product?.isCancellable, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Amendment?">{renderValue(product?.isEligibleForAmendment, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Eligible for Robo-Refund?">{renderValue(product?.isEligibleForRoboRefund, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Pricing?">{renderValue(product?.isPrimaryProductForPricing, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Grace Period?">{renderValue(product?.isPrimaryForGracePeriod, true)}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Primary for Contract Aggregation?">{renderValue(product?.isPrimaryForContractAggregation, true)}</AttributeDisplay>
            </AttributeGroup>
          </PageSection>
          
          {/* Links & Resources Section */}
          <PageSection title={toSentenceCase('Links & Resources')}>
            <AttributeGroup>
              {product?.postPurchaseLandingUrl && (
                <AttributeDisplay layout="horizontal" label="Post-Purchase URL">
                  <a href={product.postPurchaseLandingUrl} target="_blank" rel="noopener noreferrer">
                    {product.postPurchaseLandingUrl}
                  </a>
                </AttributeDisplay>
              )}
              {product?.productUrl && (
                <AttributeDisplay layout="horizontal" label="Product URL">
                  <a href={product.productUrl} target="_blank" rel="noopener noreferrer">{product.productUrl}</a>
                </AttributeDisplay>
              )}
              {product?.termsOfServiceUrl && (
                <AttributeDisplay layout="horizontal" label="Terms of Service">
                  <a href={product.termsOfServiceUrl} target="_blank" rel="noopener noreferrer">{product.termsOfServiceUrl}</a>
                </AttributeDisplay>
              )}
              {product?.howToCancelUrl && (
                <AttributeDisplay layout="horizontal" label="How to Cancel">
                  <a href={product.howToCancelUrl} target="_blank" rel="noopener noreferrer">{product.howToCancelUrl}</a>
                </AttributeDisplay>
              )}
              {product?.refundPolicyUrl && (
                <AttributeDisplay layout="horizontal" label="Refund Policy">
                  <a href={product.refundPolicyUrl} target="_blank" rel="noopener noreferrer">{product.refundPolicyUrl}</a>
                </AttributeDisplay>
              )}
              {product?.helpCenterUrl && (
                <AttributeDisplay layout="horizontal" label="Help Center">
                  <a href={product.helpCenterUrl} target="_blank" rel="noopener noreferrer">{product.helpCenterUrl}</a>
                </AttributeDisplay>
              )}
              {product?.contactUsUrl && (
                <AttributeDisplay layout="horizontal" label="Contact Us">
                  <a href={product.contactUsUrl} target="_blank" rel="noopener noreferrer">{product.contactUsUrl}</a>
                </AttributeDisplay>
              )}
              {product?.accountLink && (
                <AttributeDisplay layout="horizontal" label="Account Link">
                  <a href={product.accountLink} target="_blank" rel="noopener noreferrer">{product.accountLink}</a>
                </AttributeDisplay>
              )}
              {product?.ctaLink && (
                <AttributeDisplay layout="horizontal" label="CTA Link">
                  <a href={product.ctaLink} target="_blank" rel="noopener noreferrer">{product.ctaLink}</a>
                </AttributeDisplay>
              )}
              {product?.ctaUrl && (
                <AttributeDisplay layout="horizontal" label="CTA URL">
                  <a href={product.ctaUrl} target="_blank" rel="noopener noreferrer">{product.ctaUrl}</a>
                </AttributeDisplay>
              )}
              {product?.confirmationCtaUrl && (
                <AttributeDisplay layout="horizontal" label="Confirmation CTA URL">
                  <a href={product.confirmationCtaUrl} target="_blank" rel="noopener noreferrer">{product.confirmationCtaUrl}</a>
                </AttributeDisplay>
              )}
            </AttributeGroup>
          </PageSection>
        </Space>
      ),
    },
    {
      key: 'pricing',
      label: 'Pricing',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          <PageSection 
            title={priceViewMode === 'pricePoints' 
              ? 'Price points for this SKU' 
              : 'Price Group for this SKU'
            }
          >
            <FilterBar
              useCustomFilters={true}
              search={priceViewMode === 'pricePoints' ? {
                placeholder: "Search by Currency or Price Point ID...",
                onChange: setPricePointSearchQuery,
              } : undefined}
              inlineActions={[]}
              filters={priceViewMode === 'pricePoints' ? [
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
                  options: pricePointFilterOptions.currencyOptions,
                  multiSelect: true,
                  multiValue: pricePointCurrencyFilters,
                  onMultiChange: (values: string[]) => setPricePointCurrencyFilters(values),
                  disableSearch: true,
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
                {
                  placeholder: getFilterPlaceholder('status'), 
                  options: pricePointFilterOptions.statusOptions,
                  value: pricePointStatusFilter,
                  onChange: setPricePointStatusFilter,
                  disableSearch: true,
                  primary: false, // Put Status behind "More filters" button
                },
              ] : []}
              onClearAll={priceViewMode === 'pricePoints'
                ? clearAllPricePointFilters 
                : undefined}
              viewOptions={priceViewMode === 'pricePoints' ? {
                viewMode: {
                  value: priceViewMode,
                  setter: handlePriceViewModeChange,
                  options: [
                    { key: 'price', label: 'View by price group', icon: <Rows2 size={20} /> },
                    { key: 'pricePoints', label: 'View by price point', icon: <Rows4 size={20} /> }
                  ],
                  storageKey: 'priceViewMode'
                },
                groupBy: {
                  value: pricePointGroupBy,
                  setter: setPricePointGroupBy,
                  options: FLATTENED_PRICE_POINT_GROUP_BY_OPTIONS,
                },
                sortOrder: {
                  value: pricePointSortOrder,
                  setter: setPricePointSortOrder,
                  options: FLATTENED_PRICE_POINT_SORT_OPTIONS,
                },
                columnOptions: PRICE_POINT_COLUMNS,
                visibleColumns: pricePointVisibleColumns,
                setVisibleColumns: setPricePointVisibleColumns,
                columnOrder: pricePointColumnOrder,
                setColumnOrder: setPricePointColumnOrder,
                defaultVisibleColumns: pricePointDefaultVisibility,
                defaultColumnOrder: DEFAULT_PRICE_POINT_COLUMNS,
                showUsdEquivalent: showUsdEquivalent,
                setShowUsdEquivalent: setShowUsdEquivalent,
              } : {
                viewMode: {
                  value: priceViewMode,
                  setter: handlePriceViewModeChange,
                  options: [
                    { key: 'price', label: 'View by price group', icon: <Rows2 size={20} /> },
                    { key: 'pricePoints', label: 'View by price point', icon: <Rows4 size={20} /> }
                  ],
                  storageKey: 'priceViewMode'
                }
              }}
              rightActions={[
                <Button 
                  key="export"
                  icon={<Download size={16} />}
                  size="middle"
                  onClick={() => {
                    console.log('Export price data for SKU:', sku?.id);
                  }}
                >
                  Export
                </Button>
              ]}
            />

            {priceViewMode === 'pricePoints' ? (
              <PricePointTable 
                pricePoints={sortedSkuPricePoints}
                groupedPricePoints={groupedSkuPricePoints}
                visibleColumns={pricePointVisibleColumns}
                columnOrder={pricePointColumnOrder}
                sortOrder={pricePointSortOrder}
                showUsdEquivalent={showUsdEquivalent}
              />
            ) : (
              <>
                {/* Price Group Relationship Info */}
                {sku?.priceGroup && product && (() => {
                  const skusWithSamePriceGroup = product.skus.filter(s => s.priceGroup.id === sku.priceGroup.id);
                  const otherSkusCount = skusWithSamePriceGroup.length - 1;
                  
                  return otherSkusCount > 0 ? (
                    <div style={{ marginBottom: '24px' }}>
                      <InfoPopover 
                        content={`${otherSkusCount} other SKU${otherSkusCount !== 1 ? 's' : ''} in ${product.name} use${otherSkusCount === 1 ? 's' : ''} the same price group. Click the row below to see all price points and related SKUs.`}
                      >
                        <Typography.Text style={{ color: token.colorTextSecondary }}>
                          ℹ️ {otherSkusCount} other SKU{otherSkusCount !== 1 ? 's' : ''} use{otherSkusCount === 1 ? 's' : ''} this price group
                        </Typography.Text>
                      </InfoPopover>
                    </div>
                  ) : null;
                })()}
                
                {/* Single-row Price Group Table */}
                <PriceGroupTable 
                  priceGroups={priceGroupData}
                  productId={productId || ''}
                  productName={product?.name}
                  product={product}
                  visibleColumns={priceGroupDefaultVisibility}
                  columnOrder={DEFAULT_PRICE_GROUP_COLUMNS}
                  currentTab="pricing"
                />
              </>
            )}
          </PageSection>
        </Space>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="SKU"
        title={`SKU for ${product?.name}`}
        tagContent={
          <Space size={8} wrap>
            {sku?.status && (
              <StatusTag status={sku.status} variant="small" showIcon={false} />
            )}
            {sku?.salesChannel && (
              <ChannelTag channel={sku.salesChannel} variant="small" showIcon={false} />
            )}
            {sku?.billingCycle && (
              <BillingCycleTag billingCycle={sku.billingCycle} variant="small" showIcon={false} />
            )}
          </Space>
        }
        rightAlignedId={sku?.id}
        lixKey={sku?.lix?.key || "None"}
        lixTreatment={sku?.lix?.treatment}
        compact
      />

      <Tabs defaultActiveKey="attributes" items={tabItems} />
    </Space>
  );
};

export default SkuDetail;