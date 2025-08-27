import React, { useState, useMemo } from 'react';
import { Select, Card, Typography, theme } from 'antd';
import type { PricePoint } from '../../utils/types';

const { Text } = Typography;

interface VolumeDiscountChartProps {
  pricePoints: PricePoint[];
  currencies: string[];
}

interface ChartDataPoint {
  volumeTier: string;
  pricePerSeat: number;
  totalPrice: number;
  seatCount: number;
  minQuantity: number;
  maxQuantity?: number;
}

const VolumeDiscountChart: React.FC<VolumeDiscountChartProps> = React.memo(({
  pricePoints,
  currencies
}) => {
  const { token } = theme.useToken();
  
  // Handle empty currencies array with safe defaults
  const safeCurrencies = currencies && currencies.length > 0 ? currencies : ['USD'];
  const defaultCurrency = safeCurrencies.includes('USD') ? 'USD' : safeCurrencies[0];
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);

  // Transform price points into chart data
  const chartData = useMemo(() => {
    // Safety check for pricePoints
    if (!pricePoints || !Array.isArray(pricePoints) || pricePoints.length === 0) {
      return [];
    }
    
    // Filter for selected currency and base pricing tier
    const currencyPoints = pricePoints.filter(point => 
      point.currencyCode === selectedCurrency &&
      (!point.pricingTier || point.pricingTier === 'CORP EM') // Use Corp EM as baseline
    );

    // Group by quantity ranges and calculate price per seat
    const groupedData: ChartDataPoint[] = [];
    
    currencyPoints.forEach(point => {
      const minQty = point.minQuantity || 1;
      const maxQty = point.maxQuantity;
      const avgSeatCount = maxQty ? Math.floor((minQty + maxQty) / 2) : minQty;
      
      // Format volume tier label
      let volumeTier = '';
      if (!maxQty) {
        volumeTier = `${minQty}+ seats`;
      } else if (minQty === maxQty) {
        volumeTier = `${minQty} seat${minQty === 1 ? '' : 's'}`;
      } else {
        volumeTier = `${minQty}-${maxQty} seats`;
      }

      groupedData.push({
        volumeTier,
        pricePerSeat: Math.round(point.amount / avgSeatCount),
        totalPrice: point.amount,
        seatCount: avgSeatCount,
        minQuantity: minQty,
        maxQuantity: maxQty,
      });
    });

    // Sort by minQuantity
    return groupedData.sort((a, b) => a.minQuantity - b.minQuantity);
  }, [pricePoints, selectedCurrency]);

  // Find max price per seat for scaling
  const maxPricePerSeat = Math.max(...chartData.map(d => d.pricePerSeat));

  if (!chartData.length) {
    return (
      <div style={{ textAlign: 'center', padding: '48px', color: token.colorTextSecondary }}>
        <Text>No pricing data available for selected currency</Text>
      </div>
    );
  }

  return (
    <div>
      {/* Currency Selector */}
      <div style={{ marginBottom: '24px', textAlign: 'right' }}>
        <Text style={{ marginRight: '8px' }}>Currency:</Text>
        <Select
          value={selectedCurrency}
          onChange={setSelectedCurrency}
          style={{ width: 120 }}
          options={safeCurrencies.map(currency => ({
            label: currency,
            value: currency,
          }))}
        />
      </div>

      {/* Chart Title */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Text strong style={{ fontSize: '16px' }}>
          {selectedCurrency} vs. Volume Tier
        </Text>
        <br />
        <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
          Price per seat decreases with higher volumes
        </Text>
      </div>

      {/* Simple Bar Chart */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'flex-end', 
        gap: '8px',
        padding: '20px',
        backgroundColor: token.colorFillAlter,
        borderRadius: '6px',
        minHeight: '300px'
      }}>
        {chartData.map((dataPoint, index) => {
          const barHeight = Math.max((dataPoint.pricePerSeat / maxPricePerSeat) * 250, 10);
          
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1,
                minWidth: '60px',
              }}
            >
              {/* Value Label */}
              <div style={{ 
                marginBottom: '8px',
                fontSize: '11px',
                fontWeight: 500,
                color: token.colorText
              }}>
                {dataPoint.pricePerSeat.toLocaleString()}
              </div>
              
              {/* Bar */}
              <div
                style={{
                  width: '100%',
                  maxWidth: '40px',
                  height: `${barHeight}px`,
                  backgroundColor: selectedCurrency === 'USD' ? token.colorPrimary : token.colorSuccess,
                  borderRadius: '4px 4px 0 0',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  position: 'relative',
                }}
                title={`${dataPoint.volumeTier}: ${selectedCurrency} ${dataPoint.pricePerSeat}/seat (Total: ${selectedCurrency} ${dataPoint.totalPrice.toLocaleString()})`}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '0.8';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
              
              {/* X-axis Label */}
              <div style={{ 
                marginTop: '8px',
                fontSize: '10px',
                color: token.colorTextSecondary,
                textAlign: 'center',
                lineHeight: '12px',
                maxWidth: '50px'
              }}>
                {dataPoint.volumeTier}
              </div>
            </div>
          );
        })}
      </div>

      {/* Y-axis Label */}
      <div style={{ 
        textAlign: 'left',
        marginTop: '12px',
        fontSize: '12px',
        color: token.colorTextSecondary 
      }}>
        <Text>Volume Tier</Text>
        <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'rotate(-90deg)', transformOrigin: 'center' }}>
          <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
            {selectedCurrency}
          </Text>
        </div>
      </div>

      {/* Chart Insights */}
      <Card size="small" style={{ marginTop: '16px', backgroundColor: token.colorFillTertiary }}>
        <Text style={{ fontSize: '12px', color: token.colorTextSecondary }}>
          💡 <strong>Volume discount analysis:</strong> This chart shows how the cost per seat decreases as volume increases.
          {chartData.length > 1 && (
            <>
              {' '}Best value at <strong>{chartData[chartData.length - 1]?.volumeTier}</strong> 
              ({selectedCurrency} {chartData[chartData.length - 1]?.pricePerSeat}/seat).
            </>
          )}
        </Text>
      </Card>
    </div>
  );
});

VolumeDiscountChart.displayName = 'VolumeDiscountChart';

export default VolumeDiscountChart;
