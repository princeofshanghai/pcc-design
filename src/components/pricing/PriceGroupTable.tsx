import React, { useMemo, useState } from 'react';
import { Table, Space } from 'antd';
import type { PriceGroup, Sku, SalesChannel, BillingCycle, Status } from '../../utils/types';
import FilterBar from '../filters/FilterBar';
import { formatCurrency, toSentenceCase, formatEffectiveDateRange } from '../../utils/formatters';
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

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [channelFilter, setChannelFilter] = useState<SalesChannel | null>(null);
  const [billingCycleFilter, setBillingCycleFilter] = useState<BillingCycle | null>(null);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [sortOrder, setSortOrder] = useState<string>('None');
  const [groupBy, setGroupBy] = useState<string>('None');

  // Filter options
  const channelOptions = useMemo(() => {
    const set = new Set<SalesChannel>();
    priceGroups.forEach(pg => pg.skus.forEach(sku => set.add(sku.salesChannel)));
    return Array.from(set).map(c => ({ value: c, label: toSentenceCase(c) }));
  }, [priceGroups]);
  const billingCycleOptions = useMemo(() => {
    const set = new Set<BillingCycle>();
    priceGroups.forEach(pg => pg.skus.forEach(sku => set.add(sku.billingCycle)));
    return Array.from(set).map(bc => ({ value: bc, label: toSentenceCase(bc) }));
  }, [priceGroups]);
  const statusOptions = useMemo(() => {
    const set = new Set<Status>();
    priceGroups.forEach(pg => pg.priceGroup.status && set.add(pg.priceGroup.status));
    return Array.from(set).map(s => ({ value: s, label: toSentenceCase(s) }));
  }, [priceGroups]);

  // Filtering logic
  const filteredPriceGroups = useMemo(() => {
    return priceGroups.filter(pg => {
      const sku = pg.skus[0]; // All SKUs for a price group have the same channel/cycle
      if (channelFilter && sku.salesChannel !== channelFilter) return false;
      if (billingCycleFilter && sku.billingCycle !== billingCycleFilter) return false;
      if (statusFilter && pg.priceGroup.status !== statusFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!pg.priceGroup.id?.toLowerCase().includes(q) &&
            !pg.priceGroup.name.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [priceGroups, channelFilter, billingCycleFilter, statusFilter, searchQuery]);

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (_: any, record: typeof priceGroups[0]) => (
        <Space onClick={e => e.stopPropagation()}>
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
    <Space direction="vertical" size={32} style={{ width: '100%' }}>
      <FilterBar
        search={{
          placeholder: 'Search by ID or Name...',
          onChange: setSearchQuery,
        }}
        filters={[
          {
            placeholder: 'All Channels',
            options: channelOptions,
            value: channelFilter,
            onChange: (value) => setChannelFilter(value as SalesChannel ?? null),
          },
          {
            placeholder: 'All Cycles',
            options: billingCycleOptions,
            value: billingCycleFilter,
            onChange: (value) => setBillingCycleFilter(value as BillingCycle ?? null),
          },
          {
            placeholder: 'All Statuses',
            options: statusOptions,
            value: statusFilter,
            onChange: (value) => setStatusFilter(value as Status ?? null),
          },
        ]}
        viewOptions={{
          sortOrder: {
            value: sortOrder,
            setter: setSortOrder,
            options: ['None'],
          },
          groupBy: {
            value: groupBy,
            setter: setGroupBy,
            options: ['None'],
          },
        }}
        displayMode="drawer"
      />
      <Table
        columns={columns}
        dataSource={filteredPriceGroups}
        rowKey={record => record.priceGroup.id || Math.random().toString()}
        pagination={false}
        size="small"
      />
    </Space>
  );
};

export default PriceGroupTable; 