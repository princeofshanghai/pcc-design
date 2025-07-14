import React, { useMemo } from 'react';
import { Table, Space } from 'antd';
import type { PriceGroup, Sku } from '../../utils/types';
import { formatCurrency, formatEffectiveDateRange } from '../../utils/formatters';
import CountTag from '../attributes/CountTag';
import CopyableId from '../shared/CopyableId';

interface PriceGroupTableProps {
  skus: Sku[];
}

const PriceGroupTable: React.FC<PriceGroupTableProps> = ({ skus }) => {
  // Derive unique price groups and their associated SKUs
  const priceGroupMap = useMemo(() => {
    const map: Record<string, { priceGroup: PriceGroup; skus: Sku[] }> = {};
    skus.forEach(sku => {
      const id = sku.priceGroup.id || '';
      if (!map[id]) {
        map[id] = { priceGroup: sku.priceGroup, skus: [] };
      }
      map[id].skus.push(sku);
    });
    return map;
  }, [skus]);

  const priceGroups = useMemo(() => Object.values(priceGroupMap), [priceGroupMap]);

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_: any, record: typeof priceGroups[0]) => (
        <Space onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <span>{record.priceGroup.id}</span>
          <CopyableId id={record.priceGroup.id || ''} showId={false} />
        </Space>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: typeof priceGroups[0]) => record.priceGroup.name,
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      key: 'channel',
      render: (_: any, record: typeof priceGroups[0]) => record.skus[0].salesChannel,
    },
    {
      title: 'Billing Cycle',
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (_: any, record: typeof priceGroups[0]) => record.skus[0].billingCycle,
    },
    {
      title: 'USD Price',
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      render: (_: any, record: typeof priceGroups[0]) => {
        const usd = record.priceGroup.pricePoints.find(p => p.currencyCode === 'USD');
        return usd ? formatCurrency(usd) : 'N/A';
      },
    },
    {
      title: 'Currencies',
      dataIndex: 'currencies',
      key: 'currencies',
      render: (_: any, record: typeof priceGroups[0]) => <CountTag count={record.priceGroup.pricePoints.length} />,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (_: any, record: typeof priceGroups[0]) => `${record.skus.length} SKU${record.skus.length > 1 ? 's' : ''}`,
    },
    {
      title: 'Effective Date',
      dataIndex: 'effectiveDate',
      key: 'effectiveDate',
      render: (_: any, record: typeof priceGroups[0]) => formatEffectiveDateRange(record.priceGroup.startDate, record.priceGroup.endDate),
    },
  ];

  return (
    <div className="content-panel">
      <Table
        columns={columns}
        dataSource={priceGroups}
        rowKey={record => record.priceGroup.id || Math.random().toString()}
        pagination={false}
        size="small"
      />
    </div>
  );
};

export default PriceGroupTable; 