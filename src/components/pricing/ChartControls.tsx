import React, { useState } from 'react';
import { Space, theme, Button, Dropdown, Radio, InputNumber } from 'antd';
import { ChevronDown } from 'lucide-react';
import { TAILWIND_COLORS } from '../../theme';

interface ChartControlsProps {
  chartType: 'volume' | 'calculator' | 'comparison';
  // Volume & Calculator controls
  selectedCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  availableCurrencies?: string[];
  // All chart types
  selectedValidity?: string;
  onValidityChange?: (validity: string) => void;
  validityOptions?: Array<{ label: string; value: string }>;
  // Calculator specific
  seatCount?: number;
  onSeatCountChange?: (count: number) => void;
  // Comparison specific
  selectedSeatRange?: string;
  onSeatRangeChange?: (range: string) => void;
  availableSeatRanges?: string[];
}

const ChartControls: React.FC<ChartControlsProps> = ({
  chartType,
  selectedCurrency,
  onCurrencyChange,
  availableCurrencies = [],
  selectedValidity,
  onValidityChange,
  validityOptions = [],
  seatCount,
  onSeatCountChange,
  selectedSeatRange,
  onSeatRangeChange,
  availableSeatRanges = [],
}) => {
  const { token } = theme.useToken();

  // Inject styles similar to CustomFilterButton
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('chart-controls-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'chart-controls-styles';
      styleElement.textContent = `
        .chart-control-button {
          transition: all 0.2s ease;
          border: 1px solid ${TAILWIND_COLORS.gray[300]} !important;
        }
        
        .chart-control-button:hover:not(:disabled) {
          border-color: ${token.colorPrimary} !important;
          color: ${token.colorPrimary} !important;
        }
        
        .chart-control-button:focus:not(:disabled) {
          border-color: ${token.colorPrimary} !important;
          box-shadow: 0 0 0 2px ${token.colorPrimary}1a !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
  }, [token.colorPrimary]);

  // Custom button style matching CustomFilterButton's "has-selections" state
  const buttonStyle = {
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: token.fontFamily,
    fontSize: token.fontSize,
  };

  // Currency dropdown
  const CurrencyControl = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const dropdownContent = (
      <div style={{
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadowSecondary,
        padding: '8px',
        minWidth: '120px'
      }}>
        <Space direction="vertical" style={{ width: '100%' }} size={4}>
          {availableCurrencies.map(currency => (
            <div key={currency} style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center',
              padding: '4px 8px 4px 0'
            }}>
              <Radio
                checked={selectedCurrency === currency}
                onChange={() => {
                  onCurrencyChange?.(currency);
                  setIsOpen(false);
                }}
                style={{ margin: 0, flex: 1 }}
              >
                {currency}
              </Radio>
            </div>
          ))}
        </Space>
      </div>
    );

    return (
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        placement="bottomLeft"
      >
        <Button
          style={buttonStyle}
          className="chart-control-button"
          icon={<ChevronDown size={12} />}
          iconPosition="end"
        >
          {selectedCurrency}
        </Button>
      </Dropdown>
    );
  };

  // Validity period dropdown
  const ValidityControl = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const dropdownContent = (
      <div style={{
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadowSecondary,
        padding: '8px',
        minWidth: '200px'
      }}>
        <Space direction="vertical" style={{ width: '100%' }} size={4}>
          {validityOptions
            .filter(opt => opt.value !== 'All periods')
            .map(option => (
              <div key={option.value} style={{ 
                width: '100%', 
                display: 'flex', 
                alignItems: 'center',
                padding: '4px 8px 4px 0'
              }}>
                <Radio
                  checked={selectedValidity === option.value}
                  onChange={() => {
                    onValidityChange?.(option.value);
                    setIsOpen(false);
                  }}
                  style={{ margin: 0, flex: 1 }}
                >
                  {option.label}
                </Radio>
              </div>
            ))}
        </Space>
      </div>
    );

    const displayText = validityOptions.find(opt => opt.value === selectedValidity)?.label || selectedValidity;

    return (
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        placement="bottomLeft"
      >
        <Button
          style={{...buttonStyle, width: '180px'}}
          className="chart-control-button"
          icon={<ChevronDown size={12} />}
          iconPosition="end"
        >
          <span style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {displayText}
          </span>
        </Button>
      </Dropdown>
    );
  };

  // Seat count input control
  const SeatCountControl = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState(seatCount?.toString() || '10');
    
    const dropdownContent = (
      <div style={{
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadowSecondary,
        padding: '12px',
        minWidth: '150px'
      }}>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <InputNumber
            value={parseInt(inputValue)}
            onChange={(value) => {
              const newValue = value || 1;
              setInputValue(newValue.toString());
              onSeatCountChange?.(newValue);
            }}
            min={1}
            max={1000}
            style={{ width: '100%' }}
            placeholder="Enter seat count"
            autoFocus
          />
        </Space>
      </div>
    );

    return (
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        placement="bottomLeft"
      >
        <Button
          style={{...buttonStyle, width: '90px'}}
          className="chart-control-button"
          icon={<ChevronDown size={12} />}
          iconPosition="end"
        >
          {seatCount} seats
        </Button>
      </Dropdown>
    );
  };

  // Seat range dropdown
  const SeatRangeControl = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const dropdownContent = (
      <div style={{
        backgroundColor: token.colorBgElevated,
        borderRadius: token.borderRadius,
        boxShadow: token.boxShadowSecondary,
        padding: '8px',
        minWidth: '140px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <Space direction="vertical" style={{ width: '100%' }} size={4}>
          {availableSeatRanges.map(range => (
            <div key={range} style={{ 
              width: '100%', 
              display: 'flex', 
              alignItems: 'center',
              padding: '4px 8px 4px 0'
            }}>
              <Radio
                checked={selectedSeatRange === range}
                onChange={() => {
                  onSeatRangeChange?.(range);
                  setIsOpen(false);
                }}
                style={{ margin: 0, flex: 1 }}
              >
                {range}
              </Radio>
            </div>
          ))}
        </Space>
      </div>
    );

    return (
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        dropdownRender={() => dropdownContent}
        trigger={['click']}
        placement="bottomLeft"
      >
        <Button
          style={{...buttonStyle, width: '130px'}}
          className="chart-control-button"
          icon={<ChevronDown size={12} />}
          iconPosition="end"
        >
          <span style={{ 
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis' 
          }}>
            {selectedSeatRange}
          </span>
        </Button>
      </Dropdown>
    );
  };

  // Render controls based on chart type
  const renderControls = () => {
    switch (chartType) {
      case 'volume':
        return (
          <Space size={8}>
            <CurrencyControl />
            <ValidityControl />
          </Space>
        );
      
      case 'calculator':
        return (
          <Space size={8}>
            <SeatCountControl />
            <CurrencyControl />
            <ValidityControl />
          </Space>
        );
      
      case 'comparison':
        return (
          <Space size={8}>
            <SeatRangeControl />
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
