import React from 'react';
import { Table, Typography, Space, theme } from 'antd';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../utils/types';
import { getProductListTableColumns } from './ProductListTable';
import CountTag from './CountTag';
import type { ColumnsType } from 'antd/es/table';

const { Text } = Typography;

interface GroupedProductListTableProps {
  groupedProducts: Record<string, Product[]>;
}

type TableRow = Product | { isGroupHeader: true; key: string; title: string; count: number };

const GroupedProductListTable: React.FC<GroupedProductListTableProps> = ({ groupedProducts }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const columns = getProductListTableColumns(navigate) as ColumnsType<TableRow>;

  const dataSource: TableRow[] = [];
  for (const groupTitle in groupedProducts) {
    const groupProducts = groupedProducts[groupTitle];
    dataSource.push({
      isGroupHeader: true,
      key: `header-${groupTitle}`,
      title: groupTitle,
      count: groupProducts.length,
    });
    dataSource.push(...groupProducts);
  }

  return (
    <div className="content-panel">
      <Table<TableRow>
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => ('isGroupHeader' in record ? record.key : record.id)}
        pagination={false}
        rowClassName={(record) => ('isGroupHeader' in record ? 'ant-table-row-group-header' : '')}
        onRow={(record) => ({
          onClick: () => {
            if ('isGroupHeader' in record) return;
            navigate(`/product/${record.id}`);
          },
          style: { cursor: 'pointer' },
        })}
        components={{
          body: {
            row: (props: any) => {
              if (props.children[0]?.props?.record?.isGroupHeader) {
                const { title, count } = props.children[0].props.record;
                return (
                  <tr {...props}>
                    <td colSpan={columns.length} style={{ padding: '12px 16px', backgroundColor: '#fafafa' }}>
                      <Space>
                        <Text style={{ fontSize: token.fontSizeHeading3, fontWeight: 500 }}>{title}</Text>
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

export default GroupedProductListTable; 