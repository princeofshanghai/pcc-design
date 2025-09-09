import React from 'react';
import { Form, Select, Space, Typography, theme, Button, Input } from 'antd';
import { Plus } from 'lucide-react';

const { Text } = Typography;
const { Option, OptGroup } = Select;

interface ContextSelectorProps {
  product: any; // Product data to extract real options from
  onContextChange?: (context: PriceEditingContext) => void;
}

interface PriceEditingContext {
  channel: string | null;
  billingCycle: string | null;
  priceGroupAction: string | null; // 'create' or 'update'
  existingPriceGroup: any | null; // Selected existing price group for updates
  lixKey: string | null;
  lixTreatment: string | null;
}

const ContextSelector: React.FC<ContextSelectorProps> = ({
  product,
  onContextChange
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  
  // Track current selections for progressive disclosure and price group logic
  const [selectedChannel, setSelectedChannel] = React.useState<string | null>(null);
  const [selectedBillingCycle, setSelectedBillingCycle] = React.useState<string | null>(null);
  const [selectedPriceGroupAction, setSelectedPriceGroupAction] = React.useState<string | null>(null);
  const [selectedExistingPriceGroup, setSelectedExistingPriceGroup] = React.useState<any | null>(null);
  
  // Progressive disclosure state management
  const [lixSectionExpanded, setLixSectionExpanded] = React.useState(false);
  const [selectedLixKey, setSelectedLixKey] = React.useState<string | null>(null);
  const [selectedLixTreatment, setSelectedLixTreatment] = React.useState<string | null>(null);
  const [lixKeySearchValue, setLixKeySearchValue] = React.useState<string>('');
  const [lixTreatmentSearchValue, setLixTreatmentSearchValue] = React.useState<string>('');

  // All possible channels and billing cycles
  const ALL_CHANNELS = ['Desktop', 'iOS', 'GPB', 'Field'];
  const ALL_BILLING_CYCLES = ['Monthly', 'Annual', 'Quarterly'];


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

  // Extract existing price groups for the selected channel + billing cycle combination
  const existingPriceGroups = React.useMemo(() => {
    if (!product?.skus || !selectedChannel || !selectedBillingCycle) return [];
    
    // Find SKUs that match the selected channel + billing cycle
    const matchingSkus = product.skus.filter((sku: any) => 
      sku.salesChannel === selectedChannel && 
      sku.billingCycle === selectedBillingCycle
    );
    
    // Extract price groups and calculate metadata
    return matchingSkus.map((sku: any) => {
      const priceGroup = sku.priceGroup;
      if (!priceGroup) return null;
      
      // Count active price points
      const activePricePoints = priceGroup.pricePoints?.filter((pp: any) => pp.status === 'Active') || [];
      const activePriceCount = activePricePoints.length;
      
      // Find most recent validFrom date
      const validDates = priceGroup.pricePoints
        ?.map((pp: any) => pp.validFrom ? new Date(pp.validFrom) : null)
        ?.filter((date: Date | null) => date !== null) || [];
      
      const mostRecentDate = validDates.length > 0 
        ? new Date(Math.max(...validDates.map((d: Date) => d.getTime())))
        : null;
      
      const formattedDate = mostRecentDate 
        ? mostRecentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        : 'Unknown';
      
      return {
        ...priceGroup,
        activePriceCount,
        mostRecentValidDate: formattedDate,
        sku: sku // Include reference for additional context if needed
      };
    }).filter(Boolean); // Remove any null entries
  }, [product, selectedChannel, selectedBillingCycle]);



  // Extract LIX data from product SKUs
  const lixData = React.useMemo(() => {
    if (!product?.skus) return { keys: [], treatments: {} };
    
    const keyTreatmentMap: Record<string, Set<string>> = {};
    
    product.skus.forEach((sku: any) => {
      if (sku.lix?.key && sku.lix?.treatment) {
        if (!keyTreatmentMap[sku.lix.key]) {
          keyTreatmentMap[sku.lix.key] = new Set();
        }
        keyTreatmentMap[sku.lix.key].add(sku.lix.treatment);
      }
    });
    
    const keys = Object.keys(keyTreatmentMap);
    const treatments: Record<string, string[]> = {};
    
    Object.entries(keyTreatmentMap).forEach(([key, treatmentSet]) => {
      treatments[key] = Array.from(treatmentSet);
    });
    
    return { keys, treatments };
  }, [product]);

  // LIX key options (existing + option to create new)
  const lixKeyOptions = React.useMemo(() => {
    return lixData.keys.map(key => ({
      label: key,
      value: key,
      isExisting: true
    }));
  }, [lixData.keys]);

  // LIX treatment options for selected key
  const lixTreatmentOptions = React.useMemo(() => {
    if (!selectedLixKey) return [];
    
    const existingTreatments = lixData.treatments[selectedLixKey] || [];
    return existingTreatments.map(treatment => ({
      label: treatment,
      value: treatment,
      isExisting: true
    }));
  }, [selectedLixKey, lixData.treatments]);

  const handleFormChange = () => {
    const context = {
      channel: selectedChannel,
      billingCycle: selectedBillingCycle,
      lixKey: selectedLixKey,
      lixTreatment: selectedLixTreatment,
      priceGroupAction: selectedPriceGroupAction,
      existingPriceGroup: selectedExistingPriceGroup
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
    
    // Reset progressive disclosure sections
    setLixSectionExpanded(false);
    setSelectedLixKey(null);
    setSelectedLixTreatment(null);
    setLixKeySearchValue('');
    setLixTreatmentSearchValue('');
    form.setFieldsValue({
      lixKey: undefined,
      lixTreatment: undefined
    });
    
    handleFormChange();
  };

  const handleBillingCycleChange = (value: string) => {
    setSelectedBillingCycle(value);
    
    // Reset price group selection when billing cycle changes
    setSelectedPriceGroupAction(null);
    setSelectedExistingPriceGroup(null);
    form.setFieldsValue({ 
      billingCycle: value,
      priceGroupSelection: undefined
    });
    
    handleFormChange();
  };


  // Price group selection handler
  const handlePriceGroupSelectionChange = (value: string) => {
    if (value === 'create') {
      setSelectedPriceGroupAction('create');
      setSelectedExistingPriceGroup(null);
      form.setFieldsValue({ 
        priceGroupSelection: value 
      });
    } else if (value.startsWith('update-')) {
      const priceGroupId = value.replace('update-', '');
      const selectedPriceGroup = existingPriceGroups.find((pg: any) => pg.id === priceGroupId);
      setSelectedPriceGroupAction('update');
      setSelectedExistingPriceGroup(selectedPriceGroup);
      form.setFieldsValue({ 
        priceGroupSelection: value 
      });
    }
    handleFormChange();
  };

  // Progressive disclosure handlers
  const handleAddLixExperiment = () => {
    setLixSectionExpanded(true);
  };

  const handleLixKeyChange = (value: string) => {
    setSelectedLixKey(value);
    setSelectedLixTreatment(null); // Clear treatment when key changes
    form.setFieldsValue({ lixTreatment: null });
    setLixKeySearchValue(''); // Clear search value
    handleFormChange();
  };

  const handleLixTreatmentChange = (value: string) => {
    setSelectedLixTreatment(value);
    setLixTreatmentSearchValue(''); // Clear search value
    handleFormChange();
  };

  const handleLixKeySearch = (value: string) => {
    setLixKeySearchValue(value);
  };

  const handleLixTreatmentSearch = (value: string) => {
    setLixTreatmentSearchValue(value);
  };

  // Trigger context update when key state variables change
  React.useEffect(() => {
    // Only update context when we have meaningful selections
    if (selectedChannel || selectedBillingCycle || selectedPriceGroupAction) {
      handleFormChange();
    }
  }, [selectedChannel, selectedBillingCycle, selectedPriceGroupAction, selectedExistingPriceGroup, selectedLixKey, selectedLixTreatment]);

  // Check if search value for LIX key is new (not in existing options)
  const isNewLixKey = React.useMemo(() => {
    if (!lixKeySearchValue.trim()) return false;
    return !lixData.keys.some(key => 
      key.toLowerCase() === lixKeySearchValue.toLowerCase()
    );
  }, [lixKeySearchValue, lixData.keys]);

  // Check if selected LIX key is new (doesn't exist in product data)
  const isSelectedLixKeyNew = React.useMemo(() => {
    if (!selectedLixKey) return false;
    return !lixData.keys.some(key => 
      key.toLowerCase() === selectedLixKey.toLowerCase()
    );
  }, [selectedLixKey, lixData.keys]);

  // Check if search value for LIX treatment is new (not in existing options)
  const isNewLixTreatment = React.useMemo(() => {
    if (!lixTreatmentSearchValue.trim() || !selectedLixKey || isSelectedLixKeyNew) return false;
    const existingTreatments = lixData.treatments[selectedLixKey] || [];
    return !existingTreatments.some(treatment => 
      treatment.toLowerCase() === lixTreatmentSearchValue.toLowerCase()
    );
  }, [lixTreatmentSearchValue, selectedLixKey, lixData.treatments, isSelectedLixKeyNew]);

  return (
    <div style={{ padding: '24px 0' }}>

      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        style={{ maxWidth: '800px', margin: '0 auto' }}
      >

          {/* Channel Selection - Always Visible (Full Width) */}
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

          {/* Billing Cycle - Show Only After Channel Selected */}
          {selectedChannel && (
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

          {/* Price Group Selection - Show After Channel and Billing Cycle Selected */}
          {selectedChannel && selectedBillingCycle && (
            <Form.Item
              name="priceGroupSelection"
              label="Select price group"
              rules={[{ required: true, message: 'Please select a price group option' }]}
              style={{ marginBottom: '16px' }}
            >
              <Select
                placeholder="Search by ID or choose option"
                size="large"
                showSearch
                allowClear
                filterOption={(input, option) => {
                  const searchTerm = input.toLowerCase();
                  const optionValue = option?.value?.toString().toLowerCase() || '';
                  
                  // Only search existing price group IDs (always show create option)
                  if (optionValue === 'create') return true;
                  return optionValue.includes(searchTerm);
                }}
                onChange={handlePriceGroupSelectionChange}
                style={{ width: '100%' }}
              >
                {/* Always show "Create new" as first option */}
                <Option value="create">
                  + New price group
                </Option>
                
                {/* List all existing price groups */}
                {existingPriceGroups.map((priceGroup: any) => (
                  <Option 
                    key={priceGroup.id}
                    value={`update-${priceGroup.id}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <a
                        href={`/product/${product.id}/price-group/${priceGroup.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ 
                          color: token.colorPrimary,
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        {priceGroup.id}
                        <Text style={{ fontSize: '12px' }}>🔗</Text>
                      </a>
                      <span style={{ color: token.colorTextSecondary }}>
                        ({priceGroup.activePriceCount}+ prices, Valid {priceGroup.mostRecentValidDate})
                      </span>
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Add LIX Experiment Button - Show after price group selection if LIX not expanded */}
          {selectedChannel && selectedBillingCycle && !lixSectionExpanded && (
            <div style={{ marginBottom: '16px' }}>
              <Button 
                type="link" 
                icon={<Plus size={14} />}
                onClick={handleAddLixExperiment}
                style={{ padding: '0', height: 'auto' }}
              >
                Add LIX experiment
              </Button>
            </div>
          )}

          {/* LIX Experiment Section - Show Only When Expanded */}
          {selectedChannel && selectedBillingCycle && lixSectionExpanded && (
            <div style={{ marginBottom: '16px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {/* LIX Key Selection */}
                <Form.Item
                  name="lixKey"
                  label="LIX key"
                    help="Type to add new key"
                  >
                    <Select 
                      placeholder="Select existing or enter new key"
                      size="large"
                      allowClear
                      showSearch
                      onChange={handleLixKeyChange}
                      onSearch={handleLixKeySearch}
                      searchValue={lixKeySearchValue}
                      style={{ 
                        width: '100%',
                        // Force placeholder color to match theme
                        '--placeholder-color': token.colorTextPlaceholder,
                      } as React.CSSProperties}
                      className="lix-key-select"
                      notFoundContent={
                        <div style={{ padding: '12px', textAlign: 'center' }}>
                          <Text style={{ color: token.colorTextTertiary }}>
                            No lix keys. Type to add new key
                          </Text>
                        </div>
                      }
                      dropdownRender={(menu) => (
                        <div>
                          {menu}
                          {isNewLixKey && lixKeySearchValue && (
                            <div
                              style={{
                                padding: '8px 12px',
                                cursor: 'pointer',
                                borderTop: `1px solid ${token.colorBorder}`,
                                color: token.colorPrimary,
                                backgroundColor: token.colorBgTextHover
                              }}
                              onClick={() => {
                                const newValue = lixKeySearchValue.trim();
                                form.setFieldsValue({ lixKey: newValue });
                                handleLixKeyChange(newValue);
                              }}
                            >
                              <Plus size={14} style={{ marginRight: '8px' }} />
                              New LIX key: "{lixKeySearchValue}"
                            </div>
                          )}
                        </div>
                      )}
                    >
                      {lixKeyOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          {String(option.label)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>

                  {/* LIX Treatment Selection - only show after key is selected */}
                  {selectedLixKey && (
                    <Form.Item
                      name="lixTreatment"
                      label="LIX treatment"
                      help="Type to add new treatment"
                    >
                      {isSelectedLixKeyNew ? (
                        /* New LIX Key = Simple text input for treatment */
                        <Input
                          placeholder="Enter treatment name"
                          size="large"
                          onChange={(e) => handleLixTreatmentChange(e.target.value)}
                        />
                      ) : (
                        /* Existing LIX Key = Dropdown with existing treatments + create new */
                        <Select 
                          placeholder="Select existing or enter new treatment"
                          size="large"
                          allowClear
                          showSearch
                          onChange={handleLixTreatmentChange}
                          onSearch={handleLixTreatmentSearch}
                          searchValue={lixTreatmentSearchValue}
                          notFoundContent={
                            <div style={{ padding: '12px', textAlign: 'center' }}>
                              <Text style={{ color: token.colorTextTertiary }}>
                                No lix treatments. Type to add new treatment
                              </Text>
                            </div>
                          }
                          dropdownRender={(menu) => (
                            <div>
                              {menu}
                              {isNewLixTreatment && lixTreatmentSearchValue && (
                                <div
                                  style={{
                                    padding: '8px 12px',
                                    cursor: 'pointer',
                                    borderTop: `1px solid ${token.colorBorder}`,
                                    color: token.colorPrimary,
                                    backgroundColor: token.colorBgTextHover
                                  }}
                                  onClick={() => {
                                    const newValue = lixTreatmentSearchValue.trim();
                                    form.setFieldsValue({ lixTreatment: newValue });
                                    handleLixTreatmentChange(newValue);
                                  }}
                                >
                                  <Plus size={14} style={{ marginRight: '8px' }} />
                                  New LIX treatment: "{lixTreatmentSearchValue}"
                                </div>
                              )}
                            </div>
                          )}
                        >
                          {lixTreatmentOptions.map(option => (
                            <Option key={option.value} value={option.value}>
                              {String(option.label)}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </Form.Item>
                  )}
              </Space>
            </div>
          )}


      </Form>
    </div>
  );
};

export default ContextSelector;
