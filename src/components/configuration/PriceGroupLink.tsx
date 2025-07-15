import React from 'react';
import { Typography, Space, Button, Tooltip, Badge, Tag } from 'antd';
import { ExternalLink, Users, DollarSign, Info } from 'lucide-react';
import type { PriceGroup, Product } from '../../utils/types';

const { Text } = Typography;

interface PriceGroupLinkProps {
  priceGroup: PriceGroup;
  product: Product;
  variant?: 'default' | 'compact' | 'detailed';
  showSharedCount?: boolean;
  onViewPriceGroup?: (priceGroupId: string) => void;
  onViewSharedSkus?: (priceGroupId: string) => void;
}

export const PriceGroupLink: React.FC<PriceGroupLinkProps> = ({
  priceGroup,
  product,
  variant = 'default',
  showSharedCount = true,
  onViewPriceGroup,
  onViewSharedSkus
}) => {
  // Calculate how many SKUs share this price group
  const sharedSkuCount = React.useMemo(() => {
    return product.skus.filter(sku => sku.priceGroup.id === priceGroup.id).length;
  }, [product.skus, priceGroup.id]);

  const getMainPrice = () => {
    const usdPrice = priceGroup.pricePoints.find(p => p.currencyCode === 'USD');
    return usdPrice ? `$${usdPrice.amount.toFixed(2)}` : 'No USD price';
  };

  const getTooltipContent = () => (
    <div style={{ maxWidth: 300 }}>
      <Space direction="vertical" size={4}>
        <Text strong style={{ color: 'white' }}>Price Group Details</Text>
        <div>
          <Text style={{ color: 'white', fontSize: '12px' }}>
            <strong>Name:</strong> {priceGroup.name}
          </Text>
        </div>
        <div>
          <Text style={{ color: 'white', fontSize: '12px' }}>
            <strong>ID:</strong> {priceGroup.id}
          </Text>
        </div>
        <div>
          <Text style={{ color: 'white', fontSize: '12px' }}>
            <strong>Primary Price:</strong> {getMainPrice()}
          </Text>
        </div>
        <div>
          <Text style={{ color: 'white', fontSize: '12px' }}>
            <strong>Shared by:</strong> {sharedSkuCount} SKU{sharedSkuCount !== 1 ? 's' : ''}
          </Text>
        </div>
        {priceGroup.status && (
          <div>
            <Text style={{ color: 'white', fontSize: '12px' }}>
              <strong>Status:</strong> {priceGroup.status}
            </Text>
          </div>
        )}
      </Space>
    </div>
  );

  // Compact variant - minimal display for tables
  if (variant === 'compact') {
    const compactContent = (
      <Space size={4}>
        <Button
          type="link"
          size="small"
          style={{ padding: 0, height: 'auto', fontSize: '12px' }}
          onClick={() => onViewPriceGroup?.(priceGroup.id!)}
        >
          {priceGroup.id}
        </Button>
        {showSharedCount && sharedSkuCount > 1 && (
          <Badge 
            count={sharedSkuCount}
            size="small"
            style={{ backgroundColor: '#1677ff' }}
          />
        )}
      </Space>
    );

    return (
      <Tooltip title={getTooltipContent()} placement="top">
        {compactContent}
      </Tooltip>
    );
  }

  // Detailed variant - full information card
  if (variant === 'detailed') {
    return (
      <div style={{ 
        background: '#f0f5ff',
        border: '1px solid #91d5ff',
        borderRadius: '8px',
        padding: '16px'
      }}>
        <Space direction="vertical" style={{ width: '100%' }} size={12}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <DollarSign size={16} color="#1677ff" />
              <Text strong>Price Group</Text>
            </Space>
            {priceGroup.status && (
              <Tag color={priceGroup.status === 'Active' ? 'green' : 'orange'}>
                {priceGroup.status}
              </Tag>
            )}
          </div>

          <Space direction="vertical" size={8}>
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Name:</Text>
              <br />
              <Text strong>{priceGroup.name}</Text>
            </div>
            
            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>ID:</Text>
              <br />
              <Text code style={{ fontSize: '12px' }}>{priceGroup.id}</Text>
            </div>

            <div>
              <Text type="secondary" style={{ fontSize: '12px' }}>Primary Price:</Text>
              <br />
              <Text strong style={{ color: '#52c41a' }}>{getMainPrice()}</Text>
            </div>

            {priceGroup.pricePoints.length > 1 && (
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Other currencies: {priceGroup.pricePoints.length - 1}
                </Text>
              </div>
            )}
          </Space>

          <div style={{ 
            background: '#fafafa',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9'
          }}>
            <Space>
              <Users size={14} />
              <Text style={{ fontSize: '12px' }}>
                Shared by <Text strong>{sharedSkuCount}</Text> SKU{sharedSkuCount !== 1 ? 's' : ''}
              </Text>
            </Space>
          </div>

          <Space>
            <Button
              size="small"
              type="primary"
              icon={<ExternalLink size={12} />}
              onClick={() => onViewPriceGroup?.(priceGroup.id!)}
            >
              View Price Group
            </Button>
            {sharedSkuCount > 1 && (
              <Button
                size="small"
                icon={<Users size={12} />}
                onClick={() => onViewSharedSkus?.(priceGroup.id!)}
              >
                View Shared SKUs
              </Button>
            )}
          </Space>
        </Space>
      </div>
    );
  }

  // Default variant - standard link with badge
  const defaultContent = (
    <Space>
      <Button
        type="link"
        style={{ padding: 0, height: 'auto' }}
        onClick={() => onViewPriceGroup?.(priceGroup.id!)}
      >
        <Space size={4}>
          <span>{priceGroup.name}</span>
          <ExternalLink size={12} />
        </Space>
      </Button>
      
      {showSharedCount && (
        <Space size={4}>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            ({sharedSkuCount} SKU{sharedSkuCount !== 1 ? 's' : ''})
          </Text>
          {sharedSkuCount > 1 && (
            <Button
              type="link"
              size="small"
              style={{ padding: 0, height: 'auto', fontSize: '11px' }}
              onClick={() => onViewSharedSkus?.(priceGroup.id!)}
            >
              View All
            </Button>
          )}
        </Space>
      )}
    </Space>
  );

  return (
    <Tooltip title={getTooltipContent()} placement="top">
      {defaultContent}
    </Tooltip>
  );
};

// Helper component for displaying price group info in table cells
interface PriceGroupTableCellProps {
  priceGroup: PriceGroup;
  product: Product;
  onViewPriceGroup?: (priceGroupId: string) => void;
  onViewSharedSkus?: (priceGroupId: string) => void;
}

export const PriceGroupTableCell: React.FC<PriceGroupTableCellProps> = ({
  priceGroup,
  product,
  onViewPriceGroup,
  onViewSharedSkus
}) => {
  if (!priceGroup.id) {
    return <Text type="secondary">No price group</Text>;
  }

  return (
    <PriceGroupLink
      priceGroup={priceGroup}
      product={product}
      variant="compact"
      onViewPriceGroup={onViewPriceGroup}
      onViewSharedSkus={onViewSharedSkus}
    />
  );
};

// Helper component for inline price group display with pricing
interface InlinePriceGroupProps {
  priceGroup: PriceGroup;
  product: Product;
  showPrice?: boolean;
  showSharedCount?: boolean;
  onViewPriceGroup?: (priceGroupId: string) => void;
  onViewSharedSkus?: (priceGroupId: string) => void;
}

export const InlinePriceGroup: React.FC<InlinePriceGroupProps> = ({
  priceGroup,
  product,
  showPrice = true,
  showSharedCount = true,
  onViewPriceGroup,
  onViewSharedSkus
}) => {
  const sharedSkuCount = product.skus.filter(sku => sku.priceGroup.id === priceGroup.id).length;
  const mainPrice = priceGroup.pricePoints.find(p => p.currencyCode === 'USD');

  return (
    <Space size={8}>
      <PriceGroupLink
        priceGroup={priceGroup}
        product={product}
        variant="default"
        showSharedCount={false}
        onViewPriceGroup={onViewPriceGroup}
        onViewSharedSkus={onViewSharedSkus}
      />
      
      {showPrice && mainPrice && (
        <Tag color="green">
          ${mainPrice.amount.toFixed(2)}
        </Tag>
      )}
      
      {showSharedCount && sharedSkuCount > 1 && (
        <Space size={4}>
          <Badge 
            count={sharedSkuCount}
            size="small"
            style={{ backgroundColor: '#722ed1' }}
          />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            shared
          </Text>
        </Space>
      )}
    </Space>
  );
};

// Helper component for showing price group relationships
interface PriceGroupRelationshipProps {
  priceGroup: PriceGroup;
  product: Product;
  currentSkuId: string;
  onViewPriceGroup?: (priceGroupId: string) => void;
  onViewSku?: (skuId: string) => void;
}

export const PriceGroupRelationship: React.FC<PriceGroupRelationshipProps> = ({
  priceGroup,
  product,
  currentSkuId,
  onViewPriceGroup,
  onViewSku
}) => {
  const relatedSkus = product.skus.filter(sku => 
    sku.priceGroup.id === priceGroup.id && sku.id !== currentSkuId
  );

  if (relatedSkus.length === 0) {
    return (
      <Space>
        <Info size={12} />
        <Text type="secondary" style={{ fontSize: '11px' }}>
          No other SKUs share this price group
        </Text>
      </Space>
    );
  }

  return (
    <Space direction="vertical" size={8}>
      <Text style={{ fontSize: '12px' }}>
        <Text strong>{relatedSkus.length}</Text> other SKU{relatedSkus.length !== 1 ? 's' : ''} share this price group:
      </Text>
      
      <Space wrap>
        {relatedSkus.slice(0, 3).map(sku => (
          <Button
            key={sku.id}
            type="link"
            size="small"
            style={{ padding: 0, height: 'auto', fontSize: '11px' }}
            onClick={() => onViewSku?.(sku.id)}
          >
            {sku.id}
          </Button>
        ))}
        {relatedSkus.length > 3 && (
          <Button
            type="link"
            size="small"
            style={{ padding: 0, height: 'auto', fontSize: '11px' }}
            onClick={() => onViewPriceGroup?.(priceGroup.id!)}
          >
            +{relatedSkus.length - 3} more
          </Button>
        )}
      </Space>
    </Space>
  );
}; 