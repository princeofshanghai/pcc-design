import React, { useMemo } from 'react';
import { Table, Space, Typography, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { PriceGroup, Sku } from '../../utils/types';
import { formatCurrency, formatEffectiveDateRange, toSentenceCase } from '../../utils/formatters';
import CountTag from '../attributes/CountTag';
import CopyableId from '../shared/CopyableId';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface PriceGroupTableProps {
  priceGroups: Array<{ priceGroup: PriceGroup; skus: Sku[] }>;
  groupedPriceGroups?: Record<string, Array<{ priceGroup: PriceGroup; skus: Sku[] }>> | null;
  groupBy?: string;
  productId: string;
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
  productId 
}) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  // Table columns
  const columns: ColumnsType<any> = [
    {
      title: toSentenceCase('ID'),
      dataIndex: 'id',
      key: 'id',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return (
          <Space onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <span>{record.priceGroup.id}</span>
            <CopyableId id={record.priceGroup.id || ''} showId={false} />
          </Space>
        );
      },
      className: 'table-col-first',
    },
    {
      title: toSentenceCase('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.priceGroup.name;
      },
    },
    {
      title: toSentenceCase('Channel'),
      dataIndex: 'channel',
      key: 'channel',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.skus[0].salesChannel;
      },
    },
    {
      title: toSentenceCase('Billing Cycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return record.skus[0].billingCycle;
      },
    },
    {
      title: toSentenceCase('USD Price'),
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        const usd = record.priceGroup.pricePoints.find((p: any) => p.currencyCode === 'USD');
        return usd ? formatCurrency(usd) : 'N/A';
      },
    },
    {
      title: toSentenceCase('Currencies'),
      dataIndex: 'currencies',
      key: 'currencies',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return <CountTag count={record.priceGroup.pricePoints.length} />;
      },
    },
    {
      title: toSentenceCase('SKU'),
      dataIndex: 'sku',
      key: 'sku',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return `${record.skus.length} SKU${record.skus.length > 1 ? 's' : ''}`;
      },
    },
    {
      title: toSentenceCase('Effective Date'),
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      render: (_: any, record: any) => {
        if ('isGroupHeader' in record) return null;
        return formatEffectiveDateRange(record.priceGroup.startDate, record.priceGroup.endDate);
      },
    },
  ];

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
                const displayTitle = groupBy === 'Channel' ? `Channel: ${title}` : 
                                   groupBy === 'Billing Cycle' ? `Billing Cycle: ${title}` : title;
                return (
                  <tr {...props} className="ant-table-row-group-header">
                    <td colSpan={columns.length} style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
                      <Space>
                        <Text style={{ fontSize: token.fontSizeHeading3, fontWeight: 500 }}>{displayTitle}</Text>
                        <CountTag count={count} />
                      </Space>
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