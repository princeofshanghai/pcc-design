import React, { useState, useEffect } from 'react';
import { Form, Select, InputNumber, Button, Space, Typography, Card, Divider, Input, Collapse, Alert, Modal, Result } from 'antd';
import { Beaker, AlertCircle, Check, ExternalLink } from 'lucide-react';
import type { Product, ConfigurationRequest, SalesChannel, BillingCycle, ChangeRequestStatus } from '../../utils/types';
import { validateChangeRequest, checkDetailedChangeRequestConflicts, type ConflictDetail, submitChangeRequest, getSubmissionSuccessMessage, getSubmissionNextSteps, type ChangeRequestSubmissionResult } from '../../utils/configurationUtils';
import { ConflictResolutionPanel } from './ConflictWarning';

const { Title, Text } = Typography;

interface ChangeRequestFormProps {
  product: Product;
  onSubmit?: (configData: any) => void;
  onCancel?: () => void;
  onFieldChange?: (formData: Partial<FormData>) => void;
  onSuccess?: (result: ChangeRequestSubmissionResult) => void;
}

interface FormData {
  salesChannel: SalesChannel;
  billingCycle: BillingCycle;
  priceAmount: number;
  lixKey?: string;
  lixTreatment?: string;
}

interface ValidationState {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string>;
}

export const ChangeRequestForm: React.FC<ChangeRequestFormProps> = ({ 
  product, 
  onSubmit,
  onCancel,
  onFieldChange,
  onSuccess 
}) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [validationState, setValidationState] = useState<ValidationState>({
    isValid: false,
    errors: [],
    warnings: [],
    fieldErrors: {}
  });
  const [detailedConflicts, setDetailedConflicts] = useState<ConflictDetail[]>([]);
  const [conflictOverrides, setConflictOverrides] = useState<Set<string>>(new Set());
  const [submissionResult, setSubmissionResult] = useState<ChangeRequestSubmissionResult | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Real-time validation whenever form data changes
  useEffect(() => {
    if (formData.salesChannel || formData.billingCycle || formData.priceAmount) {
      validateForm();
    }
  }, [formData]);

  const validateForm = () => {
    // Only validate if we have required fields
    if (!formData.salesChannel || !formData.billingCycle || !formData.priceAmount) {
      setDetailedConflicts([]);
      return;
    }

    // Create a temporary configuration request for validation
    const tempRequest: ConfigurationRequest = {
      id: 'temp-validation',
      targetProductId: product.id,
      salesChannel: formData.salesChannel,
      billingCycle: formData.billingCycle,
      priceAmount: formData.priceAmount,
      lixKey: formData.lixKey,
      lixTreatment: formData.lixTreatment,
      status: 'Draft' as ChangeRequestStatus,
      createdBy: 'current-user',
      createdDate: new Date().toISOString()
    };

    // Get detailed conflicts
    const conflicts = checkDetailedChangeRequestConflicts(product, tempRequest);
    setDetailedConflicts(conflicts);

    // Standard validation
    const validation = validateChangeRequest(product, tempRequest);
    setValidationState({
      ...validation,
      fieldErrors: {}
    });
  };

  const handleFieldChange = (field: keyof FormData, value: any) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    setFormData(updatedFormData);
    
    // Call the parent's onFieldChange callback for real-time updates
    if (onFieldChange) {
      onFieldChange(updatedFormData);
    }
  };

  const handleConflictResolution = (action: string, conflictId?: string) => {
    switch (action) {
      case 'override':
        if (conflictId) {
          setConflictOverrides(prev => new Set(prev).add(conflictId));
        }
        break;
      case 'acknowledge':
        if (conflictId) {
          setConflictOverrides(prev => new Set(prev).add(conflictId));
        }
        break;
      case 'cancel':
        if (onCancel) {
          onCancel();
        }
        break;
      case 'proceed':
        // Allow proceeding if no critical errors or all are overridden
        const criticalErrors = detailedConflicts.filter(c => c.severity === 'error');
        const unoverriddenErrors = criticalErrors.filter(c => !conflictOverrides.has(c.conflictingId || ''));
        
        if (unoverriddenErrors.length === 0) {
          handleFormSubmit();
        }
        break;
    }
  };

  const handleViewConflictingItem = (type: string, id: string) => {
    // TODO: Navigate to the conflicting item
    console.log('View conflicting item:', type, id);
  };

  const handleFormSubmit = async () => {
    // Get form values
    const values = form.getFieldsValue();
    await handleSubmit(values);
  };

  const handleSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    
    try {
      // Use the new submission service
      const result = submitChangeRequest(product, {
        salesChannel: values.salesChannel,
        billingCycle: values.billingCycle,
        priceAmount: values.priceAmount,
        lixKey: values.lixKey,
        lixTreatment: values.lixTreatment
      });

      setSubmissionResult(result);

      if (result.success) {
        setShowSuccessModal(true);
        
        // Call the success callback if provided
        if (onSuccess) {
          onSuccess(result);
        }
        
        // Also call the original onSubmit callback for backward compatibility
        if (onSubmit) {
          onSubmit(result.changeRequest);
        }
      } else {
        // Handle submission failure
        setValidationState(prev => ({
          ...prev,
          errors: [result.error || 'Submission failed']
        }));
      }
    } catch (error) {
      console.error('Error submitting configuration:', error);
      setValidationState(prev => ({
        ...prev,
        errors: ['An unexpected error occurred during submission. Please try again.']
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    
    // Close the form after successful submission
    if (onCancel) {
      onCancel();
    }
  };

  const handleViewGeneratedAssets = () => {
    if (submissionResult?.changeRequest) {
      const request = submissionResult.changeRequest;
      
      // Navigate to the configuration request detail page
      window.location.href = `/product/${product.id}/configuration/${request.id}`;
    }
  };

  const handleViewGeneratedSku = () => {
    if (submissionResult?.generatedSku) {
      const sku = submissionResult.generatedSku;
      
      // Navigate to the SKU detail page
      window.location.href = `/product/${product.id}/sku/${sku.id}`;
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
    // Business rule validation
    if (product.billingModel === 'One-time' && value < 10) {
      return Promise.reject(new Error('One-time products must be priced at least $10.00'));
    }
    return Promise.resolve();
  };

  const validateLixKey = (_: any, value: string) => {
    if (value && !/^[a-zA-Z0-9_-]+$/.test(value)) {
      return Promise.reject(new Error('LIX key can only contain letters, numbers, hyphens, and underscores'));
    }
    if (value && value.length < 3) {
      return Promise.reject(new Error('LIX key must be at least 3 characters long'));
    }
    return Promise.resolve();
  };

  const validateLixTreatment = (_: any, value: string) => {
    if (value && !/^[a-zA-Z0-9_-]+$/.test(value)) {
      return Promise.reject(new Error('LIX treatment can only contain letters, numbers, hyphens, and underscores'));
    }
    if (value && value.length < 3) {
      return Promise.reject(new Error('LIX treatment must be at least 3 characters long'));
    }
    return Promise.resolve();
  };

  const criticalErrors = detailedConflicts.filter(c => c.severity === 'error');
  const unoverriddenErrors = criticalErrors.filter(c => !conflictOverrides.has(c.conflictingId || ''));
  const hasBlockingConflicts = unoverriddenErrors.length > 0;

  const isFormValid = validationState.isValid && 
                     formData.salesChannel && 
                     formData.billingCycle && 
                     formData.priceAmount && 
                     formData.priceAmount > 0 &&
                     !hasBlockingConflicts;

  return (
    <>
      <Card>
        <Title level={4}>Create Configuration for {product.name}</Title>
        <Text type="secondary">
          Configure pricing and availability for different sales channels
        </Text>
        
        {/* Global validation errors */}
        {validationState.errors.length > 0 && (
          <Alert
            type="error"
            showIcon
            icon={<AlertCircle size={16} />}
            style={{ marginTop: 16 }}
            message="Configuration Issues"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 16 }}>
                {validationState.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            }
          />
        )}

        {/* Global validation warnings */}
        {validationState.warnings.length > 0 && (
          <Alert
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
            message="Recommendations"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 16 }}>
                {validationState.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            }
          />
        )}

        {/* Enhanced Conflict Detection */}
        {detailedConflicts.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <ConflictResolutionPanel
              product={product}
              configurationData={formData}
              onResolveConflict={handleConflictResolution}
              onViewConflictingItem={handleViewConflictingItem}
            />
          </div>
        )}
        
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
            <Select 
              placeholder="Select sales channel"
              onChange={(value) => handleFieldChange('salesChannel', value)}
            >
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
            <Select 
              placeholder="Select billing cycle"
              onChange={(value) => handleFieldChange('billingCycle', value)}
            >
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
              onChange={(value) => handleFieldChange('priceAmount', value)}
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
                      <Input 
                        placeholder="Enter LIX key (e.g., pricing_test_v2)" 
                        onChange={(e) => handleFieldChange('lixKey', e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="lixTreatment"
                      label="LIX Treatment"
                      rules={[{ validator: validateLixTreatment }]}
                      validateTrigger={['onChange', 'onBlur']}
                      hasFeedback
                    >
                      <Input 
                        placeholder="Enter LIX treatment (e.g., control, treatment_a)" 
                        onChange={(e) => handleFieldChange('lixTreatment', e.target.value)}
                      />
                    </Form.Item>
                  </Space>
                )
              }
            ]}
          />

          <Form.Item style={{ marginTop: 32 }}>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={isSubmitting}
                disabled={!isFormValid}
                icon={<Check size={16} />}
              >
                {isSubmitting ? 'Creating Configuration...' : 'Create Configuration'}
              </Button>
              <Button onClick={onCancel}>Cancel</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* Success Modal */}
      <Modal
        open={showSuccessModal}
        onCancel={handleSuccessModalClose}
        footer={null}
        width={600}
        centered
        zIndex={1200}
      >
        {submissionResult && (
          <Result
            status="success"
            title="Configuration Created Successfully!"
            subTitle={getSubmissionSuccessMessage(submissionResult)}
            extra={
              <Space direction="vertical" style={{ width: '100%' }} size="middle">
                {/* Next Steps */}
                <Card size="small" style={{ textAlign: 'left' }}>
                  <Title level={5}>Next Steps:</Title>
                  <ul style={{ paddingLeft: '20px' }}>
                    {getSubmissionNextSteps(submissionResult).map((step, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>
                        <Text>{step}</Text>
                      </li>
                    ))}
                  </ul>
                </Card>

                {/* Action Buttons */}
                <Space>
                  <Button 
                    type="primary" 
                    icon={<ExternalLink size={16} />}
                    onClick={handleViewGeneratedAssets}
                  >
                    View Configuration Details
                  </Button>
                  {submissionResult.generatedSku && (
                    <Button 
                      icon={<ExternalLink size={16} />}
                      onClick={handleViewGeneratedSku}
                    >
                      View Generated SKU
                    </Button>
                  )}
                  <Button onClick={handleSuccessModalClose}>
                    Close
                  </Button>
                </Space>
              </Space>
            }
          />
        )}
      </Modal>
    </>
  );
}; 