import React from 'react';
import { Table, Typography, Space, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Sku, Product } from '../../utils/types';
import { getSkuTableColumns } from './SkuListTable';
import CountTag from '../attributes/CountTag';
import { type ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface GroupedSkuListTableProps {
  groupedSkus: Record<string, Sku[]>;
  product: Product;
  groupBy?: string;
}

// A special type to handle rows that can be either a real Sku or a group header
type TableRow = Sku | { isGroupHeader: true; key: string; title: string; count: number };

const GroupedSkuListTable: React.FC<GroupedSkuListTableProps> = ({ groupedSkus, product, groupBy }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const columns = getSkuTableColumns(product, navigate) as ColumnsType<TableRow>;

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
        size="small"
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
                const displayTitle = groupBy === 'Price Group' ? `Price Group: ${title}` : title;
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

export default GroupedSkuListTable; 