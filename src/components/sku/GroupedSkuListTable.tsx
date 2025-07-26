import React from 'react';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Sku, Product } from '../../utils/types';
import { getSkuTableColumns } from './SkuListTable';
import GroupHeader from '../shared/GroupHeader';
import { type ColumnsType } from 'antd/es/table';

interface GroupedSkuListTableProps {
  groupedSkus: Record<string, Sku[]>;
  product: Product;
}

// A special type to handle rows that can be either a real Sku or a group header
type TableRow = Sku | { isGroupHeader: true; key: string; title: string; count: number };

const GroupedSkuListTable: React.FC<GroupedSkuListTableProps> = ({ groupedSkus, product }) => {
  const navigate = useNavigate();
  const columns = getSkuTableColumns(product, navigate, false) as ColumnsType<TableRow>;

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
    });
    dataSource.push(...groupSkus);
  }

  return (
    <div className="content-panel">
      <Table<TableRow>
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => ('isGroupHeader' in record ? record.key : record.id)}
        pagination={false}
        // Enable horizontal scrolling for responsive behavior
        scroll={{ x: 'max-content' }}
        // Use smaller size on mobile devices
        size={window.innerWidth < 768 ? 'small' : 'middle'}
        rowClassName={(record) => ('isGroupHeader'in record ? 'ant-table-row-group-header' : '')}
        onRow={(record) => ({
          onClick: () => {
            if ('isGroupHeader' in record) return;
            navigate(`/product/${product.id}/sku/${record.id}`);
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
                        contextType="skus"
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