import React, { useState, useMemo, useEffect } from 'react';
import { Space } from 'antd';
import { useParams } from 'react-router-dom';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { mockProducts } from '../utils/mock-data';
import { loadProductsWithAccurateCounts } from '../utils/demoDataLoader';
import type { Status, LOB, SalesChannel, ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import { useProductFilters } from '../hooks/useProductFilters';
import { PRODUCT_GROUP_BY_OPTIONS, PRODUCT_SORT_OPTIONS, getFilterPlaceholder } from '../utils/tableConfigurations';
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
  const { setFolderName } = useBreadcrumb();
  const [enhancedProducts, setEnhancedProducts] = useState(mockProducts);

  // Convert URL folder name to actual folder name for filtering
  const currentFolder = folderName ? urlToFolderName(folderName) : null;

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

  // Update column visibility when folder context changes
  useEffect(() => {
    setVisibleColumns(prev => ({
      ...prev,
      folder: !currentFolder, // Hide folder column when in a specific folder (redundant)
    }));
  }, [currentFolder]);

  // Column visibility state for ProductListTable
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    id: true,       // Always visible (required)
    name: true,     // Always visible (required)
    folder: !currentFolder, // Hide folder column when in a specific folder (redundant)
    channel: true,  // Toggleable
    status: true,   // Toggleable
  });

  // Column order state for ProductListTable
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>([
    'id',
    'name',
    'folder',
    'channel',
    'status'
  ]);

  // Column configuration for ProductListTable - exclude folder column when in specific folder
  const columnOptions: ColumnConfig[] = [
    { key: 'id', label: 'Product ID', required: true },
    { key: 'name', label: 'Name', required: true },
    // Only show folder as toggleable when viewing all products
    ...(currentFolder ? [] : [{ key: 'folder', label: 'Folder', required: false }]),
    { key: 'channel', label: 'Channel', required: false },
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
  } = useProductFilters(enhancedProducts, null); // No LOB filtering - using folder-based navigation

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
    return PRODUCT_GROUP_BY_OPTIONS;
  }, [currentFolder]);



  // Remove this useEffect since we no longer use folder tabs

  const clearAllProductFilters = () => {
    setStatusFilter(null);
    setStatusFilters([]);
    setChannelFilters([]);
    setLobFilter(null);
    if (!currentFolder) {
      setFolderFilter(null);
    }
    // Reset columns to show all toggleable columns
    const resetColumns: ColumnVisibility = {};
    columnOptions.forEach(col => {
      resetColumns[col.key] = true;
    });
    setVisibleColumns(resetColumns);
    // Reset column order to original order
    const originalOrder = columnOptions.map(col => col.key);
    setColumnOrder(originalOrder);
  };

  // Generate page title and subtitle based on current context
  const pageTitle = currentFolder ? currentFolder : 'All products';
  const pageSubtitle = `${productCount} product${productCount !== 1 ? 's' : ''}`;

  return (
    <div style={{ width: '100%' }}>
      {/* Header and Search Area */}
      <div style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <PageHeader
            title={pageTitle}
            subtitle={pageSubtitle}
          />

          <FilterBar
            displayMode="inline"
            useCustomFilters={true}
            search={{
              placeholder: "Search by Name, ID, or Folder...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllProductFilters}
            filters={[
              // Only show LOB and folder dropdowns when on All Products page
              ...(!currentFolder ? [
                {
                  placeholder: getFilterPlaceholder('lob'),
                  options: dynamicLobOptions,
                  value: lobFilter,
                  onChange: (value: string | null) => setLobFilter((value as LOB) ?? null),
                  disableSearch: true,
                },
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