import React, { useState, useMemo, useEffect } from 'react';
import { Space } from 'antd';
import { useParams } from 'react-router-dom';
import { Folder } from 'lucide-react';
import { mockProducts } from '../utils/mock-data';
import type { Status, ColumnConfig, ColumnVisibility, ColumnOrder } from '../utils/types';
import { useProductFilters } from '../hooks/useProductFilters';
import {
  PageHeader,
  GroupedProductList,
  ProductList,
  ProductListTable,
  GroupedProductListTable,
  FilterBar,
} from '../components';
import type { ViewMode, SelectOption } from '../components';

const STATUS_OPTIONS: Status[] = ['Active', 'Legacy', 'Retired'];
const GROUP_BY_OPTIONS = ['None', 'LOB', 'Status', 'Folder'];
const SORT_OPTIONS = ['None', 'Name (A-Z)', 'Name (Z-A)', 'SKUs (Low to High)', 'SKUs (High to Low)'];

const STATUS_SELECT_OPTIONS: SelectOption[] = STATUS_OPTIONS.map(status => ({ label: status, value: status }));

// Helper function to convert URL folder names back to actual folder names
const urlToFolderName = (urlFolder: string): string => {
  // Handle special cases where folder names have specific capitalization
  const specialCases: Record<string, string> = {
    'premium-core-products': 'Premium Core Products',
    'premium-multiseat-products': 'Premium Multiseat Products',
    'premium-company-page': 'Premium Company Page',
    'premium-small-business': 'Premium Small Business',
    'premium-entitlements': 'Premium Entitlements',
    'career-page': 'Career Page',
    'all-lss-products': 'All LSS Products',
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
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  // Convert URL folder name to actual folder name for filtering
  const currentFolder = folderName ? urlToFolderName(folderName) : null;

  // Column visibility state for ProductListTable
  const [visibleColumns, setVisibleColumns] = useState<ColumnVisibility>({
    name: true,     // Always visible (required)
    lob: true,      // Toggleable
    folder: true,   // Toggleable
    skus: true,     // Toggleable
    status: true,   // Toggleable
  });

  // Column order state for ProductListTable
  const [columnOrder, setColumnOrder] = useState<ColumnOrder>([
    'name',
    'lob',
    'folder',
    'skus',
    'status'
  ]);

  // Column configuration for ProductListTable
  const columnOptions: ColumnConfig[] = [
    { key: 'name', label: 'Name', required: true },
    { key: 'lob', label: 'LOB', required: false },
    { key: 'folder', label: 'Folder', required: false },
    { key: 'skus', label: 'SKUs', required: false },
    { key: 'status', label: 'Status', required: false },
  ];

  const {
    setSearchQuery,
    statusFilter,
    setStatusFilter,
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
  } = useProductFilters(mockProducts, null); // No LOB filtering - using folder-based navigation

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
      return GROUP_BY_OPTIONS.filter(option => option !== 'LOB' && option !== 'Folder');
    }
    return GROUP_BY_OPTIONS;
  }, [currentFolder]);



  // Remove this useEffect since we no longer use folder tabs

  const clearAllProductFilters = () => {
    setStatusFilter(null);
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
  const pageSubtitle = `${productCount} product${productCount !== 1 ? 's' : ''} found`;

  return (
    <div style={{ width: '100%' }}>
      {/* Header and Search Area */}
      <div style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <PageHeader
            icon={currentFolder ? <Folder /> : undefined}
            iconSize={24}
            title={pageTitle}
            subtitle={pageSubtitle}
          />

          <FilterBar
            displayMode="inline"
            filterSize="large"
            search={{
              placeholder: "Search by name, ID, or folder...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllProductFilters}
            filters={[
              {
                placeholder: "All statuses",
                options: STATUS_SELECT_OPTIONS,
                value: statusFilter,
                onChange: (value) => setStatusFilter((value as Status) ?? null),
              },
              // Only show folder dropdown when on All Products page
              ...(!currentFolder ? [{
                placeholder: "All folders",
                options: folderOptions,
                value: folderFilter,
                onChange: (value: string | null) => setFolderFilter(value ?? null),
                showOptionTooltip: true,
              }] : []),
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
                options: SORT_OPTIONS,
              },
              viewMode: {
                value: viewMode,
                setter: setViewMode,
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
        {viewMode === 'list' ? (
          groupedProducts ? (
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
          )
        ) : groupedProducts ? (
          <GroupedProductList groupedProducts={groupedProducts} />
        ) : (
          <ProductList products={sortedProducts} />
        )}
      </div>
    </div>
  );
};

export default Home; 