import React, { useState } from 'react';
import { Form, Select, Input, DatePicker, Radio, Space, Typography, theme, Card } from 'antd';
import dayjs from 'dayjs';
import { mockGTMMotions } from '../../../utils/mock-data';
import type { GTMMotion } from '../../../utils/types';
import { Calendar } from 'lucide-react';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface GTMMotionSelectorProps {
  onSelectionChange?: (selection: GTMMotionSelection) => void;
  selectedProductName?: string; // For context in motion creation
}

export interface GTMMotionSelection {
  mode: 'existing' | 'new';
  existingMotion?: GTMMotion;
  newMotion?: {
    name: string;
    description: string;
    activationDate: string;
  };
}

const GTMMotionSelector: React.FC<GTMMotionSelectorProps> = ({ 
  onSelectionChange,
  selectedProductName = "Product"
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [selectionMode, setSelectionMode] = useState<'existing' | 'new'>('existing');
  const [selectedMotionId, setSelectedMotionId] = useState<string | null>(null);
  const [activationMode, setActivationMode] = useState<'asap' | 'scheduled'>('asap');

  // Filter GTM motions to only show Draft status (fully editable)
  const editableMotions = mockGTMMotions.filter(motion => 
    motion.status === 'Draft'
  );

  // Sort by most recent first
  const sortedMotions = editableMotions.sort((a, b) => 
    new Date(b.updatedDate || b.createdDate).getTime() - 
    new Date(a.updatedDate || a.createdDate).getTime()
  );

  const handleModeChange = (e: any) => {
    const mode = e.target.value;
    setSelectionMode(mode);
    setSelectedMotionId(null);
    setActivationMode('asap'); // Reset to ASAP when switching modes
    form.resetFields();
    
    if (onSelectionChange) {
      onSelectionChange({ mode });
    }
  };

  const handleExistingMotionChange = (motionId: string) => {
    setSelectedMotionId(motionId);
    const selectedMotion = sortedMotions.find(m => m.id === motionId);
    
    if (onSelectionChange && selectedMotion) {
      onSelectionChange({
        mode: 'existing',
        existingMotion: selectedMotion
      });
    }
  };

  const handleFormChange = () => {
    if (selectionMode === 'new') {
      const values = form.getFieldsValue();
      
      // For ASAP mode, only name and description are required
      // For scheduled mode, activation date is also required
      const hasRequiredFields = values.name && values.description && 
        (activationMode === 'asap' || (activationMode === 'scheduled' && values.activationDate));
      
      if (hasRequiredFields) {
        if (onSelectionChange) {
          // Generate activation date based on mode
          let activationDate;
          if (activationMode === 'asap') {
            // Set to 7 days from now as minimum for ASAP mode
            activationDate = dayjs().add(7, 'day').toISOString();
          } else {
            activationDate = values.activationDate.toISOString();
          }
          
          onSelectionChange({
            mode: 'new',
            newMotion: {
              name: values.name,
              description: values.description,
              activationDate
            }
          });
        }
      }
    }
  };

  const formatMotionDate = (dateString: string) => {
    return dayjs(dateString).format('MMM D, YYYY');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return token.colorTextSecondary;
      case 'Submitted': return token.colorWarning;
      case 'Pending approvals': return token.colorInfo;
      case 'Approved': return token.colorSuccess;
      default: return token.colorTextSecondary;
    }
  };

  return (
    <div style={{ padding: '24px 0' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={4} style={{ 
            margin: '0 0 8px 0',
            fontSize: token.fontSizeHeading3
          }}>
            Choose GTM motion to add changes to
          </Title>
          <Text style={{ 
            color: token.colorTextSecondary, 
            fontSize: token.fontSize,
            display: 'block',
            marginBottom: '24px',
            maxWidth: '720px'
          }}>
            GTM motions represent product configuration changes tied to a business initiative. Use the same motion for changes that should activate together, or create separate motions for different timing.
          </Text>
        </div>

        <Radio.Group 
          value={selectionMode} 
          onChange={handleModeChange}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Existing GTM Motion Option */}
            <Card 
              size="small"
              style={{ 
                border: selectionMode === 'existing' ? `2px solid ${token.colorPrimary}` : `1px solid ${token.colorBorder}`,
                backgroundColor: selectionMode === 'existing' ? token.colorPrimaryBg : token.colorBgContainer
              }}
            >
              <Radio value="existing" style={{ alignSelf: 'flex-start' }}>
                <Text strong>Add to existing GTM Motion</Text>
              </Radio>
              
              {selectionMode === 'existing' && (
                <div style={{ marginTop: '16px', marginLeft: '24px' }}>
                  <Select
                    placeholder="Select a GTM Motion to add price changes to"
                    size="large"
                    style={{ width: '100%' }}
                    value={selectedMotionId}
                    onChange={handleExistingMotionChange}
                    showSearch
                    optionLabelProp="label"
                    filterOption={(input, option) =>
                      option?.label?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
                    }
                  >
                    {sortedMotions.map(motion => (
                      <Option key={motion.id} value={motion.id} label={motion.name}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          width: '100%'
                        }}>
                          <div>
                            <div style={{ fontWeight: 500, marginBottom: '2px' }}>
                              {motion.name}
                            </div>
                            <div style={{ 
                              fontSize: '12px', 
                              color: token.colorTextSecondary,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px'
                            }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Calendar size={12} />
                                {formatMotionDate(motion.activationDate)}
                              </span>
                              <span>•</span>
                              <span style={{ color: getStatusColor(motion.status) }}>
                                {motion.status}
                              </span>
                              <span>•</span>
                              <span>{motion.items.length} item{motion.items.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                  
                  {sortedMotions.length === 0 && (
                    <Text style={{ color: token.colorTextSecondary, fontSize: '13px' }}>
                      No Draft GTM Motions available. Create a new one below.
                    </Text>
                  )}
                </div>
              )}
            </Card>

            {/* New GTM Motion Option */}
            <Card 
              size="small"
              style={{ 
                border: selectionMode === 'new' ? `2px solid ${token.colorPrimary}` : `1px solid ${token.colorBorder}`,
                backgroundColor: selectionMode === 'new' ? token.colorPrimaryBg : token.colorBgContainer
              }}
            >
              <Radio value="new" style={{ alignSelf: 'flex-start' }}>
                <Text strong>Create new GTM Motion</Text>
              </Radio>
              
              {selectionMode === 'new' && (
                <div style={{ marginTop: '16px', marginLeft: '24px' }}>
                  <Form
                    form={form}
                    layout="vertical"
                    onValuesChange={handleFormChange}
                    style={{ maxWidth: '600px' }}
                  >
                    <Form.Item
                      name="name"
                      label="Motion name"
                      rules={[
                        { required: true, message: 'Please enter a motion name' },
                        { min: 3, message: 'Motion name must be at least 3 characters' },
                        { max: 100, message: 'Motion name must be less than 100 characters' }
                      ]}
                    >
                      <Input 
                        placeholder={`e.g., ${selectedProductName} Q1 2024 Price Updates`}
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="Description (optional)"
                      rules={[
                        { max: 500, message: 'Description must be less than 500 characters' }
                      ]}
                    >
                      <TextArea 
                        rows={3}
                        placeholder="Describe the purpose and scope of these price changes..."
                        size="large"
                      />
                    </Form.Item>

                    <Form.Item
                      label="Activation date"
                      style={{ marginBottom: '16px' }}
                    >
                      <Radio.Group 
                        value={activationMode} 
                        onChange={(e) => {
                          setActivationMode(e.target.value);
                          // Clear activation date when switching to ASAP
                          if (e.target.value === 'asap') {
                            form.setFieldsValue({ activationDate: undefined });
                          }
                          handleFormChange();
                        }}
                      >
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                          <Card 
                            size="small"
                            style={{ 
                              borderRadius: token.borderRadiusLG,
                              border: activationMode === 'asap' ? `2px solid ${token.colorPrimary}` : `1px solid ${token.colorBorder}`,
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setActivationMode('asap');
                              form.setFieldsValue({ activationDate: undefined });
                              handleFormChange();
                            }}
                          >
                            <Radio value="asap">
                              <div>
                                <div style={{ fontWeight: 500 }}>Activate as soon as possible</div>
                                <div style={{ 
                                  color: token.colorTextSecondary, 
                                  fontSize: token.fontSizeSM,
                                  fontWeight: 'normal'
                                }}>
                                  After approvals complete
                                </div>
                              </div>
                            </Radio>
                          </Card>
                          
                          <Card 
                            size="small"
                            style={{ 
                              borderRadius: token.borderRadiusLG,
                              border: activationMode === 'scheduled' ? `2px solid ${token.colorPrimary}` : `1px solid ${token.colorBorder}`,
                              cursor: 'pointer'
                            }}
                            onClick={() => {
                              setActivationMode('scheduled');
                              handleFormChange();
                            }}
                          >
                            <Radio value="scheduled">
                              <div style={{ fontWeight: 500 }}>Schedule for specific date</div>
                            </Radio>
                          </Card>
                        </Space>
                      </Radio.Group>
                    </Form.Item>

                    {activationMode === 'scheduled' && (
                      <Form.Item
                        name="activationDate"
                        label="Activation date"
                        rules={[
                          { required: true, message: 'Please select an activation date' }
                        ]}
                        style={{ marginLeft: '24px' }}
                      >
                        <DatePicker 
                          size="large"
                          style={{ width: '200px' }}
                          placeholder="Select date"
                          disabledDate={(current) => {
                            // Disable dates before 7 days from now and after 9 months from now
                            const minDate = dayjs().add(7, 'day').startOf('day');
                            const maxDate = dayjs().add(9, 'month').endOf('day');
                            return current && (current < minDate || current > maxDate);
                          }}
                          onChange={handleFormChange}
                        />
                        <div style={{ 
                          color: token.colorTextSecondary, 
                          fontSize: token.fontSizeSM,
                          marginTop: '4px'
                        }}>
                          Minimum 7 days from today, maximum 9 months in advance
                        </div>
                      </Form.Item>
                    )}
                  </Form>
                </div>
              )}
            </Card>
          </Space>
        </Radio.Group>
      </Space>
    </div>
  );
};

export default GTMMotionSelector;
