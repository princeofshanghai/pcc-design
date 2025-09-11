import React from 'react';
import { Form, Select, Space, theme, Input, Radio } from 'antd';

const { Option, OptGroup } = Select;

interface ContextSelectorProps {
  product: any; // Product data to extract real options from
  onContextChange?: (context: PriceEditingContext) => void;
  creationMethod?: 'blank' | 'clone' | null; // Creation method for conditional display
}

interface PriceEditingContext {
  channel: string | null;
  billingCycle: string | null;
  priceGroupAction: string | null; // 'create' or 'update'
  existingPriceGroup: any | null; // Selected existing price group for updates
  lixKey: string | null;
  lixTreatment: string | null;
  clonePriceGroup?: any | null; // Selected price group for cloning
}

const ContextSelector: React.FC<ContextSelectorProps> = ({
  product,
  onContextChange,
  creationMethod = null
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
  const [clonePriceGroupSearch, setClonePriceGroupSearch] = React.useState('');

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

  // Filtered price groups based on search
  const filteredClonePriceGroups = React.useMemo(() => {
    if (!clonePriceGroupSearch.trim()) return availableClonePriceGroups;
    
    const search = clonePriceGroupSearch.toLowerCase();
    return availableClonePriceGroups.filter(pg => 
      pg.id.toLowerCase().includes(search) ||
      pg.channel.toLowerCase().includes(search) ||
      pg.billingCycle.toLowerCase().includes(search) ||
      (pg.lix?.key && pg.lix.key.toLowerCase().includes(search))
    );
  }, [availableClonePriceGroups, clonePriceGroupSearch]);


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

  const handleChannelChange = (value: string) => {
    setSelectedChannel(value);
    
    // Reset billing cycle and all dependent fields when channel changes
    setSelectedBillingCycle(null);
    setSelectedPriceGroupAction(null);
    setSelectedExistingPriceGroup(null);
    form.setFieldsValue({ 
      channel: value,
      billingCycle: undefined,
      priceGroupSelection: undefined
    });
    
    // Reset LIX fields and clone search
    setSelectedLixKey(null);
    setSelectedLixTreatment(null);
    setSelectedClonePriceGroup(null);
    setClonePriceGroupSearch('');
    form.setFieldsValue({
      lixKey: undefined,
      lixTreatment: undefined,
      clonePriceGroup: undefined
    });
    
    handleFormChange();
  };

  const handleBillingCycleChange = (value: string) => {
    setSelectedBillingCycle(value);
    
    // In creation mode, automatically set action to 'create' since we removed the selection step
    if (creationMethod === 'blank') {
      setSelectedPriceGroupAction('create');
      setSelectedExistingPriceGroup(null);
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
  const handleClonePriceGroupChange = (priceGroupId: string) => {
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

  // Handle radio selection for clone price groups
  const handleRadioClonePriceGroupChange = (e: any) => {
    handleClonePriceGroupChange(e.target.value);
  };

  // Reset clone search when creation method changes
  React.useEffect(() => {
    if (creationMethod !== 'clone') {
      setClonePriceGroupSearch('');
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
            <div style={{ marginBottom: '24px' }}>
              {/* Label */}
              <div style={{ 
                marginBottom: '8px', 
                fontSize: '14px', 
                fontWeight: '500',
                color: token.colorText 
              }}>
                Choose price group to clone
              </div>
              
              {/* Search Input */}
              <Input
                placeholder="Search price groups..."
                value={clonePriceGroupSearch}
                onChange={(e) => setClonePriceGroupSearch(e.target.value)}
                style={{ marginBottom: '16px' }}
                allowClear
              />
              
              {/* Radio Cards */}
              <Form.Item
                name="clonePriceGroup"
                rules={[{ required: true, message: 'Please select a price group to clone from' }]}
              >
                <Radio.Group
                  value={selectedClonePriceGroup?.id}
                  onChange={handleRadioClonePriceGroupChange}
                  style={{ width: '100%' }}
                >
                  <div style={{ width: '100%' }}>
                    {filteredClonePriceGroups.map((priceGroup: any, index: number) => (
                      <div key={priceGroup.id}>
                        <div
                          onClick={() => handleClonePriceGroupChange(priceGroup.id)}
                          style={{
                            padding: index === 0 ? '8px 0 20px 0' : index === filteredClonePriceGroups.length - 1 ? '20px 0 8px 0' : '20px 0',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%',
                            transition: 'background-color 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = token.colorFillTertiary || token.colorBgTextHover;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                            <Radio value={priceGroup.id} style={{ pointerEvents: 'none' }} />
                            <div style={{ 
                              fontSize: token.fontSize, 
                              color: token.colorText,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              flex: 1
                            }}>
                              <span style={{ fontWeight: '500' }}>{priceGroup.id}</span>
                              <span style={{ color: token.colorTextSecondary }}>
                                {priceGroup.channel} • {priceGroup.billingCycle}
                                {priceGroup.lix && ` • ${priceGroup.lix.key} (${priceGroup.lix.treatment})`}
                              </span>
                            </div>
                          </div>
                          <div style={{ 
                            fontSize: token.fontSize, 
                            color: token.colorTextSecondary, 
                            fontWeight: '500',
                            marginLeft: '16px'
                          }}>
                            {priceGroup.pricePoints?.length || 0} price points
                          </div>
                        </div>
                        {index < filteredClonePriceGroups.length - 1 && (
                          <div style={{
                            height: '1px',
                            backgroundColor: token.colorBorder,
                            margin: '0'
                          }} />
                        )}
                      </div>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>
              
              {filteredClonePriceGroups.length === 0 && clonePriceGroupSearch && (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '32px', 
                  color: token.colorTextSecondary 
                }}>
                  No price groups found matching "{clonePriceGroupSearch}"
                </div>
              )}
            </div>
          )}

          {/* Channel Selection - Only show in blank mode */}
          {creationMethod !== 'clone' && (
            <Form.Item
              name="channel"
              label="Sales channel"
              rules={[{ required: true, message: 'Please select a sales channel' }]}
            >
              <Select 
                placeholder="Choose sales channel"
                size="large"
                style={{ width: '100%' }}
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
            <div style={{ marginBottom: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
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
              </Space>
            </div>
          )}


      </Form>
    </div>
  );
};

export default ContextSelector;
