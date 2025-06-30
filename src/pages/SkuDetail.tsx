import React, { useEffect } from 'react';
import { Typography, Space } from 'antd';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mockProducts } from '../utils/mock-data';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import PageHeader from '../components/PageHeader';
import StatusTag from '../components/StatusTag';
import { Tag as SkuIcon } from 'lucide-react';

const { Title } = Typography;

const SkuDetail: React.FC = () => {
  const { productId, skuId } = useParams<{ productId: string; skuId: string }>();
  const { setProductName, setSkuId } = useBreadcrumb();
  const navigate = useNavigate();

  const product = mockProducts.find(p => p.id === productId);
  const sku = product?.skus.find(s => s.id === skuId);

  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
    if (sku) {
      setSkuId(sku.id);
    }

    return () => {
      setProductName(null);
      setSkuId(null);
    };
  }, [product, sku, setProductName, setSkuId]);

  if (!product || !sku) {
    return (
      <div>
        <Title level={2}>SKU Not Found</Title>
        <p>The requested product or SKU could not be found.</p>
      </div>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      <PageHeader
        preTitle={
          <Space size="small">
            <SkuIcon size={14} />
            <span>SKU</span>
          </Space>
        }
        title={sku.id}
        onBack={() => navigate(`/product/${product.id}`)}
        tagContent={<StatusTag status={sku.status} />}
      />
    </Space>
  );
};

export default SkuDetail; 