import React, { useState } from 'react';
import { Form, Select, theme, Alert, Radio } from 'antd';

const { Option } = Select;

interface SkuSelectorProps {
  existingSkus: any[]; // Array of existing SKUs that match the context
  product: any; // Product data for context
  onSelectionChange?: (selection: { action: 'create' | 'update'; selectedSku?: any }) => void;
}

const SkuSelector: React.FC<SkuSelectorProps> = ({
  existingSkus,
  product,
  onSelectionChange
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [selectedAction, setSelectedAction] = useState<'create' | 'update'>('create');
  const [selectedSku, setSelectedSku] = useState<any | null>(null);

  const handleActionChange = (value: 'create' | 'update') => {
    setSelectedAction(value);
    setSelectedSku(null); // Reset SKU selection when action changes
    
    form.setFieldsValue({
      action: value,
      selectedSku: undefined
    });

    if (value === 'create') {
      // Immediately call onChange for create mode
      onSelectionChange?.({ action: 'create' });
    } else {
      // For update mode, wait for SKU selection
      onSelectionChange?.({ action: 'update' });
    }
  };

  const handleSkuChange = (skuId: string | null) => {
    const sku = existingSkus.find(s => s.id === skuId) || null;
    setSelectedSku(sku);
    
    onSelectionChange?.({ 
      action: 'update', 
      selectedSku: sku 
    });
  };

  // Helper to get price preview for a SKU
  const getPricePreview = (sku: any) => {
    const priceGroup = sku.priceGroup;
    if (!priceGroup?.pricePoints) return 'No prices';

    const usdPricePoint = priceGroup.pricePoints.find((pp: any) => 
      pp.currencyCode === 'USD' || pp.currency === 'USD'
    );
    const totalPricePoints = priceGroup.pricePoints.length;
    
    if (usdPricePoint && totalPricePoints > 1) {
      return `USD ${usdPricePoint.amount || usdPricePoint.price} + ${totalPricePoints - 1} more`;
    } else if (usdPricePoint) {
      return `USD ${usdPricePoint.amount || usdPricePoint.price}`;
    } else {
      return `${totalPricePoints} non-USD price points`;
    }
  };

  // Helper to get override summary for a SKU
  const getOverrideSummary = (sku: any) => {
    const overrides = [];
    
    if (sku.taxClass && sku.taxClass !== product?.taxClass) {
      overrides.push('Tax Class');
    }
    if (sku.seatMin !== undefined && sku.seatMin !== product?.seatMin) {
      overrides.push('Seat Min');
    }
    if (sku.seatMax !== undefined && sku.seatMax !== product?.seatMax) {
      overrides.push('Seat Max');
    }
    if (sku.paymentFailureFreeToPaidGracePeriod !== undefined && 
        sku.paymentFailureFreeToPaidGracePeriod !== product?.paymentFailureFreeToPaidGracePeriod) {
      overrides.push('Grace Period');
    }

    if (overrides.length > 0) {
      return `overrides: ${overrides.join(', ')}`;
    }
    return 'no overrides';
  };

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <Alert 
        message={`Found ${existingSkus.length} existing SKU${existingSkus.length === 1 ? '' : 's'} with this combination`}
        type="info" 
        showIcon 
        style={{ marginBottom: 24 }}
      />

      <Form
        form={form}
        layout="vertical"
        initialValues={{ action: 'create' }}
      >
        <Form.Item
          name="action"
          label="What would you like to do?"
        >
          <Radio.Group 
            value={selectedAction}
            onChange={(e) => handleActionChange(e.target.value)}
            style={{ width: '100%' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Radio value="create" style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                padding: '12px',
                border: `1px solid ${selectedAction === 'create' ? token.colorPrimary : token.colorBorder}`,
                borderRadius: token.borderRadius,
                backgroundColor: selectedAction === 'create' ? token.colorPrimaryBg : token.colorBgContainer,
              }}>
                <div style={{ marginLeft: '8px' }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    Create new SKU (recommended)
                  </div>
                  <div style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                    Will generate new SKU and price group
                  </div>
                </div>
              </Radio>

              <Radio value="update" style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                padding: '12px',
                border: `1px solid ${selectedAction === 'update' ? token.colorPrimary : token.colorBorder}`,
                borderRadius: token.borderRadius,
                backgroundColor: selectedAction === 'update' ? token.colorPrimaryBg : token.colorBgContainer,
              }}>
                <div style={{ marginLeft: '8px' }}>
                  <div style={{ fontWeight: '500', marginBottom: '4px' }}>
                    Update existing SKU
                  </div>
                  <div style={{ fontSize: '13px', color: token.colorTextSecondary }}>
                    Choose which SKU to modify
                  </div>
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </Form.Item>

        {selectedAction === 'update' && (
          <Form.Item
            name="selectedSku"
            label="Select SKU to update"
            rules={[{ required: true, message: 'Please select a SKU to update' }]}
          >
            <Select
              placeholder="Search SKUs..."
              size="large"
              style={{ width: '100%' }}
              showSearch
              allowClear
              onChange={handleSkuChange}
              filterOption={(input, option) => {
                const sku = existingSkus.find(s => s.id === option?.value);
                if (!sku) return false;
                
                // Search in SKU ID and price preview
                const searchFields = [
                  sku.id,
                  getPricePreview(sku),
                  getOverrideSummary(sku)
                ].join(' ').toLowerCase();
                
                return searchFields.includes(input.toLowerCase());
              }}
              optionRender={(option) => {
                const sku = existingSkus.find(s => s.id === option.value);
                if (!sku) return null;
                
                return (
                  <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '4px',
                    padding: '8px 0'
                  }}>
                    {/* Row 1: Price info (left) and ID (right) */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                      <span style={{ 
                        fontSize: token.fontSize, 
                        color: token.colorText,
                        fontWeight: '500'
                      }}>
                        {getPricePreview(sku)}
                      </span>
                      <span style={{ 
                        fontSize: token.fontSize, 
                        color: token.colorText,
                        fontWeight: '500'
                      }}>
                        SKU: {sku.id}
                      </span>
                    </div>
                    
                    {/* Row 2: Channel, Cycle, Override info */}
                    <div style={{ 
                      fontSize: token.fontSize, 
                      color: token.colorTextSecondary 
                    }}>
                      {[
                        sku.salesChannel,
                        sku.billingCycle,
                        getOverrideSummary(sku)
                      ].filter(Boolean).join(', ')}
                    </div>
                  </div>
                );
              }}
            >
              {existingSkus.map((sku) => (
                <Option key={sku.id} value={sku.id}>
                  SKU: {sku.id}
                </Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default SkuSelector;
