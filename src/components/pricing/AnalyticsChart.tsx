import React, { useState, useMemo } from 'react';
import { Space, Typography, theme, Card } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { PricePoint } from '../../utils/types';
import { formatValidityRange } from '../../utils/formatters';
import ChartControls from './ChartControls';
import { TAILWIND_COLORS } from '../../theme';

const { Title, Text } = Typography;

interface AnalyticsChartProps {
  pricePoints: PricePoint[];
  validityOptions: Array<{ label: string; value: string }>;
}

type ChartType = 'volume' | 'calculator' | 'comparison';

const AnalyticsChart: React.FC<AnalyticsChartProps> = ({
  pricePoints,
  validityOptions,
}) => {
  const { token } = theme.useToken();
  
  // Chart type selection
  const [chartType, setChartType] = useState<ChartType>('volume');
  
  // Common controls
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedValidity, setSelectedValidity] = useState(() => {
    // Default to first non-"All periods" option
    const defaultOption = validityOptions.find(opt => opt.value !== 'All periods');
    return defaultOption?.value || validityOptions[0]?.value || '';
  });
  
  // Seat calculator specific controls
  const [seatCount, setSeatCount] = useState<number>(10);
  const [selectedSeatRange, setSelectedSeatRange] = useState('11-31');

  // Get available currencies from price points
  const availableCurrencies = useMemo(() => {
    const currencies = [...new Set(pricePoints.map(p => p.currencyCode))];
    const currencyOrder = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'HKD', 'INR', 'SGD', 'CNY'];
    return currencies.sort((a, b) => {
      const aIndex = currencyOrder.indexOf(a);
      const bIndex = currencyOrder.indexOf(b);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [pricePoints]);

  // Get available seat ranges
  const availableSeatRanges = useMemo(() => {
    const ranges = new Set<string>();
    pricePoints.forEach(pp => {
      const min = pp.minQuantity || 1;
      const max = pp.maxQuantity;
      if (!max) {
        ranges.add(`${min}+ seats`);
      } else if (min === max) {
        ranges.add(`${min} seat${min === 1 ? '' : 's'}`);
      } else {
        ranges.add(`${min}-${max} seats`);
      }
    });
    return Array.from(ranges).sort((a, b) => {
      const parseRange = (range: string) => {
        const match = range.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      return parseRange(a) - parseRange(b);
    });
  }, [pricePoints]);

  // Filter price points based on validity
  const filteredByValidity = useMemo(() => {
    return pricePoints.filter(pp => {
      const period = formatValidityRange(pp.validFrom, pp.validTo);
      return period === selectedValidity;
    });
  }, [pricePoints, selectedValidity]);

  // Chart type options
  const chartTypeOptions = [
    { 
      value: 'volume', 
      label: 'Volume Pricing',
      description: 'Amount vs Seat Ranges'
    },
    { 
      value: 'calculator', 
      label: 'Seat Calculator',
      description: 'Cost for Specific Seat Count'
    },
    { 
      value: 'comparison', 
      label: 'Currency Comparison',
      description: 'USD vs Other Currencies'
    }
  ];

  // Volume Pricing Chart Data
  const volumeChartData = useMemo(() => {
    // Group by seat range first, then by tier
    const groupedData = new Map<string, Map<string, PricePoint>>();
    
    filteredByValidity
      .filter(pp => pp.currencyCode === selectedCurrency)
      .forEach(pp => {
        const min = pp.minQuantity || 1;
        const max = pp.maxQuantity;
        let seatRange;
        if (!max) {
          seatRange = `${min}+`;
        } else if (min === max) {
          seatRange = `${min}`;
        } else {
          seatRange = `${min}-${max}`;
        }
        
        const tier = pp.pricingTier || 'Standard';
        
        if (!groupedData.has(seatRange)) {
          groupedData.set(seatRange, new Map());
        }
        groupedData.get(seatRange)!.set(tier, pp);
      });

    // Convert to array format for Recharts
    const data: any[] = [];
    const allTiers = new Set<string>();
    
    // Collect all tiers first
    groupedData.forEach(tierMap => {
      tierMap.forEach((_, tier) => allTiers.add(tier));
    });
    
    // Sort seat ranges by numeric value
    const sortedRanges = Array.from(groupedData.keys()).sort((a, b) => {
      const parseRange = (range: string) => {
        const match = range.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      return parseRange(a) - parseRange(b);
    });
    
    sortedRanges.forEach(seatRange => {
      const tierMap = groupedData.get(seatRange)!;
      const dataPoint: any = { seatRange };
      
      Array.from(allTiers).forEach(tier => {
        const pp = tierMap.get(tier);
        dataPoint[tier] = pp ? pp.amount : null;
      });
      
      data.push(dataPoint);
    });
    
    return { data, tiers: Array.from(allTiers) };
  }, [filteredByValidity, selectedCurrency]);

  // Chart colors that match your design system
  const chartColors = [
    '#1890ff', // Primary blue
    '#52c41a', // Success green  
    '#faad14', // Warning orange
    '#f5222d', // Error red
    '#722ed1', // Purple
    '#13c2c2', // Cyan
    '#eb2f96', // Magenta
    '#fa8c16', // Orange
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: token.colorBgElevated,
          border: `1px solid ${token.colorBorder}`,
          borderRadius: token.borderRadius,
          padding: '8px 12px',
          boxShadow: token.boxShadowSecondary,
          fontSize: token.fontSizeSM,
        }}>
          <Text style={{ 
            fontWeight: 500, 
            color: token.colorText,
            fontSize: token.fontSizeSM 
          }}>
            {label} seats
          </Text>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{ marginTop: 4 }}>
              <Text style={{ 
                color: entry.color,
                fontSize: token.fontSizeSM 
              }}>
                {entry.dataKey}: {selectedCurrency} {entry.value?.toLocaleString()}
              </Text>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    switch (chartType) {
      case 'volume':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={volumeChartData.data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
              barCategoryGap="20%"
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={token.colorBorderSecondary}
                opacity={0.6}
              />
              <XAxis 
                dataKey="seatRange"
                tick={{ 
                  fontSize: 11, 
                  fill: token.colorTextSecondary,
                  fontFamily: token.fontFamily
                }}
                axisLine={{ stroke: token.colorBorder }}
                tickLine={{ stroke: token.colorBorder }}
                angle={-45}
                textAnchor="end"
                height={80}
                interval={0}
              />
              <YAxis 
                tick={{ 
                  fontSize: 11, 
                  fill: token.colorTextSecondary,
                  fontFamily: token.fontFamily
                }}
                axisLine={{ stroke: token.colorBorder }}
                tickLine={{ stroke: token.colorBorder }}
                label={{ 
                  value: `Amount (${selectedCurrency})`, 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { 
                    textAnchor: 'middle',
                    fontSize: 12,
                    fill: token.colorTextSecondary,
                    fontFamily: token.fontFamily,
                    fontWeight: 500
                  }
                }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{
                  fontSize: token.fontSizeSM,
                  fontFamily: token.fontFamily,
                  color: token.colorText
                }}
              />
              {volumeChartData.tiers.map((tier, index) => (
                <Bar 
                  key={tier}
                  dataKey={tier} 
                  fill={chartColors[index % chartColors.length]}
                  radius={[2, 2, 0, 0]}
                  name={tier === 'Standard' ? 'Standard' : tier}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'calculator':
        // Placeholder for now - will implement in next step
        return (
          <ResponsiveContainer width="100%" height={400}>
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: token.colorBgContainer,
              border: `1px solid ${token.colorBorder}`,
              borderRadius: token.borderRadius
            }}>
              <Text style={{ color: token.colorTextSecondary }}>
                Seat Calculator Chart - Coming Soon
              </Text>
            </div>
          </ResponsiveContainer>
        );
      
      case 'comparison':
        // Placeholder for now - will implement in next step
        return (
          <ResponsiveContainer width="100%" height={400}>
            <div style={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: token.colorBgContainer,
              border: `1px solid ${token.colorBorder}`,
              borderRadius: token.borderRadius
            }}>
              <Text style={{ color: token.colorTextSecondary }}>
                Currency Comparison Chart - Coming Soon
              </Text>
            </div>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };



  return (
    <div>
      <Space direction="vertical" size={32} style={{ width: '100%' }}>
        {/* Chart Type Selector - Individual Clickable Cards */}
        <div>
          <Text style={{ 
            fontSize: token.fontSizeSM, 
            color: token.colorTextSecondary,
            display: 'block',
            marginBottom: 16
          }}>
            Chart Type
          </Text>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px',
            maxWidth: '800px'
          }}>
            {chartTypeOptions.map(option => (
              <div
                key={option.value}
                onClick={() => setChartType(option.value as ChartType)}
                style={{
                  padding: '16px',
                  backgroundColor: chartType === option.value 
                    ? token.colorPrimaryBg 
                    : token.colorBgContainer,
                  border: `1px solid ${chartType === option.value 
                    ? token.colorPrimary 
                    : TAILWIND_COLORS.gray[300]}`,
                  borderRadius: token.borderRadius,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (chartType !== option.value) {
                    e.currentTarget.style.borderColor = token.colorPrimary;
                    e.currentTarget.style.backgroundColor = token.colorFillQuaternary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (chartType !== option.value) {
                    e.currentTarget.style.borderColor = TAILWIND_COLORS.gray[300];
                    e.currentTarget.style.backgroundColor = token.colorBgContainer;
                  }
                }}
              >
                <div style={{ marginBottom: 8 }}>
                  <Text style={{ 
                    fontWeight: 500,
                    fontSize: token.fontSize,
                    color: chartType === option.value ? token.colorPrimary : token.colorText
                  }}>
                    {option.label}
                  </Text>
                </div>
                <Text style={{ 
                  fontSize: token.fontSizeSM, 
                  color: token.colorTextSecondary,
                  lineHeight: 1.4
                }}>
                  {option.description}
                </Text>
              </div>
            ))}
          </div>
        </div>

        {/* Chart Display with Embedded Controls */}
        <Card 
          size="small"
          title={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              width: '100%',
              padding: '8px 0'
            }}>
              <Title level={4} style={{ 
                margin: 0, 
                fontSize: token.fontSizeHeading4,
                fontWeight: 500 
              }}>
                {chartTypeOptions.find(opt => opt.value === chartType)?.label}
              </Title>
              <ChartControls
                chartType={chartType}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                availableCurrencies={availableCurrencies}
                selectedValidity={selectedValidity}
                onValidityChange={setSelectedValidity}
                validityOptions={validityOptions}
                seatCount={seatCount}
                onSeatCountChange={setSeatCount}
                selectedSeatRange={selectedSeatRange}
                onSeatRangeChange={setSelectedSeatRange}
                availableSeatRanges={availableSeatRanges}
              />
            </div>
          }
          style={{ 
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${TAILWIND_COLORS.gray[300]}`,
            borderRadius: token.borderRadius,
          }}
          headStyle={{
            padding: '16px 24px'
          }}
        >
          {renderChart()}
        </Card>
      </Space>
    </div>
  );
};

export default AnalyticsChart;
