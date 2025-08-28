import React, { useMemo } from 'react';
import { Table, Typography, theme, Tooltip } from 'antd';
import type { PricePoint } from '../../utils/types';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PricePointMatrixProps {
  pricePoints: PricePoint[];
}

// Helper to format quantity range consistently
const formatQuantityRange = (minQuantity?: number, maxQuantity?: number): string => {
  if (!minQuantity && !maxQuantity) return 'All quantities';
  
  const min = minQuantity || 1;
  if (!maxQuantity) return `${min}+ seats`;
  
  if (min === maxQuantity) return `${min} seat${min === 1 ? '' : 's'}`;
  
  return `${min}-${maxQuantity} seats`;
};

// Helper to create a sort key for quantity ranges
const getQuantityRangeSortKey = (minQuantity?: number): number => {
  return minQuantity || 1;
};

// Helper to format currency amounts (same logic as PricePointTable)
const zeroDecimalCurrencies = new Set([
  'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
  'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
]);

const formatAmount = (pricePoint: PricePoint): string => {
  if (zeroDecimalCurrencies.has(pricePoint.currencyCode)) {
    return Math.round(pricePoint.amount).toString();
  }
  return pricePoint.amount.toFixed(2);
};

// Matrix data structure
interface MatrixRow {
  quantityRange: string;
  sortKey: number;
  prices: Record<string, Record<string, PricePoint>>; // currency -> pricing tier -> price point
}

// Helper to get a display-friendly pricing tier name
const formatPricingTier = (tier: string | null): string => {
  if (!tier) return 'Base';
  
  // Format common tier abbreviations
  const tierMappings: Record<string, string> = {
    'STFF': 'Staff',
    'CORP_EM': 'Corp EM',
    'CORP BASE PRICE': 'Corp Base',
    'CORP_BASE_PRICE': 'Corp Base',
    'GVT': 'Gov\'t',
    'CORP TIER 1': 'Corp T1',
    'CORP_TIER_1': 'Corp T1',
    'CORP TIER 2': 'Corp T2', 
    'CORP_TIER_2': 'Corp T2',
    'CORP ARH TIER 1 DSC': 'ARH T1 DSC',
    'T2 ARH DSC': 'T2 ARH DSC',
    'T2DSC': 'T2 DSC',
    'T3 ARH DSC': 'T3 ARH DSC',
  };
  
  return tierMappings[tier] || tier;
};

const PricePointMatrix: React.FC<PricePointMatrixProps> = React.memo(({ 
  pricePoints
}) => {
  const { token } = theme.useToken();

  // Transform price points into matrix structure
  const { matrixData, currencies, currencyTiers } = useMemo(() => {
    // Group price points by quantity range, currency, and pricing tier
    const rangeMap = new Map<string, Map<string, Map<string, PricePoint>>>();
    const currencySet = new Set<string>();
    const currencyTierMap = new Map<string, Set<string>>();

    pricePoints.forEach(pricePoint => {
      const rangeKey = `${pricePoint.minQuantity || 1}-${pricePoint.maxQuantity || 'unlimited'}`;
      const currency = pricePoint.currencyCode;
      const tier = pricePoint.pricingTier || 'Base';
      
      currencySet.add(currency);
      
      if (!currencyTierMap.has(currency)) {
        currencyTierMap.set(currency, new Set());
      }
      currencyTierMap.get(currency)!.add(tier);

      if (!rangeMap.has(rangeKey)) {
        rangeMap.set(rangeKey, new Map());
      }
      if (!rangeMap.get(rangeKey)!.has(currency)) {
        rangeMap.get(rangeKey)!.set(currency, new Map());
      }
      rangeMap.get(rangeKey)!.get(currency)!.set(tier, pricePoint);
    });

    // Convert to matrix structure
    const matrixRows: MatrixRow[] = [];
    rangeMap.forEach((currencyMap) => {
      // Find any price point to get quantity info
      let firstPricePoint: PricePoint | undefined = undefined;
      currencyMap.forEach(tierMap => {
        if (!firstPricePoint) {
          const values = Array.from(tierMap.values()) as PricePoint[];
          firstPricePoint = values.length > 0 ? values[0] : undefined;
        }
      });

      if (firstPricePoint) {
        const prices: Record<string, Record<string, PricePoint>> = {};
        
        currencyMap.forEach((tierMap, currency) => {
          prices[currency] = {};
          tierMap.forEach((pricePoint, tier) => {
            prices[currency][tier] = pricePoint;
          });
        });

        const pricePointForQuantity = firstPricePoint as PricePoint;
        matrixRows.push({
          quantityRange: formatQuantityRange(pricePointForQuantity.minQuantity, pricePointForQuantity.maxQuantity),
          sortKey: getQuantityRangeSortKey(pricePointForQuantity.minQuantity),
          prices
        });
      }
    });

    // Sort rows by quantity range
    matrixRows.sort((a, b) => a.sortKey - b.sortKey);

    // Sort currencies in preferred order: USD CAD GBP EUR AUD HKD INR SGD CNY
    const preferredCurrencyOrder = ['USD', 'CAD', 'GBP', 'EUR', 'AUD', 'HKD', 'INR', 'SGD', 'CNY'];
    const sortedCurrencies = Array.from(currencySet).sort((a, b) => {
      const indexA = preferredCurrencyOrder.indexOf(a);
      const indexB = preferredCurrencyOrder.indexOf(b);
      
      // If both currencies are in the preferred order, sort by their position
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      
      // If only one currency is in the preferred order, it comes first
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      
      // If neither currency is in the preferred order, sort alphabetically
      return a.localeCompare(b);
    });

    // Build currency -> tiers mapping with sorted tiers
    const currencyTiersResult: Record<string, string[]> = {};
    sortedCurrencies.forEach(currency => {
      const tiers = Array.from(currencyTierMap.get(currency) || new Set(['Base']));
      // Sort tiers: Base first, then alphabetical
      currencyTiersResult[currency] = tiers.sort((a, b) => {
        if (a === 'Base') return -1;
        if (b === 'Base') return 1;
        return a.localeCompare(b);
      });
    });

    return {
      matrixData: matrixRows,
      currencies: sortedCurrencies,
      currencyTiers: currencyTiersResult
    };
  }, [pricePoints]);

  // Build table columns with nested headers
  const columns: ColumnsType<MatrixRow> = useMemo(() => {
    const cols: ColumnsType<MatrixRow> = [
      {
        title: 'Volume Tier',
        dataIndex: 'quantityRange',
        key: 'quantityRange',
        fixed: 'left',
        width: 140,
        render: (quantityRange: string) => (
          <Text strong style={{ fontSize: '13px' }}>
            {quantityRange}
          </Text>
        ),
        className: 'matrix-quantity-column',
      }
    ];

    // Add currency columns with consistent nested structure
    // ALL currencies get parent-child structure for visual consistency
    currencies.forEach(currency => {
      const tiers = currencyTiers[currency] || ['Base'];
      
      // Create children columns for all tiers (or single tier)
      const childrenCols = tiers.map(tier => ({
        title: (
          <div style={{ 
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            <Text style={{ 
              fontSize: '11px',
              fontWeight: 500
            }}>
              {tier === 'Base' ? '-' : formatPricingTier(tier)}
            </Text>
          </div>
        ),
        key: `${currency}-${tier}`,
        align: 'center' as const,
        width: 110,
        render: (record: MatrixRow) => {
          const pricePoint = record.prices[currency]?.[tier];
          return renderPriceCell(pricePoint, currency, tier);
        },
      }));

      // Always create parent column with children (consistent structure)
      cols.push({
        title: (
          <div style={{ 
            textAlign: 'center',
            whiteSpace: 'nowrap'
          }}>
            <Text strong style={{ 
              fontSize: '13px',
              color: token.colorText
            }}>
              {currency}
            </Text>
          </div>
        ),
        key: currency,
        children: childrenCols,
      });
    });

    return cols;
  }, [currencies, currencyTiers, token]);

  // Helper function to render price cells
  const renderPriceCell = (pricePoint: PricePoint | undefined, currency: string, tier: string) => {
    if (!pricePoint) {
      return (
        <div style={{ 
          color: token.colorTextTertiary,
          fontSize: '12px',
          fontStyle: 'italic',
          padding: '8px 4px',
        }}>
          -
        </div>
      );
    }

    const isExpired = pricePoint.status === 'Expired';
    const amount = formatAmount(pricePoint);

    return (
      <Tooltip 
        title={
          <div>
            <div><strong>Price ID:</strong> {pricePoint.id}</div>
            <div><strong>Currency:</strong> {currency}</div>
            {tier !== 'Base' && <div><strong>Pricing Tier:</strong> {formatPricingTier(tier)}</div>}
            <div><strong>Status:</strong> {pricePoint.status}</div>
            {pricePoint.validFrom && pricePoint.validTo && (
              <div><strong>Validity:</strong> {new Date(pricePoint.validFrom).toLocaleDateString()} - {new Date(pricePoint.validTo).toLocaleDateString()}</div>
            )}
            {pricePoint.priceType && <div><strong>Type:</strong> {pricePoint.priceType}</div>}
          </div>
        }
        mouseEnterDelay={0.5}
      >
        <div 
          style={{
            padding: '8px 4px',
            cursor: 'pointer',
            borderRadius: '4px',
            transition: 'background-color 0.2s',
            fontSize: '13px',
            fontWeight: 500,
            color: isExpired ? token.colorTextTertiary : token.colorText,
            backgroundColor: 'transparent',
            fontVariantNumeric: 'tabular-nums',
          }}
          onMouseEnter={(e) => {
            if (!isExpired) {
              e.currentTarget.style.backgroundColor = token.colorFillSecondary;
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          {amount}
        </div>
      </Tooltip>
    );
  };

  if (matrixData.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '48px 24px',
        color: token.colorTextSecondary 
      }}>
        <Text>No price points available for matrix view</Text>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '16px' }}>
      <style>
        {`
          .matrix-quantity-column {
            background: ${token.colorFillAlter} !important;
          }
          
          .ant-table-thead > tr > th {
            text-align: center !important;
            font-weight: 600 !important;
            background: ${token.colorFillAlter} !important;
            white-space: nowrap !important;
          }
          
          .ant-table-thead > tr > th:first-child {
            background: ${token.colorFillSecondary} !important;
          }
          
          .ant-table-tbody > tr:hover > td {
            background: ${token.colorFillTertiary} !important;
          }
          
          .ant-table-tbody > tr > td:first-child {
            background: ${token.colorFillAlter} !important;
            font-weight: 500 !important;
            vertical-align: middle !important;
          }
          
          .ant-table-tbody > tr:hover > td:first-child {
            background: ${token.colorFillSecondary} !important;
            vertical-align: middle !important;
          }
          
          .ant-table-cell {
            padding: 12px 8px !important;
          }
        `}
      </style>
      
      <Table
        size="small"
        columns={columns}
        dataSource={matrixData}
        rowKey="quantityRange"
        pagination={false}
        scroll={{ x: 'max-content' }}
        bordered
      />

    </div>
  );
});

PricePointMatrix.displayName = 'PricePointMatrix';

export default PricePointMatrix;
