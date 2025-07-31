import React, { useMemo, useState, useEffect } from 'react';
import { Table, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { PriceGroup, Sku, ColumnVisibility, ColumnOrder, PricePoint } from '../../utils/types';
import { formatCurrency, formatValidityRange, toSentenceCase, formatColumnTitles } from '../../utils/formatters';
import { PRICE_GROUP_COLUMNS } from '../../utils/tableConfigurations';
import GroupHeader from '../shared/GroupHeader';
import CopyableId from '../shared/CopyableId';
import { ExperimentalBadge } from '../configuration/ExperimentalBadge';
import SalesChannelDisplay from '../attributes/SalesChannelDisplay';
import BillingCycleDisplay from '../attributes/BillingCycleDisplay';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PriceGroupTableProps {
  priceGroups: Array<{ priceGroup: PriceGroup; skus: Sku[] }>;
  groupedPriceGroups?: Record<string, Array<{ priceGroup: PriceGroup; skus: Sku[] }>> | null;
  productId: string;
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
}

type TableRow = {
  priceGroup: PriceGroup;
  skus: Sku[];
} | {
  isGroupHeader: true;
  key: string;
  title: string;
  count: number;
  groupKey: string;
};

/**
 * Determines the common validity range for a price group based on its price points
 */
const getCommonValidityRange = (pricePoints: PricePoint[]): string => {
  if (!pricePoints || pricePoints.length === 0) return 'N/A';

  // Count frequency of valid from dates
  const validFromCounts: Record<string, number> = {};
  const validToCounts: Record<string, number> = {};
  
  pricePoints.forEach(point => {
    const validFrom = point.validFrom || '';
    const validTo = point.validTo || '';
    
    validFromCounts[validFrom] = (validFromCounts[validFrom] || 0) + 1;
    validToCounts[validTo] = (validToCounts[validTo] || 0) + 1;
  });

  // Find most common valid from date
  const validFromEntries = Object.entries(validFromCounts);
  const mostCommonValidFromEntry = validFromEntries.reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  );
  const mostCommonValidFrom = mostCommonValidFromEntry[0];
  const validFromFrequency = mostCommonValidFromEntry[1];

  // Find most common valid to date
  const validToEntries = Object.entries(validToCounts);
  const mostCommonValidToEntry = validToEntries.reduce((prev, current) => 
    current[1] > prev[1] ? current : prev
  );
  const mostCommonValidTo = mostCommonValidToEntry[0];
  const validToFrequency = mostCommonValidToEntry[1];

  // Check if dates are mixed
  const hasMultipleValidFromDates = validFromEntries.length > 1;
  const hasMultipleValidToDates = validToEntries.length > 1;
  
  // If valid from dates vary significantly, show "Mixed validity"
  if (hasMultipleValidFromDates && validFromFrequency < pricePoints.length * 0.7) {
    return 'Mixed validity';
  }
  
  // If valid to dates vary significantly, but valid from dates are consistent
  if (hasMultipleValidToDates && validToFrequency < pricePoints.length * 0.7) {
    return formatValidityRange(mostCommonValidFrom, undefined) + ' - Mixed validity end dates';
  }
  
  // Use most common dates
  return formatValidityRange(
    mostCommonValidFrom || undefined, 
    mostCommonValidTo || undefined
  );
};

const PriceGroupTable: React.FC<PriceGroupTableProps> = ({ 
  priceGroups, 
  groupedPriceGroups, 
  productId,
  visibleColumns = {},
  columnOrder = ['name', 'channel', 'billingCycle', 'usdPrice', 'currencies', 'sku', 'effectiveDate'],
}) => {
  const navigate = useNavigate();

  // Create a helper to get column label from centralized config
  const getColumnLabel = (key: string): string => {
    const column = PRICE_GROUP_COLUMNS.find(col => col.key === key);
    return column?.label || toSentenceCase(key);
  };

  // Define all possible columns
  const allColumnsMap: Record<string, any> = {
    id: {
      title: getColumnLabel('id'),
      dataIndex: 'id',
      key: 'id',
      // ID column always visible
      fixed: 'left',
      minWidth: 150,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        return (
          <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <CopyableId id={record.priceGroup.id || ''} variant="prominent" />
          </div>
        );
      },
      className: 'table-col-first',
    },
    name: visibleColumns.name !== false ? {
      title: getColumnLabel('name'),
      dataIndex: 'name',
      key: 'name',
      minWidth: 200,
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        // Find experimental SKUs in this price group
        const experimentalSkus = record.skus.filter((sku: Sku) => sku.lix?.key);
        const firstExperimentalSku = experimentalSkus[0];
        
        const getPriceGroupTooltipContent = () => {
          if (!firstExperimentalSku) return null;
          
          return (
            <div style={{ maxWidth: 300 }}>
              <Space direction="vertical" size={4}>
                <Text strong style={{ color: 'white' }}>This price group is part of a SKU experiment</Text>
                <div style={{ marginTop: 8 }}>
                  <Text style={{ color: 'white', fontSize: '13px' }}>
                    <strong>SKU:</strong> {firstExperimentalSku.id}
                  </Text>
                  <div>
                    <Text style={{ color: 'white', fontSize: '13px' }}>
                      <strong>LIX Key:</strong> {firstExperimentalSku.lix.key}
                    </Text>
                  </div>
                  {firstExperimentalSku.lix.treatment && (
                    <div>
                      <Text style={{ color: 'white', fontSize: '13px' }}>
                        <strong>Treatment:</strong> {firstExperimentalSku.lix.treatment}
                      </Text>
                    </div>
                  )}
                  {experimentalSkus.length > 1 && (
                    <div style={{ marginTop: 4 }}>
                      <Text style={{ color: 'white', fontSize: '13px' }}>
                        +{experimentalSkus.length - 1} more experimental SKU{experimentalSkus.length - 1 > 1 ? 's' : ''}
                      </Text>
                    </div>
                  )}
                </div>
              </Space>
            </div>
          );
        };
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontWeight: 500 }}>
              {record.priceGroup.name || '-'}
            </span>
            {firstExperimentalSku && (
              <ExperimentalBadge 
                lixKey={firstExperimentalSku.lix.key} 
                lixTreatment={firstExperimentalSku.lix.treatment} 
                variant="compact"
                customTooltipContent={getPriceGroupTooltipContent()}
              />
            )}
          </div>
        );
      },
    } : null,
    channel: visibleColumns.channel !== false ? {
      title: getColumnLabel('channel'),
      dataIndex: 'channel',
      key: 'channel',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        // Get all unique channels from SKUs using this price group
        const uniqueChannels = [...new Set(record.skus.map((sku: Sku) => sku.salesChannel))];
        return (
          <Space size="small">
            {uniqueChannels.map((channel: any) => (
              <SalesChannelDisplay key={channel} channel={channel} />
            ))}
          </Space>
        );
      },
    } : null,
    billingCycle: visibleColumns.billingCycle !== false ? {
      title: getColumnLabel('billingCycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        // Get all unique billing cycles from SKUs using this price group
        const uniqueBillingCycles = [...new Set(record.skus.map((sku: Sku) => sku.billingCycle))];
        return (
          <Space size="small">
            {uniqueBillingCycles.map((billingCycle: any) => (
              <BillingCycleDisplay key={billingCycle} billingCycle={billingCycle} />
            ))}
          </Space>
        );
      },
    } : null,
    usdPrice: visibleColumns.usdPrice !== false ? {
      title: getColumnLabel('usdPrice'),
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        const usd = record.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        return usd ? formatCurrency(usd) : (
          <Text type="secondary">No USD price</Text>
        );
      },
    } : null,
    currencies: visibleColumns.currencies !== false ? {
      title: getColumnLabel('currencies'),
      dataIndex: 'currencies',
      key: 'currencies',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.priceGroup.pricePoints.length;
      },
    } : null,
    sku: visibleColumns.sku !== false ? {
      title: getColumnLabel('sku'),
      dataIndex: 'sku',
      key: 'sku',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.skus.length;
      },
    } : null,
    validity: visibleColumns.validity !== false ? {
      title: getColumnLabel('validity'),
      dataIndex: 'validity',
      key: 'validity',
      render: (_: any, record: any) => {
        return getCommonValidityRange(record.priceGroup.pricePoints);
      },
    } : undefined,
  };

  // Build columns in the specified order, filtering out hidden/null columns
  const columns: ColumnsType<any> = formatColumnTitles(
    columnOrder
      .map(key => allColumnsMap[key])
      .filter(Boolean)
  );

  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Auto-expand all groups when groupedPriceGroups changes (i.e., when grouping is applied)
  useEffect(() => {
    if (groupedPriceGroups) {
      const allGroupKeys = Object.keys(groupedPriceGroups);
      setExpandedGroups(allGroupKeys);
    } else {
      setExpandedGroups([]);
    }
  }, [groupedPriceGroups]);

  // Prepare data source
  const dataSource: TableRow[] = useMemo(() => {
    if (groupedPriceGroups) {
      // Grouped data
      const result: TableRow[] = [];
      Object.entries(groupedPriceGroups).forEach(([groupTitle, groups]) => {
        result.push({
          isGroupHeader: true,
          key: `header-${groupTitle}`,
          title: groupTitle,
          count: groups.length,
          groupKey: groupTitle,
        });
        // Only add group items if the group is expanded
        if (expandedGroups.includes(groupTitle)) {
          result.push(...groups);
        }
      });
      return result;
    } else {
      // Ungrouped data
      return priceGroups;
    }
  }, [priceGroups, groupedPriceGroups, expandedGroups]);

  const handleGroupToggle = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  return (
    <div className="content-panel">
      <Table
        size="small"
        columns={columns}
        dataSource={dataSource}
        rowKey={record => ('isGroupHeader' in record ? record.key : record.priceGroup.id || Math.random().toString())}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
        onRow={(record) => ({
          onClick: () => {
            if ('isGroupHeader' in record) return;
            navigate(`/product/${productId}/price-group/${record.priceGroup.id}`);
          },
          style: { cursor: 'isGroupHeader' in record ? 'default' : 'pointer' },
        })}
        components={{
          body: {
            row: (props: any) => {
              if (props.children[0]?.props?.record?.isGroupHeader) {
                const { title, count, groupKey } = props.children[0].props.record;
                const isExpanded = expandedGroups.includes(groupKey);
                return (
                  <tr {...props} className="ant-table-row-group-header">
                    <td colSpan={columns.length} style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
                      <GroupHeader 
                        title={title}
                        count={count}
                        contextType="price groups"
                        isExpanded={isExpanded}
                        onToggle={() => handleGroupToggle(groupKey)}
                        isExpandable={true}
                      />
                    </td>
                  </tr>
                );
              }
              return <tr {...props} />;
            },
          },
        }}
      />
    </div>
  );
};

export default PriceGroupTable; 