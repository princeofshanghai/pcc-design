import React from 'react';
import { Space, theme, Checkbox } from 'antd';
import { Calendar } from 'lucide-react';
import CustomFilterButton from '../filters/CustomFilterButton';

interface ChartControlsProps {
  chartType: 'volume' | 'calculator' | 'comparison';
  // Volume & Calculator controls
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  availableCurrencies?: string[];
  // Volume specific - tier filtering (single select)
  selectedTier?: string;
  onTierChange?: (tier: string) => void;
  availableTiers?: string[];
  // Calculator specific - tier filtering (single select)
  selectedCalculatorTier?: string;
  onCalculatorTierChange?: (tier: string) => void;
  // Comparison specific - currency filtering (multi-select, non-USD)
  selectedComparisonCurrencies?: string[];
  onComparisonCurrenciesChange?: (currencies: string[]) => void;
  availableComparisonCurrencies?: string[];
  selectedComparisonTier?: string;
  onComparisonTierChange?: (tier: string) => void;
  // Volume specific - line overlay
  showLineOverlay?: boolean;
  onLineOverlayChange?: (show: boolean) => void;
  // All chart types
  selectedValidity?: string;
  onValidityChange?: (validity: string) => void;
  validityOptions?: Array<{ label: string; value: string }>;
  // Calculator specific - simplified (no seat input)
  // Comparison specific - no seat range needed
}

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  selectedCurrency,
  onCurrencyChange,
  availableCurrencies = [],
  selectedTier = '',
  onTierChange,
  availableTiers = [],
  selectedCalculatorTier = '',
  onCalculatorTierChange,
  selectedComparisonCurrencies = [],
  onComparisonCurrenciesChange,
  availableComparisonCurrencies = [],
  selectedComparisonTier = '',
  onComparisonTierChange,
  showLineOverlay = false,
  onLineOverlayChange,
  selectedValidity,
  onValidityChange,
  validityOptions = [],
}) => {
  const { token } = theme.useToken();

  // Minimal styles for remaining custom controls
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('remaining-chart-controls-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'remaining-chart-controls-styles';
      styleElement.textContent = `
        .chart-control-button {
          transition: all 0.2s ease;
          border: 1px solid ${token.colorBorder} !important;
        }
        
        .chart-control-button:hover:not(:disabled) {
          border-color: ${token.colorPrimary} !important;
          color: ${token.colorPrimary} !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [token.colorPrimary, token.colorBorder]);



  // Currency dropdown - using CustomFilterButton for consistency
  const CurrencyControl = () => {
    if (!onCurrencyChange || availableCurrencies.length === 0) return null;

    const currencyOptions = availableCurrencies.map(currency => ({
      label: currency,
      value: currency
    }));

    return (
      <CustomFilterButton
        placeholder="Currency"
        options={currencyOptions}
        value={selectedCurrency || null}
        onChange={(value) => value && onCurrencyChange?.(value)}
        disableSearch={false}
        preventDeselection={true}
        hideClearButton={true}
        noXIcon={true}
        customDisplayValue={(value) => {
          if (!value) return 'Currency';
          return { label: 'Currency:', values: value };
        }}
        style={{ minWidth: '90px' }}
      />
    );
  };

  // Tier dropdown for volume charts - single select
  const VolumeTierControl = () => {
    if (!onTierChange || availableTiers.length === 0) return null;

    const tierOptions = availableTiers.map(tier => ({
      label: tier,
      value: tier
    }));

    return (
      <CustomFilterButton
        placeholder="Tier"
        options={tierOptions}
        value={selectedTier || null}
        onChange={(value) => value && onTierChange(value)}
        disableSearch={false}
        preventDeselection={true}
        hideClearButton={true}
        noXIcon={true}
        customDisplayValue={(value) => {
          if (!value) return 'Tier';
          return { label: 'Tier:', values: value };
        }}
        style={{ minWidth: '100px' }}
      />
    );
  };

  // Tier dropdown for calculator charts - single select  
  const CalculatorTierControl = () => {
    if (!onCalculatorTierChange || availableTiers.length === 0) return null;

    const tierOptions = availableTiers.map(tier => ({
      label: tier,
      value: tier
    }));

    return (
      <CustomFilterButton
        placeholder="Tier"
        options={tierOptions}
        value={selectedCalculatorTier || null}
        onChange={(value) => value && onCalculatorTierChange(value)}
        disableSearch={false}
        preventDeselection={true}
        hideClearButton={true}
        noXIcon={true}
        customDisplayValue={(value) => {
          if (!value) return 'Tier';
          return { label: 'Tier:', values: value };
        }}
        style={{ minWidth: '100px' }}
      />
    );
  };

  // Currency dropdown for comparison charts - multi-select (non-USD)
  const ComparisonCurrencyControl = () => {
    if (!onComparisonCurrenciesChange || availableComparisonCurrencies.length === 0) return null;

    const currencyOptions = availableComparisonCurrencies.map(currency => ({
      label: currency,
      value: currency
    }));

    return (
      <CustomFilterButton
        placeholder="Currencies"
        options={currencyOptions}
        multiSelect={true}
        multiValue={selectedComparisonCurrencies}
        onMultiChange={onComparisonCurrenciesChange}
        disableSearch={false}
        useDropdownArrow={true}
        noXIcon={true}
        customDisplayValue={(_, multiValue) => {
          if (!multiValue || multiValue.length === 0) return 'Currencies';
          if (multiValue.length === availableComparisonCurrencies.length) return { label: 'Currencies:', values: 'All' };
          if (multiValue.length === 1) return { label: 'Currencies:', values: multiValue[0] };
          return { label: 'Currencies:', values: `${multiValue[0]} +${multiValue.length - 1} more` };
        }}
        style={{ minWidth: '120px' }}
      />
    );
  };

  // Tier dropdown for comparison charts - single select  
  const ComparisonTierControl = () => {
    if (!onComparisonTierChange || availableTiers.length === 0) return null;

    const tierOptions = availableTiers.map(tier => ({
      label: tier,
      value: tier
    }));

    return (
      <CustomFilterButton
        placeholder="Tier"
        options={tierOptions}
        value={selectedComparisonTier || null}
        onChange={(value) => value && onComparisonTierChange(value)}
        disableSearch={false}
        preventDeselection={true}
        hideClearButton={true}
        noXIcon={true}
        customDisplayValue={(value) => {
          if (!value) return 'Tier';
          return { label: 'Tier:', values: value };
        }}
        style={{ minWidth: '100px' }}
      />
    );
  };

  // Validity period dropdown - using CustomFilterButton for consistency
  const ValidityControl = () => {
    if (!onValidityChange || validityOptions.length === 0) return null;

    // Filter out "All periods" option for chart controls and remove counts
    const filteredValidityOptions = validityOptions
      .filter(opt => opt.value !== 'All periods')
      .map(opt => ({
        label: opt.label.replace(/\s*\(\d+\)$/, ''), // Remove count numbers like "(5)"
        value: opt.value
      }));

    return (
      <CustomFilterButton
        placeholder="Period"
        options={filteredValidityOptions}
        value={selectedValidity || null}
        onChange={(value) => value && onValidityChange?.(value)}
        disableSearch={false}
        preventDeselection={true}
        hideClearButton={true}
        noXIcon={true}
        icon={<Calendar size={12} />}
        customDisplayValue={(value) => value || 'Period'}
        style={{ minWidth: '140px' }}
      />
    );
  };





  // Line overlay checkbox for volume charts
  const LineOverlayControl = () => {
    if (chartType !== 'volume' || !onLineOverlayChange) return null;

    return (
      <Checkbox
        checked={showLineOverlay}
        onChange={(e) => onLineOverlayChange(e.target.checked)}
        style={{
          fontFamily: token.fontFamily,
          fontSize: token.fontSize,
          color: token.colorText,
        }}
      >
        Show trend lines
      </Checkbox>
    );
  };

  // Render controls based on chart type
  const renderControls = () => {
    switch (chartType) {
      case 'volume':
        return (
          <Space size={8}>
            <LineOverlayControl />
            <CurrencyControl />
            {/* Only render TierControl if we have tiers and the callback */}
            {onTierChange && availableTiers.length > 0 && <VolumeTierControl />}
            <ValidityControl />
          </Space>
        );
      
      case 'calculator':
        return (
          <Space size={8}>
            <CurrencyControl />
            {/* Only render TierControl if we have tiers and the callback */}
            {onCalculatorTierChange && availableTiers.length > 0 && <CalculatorTierControl />}
            <ValidityControl />
          </Space>
        );
      
      case 'comparison':
        return (
          <Space size={8}>
            <ComparisonCurrencyControl />
            {/* Only render TierControl if we have tiers and the callback */}
            {onComparisonTierChange && availableTiers.length > 0 && <ComparisonTierControl />}
            <ValidityControl />
          </Space>
        );
      
      default:
        return null;
    }
  };

  return <>{renderControls()}</>;
};

export default ChartControls;
