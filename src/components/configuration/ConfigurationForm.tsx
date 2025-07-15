import React, { useState } from 'react';
import { Form, Select, InputNumber, Button, Space, Typography, Card, Divider, Input, Collapse } from 'antd';
import { Beaker } from 'lucide-react';
import type { Product } from '../../utils/types';

const { Title, Text } = Typography;

interface ConfigurationFormProps {
  product: Product;
  onSubmit?: (configData: any) => void;
  onCancel?: () => void;
}

export const ConfigurationForm: React.FC<ConfigurationFormProps> = ({ 
  product, 
  onSubmit,
  onCancel 
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      console.log('Configuration submitted:', values);
      if (onSubmit) {
        onSubmit(values);
      }
    } catch (error) {
      console.error('Error submitting configuration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePrice = (_: any, value: number) => {
    if (!value) {
      return Promise.reject(new Error('Please enter a price'));
    }
    if (value <= 0) {
      return Promise.reject(new Error('Price must be greater than $0.00'));
    }
    if (value > 99999.99) {
      return Promise.reject(new Error('Price cannot exceed $99,999.99'));
    }
    return Promise.resolve();
  };

  const validateLixKey = (_: any, value: string) => {
    if (value && !/^[a-zA-Z0-9_-]+$/.test(value)) {
      return Promise.reject(new Error('LIX key can only contain letters, numbers, hyphens, and underscores'));
    }
    return Promise.resolve();
  };

  return (
    <Card>
      <Title level={4}>Create Configuration for {product.name}</Title>
      <Text type="secondary">
        Configure pricing and availability for different sales channels
      </Text>
      
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ marginTop: 24 }}
      >
        <Form.Item
          name="salesChannel"
          label="Sales Channel"
          rules={[{ required: true, message: 'Please select a sales channel' }]}
          validateTrigger="onChange"
          hasFeedback
        >
          <Select placeholder="Select sales channel">
            <Select.Option value="Desktop">Desktop</Select.Option>
            <Select.Option value="Mobile">Mobile</Select.Option>
            <Select.Option value="Field">Field</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="billingCycle"
          label="Billing Cycle"
          rules={[{ required: true, message: 'Please select a billing cycle' }]}
          validateTrigger="onChange"
          hasFeedback
        >
          <Select placeholder="Select billing cycle">
            <Select.Option value="Monthly">Monthly</Select.Option>
            <Select.Option value="Quarterly">Quarterly</Select.Option>
            <Select.Option value="Annual">Annual</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="priceAmount"
          label="Price (USD)"
          rules={[{ validator: validatePrice }]}
          validateTrigger={['onChange', 'onBlur']}
          hasFeedback
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Enter price amount"
            prefix="$"
            min={0.01}
            step={0.01}
            precision={2}
          />
        </Form.Item>

        <Divider />

        <Collapse 
          ghost 
          items={[
            {
              key: 'experimental',
              label: (
                <Space>
                  <Beaker size={16} />
                  <span>Experimental Configuration (Optional)</span>
                </Space>
              ),
              children: (
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Text type="secondary">
                    Configure LIX (LinkedIn Experiment) parameters for A/B testing and feature experimentation.
                  </Text>
                  
                  <Form.Item
                    name="lixKey"
                    label="LIX Key"
                    style={{ marginTop: 16 }}
                    rules={[{ validator: validateLixKey }]}
                    validateTrigger={['onChange', 'onBlur']}
                    hasFeedback
                  >
                    <Input placeholder="Enter LIX key (e.g., pricing_test_v2)" />
                  </Form.Item>

                  <Form.Item
                    name="lixTreatment"
                    label="LIX Treatment"
                    rules={[{ validator: validateLixKey }]}
                    validateTrigger={['onChange', 'onBlur']}
                    hasFeedback
                  >
                    <Input placeholder="Enter LIX treatment (e.g., control, treatment_a)" />
                  </Form.Item>
                </Space>
              )
            }
          ]}
        />

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button type="primary" htmlType="submit" loading={isSubmitting}>
              Next
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}; 