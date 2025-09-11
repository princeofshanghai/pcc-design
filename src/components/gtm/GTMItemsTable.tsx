import React, { useMemo } from 'react';
import { Table, Typography, Tag, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link } from 'react-router-dom';
import { Check, X, Clock } from 'lucide-react';
import type { GTMItem, ApprovalRequirement } from '../../utils/types';
import { formatFullDate } from '../../utils/formatters';
import InfoPopover from '../shared/InfoPopover';

const { Text } = Typography;

// Get approval status icon
const getApprovalIcon = (status: string) => {
  switch (status) {
    case 'Approved':
      return <Check size={14} style={{ color: '#22c55e' }} />;
    case 'Rejected': 
      return <X size={14} style={{ color: '#ef4444' }} />;
    case 'Pending':
    default:
      return <Clock size={14} style={{ color: '#f59e0b' }} />;
  }
};

interface GTMItemsTableProps {
  items: GTMItem[];
}

const GTMItemsTable: React.FC<GTMItemsTableProps> = ({ items }) => {
  const { token } = theme.useToken();

  // Calculate overall approval progress
  const allApprovers = useMemo(() => {
    const approverMap = new Map<string, ApprovalRequirement>();
    
    items.forEach(item => {
      item.approvalRequirements.forEach(req => {
        const existing = approverMap.get(req.team);
        if (!existing || 
            (req.status === 'Approved' && existing.status !== 'Approved') ||
            (req.status === 'Pending' && existing.status === 'Rejected')) {
          approverMap.set(req.team, req);
        }
      });
    });

    return Array.from(approverMap.values()).sort((a, b) => a.team.localeCompare(b.team));
  }, [items]);

  const approvedCount = allApprovers.filter(req => req.status === 'Approved').length;
  const totalCount = allApprovers.length;

  const columns: ColumnsType<GTMItem> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color="blue" style={{ fontSize: '10px', lineHeight: '18px' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Product', 
      dataIndex: 'productName',
      key: 'productName',
      width: 160,
      render: (productName: string, record: GTMItem) => (
        <div>
          <Link to={`/product/${record.productId}`} onClick={(e) => e.stopPropagation()}>
            <Text style={{ fontWeight: 500, fontSize: '13px' }}>{productName}</Text>
          </Link>
          <br />
          <Text style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
            {record.details}
          </Text>
        </div>
      ),
    },
    {
      title: 'Approval Progress',
      dataIndex: 'approvalRequirements',
      key: 'approvalRequirements',
      render: (requirements: ApprovalRequirement[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          {requirements.map((req, index) => (
            <InfoPopover
              key={index}
              content={
                req.status === 'Approved' && req.approvedBy 
                  ? `Approved by ${req.approvedBy} on ${formatFullDate(req.approvedDate || '').split(' at ')[0]}`
                  : `${req.team} approval ${req.status.toLowerCase()}`
              }
              placement="top"
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                cursor: 'help'
              }}>
                {getApprovalIcon(req.status)}
                <Text style={{ fontSize: '12px' }}>{req.team}</Text>
                {req.status === 'Approved' && req.approvedDate && (
                  <Text style={{ 
                    fontSize: '11px', 
                    color: token.colorTextTertiary,
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    ({formatFullDate(req.approvedDate).split(' at ')[0].split(', ')[1]})
                  </Text>
                )}
              </div>
            </InfoPopover>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (_: string, record: GTMItem) => {
        const allApproved = record.approvalRequirements.every(req => req.status === 'Approved');
        const displayStatus = allApproved ? 'Ready' : 'Pending';
        const displayColor = allApproved ? 'success' : 'warning';

        return (
          <Tag color={displayColor} style={{ fontSize: '11px' }}>
            {displayStatus}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      {/* Motion Approval Progress Header */}
      <div style={{ 
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: token.colorBgLayout,
        borderRadius: token.borderRadius,
        border: `1px solid ${token.colorBorder}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 500, fontSize: '14px' }}>Motion Approval Progress</Text>
          <Text style={{ fontWeight: 500, fontSize: '14px' }}>
            {approvedCount}/{totalCount} teams approved
          </Text>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allApprovers.map((req, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {getApprovalIcon(req.status)}
              <Text style={{ fontSize: '12px' }}>{req.team}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* GTM Items Table */}
      <Table
        size="large"
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        scroll={{ x: 'max-content' }}
        showHeader={true}
      />
    </div>
  );
};

export default GTMItemsTable;
