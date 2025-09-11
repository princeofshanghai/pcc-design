import React from 'react';
import { Table, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { GTMMotion, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { formatFullDate, formatShortDate, formatFullDateTimeUTC } from '../../utils/formatters';
import { TEAM_MEMBERS } from '../../utils/users';
import CopyableId from '../shared/CopyableId';
import InfoPopover from '../shared/InfoPopover';
import GTMStatusTag from '../attributes/GTMStatusTag';

const { Text } = Typography;

// Helper function to get LDAP for display
const getLdapForDisplay = (createdBy: string): string => {
  // Check if it's a known team member full name, return their LDAP
  const teamMemberByFullName = Object.values(TEAM_MEMBERS).find(member => member.fullName === createdBy);
  if (teamMemberByFullName) {
    return teamMemberByFullName.ldap;
  }
  
  // Check if it's already a known team member LDAP
  const isTeamMemberLdap = Object.values(TEAM_MEMBERS).some(member => member.ldap === createdBy);
  if (isTeamMemberLdap) {
    return createdBy;
  }
  
  // Handle special cases
  if (createdBy === 'current.user') {
    return 'current.user';
  }
  
  if (createdBy === 'System') {
    return 'System';
  }
  
  // For mock LDAP names like "sarah.johnson", keep as is
  return createdBy;
};


interface GTMMotionTableProps {
  gtmMotions: GTMMotion[];
  visibleColumns: ColumnVisibility;
  columnOrder: ColumnOrder;
}

const GTMMotionTable: React.FC<GTMMotionTableProps> = ({ 
  gtmMotions, 
  visibleColumns, 
  columnOrder 
}) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();

  const columns: ColumnsType<GTMMotion> = [
    {
      title: 'Motion ID',
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      render: (id: string) => (
        <div onClick={(e: React.MouseEvent) => e.stopPropagation()}>
          <CopyableId id={id} variant="default" />
        </div>
      ),
      className: 'table-col-first',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string, record: GTMMotion) => (
        <div>
          <Text style={{ fontWeight: 500 }}>{name}</Text>
          <br />
          <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM }}>
            {record.items.length} change{record.items.length !== 1 ? 's' : ''}
          </Text>
        </div>
      ),
    },
    {
      title: 'Product',
      key: 'product',
      render: (_, record: GTMMotion) => {
        // Get unique products from the motion items
        const uniqueProducts = Array.from(
          new Map(record.items.map(item => [item.productId, item])).values()
        );

        if (uniqueProducts.length === 0) {
          return (
            <Text style={{ color: token.colorTextTertiary, fontSize: token.fontSizeSM }}>
              No products
            </Text>
          );
        }

        if (uniqueProducts.length === 1) {
          const product = uniqueProducts[0];
          return (
            <Text>{product.productName}</Text>
          );
        }

        // Multiple products
        return (
          <div>
            <Text>{uniqueProducts[0].productName}</Text>
            <span style={{ color: token.colorTextSecondary }}> +{uniqueProducts.length - 1} more</span>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: GTMMotion['status']) => (
        <GTMStatusTag status={status} variant="small" />
      ),
    },
    {
      title: 'Activation Date',
      dataIndex: 'activationDate',
      key: 'activationDate',
      render: (date: string) => (
        <Text style={{ color: token.colorTextSecondary }}>
          {formatFullDate(date)}
        </Text>
      ),
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (createdBy: string, record: GTMMotion) => (
        <div>
          <Text>{getLdapForDisplay(createdBy)}</Text>
          <br />
          <InfoPopover 
            content={formatFullDateTimeUTC(record.createdDate)}
            placement="top"
          >
            <Text style={{ color: token.colorTextSecondary, fontSize: token.fontSizeSM, cursor: 'help' }}>
              {formatShortDate(record.createdDate)}
            </Text>
          </InfoPopover>
        </div>
      ),
    },
  ];

  // Action column (always visible, fixed to right) - visual indicator for clickability
  const actionColumn = {
    title: '', // No column title
    key: 'actions',
    fixed: 'right' as const,
    width: 48,
    className: 'table-action-column',
    render: (_: any, _record: GTMMotion) => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}>
        <ChevronRight 
          size={16} 
          style={{ 
            color: token.colorTextTertiary,
          }} 
        />
      </div>
    ),
  };

  // Filter columns based on visibility and reorder them
  const visibleOrderedColumns = [
    ...columnOrder
      .filter(key => visibleColumns[key])
      .map(key => columns.find(col => col.key === key))
      .filter((col): col is NonNullable<typeof col> => col !== undefined),
    actionColumn
  ];

  return (
    <Table
      size="large"
      columns={visibleOrderedColumns}
      dataSource={gtmMotions}
      rowKey="id"
      pagination={false}
      scroll={{ x: 'max-content' }}
      onRow={(record) => ({
        onClick: () => {
          navigate(`/gtm-motions/${record.id}`);
        },
        style: { cursor: 'pointer' }
      })}
    />
  );
};

export default GTMMotionTable;
