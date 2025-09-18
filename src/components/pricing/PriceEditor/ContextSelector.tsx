import React from 'react';
import { Form, Select, theme, Input } from 'antd';
import type { PriceEditingContext } from '../../../utils/types';

const { Option, OptGroup } = Select;

interface ContextSelectorProps {
  product: any; // Product data to extract real options from
  onContextChange?: (context: PriceEditingContext) => void;
  creationMethod?: 'blank' | 'clone' | null; // Creation method for conditional display
  prefilledContext?: any; // Pre-filled context data
}

// PriceEditingContext interface now imported from shared types

const ContextSelector: React.FC<ContextSelectorProps> = ({
  product,
  onContextChange,
  creationMethod = null,
  prefilledContext = null
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  
  // Track current selections for progressive disclosure and price group logic
  const [selectedChannel, setSelectedChannel] = React.useState<string | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = React.useState<string | null>(null);
  const [selectedPriceGroupAction, setSelectedPriceGroupAction] = React.useState<string | null>(null);
  const [selectedExistingPriceGroup, setSelectedExistingPriceGroup] = React.useState<any | null>(null);
  
  // LIX state management
  const [selectedLixKey, setSelectedLixKey] = React.useState<string | null>(null);
  const [selectedLixTreatment, setSelectedLixTreatment] = React.useState<string | null>(null);

  // Clone mode state management
  const [selectedClonePriceGroup, setSelectedClonePriceGroup] = React.useState<any | null>(null);

  // All possible channels and billing cycles
  const ALL_CHANNELS = ['Desktop', 'iOS', 'GPB', 'Field'];
  const ALL_BILLING_CYCLES = ['Monthly', 'Annual', 'Quarterly'];

  // Available price groups for cloning (only from current product)
  const availableClonePriceGroups = React.useMemo(() => {
    if (!product?.skus || creationMethod !== 'clone') return [];
    
    // Get unique price groups from current product
    const priceGroupMap = new Map();
    product.skus.forEach((sku: any) => {
      const pg = sku.priceGroup;
      if (pg && !priceGroupMap.has(pg.id)) {
        priceGroupMap.set(pg.id, {
          ...pg,
          channel: sku.salesChannel,
          billingCycle: sku.billingCycle,
          lix: sku.lix || null
        });
      }
    });
    
    return Array.from(priceGroupMap.values());
  }, [product, creationMethod]);



  // Categorize channels into existing vs new
  const channelCategories = React.useMemo(() => {
    if (!product?.skus) return { existing: [], new: ALL_CHANNELS };
    
    const existingChannels = [...new Set(product.skus.map((sku: any) => sku.salesChannel))];
    const newChannels = ALL_CHANNELS.filter(channel => !existingChannels.includes(channel));
    
    return {
      existing: existingChannels,
      new: newChannels
    };
  }, [product]);

  // Categorize billing cycles into existing vs new (specific to selected channel)
  const billingCycleCategories = React.useMemo(() => {
    if (!product?.skus || !selectedChannel) {
      return { existing: [], new: [] };
    }
    
    // Find existing billing cycles for the selected channel
    const existingForChannel = [...new Set(
      product.skus
        .filter((sku: any) => sku.salesChannel === selectedChannel)
        .map((sku: any) => sku.billingCycle)
    )];
    
    // New billing cycles are those not used for this channel yet
    const newForChannel = ALL_BILLING_CYCLES.filter(cycle => 
      !existingForChannel.includes(cycle)
    );
    
    return {
      existing: existingForChannel,
      new: newForChannel
    };
  }, [product, selectedChannel]);





  const handleFormChange = () => {
    const context = {
      channel: selectedChannel,
      billingCycle: selectedBillingCycle,
      lixKey: selectedLixKey,
      lixTreatment: selectedLixTreatment,
      priceGroupAction: selectedPriceGroupAction,
      existingPriceGroup: selectedExistingPriceGroup,
      clonePriceGroup: selectedClonePriceGroup
    } as PriceEditingContext;
    
    if (onContextChange) {
      onContextChange(context);
    }
  };

  const handleChannelChange = (value: string | null | undefined) => {
    setSelectedChannel(value || null);
    
    // Reset billing cycle and all dependent fields when channel changes (or is cleared)
    setSelectedBillingCycle(null);
    setSelectedPriceGroupAction(null);
    setSelectedExistingPriceGroup(null);
    form.setFieldsValue({ 
      channel: value,
      billingCycle: undefined,
      priceGroupSelection: undefined
    });
    
    // Reset LIX fields and clone selection
    setSelectedLixKey(null);
    setSelectedLixTreatment(null);
    setSelectedClonePriceGroup(null);
    form.setFieldsValue({
      lixKey: undefined,
      lixTreatment: undefined,
      clonePriceGroup: undefined
    });
    
    handleFormChange();
  };

  const handleBillingCycleChange = (value: string | null | undefined) => {
    setSelectedBillingCycle(value || null);
    
    // In creation mode, automatically set action to 'create' since we removed the selection step
    // But only if we have a value, otherwise reset
    if (creationMethod === 'blank') {
      if (value) {
        setSelectedPriceGroupAction('create');
        setSelectedExistingPriceGroup(null);
      } else {
        setSelectedPriceGroupAction(null);
        setSelectedExistingPriceGroup(null);
      }
    } else {
      // Reset price group selection when billing cycle changes (for other modes)
      setSelectedPriceGroupAction(null);
      setSelectedExistingPriceGroup(null);
    }
    
    form.setFieldsValue({ 
      billingCycle: value,
      priceGroupSelection: undefined
    });
    
    handleFormChange();
  };




  // Clone price group selection handler
  const handleClonePriceGroupChange = (priceGroupId: string | null | undefined) => {
    if (!priceGroupId) {
      // Handle clearing - reset all selections
      setSelectedClonePriceGroup(null);
      setSelectedChannel(null);
      setSelectedBillingCycle(null);
      setSelectedPriceGroupAction(null);
      setSelectedExistingPriceGroup(null);
      setSelectedLixKey(null);
      setSelectedLixTreatment(null);
      
      form.setFieldsValue({
        clonePriceGroup: undefined,
        channel: undefined,
        billingCycle: undefined,
        lixKey: undefined,
        lixTreatment: undefined
      });
      
      handleFormChange();
      return;
    }
    
    const selectedPriceGroup = availableClonePriceGroups.find(pg => pg.id === priceGroupId);
    
    if (selectedPriceGroup) {
      setSelectedClonePriceGroup(selectedPriceGroup);
      
      // Pre-fill channel and billing cycle from selected price group
      setSelectedChannel(selectedPriceGroup.channel);
      setSelectedBillingCycle(selectedPriceGroup.billingCycle);
      setSelectedPriceGroupAction('create'); // Always create new when cloning
      setSelectedExistingPriceGroup(null);
      
      // Update form values
      form.setFieldsValue({
        clonePriceGroup: priceGroupId,
        channel: selectedPriceGroup.channel,
        billingCycle: selectedPriceGroup.billingCycle
        // No priceGroupSelection needed in clone mode since we don't show that dropdown
      });
      
      // Reset LIX fields (user can add their own)
      setSelectedLixKey(null);
      setSelectedLixTreatment(null);
      form.setFieldsValue({
        lixKey: undefined,
        lixTreatment: undefined
      });
      
      handleFormChange();
    }
  };


  // Initialize form with prefilledContext if provided
  React.useEffect(() => {
    if (prefilledContext) {
      if (prefilledContext.channel) {
        setSelectedChannel(prefilledContext.channel);
      }
      if (prefilledContext.billingCycle) {
        setSelectedBillingCycle(prefilledContext.billingCycle);
      }
      if (prefilledContext.lixKey) {
        setSelectedLixKey(prefilledContext.lixKey);
      }
      if (prefilledContext.lixTreatment) {
        setSelectedLixTreatment(prefilledContext.lixTreatment);
      }
      if (prefilledContext.clonePriceGroup) {
        setSelectedClonePriceGroup(prefilledContext.clonePriceGroup);
        setSelectedPriceGroupAction('create'); // Always create when cloning
      }
      
      // Set form field values
      form.setFieldsValue({
        channel: prefilledContext.channel,
        billingCycle: prefilledContext.billingCycle,
        lixKey: prefilledContext.lixKey,
        lixTreatment: prefilledContext.lixTreatment,
        clonePriceGroup: prefilledContext.clonePriceGroup?.id,
      });
    }
  }, [prefilledContext, form]);

  // Reset clone selection when creation method changes
  React.useEffect(() => {
    if (creationMethod !== 'clone') {
      setSelectedClonePriceGroup(null);
    }
  }, [creationMethod]);

  // Trigger context update when key state variables change
  React.useEffect(() => {
    // Only update context when we have meaningful selections
    if (selectedChannel || selectedBillingCycle || selectedPriceGroupAction) {
      handleFormChange();
    }
  }, [selectedChannel, selectedBillingCycle, selectedPriceGroupAction, selectedExistingPriceGroup, selectedLixKey, selectedLixTreatment]);


  return (
    <div style={{ padding: '24px 0' }}>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >

          {/* Clone Price Group Selection - Show Only in Clone Mode */}
          {creationMethod === 'clone' && (
            <Form.Item
              name="clonePriceGroup"
              label="Price group"
              rules={[{ required: true, message: 'Please select a price group to clone from' }]}
            >
              <Select
                placeholder="Search price groups..."
                size="large"
                style={{ width: '100%' }}
                showSearch
                allowClear
                filterOption={(input, option) => {
                  const priceGroup = availableClonePriceGroups.find(pg => pg.id === option?.value);
                  if (!priceGroup) return false;
                  
                  // Search in ID, channel, billing cycle, LIX key, and LIX treatment
                  const searchFields = [
                    priceGroup.id,
                    priceGroup.channel,
                    priceGroup.billingCycle,
                    priceGroup.lix?.key,
                    priceGroup.lix?.treatment
                  ].filter(Boolean).join(' ').toLowerCase();
                  
                  return searchFields.includes(input.toLowerCase());
                }}
                onChange={handleClonePriceGroupChange}
                optionRender={(option) => {
                  const priceGroup = availableClonePriceGroups.find(pg => pg.id === option.value);
                  if (!priceGroup) return null;
                  
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
                          {(() => {
                            const usdPricePoint = priceGroup.pricePoints?.find((pp: any) => pp.currency === 'USD');
                            const totalPricePoints = priceGroup.pricePoints?.length || 0;
                            
                            if (usdPricePoint && totalPricePoints > 1) {
                              return `USD ${usdPricePoint.price} + ${totalPricePoints - 1} more`;
                            } else if (usdPricePoint) {
                              return `USD ${usdPricePoint.price}`;
                            } else {
                              return `${totalPricePoints} non-USD price points`;
                            }
                          })()}
                        </span>
                        <span style={{ 
                          fontSize: token.fontSize, 
                          color: token.colorText,
                          fontWeight: '500'
                        }}>
                          ID: {priceGroup.id}
                        </span>
                      </div>
                      
                      {/* Row 2: Channel, Cycle, LIX info */}
                      <div style={{ 
                        fontSize: token.fontSize, 
                        color: token.colorTextSecondary 
                      }}>
                        {[
                          priceGroup.channel,
                          priceGroup.billingCycle,
                          priceGroup.lix && `${priceGroup.lix.key} (${priceGroup.lix.treatment})`
                        ].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  );
                }}
              >
                {availableClonePriceGroups.map((priceGroup: any) => (
                  <Option key={priceGroup.id} value={priceGroup.id}>
                    {priceGroup.id}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Channel Selection - Only show in blank mode */}
          {creationMethod !== 'clone' && (
            <Form.Item
              name="channel"
              label="Channel"
              rules={[{ required: true, message: 'Please select a channel' }]}
            >
              <Select 
                placeholder="Choose channel"
                size="large"
                style={{ width: '100%' }}
                allowClear
                onChange={handleChannelChange}
              >
              {channelCategories.existing.length > 0 && (
                <OptGroup label="Existing">
                  {channelCategories.existing.map(channel => (
                    <Option key={String(channel)} value={String(channel)}>
                      {String(channel)}
                    </Option>
                  ))}
                </OptGroup>
              )}
              {channelCategories.new.length > 0 && (
                <OptGroup label="New">
                  {channelCategories.new.map(channel => (
                    <Option key={String(channel)} value={String(channel)}>
                      {String(channel)}
                    </Option>
                  ))}
                </OptGroup>
                )}
              </Select>
            </Form.Item>
          )}

          {/* Billing Cycle - Only show in blank mode after channel selected */}
          {creationMethod !== 'clone' && selectedChannel && (
            <Form.Item
              name="billingCycle"
              label="Billing cycle"
              rules={[{ required: true, message: 'Please select a billing cycle' }]}
            >
              <Select 
                placeholder="Choose billing cycle"
                size="large"
                allowClear
                onChange={handleBillingCycleChange}
              >
                {billingCycleCategories.existing.length > 0 && (
                  <OptGroup label="Existing">
                    {billingCycleCategories.existing.map(cycle => (
                      <Option key={String(cycle)} value={String(cycle)}>
                        {String(cycle)}
                      </Option>
                    ))}
                  </OptGroup>
                )}
                {billingCycleCategories.new.length > 0 && (
                  <OptGroup label="New">
                    {billingCycleCategories.new.map(cycle => (
                      <Option key={String(cycle)} value={String(cycle)}>
                        {String(cycle)}
                      </Option>
                    ))}
                  </OptGroup>
                )}
              </Select>
            </Form.Item>
          )}

          {/* LIX Experiment Section - Simple text fields */}
          {/* Show after channel/billing cycle selection in blank mode, or after clone selection in clone mode */}
          {((creationMethod === 'blank' && selectedChannel && selectedBillingCycle) || 
            (creationMethod === 'clone' && selectedClonePriceGroup)) && (
            <>
              {/* LIX Key - Simple text input */}
              <Form.Item
                name="lixKey"
                label="LIX key (optional)"
              >
                <Input
                  placeholder="Enter LIX key"
                  size="large"
                  allowClear
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedLixKey(value || null);
                    handleFormChange();
                  }}
                />
              </Form.Item>

              {/* LIX Treatment - Simple text input */}
              <Form.Item
                name="lixTreatment"
                label="LIX treatment (optional)"
              >
                <Input
                  placeholder="Enter LIX treatment"
                  size="large"
                  allowClear
                  onChange={(e) => {
                    const value = e.target.value;
                    setSelectedLixTreatment(value || null);
                    handleFormChange();
                  }}
                />
              </Form.Item>
            </>
          )}


      </Form>
    </div>
  );
};

export default ContextSelector;
