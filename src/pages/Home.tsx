import React, { useState, useMemo, useEffect } from 'react';
import { Space, Tabs } from 'antd';
import { mockProducts } from '../utils/mock-data';
import type { LOB, Status } from '../utils/types';
import { useProductFilters } from '../hooks/useProductFilters';
import {
  PageHeader,
  GroupedProductList,
  ProductList,
  ProductListTable,
  GroupedProductListTable,
  CountTag,
  FilterBar,
  FolderTabs
} from '../components';
import type { ViewMode, SelectOption } from '../components';

const LOB_OPTIONS: LOB[] = [...new Set(mockProducts.map(p => p.lob))];
const STATUS_OPTIONS: Status[] = ['Active', 'Legacy', 'Retired'];
const GROUP_BY_OPTIONS = ['None', 'LOB', 'Status', 'Folder'];
const SORT_OPTIONS = ['None', 'Name (A-Z)', 'Name (Z-A)'];


const STATUS_SELECT_OPTIONS: SelectOption[] = STATUS_OPTIONS.map(status => ({ label: status, value: status }));

const Home: React.FC = () => {
  const [lobFilter, setLobFilter] = useState<LOB | null>(null);
  const [activeLobTab, setActiveLobTab] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const {
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    folderFilter,
    setFolderFilter,
    folderTabFilter,
    setFolderTabFilter,
    groupBy,
    setGroupBy,
    sortOrder,
    setSortOrder,
    sortedProducts,
    groupedProducts,
    productCount,
    folderOptions,
    folderTabsData,
  } = useProductFilters(mockProducts, lobFilter);

  const lobCounts = useMemo(() => {
    const counts: Record<string, number> = { All: mockProducts.length };
    LOB_OPTIONS.forEach(lob => {
      counts[lob] = mockProducts.filter(p => p.lob === lob).length;
    });
    return counts;
  }, []);

  const lobTabOptions = useMemo(() => {
    return [
      { 
        key: 'All', 
        label: (
          <Space>
            <span>All</span>
            <CountTag count={lobCounts.All} />
          </Space>
        )
      },
      ...LOB_OPTIONS.map(lob => ({ 
        key: lob, 
        label: (
          <Space>
            <span>{lob}</span>
            <CountTag count={lobCounts[lob]} />
          </Space>
        )
      }))
    ];
  }, [lobCounts]);

  useEffect(() => {
    if (viewMode === 'list') {
      setGroupBy('None');
    }
  }, [viewMode, setGroupBy]);

  useEffect(() => {
    if (folderTabFilter !== 'All') {
      setGroupBy('None');
    }
  }, [folderTabFilter, setGroupBy]);

  const handleLobChange = (key: string) => {
    setActiveLobTab(key);
    setLobFilter(key === 'All' ? null : (key as LOB));
    setFolderFilter(null);
  };

  const handleFolderTabChange = (folder: string) => {
    setFolderTabFilter(folder);
  };

  const clearAllProductFilters = () => {
    setStatusFilter(null);
    setFolderFilter(null);
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        title="Product Catalog"
        subtitle={`${productCount} product${productCount !== 1 ? 's' : ''} found`}
      />

      <Tabs
        activeKey={activeLobTab}
        onChange={handleLobChange}
        items={lobTabOptions}
        size="large"
      />

      {/* Show folder tabs when a specific LOB is selected */}
      {lobFilter && folderTabsData.length > 0 && (
        <FolderTabs
          folders={folderTabsData}
          activeFolder={folderTabFilter}
          onFolderChange={handleFolderTabChange}
          lob={lobFilter}
        />
      )}

      <FilterBar
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
          // Only show folder dropdown when LOB is "All"
          ...(lobFilter === null ? [{
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
            options: GROUP_BY_OPTIONS,
            disabled: folderTabFilter !== 'All',
          },
          sortOrder: {
            value: sortOrder,
            setter: setSortOrder,
            options: SORT_OPTIONS,
          },
        }}
        viewMode={{
          value: viewMode,
          setter: setViewMode,
        }}
      />

      {viewMode === 'list' ? (
        groupedProducts ? (
          <GroupedProductListTable groupedProducts={groupedProducts} />
        ) : (
          <ProductListTable products={sortedProducts} />
        )
      ) : groupedProducts ? (
        <GroupedProductList groupedProducts={groupedProducts} />
      ) : (
        <ProductList products={sortedProducts} />
      )}
    </Space>
  );
};

export default Home; 