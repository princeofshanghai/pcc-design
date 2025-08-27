import React, { useState, useMemo } from 'react';
import { Tabs, Spin } from 'antd';
import type { PricePoint } from '../../utils/types';
import type { ColumnVisibility, ColumnOrder } from '../../utils/types';
import PricePointTable from './PricePointTable';
import PricePointMatrix from './PricePointMatrix';
import VolumeDiscountChart from './VolumeDiscountChart';
import { FilterBar } from '../index';
import { useFieldPricingFilters } from '../../hooks/useFieldPricingFilters';
import { getFilterPlaceholder } from '../../utils/tableConfigurations';



interface FieldPricingViewProps {
  pricePoints: PricePoint[];
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
  sortOrder?: string;
  isTaxInclusive?: boolean;
}

const FieldPricingView: React.FC<FieldPricingViewProps> = ({
  pricePoints,
  visibleColumns,
  columnOrder,
  sortOrder,
  isTaxInclusive
}) => {


  console.log('🔧 FieldPricingView - pricePoints received:', pricePoints?.length || 0, 'total');

  // Use field pricing filters hook with error handling
  let filterData;
  try {
    filterData = useFieldPricingFilters(pricePoints || []);
  } catch (error) {
    console.error('❌ FieldPricingView - Filter hook error:', error);
    // Fallback to basic data
    filterData = {
      currencyFilters: [],
      setCurrencyFilters: () => {},
      tierFilters: [],
      setTierFilters: () => {},
      validityFilter: '',
      setValidityFilter: () => {},
      currencyOptions: [],
      tierOptions: [],
      validityOptions: [],
      filteredPricePoints: pricePoints || [],
    };
  }

  const {
    currencyFilters,
    setCurrencyFilters,
    tierFilters,
    setTierFilters,
    validityFilter,
    setValidityFilter,
    currencyOptions,
    tierOptions,
    validityOptions,
    filteredPricePoints,
  } = filterData;

  // Track active tab state
  const [activeTab, setActiveTab] = useState<string>('matrix');
  const [tabLoading, setTabLoading] = useState<boolean>(false);

  // PERFORMANCE: Only filter expired price points when needed for matrix/chart tabs
  const matrixPricePoints = useMemo(() => {
    if (activeTab === 'detailed') return filteredPricePoints; // Detailed view shows all
    return filteredPricePoints.filter(point => point.status !== 'Expired');
  }, [filteredPricePoints, activeTab]);

  // Prepare currencies for VolumeDiscountChart - must be outside conditional rendering
  const chartCurrencies = useMemo(() => 
    currencyOptions.map(option => option.value), 
    [currencyOptions]
  );

  // Create filter configurations based on active tab
  const getFilterConfig = () => {
    const baseFilters = [
      {
        placeholder: getFilterPlaceholder('validity'),
        options: validityOptions.filter(option => option.value !== 'All periods'),
        multiSelect: false,
        value: validityFilter,
        onChange: (value: string | null) => {
          if (value) {
            setValidityFilter(value);
          } else {
            // Reset to newest period when cleared
            const newestPeriod = validityOptions.find(opt => opt.value !== 'All periods')?.value;
            if (newestPeriod) {
              setValidityFilter(newestPeriod);
            }
          }
        },
        disableSearch: true,
        excludeFromClearAll: true,
        hideClearButton: true,
        preventDeselection: true,
        multiValue: [],
        onMultiChange: () => {},
      },
      {
        placeholder: getFilterPlaceholder('currency'),
        options: currencyOptions,
        multiSelect: true,
        multiValue: currencyFilters,
        onMultiChange: (values: string[]) => setCurrencyFilters(values),
        value: null,
        onChange: () => {},
      },
      {
        placeholder: getFilterPlaceholder('pricingTier'),
        options: tierOptions,
        multiSelect: true,
        multiValue: tierFilters,
        onMultiChange: (values: string[]) => setTierFilters(values),
        disableSearch: true,
        value: null,
        onChange: () => {},
      },
    ];

    return baseFilters;
  };

  const clearFilters = () => {
    setCurrencyFilters([]);
    setTierFilters([]);
  };

  // Handle tab changes with loading state
  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setTabLoading(true);
      // Use setTimeout to allow UI to update before heavy computation
      setTimeout(() => {
        setActiveTab(newTab);
        setTabLoading(false);
      }, 50);
    }
  };

  // PERFORMANCE: Lazy render tab content - only render the active tab
  const renderTabContent = () => {
    if (tabLoading) {
      return (
        <div style={{ 
          paddingTop: '64px', 
          textAlign: 'center',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Spin size="large" tip="Loading tab content..." />
        </div>
      );
    }

    return (
      <div style={{ paddingTop: '16px' }}>
        {activeTab === 'matrix' && (
          <PricePointMatrix 
            pricePoints={matrixPricePoints}
            isTaxInclusive={isTaxInclusive}
          />
        )}

        {activeTab === 'charts' && (
          <VolumeDiscountChart 
            pricePoints={matrixPricePoints}
            currencies={chartCurrencies}
          />
        )}

        {activeTab === 'detailed' && (
          <PricePointTable 
            pricePoints={filteredPricePoints}
            groupedPricePoints={null}
            visibleColumns={visibleColumns}
            columnOrder={columnOrder}
            sortOrder={sortOrder}
            isTaxInclusive={isTaxInclusive}
          />
        )}
      </div>
    );
  };

  return (
    <div style={{ marginTop: '16px' }}>
      {/* Tabs at the top */}
      <Tabs
        activeKey={activeTab}
        onChange={handleTabChange}
        size="large"
        items={[
          {
            key: 'matrix',
            label: 'Matrix',
          },
          {
            key: 'charts', 
            label: 'Charts',
          },
          {
            key: 'detailed',
            label: 'Details',
          },
        ]}
      />

      {/* Conditional FilterBar based on active tab */}
      {(activeTab === 'matrix' || activeTab === 'charts' || activeTab === 'detailed') && (
        <FilterBar
          useCustomFilters={true}
          displayMode="inline"
          filters={getFilterConfig()}
          onClearAll={clearFilters}
        />
      )}

      {/* Tab content */}
      {renderTabContent()}
    </div>
  );
};

export default FieldPricingView;
