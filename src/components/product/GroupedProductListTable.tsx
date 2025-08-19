import React, { useMemo, useState, useEffect } from 'react';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product, ColumnVisibility, ColumnOrder } from '../../utils/types';
import { getProductListTableColumns } from './ProductListTable';
import GroupHeader from '../shared/GroupHeader';
import type { ColumnsType } from 'antd/es/table';

interface GroupedProductListTableProps {
  groupedProducts: Record<string, Product[]>;
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
}

type TableRow = Product | { 
  isGroupHeader: true; 
  key: string; 
  title: string; 
  count: number;
  groupKey: string;
};

const GroupedProductListTable: React.FC<GroupedProductListTableProps> = ({ 
  groupedProducts, 
  visibleColumns = {},
  columnOrder = ['id', 'name', 'folder', 'channel', 'skus', 'status']
}) => {
  const navigate = useNavigate();
  const columns = getProductListTableColumns(navigate, visibleColumns, columnOrder) as ColumnsType<TableRow>;
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Auto-expand all groups when groupedProducts changes (i.e., when grouping is applied)
  useEffect(() => {
    if (groupedProducts) {
      const allGroupKeys = Object.keys(groupedProducts);
      setExpandedGroups(allGroupKeys);
    } else {
      setExpandedGroups([]);
    }
  }, [groupedProducts]);

  // Prepare data source with expand/collapse functionality
  const dataSource: TableRow[] = useMemo(() => {
    const result: TableRow[] = [];
    Object.entries(groupedProducts).forEach(([groupTitle, groupProducts]) => {
      result.push({
        isGroupHeader: true,
        key: `header-${groupTitle}`,
        title: groupTitle,
        count: groupProducts.length,
        groupKey: groupTitle,
      });
      // Only add group items if the group is expanded
      if (expandedGroups.includes(groupTitle)) {
        result.push(...groupProducts);
      }
    });
    return result;
  }, [groupedProducts, expandedGroups]);

  const handleGroupToggle = (groupKey: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupKey) 
        ? prev.filter(key => key !== groupKey)
        : [...prev, groupKey]
    );
  };

  return (
    <div style={{ marginTop: '16px' }}>
      <Table<TableRow>
        size="small"
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => ('isGroupHeader' in record ? record.key : record.id)}
        pagination={false}
        scroll={{ x: 'max-content' }}
        rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
        onRow={(record) => ({
          onClick: () => {
            if ('isGroupHeader' in record) return;
            navigate(`/product/${record.id}`);
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
                        contextType="products"
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

export default GroupedProductListTable; 