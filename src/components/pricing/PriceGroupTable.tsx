import React, { useMemo } from 'react';
import { Table, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { PriceGroup, Sku } from '../../utils/types';
import { formatCurrency, formatEffectiveDateRange, toSentenceCase } from '../../utils/formatters';
import CountTag from '../attributes/CountTag';
import CopyableId from '../shared/CopyableId';

interface PriceGroupTableProps {
  skus: Sku[];
  productId: string;
}

const PriceGroupTable: React.FC<PriceGroupTableProps> = ({ skus, productId }) => {
  const navigate = useNavigate();
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
      title: toSentenceCase('ID'),
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
      title: toSentenceCase('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: typeof priceGroups[0]) => record.priceGroup.name,
    },
    {
      title: toSentenceCase('Channel'),
      dataIndex: 'channel',
      key: 'channel',
      render: (_: any, record: typeof priceGroups[0]) => record.skus[0].salesChannel,
    },
    {
      title: toSentenceCase('Billing Cycle'),
      dataIndex: 'billingCycle',
      key: 'billingCycle',
      render: (_: any, record: typeof priceGroups[0]) => record.skus[0].billingCycle,
    },
    {
      title: toSentenceCase('USD Price'),
      dataIndex: 'usdPrice',
      key: 'usdPrice',
      render: (_: any, record: typeof priceGroups[0]) => {
        const usd = record.priceGroup.pricePoints.find(p => p.currencyCode === 'USD');
        return usd ? formatCurrency(usd) : 'N/A';
      },
    },
    {
      title: toSentenceCase('Currencies'),
      dataIndex: 'currencies',
      key: 'currencies',
      render: (_: any, record: typeof priceGroups[0]) => <CountTag count={record.priceGroup.pricePoints.length} />,
    },
    {
      title: toSentenceCase('SKU'),
      dataIndex: 'sku',
      key: 'sku',
      render: (_: any, record: typeof priceGroups[0]) => `${record.skus.length} SKU${record.skus.length > 1 ? 's' : ''}`,
    },
    {
      title: toSentenceCase('Effective Date'),
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
        onRow={(record) => ({
          onClick: () => {
            navigate(`/product/${productId}/price-group/${record.priceGroup.id}`);
          },
          style: { cursor: 'pointer' },
          onMouseEnter: (e) => {
            e.currentTarget.style.backgroundColor = '#f5f5f5';
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.backgroundColor = '';
          },
        })}
      />
    </div>
  );
};

export default PriceGroupTable; 