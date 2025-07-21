import React, { useMemo } from 'react';
import { Table, Space, Typography, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { PriceGroup, Sku, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { formatCurrency, formatEffectiveDateRange, toSentenceCase } from '../../utils/formatters';
import GroupHeader from '../shared/GroupHeader';
import CopyableId from '../shared/CopyableId';
import { ExperimentalBadge } from '../configuration/ExperimentalBadge';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PriceGroupTableProps {
  priceGroups: Array<{ priceGroup: PriceGroup; skus: Sku[] }>;
  groupedPriceGroups?: Record<string, Array<{ priceGroup: PriceGroup; skus: Sku[] }>> | null;
  groupBy?: string;
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
};

const PriceGroupTable: React.FC<PriceGroupTableProps> = ({ 
  priceGroups, 
  groupedPriceGroups, 
  groupBy,
  productId,
  visibleColumns = {},
  columnOrder = ['name', 'channel', 'billingCycle', 'usdPrice', 'currencies', 'sku', 'effectiveDate'],
}) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Define all possible columns
  const allColumnsMap: Record<string, any> = {
    name: {
      title: toSentenceCase('Name'),
      dataIndex: 'name',
      key: 'name',
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
                    <strong>SKU:</strong> {firstExperimentalSku.name}
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
          <div>
            <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
              {record.priceGroup.name}
              {firstExperimentalSku && (
                <ExperimentalBadge 
                  lixKey={firstExperimentalSku.lix.key} 
                  lixTreatment={firstExperimentalSku.lix.treatment} 
                  variant="compact"
                  customTooltipContent={getPriceGroupTooltipContent()}
                />
              )}
            </div>
            <div>
              <Space size="small" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <Text type="secondary" style={{ fontSize: '13px', fontFamily: 'monospace' }}>{record.priceGroup.id}</Text>
                <CopyableId id={record.priceGroup.id || ''} showId={false} />
              </Space>
            </div>
          </div>
        );
      },
      className: 'table-col-first',
    },
    channel: visibleColumns.channel !== false ? {
      title: toSentenceCase('Channel'),
      dataIndex: 'channel',
      key: 'channel',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.skus[0].salesChannel;
      },
    } : null,
    billingCycle: visibleColumns.billingCycle !== false ? {
      title: toSentenceCase('Billing Cycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.skus[0].billingCycle;
      },
    } : null,
    usdPrice: visibleColumns.usdPrice !== false ? {
      title: toSentenceCase('USD Price'),
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        const usd = record.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        return usd ? formatCurrency(usd) : 'N/A';
      },
    } : null,
    currencies: visibleColumns.currencies !== false ? {
      title: toSentenceCase('Currencies'),
      dataIndex: 'currencies',
      key: 'currencies',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.priceGroup.pricePoints.length;
      },
    } : null,
    sku: visibleColumns.sku !== false ? {
      title: toSentenceCase('SKU'),
      dataIndex: 'sku',
      key: 'sku',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        
        if (record.skus.length === 1) {
          const sku = record.skus[0];
          return (
            <Text 
              style={{ color: '#1677ff', cursor: 'pointer', textDecoration: 'underline' }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/product/${productId}/sku/${sku.id}`);
              }}
            >
              {sku.name}
            </Text>
          );
        }
        
        return record.skus.length;
      },
    } : null,
    effectiveDate: visibleColumns.effectiveDate !== false ? {
      title: toSentenceCase('Effective Date'),
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return formatEffectiveDateRange(record.priceGroup.startDate, record.priceGroup.endDate);
      },
    } : null,
  };

  // Build columns in the specified order, filtering out hidden/null columns
  const columns: ColumnsType<any> = columnOrder
    .map(key => allColumnsMap[key])
    .filter(Boolean);

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
        });
        result.push(...groups);
      });
      return result;
    } else {
      // Ungrouped data
      return priceGroups;
    }
  }, [priceGroups, groupedPriceGroups]);

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={record => ('isGroupHeader' in record ? record.key : record.priceGroup.id || Math.random().toString())}
        pagination={false}
        size="small"
        rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
        onRow={(record) => ({
          onClick: () => {
            if ('isGroupHeader' in record) return;
            navigate(`/product/${productId}/price-group/${record.priceGroup.id}`);
          },
          style: { cursor: 'isGroupHeader' in record ? 'default' : 'pointer' },
          onMouseEnter: (e) => {
            if (!('isGroupHeader' in record)) {
              e.currentTarget.style.backgroundColor = '#f5f5f5';
            }
          },
          onMouseLeave: (e) => {
            if (!('isGroupHeader' in record)) {
              e.currentTarget.style.backgroundColor = '';
            }
          },
        })}
        components={{
          body: {
            row: (props: any) => {
              if (props.children[0]?.props?.record?.isGroupHeader) {
                const { title, count } = props.children[0].props.record;
                return (
                  <tr {...props} className="ant-table-row-group-header">
                    <td colSpan={columns.length} style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
                      <GroupHeader 
                        title={title}
                        count={count}
                        contextType="price groups"
                        groupBy={groupBy}
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