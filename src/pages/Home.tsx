import React, { useState, useMemo, useEffect } from 'react';
import { Space } from 'antd';
import { Folder } from 'lucide-react';
import { useParams, useLocation } from 'react-router-dom';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { mockProducts } from '../utils/mock-data';
import { loadProductsWithAccurateCounts } from '../utils/demoDataLoader';
import type { Status, LOB, SalesChannel, ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import { useProductFilters } from '../hooks/useProductFilters';
import { PRODUCT_GROUP_BY_OPTIONS, PRODUCT_SORT_OPTIONS, getFilterPlaceholder, DEFAULT_PRODUCT_COLUMNS } from '../utils/tableConfigurations';
import {
  PageHeader,
  ProductListTable,
  GroupedProductListTable,
  FilterBar,
} from '../components';



// Helper function to convert URL folder names back to actual folder names
const urlToFolderName = (urlFolder: string): string => {
  // Handle special cases where folder names have specific capitalization
  const specialCases: Record<string, string> = {
    'premium-core': 'Premium Core',
    'premium-multiseat': 'Premium Multiseat',
    'premium-company-page': 'Premium Company Page',
    'premium-small-business': 'Premium Small Business',
    'premium-entitlements': 'Premium Entitlements',
    'career-page': 'Career Page',
    'sales-navigator': 'Sales Navigator',
    'sales-insights': 'Sales Insights',
    'all-lms-products': 'All LMS Products'
  };
  
  // Check if it's a special case first
  if (specialCases[urlFolder]) {
    return specialCases[urlFolder];
  }
  
  // Default behavior for other cases
  return urlFolder.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};

const Home: React.FC = () => {
  const { folderName } = useParams<{ folderName?: string }>();
  const location = useLocation();
  const { setFolderName } = useBreadcrumb();
  const [enhancedProducts, setEnhancedProducts] = useState(mockProducts);

  // Convert URL folder name to actual folder name for filtering
  const currentFolder = folderName ? urlToFolderName(folderName) : null;
  
  // Extract LOB from URL for LOB-specific pages
  const currentLob: LOB | null = useMemo(() => {
    const { pathname } = location;
    if (pathname === '/lms-products') return 'LMS';
    if (pathname === '/lss-products') return 'LSS';
    if (pathname === '/lts-products') return 'LTS';
    if (pathname === '/premium-products') return 'Premium';
    if (pathname === '/other-products') return 'Other';
    return null;
  }, [location.pathname]);

  // Load enhanced data on component mount
  useEffect(() => {
    loadProductsWithAccurateCounts().then(setEnhancedProducts);
  }, []);

  // Set folder name in breadcrumb context
  useEffect(() => {
    if (currentFolder) {
      setFolderName(currentFolder);
    } else {
      setFolderName(null);
    }
    
    // Clean up when component unmounts
    return () => {
      setFolderName(null);
    };
  }, [currentFolder, setFolderName]);

  // Update column visibility when folder/LOB context changes
  useEffect(() => {
    setVisibleColumns(prev => ({
      ...prev,
      customers: true, // Always show customers column
      folder: !currentFolder && !currentLob, // Hide folder column when in a specific folder or LOB (redundant)
      status: true, // Always show status column
    }));
  }, [currentFolder, currentLob]);

  // Column visibility state for ProductListTable
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,       // Always visible (required)
    name: true,     // Always visible (required)
    customers: true, // Show customers column by default
    folder: !currentFolder && !currentLob, // Hide folder column when in a specific folder or LOB (redundant)
    channel: true,  // Toggleable
    status: true,   // Show status column by default
  });

  // Column order state for ProductListTable
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>(DEFAULT_PRODUCT_COLUMNS);

  // Column configuration for ProductListTable - exclude folder column when in specific folder or LOB
  const columnOptions: ColumnConfig[] = [
    { key: 'id', label: 'Product ID', required: true },
    { key: 'name', label: 'Name', required: true },
    // Only show folder as toggleable when viewing all products (not in folder or LOB view)
    ...(currentFolder || currentLob ? [] : [{ key: 'folder', label: 'Folder', required: false }]),
    { key: 'channel', label: 'Channel', required: false },
    { key: 'customers', label: 'Customers', required: false },
    { key: 'status', label: 'Status', required: false },
  ];

  const {
    setSearchQuery,
    setStatusFilter,
    statusFilters,
    setStatusFilters,
    channelFilters,
    setChannelFilters,
    lobFilter,
    setLobFilter,
    folderFilter,
    setFolderFilter,
    groupBy,
    setGroupBy,
    sortOrder,
    setSortOrder,
    sortedProducts,
    groupedProducts,
    productCount,
    folderOptions,
    dynamicStatusOptions,
    dynamicLobOptions,
    dynamicChannelOptions,
  } = useProductFilters(enhancedProducts, currentLob); // Pass current LOB for filtering

  // Set folder filter based on URL parameter
  useEffect(() => {
    if (currentFolder) {
      setFolderFilter(currentFolder);
    } else {
      setFolderFilter(null);
    }
  }, [currentFolder, setFolderFilter]);

  // Update group by options based on current context
  const availableGroupByOptions = useMemo(() => {
    if (currentFolder) {
      // On folder pages, remove LOB and Folder grouping since we're already in a specific folder
      return PRODUCT_GROUP_BY_OPTIONS.filter(option => option !== 'LOB' && option !== 'Folder');
    }
    if (currentLob) {
      // On LOB pages, remove LOB grouping since we're already in a specific LOB, but keep Folder
      return PRODUCT_GROUP_BY_OPTIONS.filter(option => option !== 'LOB');
    }
    return PRODUCT_GROUP_BY_OPTIONS;
  }, [currentFolder, currentLob]);



  // Remove this useEffect since we no longer use folder tabs

  const clearAllProductFilters = () => {
    setStatusFilter(null);
    setStatusFilters([]);
    setChannelFilters([]);
    setLobFilter(null);
    if (!currentFolder) {
      setFolderFilter(null);
    }
    // Reset columns to proper defaults
    const resetColumns: ColumnVisibility = {
      id: true,       // Always visible (required)
      name: true,     // Always visible (required)
      folder: !currentFolder, // Hide folder column when in a specific folder
      channel: true,  // Toggleable, default visible
      status: true,   // Show status column by default
      customers: true, // Show customers column by default
    };
    setVisibleColumns(resetColumns);
    // Reset column order to default order
    setColumnOrder(DEFAULT_PRODUCT_COLUMNS);
  };

  // Generate page title and subtitle based on current context
  const pageTitle = currentFolder ? currentFolder : currentLob ? `${currentLob} products` : 'All products';
  const pageSubtitle = `${productCount} product${productCount !== 1 ? 's' : ''}`;

  return (
    <div style={{ width: '100%' }}>
      {/* Header and Search Area */}
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <PageHeader
            {...(currentFolder && {
              entityType: "Folder",
              entityIcon: <Folder size={12} />
            })}
            {...(currentLob && {
              entityType: "Folder",
              entityIcon: <Folder size={12} />
            })}
            title={pageTitle}
            subtitle={pageSubtitle}
          />

          <FilterBar
            useCustomFilters={true}
            search={{
              placeholder: "Search by Name, ID, or Folder...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllProductFilters}
            filters={[
              // LOB filter: Only show when on All Products page (not in specific LOB or folder)
              ...(!currentFolder && !currentLob ? [
                {
                  placeholder: getFilterPlaceholder('lob'),
                  options: dynamicLobOptions,
                  value: lobFilter,
                  onChange: (value: string | null) => setLobFilter((value as LOB) ?? null),
                  disableSearch: true,
                },
              ] : []),
              // Folder filter: Show on All Products and LOB pages, but not on specific folder pages
              ...(!currentFolder ? [
                {
                  placeholder: getFilterPlaceholder('folder'),
                  options: folderOptions,
                  value: folderFilter,
                  onChange: (value: string | null) => setFolderFilter(value ?? null),
                  showOptionTooltip: true,
                  dropdownStyle: { width: '240px' },
                }
              ] : []),
              {
                placeholder: getFilterPlaceholder('channel'),
                options: dynamicChannelOptions,
                multiSelect: true,
                multiValue: channelFilters,
                onMultiChange: (values: string[]) => setChannelFilters(values as SalesChannel[]),
                disableSearch: true,
                // Required for TypeScript interface compatibility
                value: null,
                onChange: () => {},
              },
              {
                placeholder: getFilterPlaceholder('status'),
                options: dynamicStatusOptions,
                multiSelect: true,
                multiValue: statusFilters,
                onMultiChange: (values: string[]) => setStatusFilters(values as Status[]),
                disableSearch: true,
                // Required for TypeScript interface compatibility
                value: null,
                onChange: () => {},
              },
            ]}
            viewOptions={{
              groupBy: {
                value: groupBy,
                setter: setGroupBy,
                options: availableGroupByOptions,
                disabled: false, // No longer disable based on folder tabs
              },
              sortOrder: {
                value: sortOrder,
                setter: setSortOrder,
                options: PRODUCT_SORT_OPTIONS,
              },
              columnOptions,
              visibleColumns,
              setVisibleColumns,
              columnOrder,
              setColumnOrder,
              defaultVisibleColumns: {
                id: true,       // Always visible (required)
                name: true,     // Always visible (required)
                folder: !currentFolder, // Hide folder column when in a specific folder
                channel: true,  // Toggleable, default visible
                status: true,   // Show status column by default
              },
              defaultColumnOrder: DEFAULT_PRODUCT_COLUMNS,
            }}
          />
        </Space>
      </div>

      {/* Content Area - closer to filters */}
      <div>
        {groupedProducts ? (
          <GroupedProductListTable 
            groupedProducts={groupedProducts} 
            visibleColumns={visibleColumns}
            columnOrder={columnOrder}
          />
        ) : (
          <ProductListTable 
            products={sortedProducts} 
            visibleColumns={visibleColumns}
            columnOrder={columnOrder}
          />
        )}
      </div>
    </div>
  );
};

export default Home; 