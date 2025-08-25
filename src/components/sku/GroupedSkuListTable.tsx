import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Sku, Product } from '../../utils/types';
import { getSkuTableColumns } from './SkuListTable';
import GroupHeader from '../shared/GroupHeader';
import { type ColumnsType } from 'antd/es/table';

interface GroupedSkuListTableProps {
  groupedSkus: Record<string, Sku[]>;
  product: Product;
  currentTab?: string; // Add current tab to remember where we came from
}

// A special type to handle rows that can be either a real Sku or a group header
type TableRow = Sku | { isGroupHeader: true; key: string; title: string; count: number; groupKey: string };

const GroupedSkuListTable: React.FC<GroupedSkuListTableProps> = ({ groupedSkus, product, currentTab = 'skus' }) => {
  const navigate = useNavigate();
  const columns = getSkuTableColumns(product, navigate, false) as ColumnsType<TableRow>;
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  // Keep all groups collapsed by default when groupedSkus changes
  useEffect(() => {
    if (groupedSkus) {
      // Start with no expanded groups (all collapsed)
      setExpandedGroups([]);
    } else {
      setExpandedGroups([]);
    }
  }, [groupedSkus]);

  // We need to flatten the grouped data into a single array for the table,
  // inserting header objects along the way.
  const dataSource: TableRow[] = [];
  for (const groupTitle in groupedSkus) {
    const groupSkus = groupedSkus[groupTitle];
    dataSource.push({
      isGroupHeader: true,
      key: `header-${groupTitle}`,
      title: groupTitle,
      count: groupSkus.length,
      groupKey: groupTitle,
    });
    // Only add group items if the group is expanded
    if (expandedGroups.includes(groupTitle)) {
      dataSource.push(...groupSkus);
    }
  }

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
        rowClassName={(record) => ('isGroupHeader'in record ? 'ant-table-row-group-header' : '')}
        onRow={(record) => ({
          onClick: () => {
            if ('isGroupHeader' in record) return;
            // Include current tab in URL so back navigation knows where to return
            navigate(`/product/${product.id}/sku/${record.id}?from=${currentTab}`);
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
                        contextType="skus"
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

export default GroupedSkuListTable; 