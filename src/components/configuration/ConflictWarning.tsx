import React from 'react';
import { Alert, Typography, Space, Tag, Button, Divider } from 'antd';
import { AlertTriangle, X, Info } from 'lucide-react';
import type { Product, ConfigurationRequest } from '../../utils/types';
import { checkConfigurationConflicts } from '../../utils/configurationUtils';

const { Text, Title } = Typography;

interface ConflictWarningProps {
  product: Product;
  configurationData: {
    salesChannel?: string;
    billingCycle?: string;
    priceAmount?: number;
    lixKey?: string;
    lixTreatment?: string;
  };
  onResolveConflict?: (action: string) => void;
}

export const ConflictWarning: React.FC<ConflictWarningProps> = ({
  product,
  configurationData,
  onResolveConflict
}) => {
  const { salesChannel, billingCycle, priceAmount, lixKey, lixTreatment } = configurationData;

  // Generate conflicts using the utility function
  const conflicts = React.useMemo(() => {
    if (!salesChannel || !billingCycle || !priceAmount) return [];

    const mockConfigRequest: ConfigurationRequest = {
      id: 'temp-validation',
      targetProductId: product.id,
      salesChannel: salesChannel as any,
      billingCycle: billingCycle as any,
      priceAmount,
      lixKey,
      lixTreatment,
      status: 'Pending Review',
      createdBy: 'Current User',
      createdDate: new Date().toISOString()
    };

    return checkConfigurationConflicts(product, mockConfigRequest);
  }, [product, salesChannel, billingCycle, priceAmount, lixKey, lixTreatment]);

  // Additional validation checks
  const additionalWarnings = React.useMemo(() => {
    const warnings: string[] = [];

    // Check for LIX configuration warnings
    if (lixKey && !lixTreatment) {
      warnings.push('LIX key provided but no treatment specified. Both fields are recommended for proper experimentation.');
    }

    if (lixTreatment && !lixKey) {
      warnings.push('LIX treatment provided but no key specified. Both fields are recommended for proper experimentation.');
    }

    // Check for pricing tier consistency
    if (priceAmount && priceAmount > 500) {
      warnings.push('High price point detected. Consider if this aligns with product positioning and market expectations.');
    }

    if (priceAmount && priceAmount < 10) {
      warnings.push('Low price point detected. Verify this meets minimum pricing requirements and business objectives.');
    }

    return warnings;
  }, [lixKey, lixTreatment, priceAmount]);

  const allIssues = [...conflicts, ...additionalWarnings];

  if (allIssues.length === 0) {
    return null;
  }

  const hasErrors = conflicts.length > 0;
  const hasWarnings = additionalWarnings.length > 0;

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Critical Conflicts */}
      {hasErrors && (
        <Alert
          type="error"
          showIcon
          icon={<AlertTriangle size={16} />}
          message="Configuration Conflicts Detected"
          description={
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                The following conflicts must be resolved before this configuration can be created:
              </Text>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {conflicts.map((conflict, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    <Text>{conflict}</Text>
                  </li>
                ))}
              </ul>
              <Divider style={{ margin: '12px 0' }} />
              <Space>
                <Button 
                  size="small" 
                  onClick={() => onResolveConflict?.('modify')}
                >
                  Modify Configuration
                </Button>
                <Button 
                  size="small" 
                  type="link"
                  onClick={() => onResolveConflict?.('override')}
                >
                  Override Conflicts
                </Button>
              </Space>
            </Space>
          }
        />
      )}

      {/* Warnings */}
      {hasWarnings && (
        <Alert
          type="warning"
          showIcon
          message="Configuration Warnings"
          description={
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text>
                Please review the following recommendations:
              </Text>
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {additionalWarnings.map((warning, index) => (
                  <li key={index} style={{ marginBottom: '4px' }}>
                    <Text>{warning}</Text>
                  </li>
                ))}
              </ul>
              <Divider style={{ margin: '12px 0' }} />
              <Space>
                <Button 
                  size="small" 
                  onClick={() => onResolveConflict?.('acknowledge')}
                >
                  Acknowledge & Continue
                </Button>
                <Button 
                  size="small" 
                  type="link"
                  onClick={() => onResolveConflict?.('review')}
                >
                  Review Configuration
                </Button>
              </Space>
            </Space>
          }
        />
      )}

      {/* Configuration Summary for Context */}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '12px', 
        borderRadius: '6px', 
        border: '1px solid #e9ecef' 
      }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Info size={16} />
            <Text strong>Current Configuration:</Text>
          </Space>
          <Space wrap>
            {salesChannel && <Tag color="blue">{salesChannel}</Tag>}
            {billingCycle && <Tag color="purple">{billingCycle}</Tag>}
            {priceAmount && <Tag color="green">${priceAmount.toFixed(2)}</Tag>}
            {lixKey && <Tag color="orange">LIX: {lixKey}</Tag>}
          </Space>
        </Space>
      </div>
    </Space>
  );
}; 