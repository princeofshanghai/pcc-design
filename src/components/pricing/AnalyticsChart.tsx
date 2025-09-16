import React, { useState, useMemo, useEffect } from 'react';
import { Space, Typography, theme, Card } from 'antd';
import { Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Line, LineChart, Legend } from 'recharts';
import type { PricePoint } from '../../utils/types';
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
  
  // Custom legend content with square rounded borders styling
  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    if (!payload || !payload.length) return null;
    
    return (
      <ul style={{ 
        listStyle: 'none', 
        padding: 0, 
        margin: 0, 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '16px',
        marginTop: '16px'
      }}>
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: entry.color,
              borderRadius: '2px',
              flexShrink: 0
            }} />
            <span style={{ 
              fontSize: token.fontSizeSM, 
              color: token.colorText,
              fontWeight: 500 
            }}>
              {entry.value}
            </span>
          </li>
        ))}
      </ul>
    );
  };
  
  // Chart type selection
  const [chartType, setChartType] = useState<ChartType>('volume');
  
  // Common controls
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [selectedValidity, setSelectedValidity] = useState(() => {
    // Default to first non-"All periods" option
    const defaultOption = validityOptions.find(opt => opt.value !== 'All periods');
    return defaultOption?.value || validityOptions[0]?.value || '';
  });
  
  // Seat calculator specific controls - simplified (no seat input, no seat range)
  
  // Volume chart tier filtering - now single select
  const [selectedTier, setSelectedTier] = useState<string>('');
  
  // Calculator chart tier filtering - single select
  const [selectedCalculatorTier, setSelectedCalculatorTier] = useState<string>('');
  
  // Comparison chart controls - currency filtering (multi-select, non-USD)
  const [selectedComparisonCurrencies, setSelectedComparisonCurrencies] = useState<string[]>([]);
  const [selectedComparisonTier, setSelectedComparisonTier] = useState<string>('');
  
  // Line chart overlay toggle
  const [showLineOverlay, setShowLineOverlay] = useState<boolean>(false);

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

  // Get non-USD currencies for comparison chart
  const availableComparisonCurrencies = useMemo(() => {
    return availableCurrencies.filter(currency => currency !== 'USD');
  }, [availableCurrencies]);

  // Auto-select all non-USD currencies when they change
  useEffect(() => {
    setSelectedComparisonCurrencies(availableComparisonCurrencies);
  }, [availableComparisonCurrencies]);



  // Use all price points directly (already filtered for "active today" by parent)
  const filteredByValidity = pricePoints;

  // Get available tiers for the selected currency
  const availableTiers = useMemo(() => {
    const tiersForCurrency = [...new Set(
      filteredByValidity
        .filter(pp => pp.currencyCode === selectedCurrency)
        .map(pp => pp.pricingTier || 'Standard')
    )];
    return tiersForCurrency.sort();
  }, [filteredByValidity, selectedCurrency]);

  // Auto-select first available tier when currency changes (for all charts)
  useEffect(() => {
    if (availableTiers.length > 0) {
      setSelectedTier(availableTiers[0]);
      setSelectedCalculatorTier(availableTiers[0]);
      setSelectedComparisonTier(availableTiers[0]);
    }
  }, [availableTiers]);

  // Chart type options
  const chartTypeOptions = [
    { 
      value: 'volume', 
      label: 'Price per seat range',
      description: 'Shows unit price per seat range'
    },
    { 
      value: 'calculator', 
      label: 'Total price',
      description: 'Shows total price for number of seats'
    },
    { 
      value: 'comparison', 
      label: 'USD comparison',
      description: 'Compares USD price to USD equivalent of other currencies'
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

  // Seat Calculator Chart Data - simplified with fixed range
  const calculatorChartData = useMemo(() => {
    const maxSeats = 300; // Fixed range 0-300
    const step = 2; // Generate data points every 2 seats for smooth curves
    const data: any[] = [];
    
    // Get tiers for selected currency
    const tiersForCurrency = [...new Set(
      filteredByValidity
        .filter(pp => pp.currencyCode === selectedCurrency)
        .map(pp => pp.pricingTier || 'Standard')
    )];
    
    // Generate data points from 0 to maxSeats
    for (let seats = 0; seats <= maxSeats; seats += step) {
      const dataPoint: any = { seats };
      
      tiersForCurrency.forEach(tier => {
        // Find the applicable price point for this seat count and tier
        const applicablePricePoint = filteredByValidity
          .filter(pp => pp.currencyCode === selectedCurrency)
          .filter(pp => (pp.pricingTier || 'Standard') === tier)
          .find(pp => {
            const min = pp.minQuantity || 1;
            const max = pp.maxQuantity;
            return seats >= min && (max === null || max === undefined || seats <= max);
          });
        
        if (applicablePricePoint) {
          // Calculate total cost (amount per seat * number of seats)
          dataPoint[tier] = applicablePricePoint.amount * seats;
        } else {
          dataPoint[tier] = null;
        }
      });
      
      data.push(dataPoint);
    }
    
    return { data, tiers: tiersForCurrency };
  }, [filteredByValidity, selectedCurrency]);

  // Currency Comparison Chart Data - USD equivalent amounts
  const comparisonChartData = useMemo(() => {
    // Helper function to get default exchange rates (approximate, for demo purposes)
    const getDefaultExchangeRate = (currency: string): number => {
      const defaultRates: Record<string, number> = {
        'EUR': 1.10,   // 1 EUR = 1.10 USD
        'GBP': 1.27,   // 1 GBP = 1.27 USD  
        'CAD': 0.73,   // 1 CAD = 0.73 USD
        'AUD': 0.65,   // 1 AUD = 0.65 USD
        'SGD': 0.75,   // 1 SGD = 0.75 USD
        'HKD': 0.13,   // 1 HKD = 0.13 USD
        'INR': 0.012,  // 1 INR = 0.012 USD
        'CNY': 0.14,   // 1 CNY = 0.14 USD
      };
      return defaultRates[currency] || 1;
    };
    
    // Helper function to generate seat range key
    const getSeatRangeKey = (pp: PricePoint) => {
      const min = pp.minQuantity || 1;
      const max = pp.maxQuantity;
      if (!max) {
        return `${min}+`;
      } else if (min === max) {
        return `${min}`;
      } else {
        return `${min}-${max}`;
      }
    };
    
    // Group by seat range first
    const groupedData = new Map<string, Map<string, number>>();
    const allCurrencies = new Set<string>();
    
    // Include USD and selected comparison currencies
    const currenciesToShow = ['USD', ...selectedComparisonCurrencies];
    
    filteredByValidity
      .filter(pp => currenciesToShow.includes(pp.currencyCode))
      .filter(pp => (pp.pricingTier || 'Standard') === selectedComparisonTier)
      .forEach(pp => {
        const seatRangeKey = getSeatRangeKey(pp);
        
        if (!groupedData.has(seatRangeKey)) {
          groupedData.set(seatRangeKey, new Map());
        }
        
        // Calculate USD equivalent
        let usdEquivalent = pp.amount;
        if (pp.currencyCode !== 'USD') {
          // Use exchange rate from data, or default rates for common currencies
          const exchangeRate = pp.exchangeRate || getDefaultExchangeRate(pp.currencyCode);
          if (exchangeRate) {
            usdEquivalent = pp.amount * exchangeRate;
          }
        }
        
        groupedData.get(seatRangeKey)!.set(pp.currencyCode, usdEquivalent);
        allCurrencies.add(pp.currencyCode);
      });

    // Convert to chart data
    const data: any[] = [];
    const sortedRanges = Array.from(groupedData.keys()).sort((a, b) => {
      const parseRange = (range: string) => {
        const match = range.match(/(\d+)/);
        return match ? parseInt(match[1]) : 0;
      };
      return parseRange(a) - parseRange(b);
    });
    
    sortedRanges.forEach(seatRange => {
      const currencyMap = groupedData.get(seatRange)!;
      const dataPoint: any = { seatRange };
      
      currenciesToShow.forEach(currency => {
        dataPoint[currency] = currencyMap.get(currency) || null;
      });
      
      data.push(dataPoint);
    });
    
    return { data, currencies: currenciesToShow };
  }, [filteredByValidity, selectedComparisonCurrencies, selectedComparisonTier]);

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

  // Darker, contrasting colors for trend lines
  const lineColors = [
    '#0050b3', // Darker blue
    '#389e0d', // Darker green
    '#d48806', // Darker orange
    '#a8071a', // Darker red
    '#531dab', // Darker purple
    '#08979c', // Darker cyan
    '#c41d7f', // Darker magenta
    '#d46b08', // Darker orange variant
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Filter payload to only show bar data (exclude line data)
      const barData = payload.filter((entry: any) => entry.type === 'rect' || !entry.type);
      
      if (barData.length === 0) return null;
      
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
          {barData.map((entry: any, index: number) => (
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
            <ComposedChart
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

                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={renderCustomLegend} />
              {/* Show only selected tier */}
              {selectedTier && volumeChartData.tiers.includes(selectedTier) && (
                <Bar 
                  key={selectedTier}
                  dataKey={selectedTier} 
                  fill={chartColors[volumeChartData.tiers.indexOf(selectedTier) % chartColors.length]}
                  radius={[2, 2, 0, 0]}
                  name={selectedTier}
                  animationDuration={250}
                />
              )}
              {/* Add line overlay when enabled for selected tier only */}
              {showLineOverlay && selectedTier && volumeChartData.tiers.includes(selectedTier) && (
                <Line 
                  key={`line-${selectedTier}`}
                  type="monotone"
                  dataKey={selectedTier} 
                  stroke={lineColors[volumeChartData.tiers.indexOf(selectedTier) % lineColors.length]}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: lineColors[volumeChartData.tiers.indexOf(selectedTier) % lineColors.length] }}
                  connectNulls={false}
                  legendType="none"
                  animationDuration={250}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        );
      
      case 'calculator':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={calculatorChartData.data}
              margin={{
                top: 20,
                right: 30,
                left: 60,
                bottom: 60,
              }}

            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke={token.colorBorderSecondary}
                opacity={0.6}
              />
              <XAxis 
                dataKey="seats"
                type="number"
                domain={[0, 300]}
                tick={{ 
                  fontSize: 11, 
                  fill: token.colorTextSecondary,
                  fontFamily: token.fontFamily
                }}
                axisLine={{ stroke: token.colorBorder }}
                tickLine={{ stroke: token.colorBorder }}
                label={{ 
                  value: 'Seat Count', 
                  position: 'insideBottom',
                  offset: -10,
                  style: { 
                    textAnchor: 'middle',
                    fontSize: 12,
                    fill: token.colorTextSecondary,
                    fontFamily: token.fontFamily,
                    fontWeight: 500
                  }
                }}
              />
              <YAxis 
                tick={{ 
                  fontSize: 11, 
                  fill: token.colorTextSecondary,
                  fontFamily: token.fontFamily
                }}
                axisLine={{ stroke: token.colorBorder }}
                tickLine={{ stroke: token.colorBorder }}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip 
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length && label) {
                    const seatCount = label;
                    
                    // Find the seat range and cost per seat this quantity falls into
                    const findSeatRangeInfo = (seats: number, tier: string) => {
                      const applicablePricePoint = filteredByValidity
                        .filter(pp => pp.currencyCode === selectedCurrency)
                        .filter(pp => (pp.pricingTier || 'Standard') === tier)
                        .find(pp => {
                          const min = pp.minQuantity || 1;
                          const max = pp.maxQuantity;
                          return seats >= min && (max === null || max === undefined || seats <= max);
                        });
                      
                      if (applicablePricePoint) {
                        const min = applicablePricePoint.minQuantity || 1;
                        const max = applicablePricePoint.maxQuantity;
                        const costPerSeat = applicablePricePoint.amount;
                        
                        let rangeText;
                        if (max === null || max === undefined) {
                          rangeText = `${min}+ seats`;
                        } else {
                          rangeText = `${min}-${max} seats`;
                        }
                        
                        // Default to annual billing cycle (most common)
                        const billingCycleSuffix = ' per year';
                        
                        return {
                          range: `${rangeText}, at ${selectedCurrency} ${costPerSeat.toLocaleString()} per seat${billingCycleSuffix}`,
                          pricePoint: applicablePricePoint
                        };
                      }
                      return null;
                    };

                    const filteredPayload = payload.filter((entry: any) => entry.value !== null);
                    if (filteredPayload.length === 0) return null;
                    
                    const entry = filteredPayload[0]; // Since we're showing single tier now
                    const tierName = entry.dataKey;
                    const totalCost = entry.value;
                    const rangeInfo = findSeatRangeInfo(seatCount, tierName);
                    
                    return (
                      <div style={{
                        backgroundColor: token.colorBgElevated,
                        border: `1px solid ${token.colorBorder}`,
                        borderRadius: token.borderRadius,
                        padding: '12px 16px',
                        boxShadow: token.boxShadowSecondary,
                        fontSize: token.fontSizeSM,
                        minWidth: '250px'
                      }}>
                        {/* Tier name - first row with color */}
                        <Text style={{ 
                          fontWeight: 600, 
                          color: entry.color,
                          fontSize: token.fontSize,
                          display: 'block',
                          marginBottom: '8px',
                          textTransform: 'uppercase'
                        }}>
                          {tierName}
                        </Text>
                        
                        {/* Total cost inline with billing cycle */}
                        <Text style={{ 
                          fontWeight: 500, 
                          color: token.colorText,
                          fontSize: token.fontSizeSM,
                          display: 'block',
                          marginBottom: '4px'
                        }}>
                          Total cost for {seatCount} seats per year: {selectedCurrency} {totalCost?.toLocaleString()}
                        </Text>
                        
                        {/* Range information with billing cycle */}
                        {rangeInfo && (
                          <Text style={{ 
                            color: token.colorTextSecondary,
                            fontSize: token.fontSizeSM,
                            display: 'block'
                          }}>
                            Range: {rangeInfo.range}
                          </Text>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend content={renderCustomLegend} />
              {/* Reference line for current seat count */}

              {/* Line for selected tier only */}
              {selectedCalculatorTier && calculatorChartData.tiers.includes(selectedCalculatorTier) && (
                <Line 
                  key={selectedCalculatorTier}
                  type="monotone"
                  dataKey={selectedCalculatorTier} 
                  stroke={chartColors[calculatorChartData.tiers.indexOf(selectedCalculatorTier) % chartColors.length]}
                  strokeWidth={3}
                  dot={false}
                  connectNulls={false}
                  name={selectedCalculatorTier}
                  animationDuration={250}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        );
      
      case 'comparison':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={comparisonChartData.data}
              margin={{
                top: 20,
                right: 30,
                left: 60,
                bottom: 60,
              }}
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
              />
              <YAxis 
                tick={{ 
                  fontSize: 11, 
                  fill: token.colorTextSecondary,
                  fontFamily: token.fontFamily
                }}
                axisLine={{ stroke: token.colorBorder }}
                tickLine={{ stroke: token.colorBorder }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length && label) {
                    const filteredPayload = payload.filter((entry: any) => entry.value !== null);
                    if (filteredPayload.length === 0) return null;
                    
                    return (
                      <div style={{
                        backgroundColor: token.colorBgElevated,
                        border: `1px solid ${token.colorBorder}`,
                        borderRadius: token.borderRadius,
                        padding: '12px 16px',
                        boxShadow: token.boxShadowSecondary,
                        fontSize: token.fontSizeSM,
                        minWidth: '200px'
                      }}>
                        {/* Range header */}
                        <Text style={{ 
                          fontWeight: 600, 
                          color: token.colorText,
                          fontSize: token.fontSize,
                          display: 'block',
                          marginBottom: '8px'
                        }}>
                          {label} seats
                        </Text>
                        
                        {/* Currency comparisons */}
                        {filteredPayload.map((entry: any, index: number) => (
                          <div key={index} style={{ marginBottom: index === filteredPayload.length - 1 ? 0 : '4px' }}>
                            <Text style={{ 
                              color: entry.color,
                              fontSize: token.fontSizeSM,
                              fontWeight: 500
                            }}>
                              {entry.dataKey}: ${entry.value?.toLocaleString()} USD equivalent
                            </Text>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend content={renderCustomLegend} />
              
              {/* Line for each currency showing USD equivalent */}
              {comparisonChartData.currencies.map((currency, index) => (
                <Line 
                  key={currency}
                  type="monotone"
                  dataKey={currency} 
                  stroke={currency === 'USD' ? token.colorPrimary : chartColors[index % chartColors.length]}
                  strokeWidth={currency === 'USD' ? 3 : 2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  connectNulls={false}
                  name={currency}
                  animationDuration={250}
                />
              ))}
            </LineChart>
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
                    : TAILWIND_COLORS.gray[200]}`,
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
                    e.currentTarget.style.borderColor = TAILWIND_COLORS.gray[200];
                    e.currentTarget.style.backgroundColor = token.colorBgContainer;
                  }
                }}
              >
                <div style={{ marginBottom: 4 }}>
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
                fontSize: token.fontSizeHeading3,
                fontWeight: 500 
              }}>
                {chartType === 'volume' 
                  ? `Price per seat range in ${selectedCurrency}`
                  : chartType === 'calculator'
                  ? `Total price for number of seats in ${selectedCurrency}`
                  : chartType === 'comparison'
                  ? `USD compared to USD equivalents`
                  : chartTypeOptions.find(opt => opt.value === chartType)?.label
                }
              </Title>
              <ChartControls
                chartType={chartType}
                selectedCurrency={selectedCurrency}
                onCurrencyChange={setSelectedCurrency}
                availableCurrencies={availableCurrencies}
                selectedTier={selectedTier}
                onTierChange={setSelectedTier}
                availableTiers={availableTiers}
                selectedCalculatorTier={selectedCalculatorTier}
                onCalculatorTierChange={setSelectedCalculatorTier}
                selectedComparisonCurrencies={selectedComparisonCurrencies}
                onComparisonCurrenciesChange={setSelectedComparisonCurrencies}
                availableComparisonCurrencies={availableComparisonCurrencies}
                selectedComparisonTier={selectedComparisonTier}
                onComparisonTierChange={setSelectedComparisonTier}
                showLineOverlay={showLineOverlay}
                onLineOverlayChange={setShowLineOverlay}
                selectedValidity={selectedValidity}
                onValidityChange={setSelectedValidity}
                validityOptions={validityOptions}
              />
            </div>
          }
          style={{ 
            backgroundColor: token.colorBgContainer,
            border: `1px solid ${TAILWIND_COLORS.gray[200]}`,
            borderRadius: token.borderRadius,
          }}
          headStyle={{
            padding: '16px 24px'
          }}
          bodyStyle={{
            padding: '24px'  // Explicitly control Card body padding
          }}
        >
          {/* Chart Area */}
          {renderChart()}
        </Card>
      </Space>
    </div>
  );
};

export default AnalyticsChart;
