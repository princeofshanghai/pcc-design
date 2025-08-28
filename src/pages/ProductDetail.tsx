import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Typography, Space, Table, Button, Tabs, Alert, Modal, Dropdown, theme, Tag, Drawer, Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
// Importing only the needed icons from lucide-react, and making sure there are no duplicate imports elsewhere in the file.
// Note: Only import each icon once from lucide-react, and do not import icons from other libraries or use inline SVGs.
import { Download, Pencil, Check, Rows2, Rows4, Calendar } from 'lucide-react';
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
  FilterBar,
  CopyableId,
  PricePointStatusTag,
  GroupHeader,
  VerticalSeparator,
} from '../components';
import { toSentenceCase, formatValidityRange } from '../utils/formatters';
import {
  PRICE_GROUP_COLUMNS,
  DEFAULT_PRICE_GROUP_COLUMNS,
  PRICE_GROUP_SORT_OPTIONS, 
  SKU_SORT_OPTIONS,
  SKU_GROUP_BY_OPTIONS,
  PRICE_GROUP_GROUP_BY_OPTIONS,
  FLATTENED_PRICE_POINT_SORT_OPTIONS,
  FLATTENED_PRICE_POINT_GROUP_BY_OPTIONS,
  getFilterPlaceholder} from '../utils/tableConfigurations';
import { getDefaultValidityFilter } from '../utils/channelConfigurations';
import { getChannelIcon } from '../utils/channelIcons';

const { Title } = Typography;

/**
 * Currency names mapping for tooltips (consistent with PricePointTable)
 */
const currencyNames: Record<string, string> = {
  'AED': 'UAE Dirham',
  'ARS': 'Argentine Peso',
  'AUD': 'Australian Dollar',
  'BDT': 'Bangladeshi Taka',
  'BGN': 'Bulgarian Lev',
  'BIF': 'Burundian Franc',
  'BYN': 'Belarusian Ruble',
  'BRL': 'Brazilian Real',
  'CAD': 'Canadian Dollar',
  'CHF': 'Swiss Franc',
  'CLP': 'Chilean Peso',
  'CNY': 'Chinese Yuan',
  'COP': 'Colombian Peso',
  'CRC': 'Costa Rican Colon',
  'CZK': 'Czech Koruna',
  'DJF': 'Djiboutian Franc',
  'DKK': 'Danish Krone',
  'EGP': 'Egyptian Pound',
  'EUR': 'Euro',
  'GBP': 'British Pound',
  'GNF': 'Guinean Franc',
  'GTQ': 'Guatemalan Quetzal',
  'HKD': 'Hong Kong Dollar',
  'HNL': 'Honduran Lempira',
  'HUF': 'Hungarian Forint',
  'IDR': 'Indonesian Rupiah',
  'ILS': 'Israeli New Shekel',
  'INR': 'Indian Rupee',
  'JOD': 'Jordanian Dinar',
  'JPY': 'Japanese Yen',
  'KES': 'Kenyan Shilling',
  'KMF': 'Comorian Franc',
  'KRW': 'South Korean Won',
  'KWD': 'Kuwaiti Dinar',
  'LBP': 'Lebanese Pound',
  'LKR': 'Sri Lankan Rupee',
  'MAD': 'Moroccan Dirham',
  'MGA': 'Malagasy Ariary',
  'MXN': 'Mexican Peso',
  'MYR': 'Malaysian Ringgit',
  'NGN': 'Nigerian Naira',
  'NOK': 'Norwegian Krone',
  'NZD': 'New Zealand Dollar',
  'PEN': 'Peruvian Sol',
  'PHP': 'Philippine Peso',
  'PKR': 'Pakistani Rupee',
  'PLN': 'Polish Zloty',
  'PYG': 'Paraguayan Guarani',
  'QAR': 'Qatari Riyal',
  'RON': 'Romanian Leu',
  'RSD': 'Serbian Dinar',
  'RUB': 'Russian Ruble',
  'RWF': 'Rwandan Franc',
  'SAR': 'Saudi Riyal',
  'SEK': 'Swedish Krona',
  'SGD': 'Singapore Dollar',
  'THB': 'Thai Baht',
  'TRY': 'Turkish Lira',
  'TWD': 'Taiwan Dollar',
  'TZS': 'Tanzanian Shilling',
  'UAH': 'Ukrainian Hryvnia',
  'UGX': 'Ugandan Shilling',
  'USD': 'US Dollar',
  'UYU': 'Uruguayan Peso',
  'VND': 'Vietnamese Dong',
  'VUV': 'Vanuatu Vatu',
  'XAF': 'Central African CFA Franc',
  'XOF': 'West African CFA Franc',
  'XPF': 'CFP Franc',
  'ZAR': 'South African Rand',
};

// Type for table rows in flattened price points table (supports both data and group headers)
type FlattenedPricePointTableRow = {
  priceGroupId: string;
  priceGroupName: string;
  pricePoint: PricePoint;
  channels: SalesChannel[];
  billingCycles: BillingCycle[];
  lix: any;
} | {
  isGroupHeader: true;
  key: string;
  title: string;
  count: number;
  groupKey: string;
};


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
            <span style={{ color: themeToken?.colorError || '#ef4444', fontSize: '14px', fontWeight: 'bold' }}>✗</span>
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
  const { setProductName, setFolderName } = useBreadcrumb();
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

  // Price view toggle state - starts with 'price' (price groups view by default) 
  const [priceViewMode, setPriceViewMode] = useState(() => {
    // Load from localStorage on initial mount
    const saved = localStorage.getItem('priceViewMode');
    return (saved === 'price' || saved === 'pricePoints') ? saved : 'price';
  });

  // Wrapper function that also saves to localStorage
  const handlePriceViewModeChange = (newMode: string) => {
    setPriceViewMode(newMode);
    localStorage.setItem('priceViewMode', newMode);
  };

  // Translations drawer state
  const [translationsDrawerOpen, setTranslationsDrawerOpen] = useState(false);

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
    DEFAULT_PRICE_GROUP_COLUMNS
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
  const [pricePointValidityFilter, setPricePointValidityFilter] = useState<string>('All periods');
  const [pricePointCurrencyFilters, setPricePointCurrencyFilters] = useState<string[]>([]);
  const [pricePointStatusFilter, setPricePointStatusFilter] = useState<string | null>(null);
  const [pricePointChannelFilters, setPricePointChannelFilters] = useState<SalesChannel[]>([]);
  const [pricePointBillingCycleFilter, setPricePointBillingCycleFilter] = useState<string | null>(null);
  const [pricePointLixFilter, setPricePointLixFilter] = useState<string | null>(null);

  // Flatten price points with inferred SKU attributes for price point view
  const allFlattenedPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints') return [];
    
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
  }, [priceViewMode, filteredPriceGroups]);

  // Filter the flattened price points based on price point view filters
  const filteredFlattenedPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints') return [];
    
    return allFlattenedPricePoints.filter(item => {
      // Validity filter - filter by validity period using formatValidityRange
      if (pricePointValidityFilter !== 'All periods') {
        const itemValidityPeriod = formatValidityRange(item.pricePoint.validFrom, item.pricePoint.validTo);
        
        if (itemValidityPeriod !== pricePointValidityFilter) {
          return false;
        }
      }

      // Search filter (currency, price point ID, or LIX key/treatment)
      if (pricePointSearchQuery) {
        const searchLower = pricePointSearchQuery.toLowerCase();
        const matchesSearch = 
          item.pricePoint.currencyCode?.toLowerCase().includes(searchLower) ||
          item.pricePoint.id?.toLowerCase().includes(searchLower) ||
          (item.lix?.key && item.lix.key.toLowerCase().includes(searchLower)) ||
          (item.lix?.treatment && item.lix.treatment.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      // Currency filter (multiselect)
      if (pricePointCurrencyFilters.length > 0 && !pricePointCurrencyFilters.includes(item.pricePoint.currencyCode)) {
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

      // LIX filter
      if (pricePointLixFilter && item.lix?.key !== pricePointLixFilter) {
        return false;
      }

      return true;
    });
  }, [
    priceViewMode,
    allFlattenedPricePoints,
    pricePointValidityFilter,
    pricePointSearchQuery,
    pricePointCurrencyFilters,
    pricePointStatusFilter,
    pricePointChannelFilters,
    pricePointBillingCycleFilter,
    pricePointLixFilter,
  ]);

  // Generate filter options for price point view with counts (following project patterns)
  const pricePointFilterOptions = useMemo(() => {
    if (priceViewMode !== 'pricePoints' || allFlattenedPricePoints.length === 0) {
      return {
        validityOptions: [{ label: 'All periods', value: 'All periods' }],
        currencyOptions: [],
        statusOptions: [],
        channelOptions: [],
        billingCycleOptions: [],
        lixOptions: [],
      };
    }

    // Extract price points for counting
    const pricePoints = allFlattenedPricePoints.map(item => item.pricePoint);

    // Generate validity options using the same logic as usePricePointFilters
    const validityGroups: Record<string, typeof pricePoints> = {};
    
    pricePoints.forEach(point => {
      const validityKey = formatValidityRange(point.validFrom, point.validTo);
      if (!validityGroups[validityKey]) {
        validityGroups[validityKey] = [];
      }
      validityGroups[validityKey].push(point);
    });

    // Helper function to extract dates and compare periods (same as usePricePointFilters)
    const extractDates = (period: string) => {
      if (period === 'Present') return { startDate: new Date(), endDate: null, isPresent: true };
      
      const match = period.match(/^(.+?) - (.+)$/);
      if (match) {
        const startDate = new Date(match[1]);
        const endDate = match[2] === 'present' ? null : new Date(match[2]);
        return { startDate, endDate, isPresent: match[2] === 'present' };
      }
      return { startDate: new Date(0), endDate: new Date(0), isPresent: false };
    };

    // Sort validity periods: newest to oldest, with present end dates first for same start dates
    const sortedValidityPeriods = Object.keys(validityGroups).sort((a, b) => {
      const datesA = extractDates(a);
      const datesB = extractDates(b);
      
      // First, compare by start date (newest first)
      const startDiff = datesB.startDate.getTime() - datesA.startDate.getTime();
      
      if (startDiff !== 0) {
        return startDiff;
      }
      
      // If same start date, "present" end dates come first
      if (datesA.isPresent && !datesB.isPresent) return -1;
      if (!datesA.isPresent && datesB.isPresent) return 1;
      
      // If both have specific end dates, newer end date comes first
      if (datesA.endDate && datesB.endDate) {
        return datesB.endDate.getTime() - datesA.endDate.getTime();
      }
      
      return 0;
    });

    // Create options array with individual validity periods first, then All periods at the end
    const validityOptions = [
      ...sortedValidityPeriods.map((period, index) => ({
        label: `${period} (${validityGroups[period].length})`,
        value: period,
        isLatest: index === 0 // First item is the latest
      })),
      // Add "All periods" at the end with total count
      {
        label: `All periods (${pricePoints.length})`,
        value: 'All periods'
      }
    ];

    // Currency options with counts
    const currencyCounts = pricePoints.reduce((acc, point) => {
      acc[point.currencyCode] = (acc[point.currencyCode] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const currencyOptions = Object.keys(currencyCounts).sort().map(currency => ({ 
      label: `${currency} (${currencyCounts[currency]})`, 
      value: currency 
    }));

    // Status options with counts
    const statusCounts = pricePoints.reduce((acc, point) => {
      const status = point.status || 'Unspecified';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const statusOptions = Object.keys(statusCounts).sort().map(status => ({ 
      label: `${toSentenceCase(status)} (${statusCounts[status]})`, 
      value: status 
    }));

    // Channel options with counts (from flattened data)
    const channelCounts = allFlattenedPricePoints.reduce((acc, item) => {
      item.channels.forEach((channel: SalesChannel) => {
        acc[channel] = (acc[channel] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    const channelOptions = Object.keys(channelCounts).sort().map(channel => ({ 
      label: `${channel === 'iOS' ? 'iOS' : toSentenceCase(channel)} (${channelCounts[channel]})`, 
      value: channel 
    }));

    // Billing cycle options with counts (from flattened data)
    const billingCycleCounts = allFlattenedPricePoints.reduce((acc, item) => {
      item.billingCycles.forEach((cycle: BillingCycle) => {
        acc[cycle] = (acc[cycle] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);
    const billingCycleOptions = Object.keys(billingCycleCounts).sort().map(cycle => ({ 
      label: `${toSentenceCase(cycle)} (${billingCycleCounts[cycle]})`, 
      value: cycle 
    }));

    // LIX options with counts
    const lixCounts = allFlattenedPricePoints.reduce((acc, item) => {
      if (item.lix?.key) {
        acc[item.lix.key] = (acc[item.lix.key] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const lixOptions = Object.keys(lixCounts).sort().map(lixKey => ({ 
      label: `${lixKey} (${lixCounts[lixKey]})`, 
      value: lixKey 
    }));

    return {
      validityOptions,
      currencyOptions,
      statusOptions, 
      channelOptions,
      billingCycleOptions,
      lixOptions,
    };
  }, [priceViewMode, allFlattenedPricePoints]);

  const clearAllPricePointFilters = () => {
    setPricePointSearchQuery('');
    setPricePointCurrencyFilters([]);
    setPricePointStatusFilter(null);
    setPricePointChannelFilters([]);
    setPricePointBillingCycleFilter(null);
    setPricePointLixFilter(null);
  };

  // Price point view state
  const [pricePointSortOrder, setPricePointSortOrder] = useState('None');
  const [pricePointGroupBy, setPricePointGroupBy] = useState('None');
  const [expandedPricePointGroups, setExpandedPricePointGroups] = useState<string[]>([]);

  // Sort price points based on selected sort order
  const sortedFlattenedPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints' || pricePointSortOrder === 'None') {
      return filteredFlattenedPricePoints;
    }

    const sorted = [...filteredFlattenedPricePoints];

    switch (pricePointSortOrder) {
      case 'ID (A-Z)':
        return sorted.sort((a, b) => a.pricePoint.id.localeCompare(b.pricePoint.id));
      case 'ID (Z-A)':
        return sorted.sort((a, b) => b.pricePoint.id.localeCompare(a.pricePoint.id));
      case 'Currency (A-Z)':
        return sorted.sort((a, b) => a.pricePoint.currencyCode.localeCompare(b.pricePoint.currencyCode));
      case 'Currency (Z-A)':
        return sorted.sort((a, b) => b.pricePoint.currencyCode.localeCompare(a.pricePoint.currencyCode));
      case 'Amount (Low to high)':
        return sorted.sort((a, b) => a.pricePoint.amount - b.pricePoint.amount);
      case 'Amount (High to low)':
        return sorted.sort((a, b) => b.pricePoint.amount - a.pricePoint.amount);
      case 'Channel (A-Z)':
        return sorted.sort((a, b) => {
          const aChannel = a.channels[0] || '';
          const bChannel = b.channels[0] || '';
          return aChannel.localeCompare(bChannel);
        });
      case 'Channel (Z-A)':
        return sorted.sort((a, b) => {
          const aChannel = a.channels[0] || '';
          const bChannel = b.channels[0] || '';
          return bChannel.localeCompare(aChannel);
        });
      case 'Billing Cycle (A-Z)':
        return sorted.sort((a, b) => {
          const aCycle = a.billingCycles[0] || '';
          const bCycle = b.billingCycles[0] || '';
          return aCycle.localeCompare(bCycle);
        });
      case 'Billing Cycle (Z-A)':
        return sorted.sort((a, b) => {
          const aCycle = a.billingCycles[0] || '';
          const bCycle = b.billingCycles[0] || '';
          return bCycle.localeCompare(aCycle);
        });
      case 'LIX (A-Z)':
        return sorted.sort((a, b) => {
          const aLix = a.lix?.key || '';
          const bLix = b.lix?.key || '';
          return aLix.localeCompare(bLix);
        });
      case 'LIX (Z-A)':
        return sorted.sort((a, b) => {
          const aLix = a.lix?.key || '';
          const bLix = b.lix?.key || '';
          return bLix.localeCompare(aLix);
        });
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
      case 'Status (A-Z)':
        return sorted.sort((a, b) => (a.pricePoint.status || '').localeCompare(b.pricePoint.status || ''));
      case 'Status (Z-A)':
        return sorted.sort((a, b) => (b.pricePoint.status || '').localeCompare(a.pricePoint.status || ''));
      default:
        return sorted;
    }
  }, [priceViewMode, filteredFlattenedPricePoints, pricePointSortOrder]);

  // Group price points based on selected group by option
  const groupedFlattenedPricePoints = useMemo(() => {
    if (priceViewMode !== 'pricePoints' || pricePointGroupBy === 'None') {
      return null;
    }

    const grouped: Record<string, typeof sortedFlattenedPricePoints> = {};

    sortedFlattenedPricePoints.forEach(item => {
      let groupKey: string;

      switch (pricePointGroupBy) {
        case 'Currency':
          groupKey = item.pricePoint.currencyCode;
          break;
        case 'Channel':
          groupKey = item.channels.join(', ') || 'No Channel';
          break;
        case 'Billing Cycle':
          groupKey = item.billingCycles.join(', ') || 'No Billing Cycle';
          break;
        case 'LIX Key':
          groupKey = item.lix?.key || 'No LIX';
          break;
        case 'Validity':
          groupKey = formatValidityRange(item.pricePoint.validFrom, item.pricePoint.validTo);
          break;
        case 'Status':
          groupKey = item.pricePoint.status || 'No Status';
          break;
        default:
          groupKey = 'Other';
      }

      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(item);
    });

    return grouped;
  }, [priceViewMode, sortedFlattenedPricePoints, pricePointGroupBy]);

  // Keep all groups collapsed by default when groupedFlattenedPricePoints changes
  useEffect(() => {
    if (groupedFlattenedPricePoints) {
      // Start with no expanded groups (all collapsed)
      setExpandedPricePointGroups([]);
    } else {
      setExpandedPricePointGroups([]);
    }
  }, [groupedFlattenedPricePoints]);

  const handlePricePointGroupToggle = (groupKey: string) => {
    setExpandedPricePointGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  // Create data source with group headers for flattened price points table
  const flattenedPricePointDataSource: FlattenedPricePointTableRow[] = useMemo(() => {
    if (priceViewMode !== 'pricePoints') return [];

    if (groupedFlattenedPricePoints) {
      // Grouped data - create table rows with group headers
      const result: FlattenedPricePointTableRow[] = [];
      Object.entries(groupedFlattenedPricePoints).forEach(([groupTitle, points]) => {
        result.push({
          isGroupHeader: true,
          key: `header-${groupTitle}`,
          title: groupTitle,
          count: points.length,
          groupKey: groupTitle,
        });
        // Only add group items if the group is expanded
        if (expandedPricePointGroups.includes(groupTitle)) {
          result.push(...points);
        }
      });
      return result;
    } else {
      // Non-grouped data - return sorted points directly
      return sortedFlattenedPricePoints;
    }
  }, [priceViewMode, groupedFlattenedPricePoints, sortedFlattenedPricePoints, expandedPricePointGroups]);

  // Define columns for flattened price points table
  const flattenedPricePointColumns: ColumnsType<FlattenedPricePointTableRow> = [
    {
      title: 'Price Point ID', 
      dataIndex: ['pricePoint', 'id'],
      key: 'pricePointId',
      fixed: 'left',
      minWidth: 150,
      render: (_: any, record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        return (
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <CopyableId id={record.pricePoint.id || ''} variant="default" />
          </div>
        );
      },
      className: 'table-col-first',
    },
    {
      title: 'Currency',
      dataIndex: ['pricePoint', 'currencyCode'],
      key: 'currency',
      render: (currencyCode: string, record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        const currencyName = currencyNames[currencyCode];
        return (
          <Tooltip title={currencyName || currencyCode}>
            <Typography.Text style={{ fontWeight: 500 }}>
              {currencyCode}
            </Typography.Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'Amount',
      dataIndex: ['pricePoint', 'amount'],
      key: 'amount',
      render: (amount: number, record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        return (
          <Typography.Text style={{ 
            fontVariantNumeric: 'tabular-nums',
          }}>
            {amount.toFixed(2)}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Channels',
      dataIndex: 'channels',
      key: 'channels',
      render: (channels: SalesChannel[], record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        return (
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {channels.map((channel, index) => (
              <React.Fragment key={channel}>
                {index > 0 && <VerticalSeparator />}
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {getChannelIcon(channel)}
                  {channel}
                </span>
              </React.Fragment>
            ))}
          </div>
        );
      },
    },
    {
      title: 'Billing Cycles',
      dataIndex: 'billingCycles',
      key: 'billingCycles',
      render: (billingCycles: BillingCycle[], record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        return (
          <Typography.Text>
            {billingCycles.join(', ')}
          </Typography.Text>
        );
      },
    },
    {
      title: 'LIX',
      dataIndex: 'lix',
      key: 'lix',
      render: (lix: any, record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        if (!lix) {
          return <Typography.Text style={{ color: token.colorTextSecondary }}>-</Typography.Text>;
        }
        
        // Middle truncation for LIX key if it's longer than 24 characters
        const truncateMiddle = (str: string, maxLength: number = 24) => {
          if (str.length <= maxLength) return str;
          const start = Math.ceil((maxLength - 3) / 2);
          const end = Math.floor((maxLength - 3) / 2);
          return `${str.slice(0, start)}...${str.slice(-end)}`;
        };
        
        const truncatedKey = truncateMiddle(lix.key);
        
        const tooltipTitle = `LIX Key: ${lix.key}\nTreatment: ${lix.treatment}`;
        
        return (
          <Tooltip title={tooltipTitle} placement="top">
            <div style={{ cursor: 'help' }}>
              <Typography.Text>{truncatedKey}</Typography.Text>
              <Typography.Text style={{ color: token.colorTextSecondary }}> | </Typography.Text>
              <Typography.Text style={{ color: token.colorTextSecondary }}>{lix.treatment}</Typography.Text>
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Validity',
      key: 'validity',
      render: (_: any, record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        const validityText = formatValidityRange(record.pricePoint.validFrom, record.pricePoint.validTo);

        return (
          <Typography.Text style={{ color: token.colorTextSecondary }}>
            {validityText}
          </Typography.Text>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: ['pricePoint', 'status'],
      key: 'status',
      render: (_: any, record: FlattenedPricePointTableRow) => {
        if ('isGroupHeader' in record) return null;
        return <PricePointStatusTag pricePoint={record.pricePoint} variant="small" />;
      },
    },
  ];

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
      // Also set the folder name if available
      if (product.folder) {
        setFolderName(product.folder);
      }
    }
    // Clear the product name and folder name when the component unmounts
    return () => {
      setProductName(null);
      setFolderName(null);
    };
  }, [product, setProductName, setFolderName]);

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
            title={toSentenceCase('Name and description')}
            actions={
              <Space size="small">
                <Button 
                  size="middle"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => setTranslationsDrawerOpen(true)}
                >
                  View translations
                </Button>
                <Dropdown menu={{ items: editMenuItems }} trigger={['click']}>
                  <Button 
                    icon={<Pencil size={14} />}
                    size="middle"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    Edit...
                  </Button>
                </Dropdown>
              </Space>
            }
          >
            <AttributeGroup>
              <AttributeDisplay layout="horizontal" label="Public name" tooltip="Visible to customers and employees on contracts and invoices">{product.name}</AttributeDisplay>
              <AttributeDisplay layout="horizontal" label="Public description" tooltip="Visible to customers and employees on contracts and invoices">{product.description}</AttributeDisplay>
            </AttributeGroup>
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
            subtitle="A price is a grouping of price points defined by a channel x billing cycle pairing, and can be part of the same LIX experiment."
            hideDivider={true}
          >
            <FilterBar
              useCustomFilters={true}
              search={{
                placeholder: priceViewMode === 'pricePoints'
                  ? "Search by Currency, Price Point ID, or LIX Key..." 
                  : "Search by Price ID or LIX Key...",
                onChange: priceViewMode === 'pricePoints'
                  ? setPricePointSearchQuery 
                  : setPriceGroupSearchQuery,
              }}
              inlineActions={[]}
              filters={priceViewMode === 'pricePoints' ? [
                {
                  placeholder: getFilterPlaceholder('validity'),
                  options: pricePointFilterOptions.validityOptions,
                  multiSelect: false,
                  value: pricePointValidityFilter,
                  onChange: (value: string | null) => {
                    if (value) {
                      setPricePointValidityFilter(value);
                    } else {
                      // Reset to channel-specific default when cleared
                      const uniqueChannels = [...new Set(allFlattenedPricePoints.flatMap(item => item.channels))];
                      const channelDefault = getDefaultValidityFilter(uniqueChannels);
                      if (channelDefault === 'most-recent') {
                        const newestPeriod = pricePointFilterOptions.validityOptions.find(opt => opt.value !== 'All periods')?.value;
                        setPricePointValidityFilter(newestPeriod || 'All periods');
                      } else {
                        setPricePointValidityFilter('All periods');
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
                  placeholder: getFilterPlaceholder('channel'),
                  options: pricePointFilterOptions.channelOptions,
                  multiSelect: true,
                  multiValue: pricePointChannelFilters,
                  onMultiChange: (values: string[]) => setPricePointChannelFilters(values as SalesChannel[]),
                  disableSearch: true,
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
                {
                  placeholder: getFilterPlaceholder('billingCycle'),
                  options: pricePointFilterOptions.billingCycleOptions,
                  value: pricePointBillingCycleFilter,
                  onChange: setPricePointBillingCycleFilter,
                  disableSearch: true,
                },
                {
                  placeholder: getFilterPlaceholder('lix'),
                  options: pricePointFilterOptions.lixOptions,
                  value: pricePointLixFilter,
                  onChange: setPricePointLixFilter,
                  primary: false, // Put LIX behind "More filters" button
                },
                {
                  placeholder: getFilterPlaceholder('status'), 
                  options: pricePointFilterOptions.statusOptions,
                  value: pricePointStatusFilter,
                  onChange: setPricePointStatusFilter,
                  disableSearch: true,
                  primary: false, // Put Status behind "More filters" button
                },
              ] : [
                {
                  placeholder: getFilterPlaceholder('channel'),
                  options: priceGroupChannelOptions,
                  multiSelect: true,
                  multiValue: priceGroupChannelFilters,
                  onMultiChange: (values: string[]) => setPriceGroupChannelFilters(values as SalesChannel[]),
                  disableSearch: true,
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
                {
                  placeholder: getFilterPlaceholder('billingCycle'),
                  options: priceGroupBillingCycleOptions,
                  value: priceGroupBillingCycleFilter,
                  onChange: setPriceGroupBillingCycleFilter,
                  disableSearch: true,
                },
                {
                  placeholder: getFilterPlaceholder('lix'),
                  options: priceGroupExperimentOptions,
                  value: priceGroupExperimentFilter,
                  onChange: setPriceGroupExperimentFilter,
                  dropdownStyle: { minWidth: '320px' },
                },
                {
                  placeholder: getFilterPlaceholder('status'),
                  options: priceGroupStatusOptions,
                  multiSelect: true,
                  multiValue: priceGroupStatusFilters,
                  onMultiChange: (values: string[]) => setPriceGroupStatusFilters(values as any[]),
                  disableSearch: true,
                  // Required for TypeScript interface compatibility
                  value: null,
                  onChange: () => {},
                },
              ]}
              onClearAll={priceViewMode === 'pricePoints'
                ? clearAllPricePointFilters 
                : clearAllPriceGroupFilters}
              viewOptions={{
                viewMode: {
                  value: priceViewMode,
                  setter: handlePriceViewModeChange,
                  options: [
                    { key: 'price', label: 'View by price', icon: <Rows2 size={20} /> },
                    { key: 'pricePoints', label: 'View by price points', icon: <Rows4 size={20} /> }
                  ],
                  storageKey: 'priceViewMode'
                },
                ...(priceViewMode === 'pricePoints' ? {
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
                })
              }}
              displayMode="inline"
              rightActions={[
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
            {priceViewMode === 'pricePoints' ? (
              <div style={{ marginTop: '16px' }}>
                <Table
                  size="small"
                  columns={flattenedPricePointColumns}
                  dataSource={flattenedPricePointDataSource}
                  rowKey={record => ('isGroupHeader' in record ? record.key : `${record.priceGroupId}-${record.pricePoint.id}`)}
                  pagination={false}
                  scroll={{ x: 'max-content' }}
                  rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
                  components={{
                    body: {
                      row: (props: any) => {
                        if (props.children[0]?.props?.record?.isGroupHeader) {
                          const { title, count, groupKey } = props.children[0].props.record;
                          const isExpanded = expandedPricePointGroups.includes(groupKey);
                          return (
                            <tr {...props} className="ant-table-row-group-header">
                              <td colSpan={flattenedPricePointColumns.length} style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
                                <GroupHeader 
                                  title={title}
                                  count={count}
                                  contextType="price points"
                                  isExpanded={isExpanded}
                                  onToggle={() => handlePricePointGroupToggle(groupKey)}
                                  isExpandable={true}
                                />
                              </td>
                            </tr>
                          );
                        }
                        return <tr {...props} />;
                      },
                    },
                  }}
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
    // Attributes tab
    {
      key: 'configurations',
      label: 'Attributes',
      children: (
        <Space direction="vertical" size={48} style={{ width: '100%' }}>
          {/* General Section */}
          <PageSection title={toSentenceCase('General')}>
            <AttributeGroup>
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
    // SKUs tab (moved to be last)
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
            hideDivider={true}
        >
          <FilterBar
            useCustomFilters={true}
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
                disableSearch: true,
              },
              {
                placeholder: getFilterPlaceholder('billingCycle'),
                options: billingCycleOptions,
                value: billingCycleFilter,
                onChange: (value) => setBillingCycleFilter(value as string ?? null),
                disableSearch: true,
              },
              {
                placeholder: getFilterPlaceholder('lix'),
                options: lixKeyOptions,
                value: lixKeyFilter,
                onChange: (value) => setLixKeyFilter(value as string ?? null),
              },

              {
                placeholder: getFilterPlaceholder('status'),
                options: statusOptions,
                value: statusFilter,
                onChange: (value) => setStatusFilter(value as Status ?? null),
                disableSearch: true,
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
  ];

  // Mock translation data
  const translations = useMemo(() => {
    const mockTranslations = [
      {
        language: 'English',
        code: 'en',
        name: product?.name || '',
        description: product?.description || '',
        isOriginal: true,
      },
      {
        language: 'Chinese (Simplified)',
        code: 'zh-cn',
        name: 'LinkedIn 高级会员',
        description: '通过高级搜索、InMail消息和个人资料见解提升您的职业生涯',
      },
      {
        language: 'French',
        code: 'fr',
        name: 'LinkedIn Premium',
        description: 'Développez votre carrière avec la recherche avancée, les messages InMail et les informations sur les profils',
      },
      {
        language: 'German',
        code: 'de',
        name: 'LinkedIn Premium',
        description: 'Fördern Sie Ihre Karriere mit erweiterten Suchfunktionen, InMail-Nachrichten und Profil-Insights',
      },
      {
        language: 'Italian',
        code: 'it',
        name: 'LinkedIn Premium',
        description: 'Fai crescere la tua carriera con ricerca avanzata, messaggi InMail e approfondimenti sui profili',
      },
      {
        language: 'Japanese',
        code: 'ja',
        name: 'LinkedIn プレミアム',
        description: '高度な検索、InMailメッセージ、プロフィールインサイトでキャリアを向上させましょう',
      },
      {
        language: 'Korean',
        code: 'ko',
        name: '링크드인 프리미엄',
        description: '고급 검색, InMail 메시지, 프로필 인사이트로 경력을 향상시키세요',
      },
      {
        language: 'Portuguese',
        code: 'pt',
        name: 'LinkedIn Premium',
        description: 'Impulsione sua carreira com pesquisa avançada, mensagens InMail e insights de perfil',
      },
      {
        language: 'Spanish',
        code: 'es',
        name: 'LinkedIn Premium',
        description: 'Impulsa tu carrera con búsqueda avanzada, mensajes InMail e insights de perfiles',
      },
    ];

    // Sort non-English languages alphabetically
    const english = mockTranslations.find(t => t.isOriginal);
    const others = mockTranslations.filter(t => !t.isOriginal).sort((a, b) => a.language.localeCompare(b.language));
    
    return english ? [english, ...others] : others;
  }, [product?.name, product?.description]);

  // Helper function to sort billing cycles in consistent order
  const sortBillingCycles = (cycles: BillingCycle[]): BillingCycle[] => {
    const order: BillingCycle[] = ['Monthly', 'Quarterly', 'Annual'];
    return cycles.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  };

  // Group billing cycles by channel from SKU data
  const channelBillingGroups = product.skus.reduce((groups, sku) => {
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



  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="Product"
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>{product.name}</span>
            {product.isBundle && (
              <Tag>Bundle</Tag>
            )}
          </div>
        }
        tagContent={<StatusTag status={product.status} variant="small" />}
        rightAlignedId={product.id}
        channelBillingGroups={channelBillingGroups}
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

      {/* Translations Drawer */}
      <Drawer
        title="Product Translations"
        placement="right"
        width={600}
        onClose={() => setTranslationsDrawerOpen(false)}
        open={translationsDrawerOpen}
        zIndex={1050}
      >
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          {translations.map((translation, index) => (
            <div key={translation.code}>
              {/* Language header */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                <Typography.Text strong style={{ fontSize: '14px' }}>
                  {translation.language}
                </Typography.Text>
                {translation.isOriginal && (
                  <Tag color="blue">Original</Tag>
                )}
              </div>
              
              {/* Name field */}
              <div style={{ marginBottom: '12px' }}>
                <Typography.Text style={{ 
                  fontSize: '13px', 
                  letterSpacing: '0.1px', 
                  color: token.colorTextSecondary 
                }}>
                  Name:
                </Typography.Text>
                <div style={{ marginTop: '2px' }}>
                  <Typography.Text style={{ fontSize: '13px' }}>
                    {translation.name}
                  </Typography.Text>
                </div>
              </div>
              
              {/* Description field */}
              <div style={{ marginBottom: '24px' }}>
                <Typography.Text style={{ 
                  fontSize: '13px', 
                  letterSpacing: '0.1px', 
                  color: token.colorTextSecondary 
                }}>
                  Description:
                </Typography.Text>
                <div style={{ marginTop: '2px' }}>
                  <Typography.Text style={{ fontSize: '13px', lineHeight: '1.5' }}>
                    {translation.description}
                  </Typography.Text>
                </div>
              </div>
              
              {/* Divider between languages (except last one) */}
              {index < translations.length - 1 && (
                <div style={{ 
                  borderBottom: `1px solid ${token.colorBorder}`, 
                  marginBottom: '24px'
                }} />
              )}
            </div>
          ))}
        </Space>
      </Drawer>
    </Space>
  );
};

export default ProductDetail; 