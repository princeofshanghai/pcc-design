import React from 'react';
import { Typography, Space, theme, Popover, Collapse } from 'antd';
import { TriangleAlert } from 'lucide-react';

const { Title, Text } = Typography;

interface PriceChange {
  currency: string;
  currencyName: string;
  currentPrice: number | null;
  newPrice: number;
  change: {
    amount: number;
    percentage: number;
  };
  validity: string;
}

interface FieldPriceChange {
  currency: string;
  currencyName: string;
  seatRange: string;
  tier: string;
  currentPrice: number | null;
  newPrice: number;
  change: {
    amount: number;
    percentage: number;
  };
  validity: string;
}

interface PriceChangesSummaryProps {
  productName: string;
  isFieldChannel: boolean;
  changes: PriceChange[] | FieldPriceChange[];
  priceGroupAction: 'create' | 'update';
  hideTitle?: boolean;
}

/**
 * Formats currency amount with proper decimal places
 */
const formatCurrencyAmount = (amount: number, currencyCode: string): string => {
  const zeroDecimalCurrencies = new Set([
    'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
    'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
  ]);
  
  if (zeroDecimalCurrencies.has(currencyCode)) {
    return Math.round(amount).toLocaleString();
  }
  return amount.toFixed(2);
};

const PriceChangesSummary: React.FC<PriceChangesSummaryProps> = ({
  productName,
  isFieldChannel,
  changes,
  priceGroupAction,
  hideTitle = false
}) => {
  const { token } = theme.useToken();

  // Note: The "No price changes to review" case is no longer reachable since 
  // Step 1's Continue button is disabled when hasRealTimeChanges is false

  // Generate summary text based on mode
  const getSummaryText = () => {
    const pricePointCount = isFieldChannel ? 
      (changes as FieldPriceChange[]).length : 
      (changes as PriceChange[]).length;

    if (priceGroupAction === 'create') {
      return `This will create a new price group and new SKU with ${pricePointCount} new price point${pricePointCount === 1 ? '' : 's'}.`;
    } else {
      return `This will update the existing price group by expiring ${pricePointCount} price point${pricePointCount === 1 ? '' : 's'} and replacing them with ${pricePointCount} new one${pricePointCount === 1 ? '' : 's'} (existing SKU unchanged).`;
    }
  };

  const summaryText = React.useMemo(() => getSummaryText(), [priceGroupAction, isFieldChannel, changes]);

  if (isFieldChannel) {
    // Field channel: Collapsible Currency → Tier approach
    const fieldChanges = changes as FieldPriceChange[];
    
    // Helper function to check if change is large (>10%)
    const isLargeChange = (change: FieldPriceChange): boolean => {
      if (change.currentPrice === null || change.currentPrice === 0) return false;
      const percentChange = Math.abs(change.change.percentage);
      return percentChange > 10;
    };
    
    // Group changes by currency, then by tier
    const changesByCurrency = fieldChanges.reduce((acc, change) => {
      if (!acc[change.currency]) {
        acc[change.currency] = {
          currencyName: change.currencyName,
          validity: change.validity,
          tiers: {}
        };
      }
      
      if (!acc[change.currency].tiers[change.tier]) {
        acc[change.currency].tiers[change.tier] = [];
      }
      
      acc[change.currency].tiers[change.tier].push(change);
      return acc;
    }, {} as Record<string, { 
      currencyName: string; 
      validity: string; 
      tiers: Record<string, FieldPriceChange[]> 
    }>);

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Main heading */}
        {!hideTitle && (
          <div>
            <Title level={3} style={{ 
              marginBottom: '24px',
              fontSize: token.fontSizeHeading2 
            }}>
              Review changes
            </Title>
          </div>
        )}

        {/* Summary section */}
        <div>
          <Title level={5} style={{ marginBottom: '12px', color: token.colorText }}>
            Summary
          </Title>
          <Text style={{ 
            color: token.colorTextSecondary, 
            fontSize: token.fontSize,
            display: 'block',
            marginBottom: '24px'
          }}>
            {summaryText}
          </Text>
        </div>

        {/* Price changes section */}
        <div>
          <Title level={5} style={{ marginBottom: '16px', color: token.colorText }}>
            Price changes
          </Title>
          <Text style={{ color: token.colorTextSecondary, display: 'block', marginBottom: '16px' }}>
            {fieldChanges.length} price change{fieldChanges.length === 1 ? '' : 's'} for {productName}
          </Text>

          <Collapse 
            size="small"
            style={{ backgroundColor: 'transparent' }}
            items={Object.entries(changesByCurrency).map(([currency, group]) => {
              const totalChanges = Object.values(group.tiers).flat().length;
              const largeChanges = Object.values(group.tiers).flat().filter(isLargeChange);
              const largeChangeCount = largeChanges.length;
              
              return {
                key: currency,
                label: (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Text style={{ fontWeight: 500, fontSize: token.fontSize }}>
                      {currency} ({totalChanges} change{totalChanges !== 1 ? 's' : ''})
                    </Text>
                    <Text style={{ fontSize: token.fontSize, color: token.colorTextSecondary, fontWeight: 'normal' }}>
                      {group.validity}
                    </Text>
                    {largeChangeCount > 0 && (
                      <Popover 
                        content="New price is more than 10% of current"
                        placement="top"
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: token.colorWarning }}>
                          <TriangleAlert size={14} />
                          <Text style={{ fontSize: token.fontSize, color: token.colorWarning, fontWeight: 'normal' }}>
                            {largeChangeCount} large change{largeChangeCount !== 1 ? 's' : ''}
                          </Text>
                        </div>
                      </Popover>
                    )}
                  </div>
                ),
                children: (
                  <div style={{ 
                    borderLeft: `1px solid ${token.colorBorderSecondary}`,
                    marginLeft: '12px',
                    paddingLeft: '12px'
                  }}>
                    <Collapse 
                      size="small"
                      ghost
                      items={Object.entries(group.tiers).map(([tier, tierChanges], tierIndex, tierArray) => {
                        const tierLargeChanges = tierChanges.filter(isLargeChange);
                        const tierLargeCount = tierLargeChanges.length;
                        
                        return {
                          key: tier,
                          label: (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Text style={{ fontWeight: 500, fontSize: token.fontSize }}>
                                {tier === 'NULL_TIER' ? 'Base' : tier} ({tierChanges.length} changes)
                              </Text>
                              {tierLargeCount > 0 && (
                                <Popover 
                                  content="New price is more than 10% of current"
                                  placement="top"
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: token.colorWarning }}>
                                    <TriangleAlert size={12} />
                                    <Text style={{ fontSize: token.fontSize, color: token.colorWarning, fontWeight: 'normal' }}>
                                      {tierLargeCount} large change{tierLargeCount !== 1 ? 's' : ''}
                                    </Text>
                                  </div>
                                </Popover>
                              )}
                            </div>
                          ),
                          children: (
                            <div style={{ 
                              marginBottom: tierIndex < tierArray.length - 1 ? '16px' : '0',
                              borderBottom: tierIndex < tierArray.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none',
                              paddingBottom: tierIndex < tierArray.length - 1 ? '16px' : '0'
                            }}>
                              {tierChanges.map((item, index) => (
                                <div 
                                  key={`${item.seatRange}-${item.tier}-${index}`}
                                  style={{ 
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '8px 0',
                                    borderBottom: index < tierChanges.length - 1 ? `1px solid ${token.colorBorderSecondary}` : 'none'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Text style={{ fontSize: token.fontSize, fontWeight: 'normal' }}>
                                      {item.seatRange} seats
                                    </Text>
                                    {isLargeChange(item) && (
                                      <Popover 
                                        content="New price is more than 10% of current"
                                        placement="top"
                                      >
                                        <TriangleAlert size={12} color={token.colorWarning} />
                                      </Popover>
                                    )}
                                  </div>
                                  <div style={{ textAlign: 'right' }}>
                                    <Space size="small" align="center">
                                      {priceGroupAction === 'update' && item.currentPrice !== null && (
                                        <Text style={{ 
                                          color: token.colorTextTertiary,
                                          fontSize: token.fontSize,
                                          fontWeight: 'normal',
                                          textDecoration: 'line-through',
                                          fontVariantNumeric: 'tabular-nums'
                                        }}>
                                          {formatCurrencyAmount(item.currentPrice, currency)}
                                        </Text>
                                      )}
                                      <Text style={{ 
                                        fontWeight: 'normal',
                                        fontSize: token.fontSize,
                                        fontVariantNumeric: 'tabular-nums'
                                      }}>
                                        {formatCurrencyAmount(item.newPrice, currency)}
                                      </Text>
                                      {priceGroupAction === 'update' && (
                                        <Text style={{ 
                                          color: item.change.amount > 0 ? token.colorSuccess : token.colorError,
                                          fontSize: token.fontSize,
                                          fontWeight: 'normal'
                                        }}>
                                          {item.change.amount > 0 ? '+' : ''}{item.change.percentage.toFixed(1)}%
                                        </Text>
                                      )}
                                    </Space>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        };
                      })}
                    />
                  </div>
                )
              };
            })}
          />
        </div>
      </Space>
    );
  } else {
    // Non-field channels: Clean price grid approach  
    const nonFieldChanges = changes as PriceChange[];

    // Get SKU context for display  
    const skuContext = productName || 'Unknown Product';
    const skuStatus = priceGroupAction === 'create' ? '🆕 Creating new SKU' : '✏️ Updating SKU';
    
    // Get validity info - use the first change's validity since they're all the same
    const validityInfo = nonFieldChanges.length > 0 ? nonFieldChanges[0].validity : '';

    return (
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Main heading */}
        {!hideTitle && (
          <div>
            <Title level={3} style={{ 
              marginBottom: '24px',
              fontSize: token.fontSizeHeading2 
            }}>
              Review changes
            </Title>
          </div>
        )}

        {/* SKU Status */}
        <div>
          <Text style={{ 
            fontSize: token.fontSizeLG,
            fontWeight: 500,
            display: 'block',
            marginBottom: '8px'
          }}>
            {skuStatus}: {skuContext}
          </Text>
        </div>

        {/* Price verification section */}
        <div>
          <Text style={{ 
            fontSize: token.fontSize,
            fontWeight: 500,
            display: 'block',
            marginBottom: '12px'
          }}>
            Double-check your prices:
          </Text>
          
          {/* Price Grid */}
          <div style={{
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadiusLG,
            padding: '16px',
            backgroundColor: token.colorBgContainer,
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '12px 24px',
              alignItems: 'center'
            }}>
              {nonFieldChanges.map((change, _) => (
                <div key={change.currency} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Text style={{ 
                    fontWeight: 500,
                    color: token.colorText,
                    minWidth: '32px'
                  }}>
                    {change.currency}
                  </Text>
                  <Text style={{ 
                    fontVariantNumeric: 'tabular-nums',
                    fontWeight: 400,
                    color: token.colorText
                  }}>
                    {formatCurrencyAmount(change.newPrice, change.currency)}
                  </Text>
                  {/* Show change indicator if updating */}
                  {priceGroupAction === 'update' && change.currentPrice !== null && (
                    <>
                      {Math.abs(change.change.percentage) > 10 && (
                        <Popover 
                          content="Price change is more than 10%"
                          placement="top"
                        >
                          <TriangleAlert size={12} color={token.colorWarning} />
                        </Popover>
                      )}
                      <Text style={{ 
                        fontSize: token.fontSizeSM,
                        color: change.change.amount > 0 ? token.colorSuccess : token.colorError,
                        fontWeight: 400
                      }}>
                        {change.change.amount > 0 ? '+' : ''}{change.change.percentage.toFixed(1)}%
                      </Text>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Validity info */}
          {validityInfo && (
            <Text style={{ 
              color: token.colorTextSecondary,
              display: 'block',
              marginBottom: '16px',
              fontSize: token.fontSize
            }}>
              📅 Valid from: {validityInfo}
            </Text>
          )}

          {/* Edit link */}
          <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
            ✏️ Need to change something?{' '}
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                // This would trigger going back to edit step - you can implement this functionality
              }}
              style={{ color: token.colorPrimary }}
            >
              Go back to edit prices
            </a>
          </Text>
        </div>
      </Space>
    );
  }
};

export default PriceChangesSummary;
