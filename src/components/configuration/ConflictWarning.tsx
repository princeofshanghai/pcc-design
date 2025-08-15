import React from 'react';
import { Alert, Typography, Space, Tag, Button, Card, Row, Col } from 'antd';
import { AlertTriangle, Info, ExternalLink, Clock, RefreshCw } from 'lucide-react';
import { colors } from '../../theme';
import type { Product, ConfigurationRequest } from '../../utils/types';
import { checkDetailedChangeRequestConflicts, getConflictResolutionSuggestions, type ConflictDetail } from '../../utils/configurationUtils';

const { Text } = Typography;

interface ConflictResolutionPanelProps {
  product: Product;
  configurationData: {
    salesChannel?: string;
    billingCycle?: string;
    priceAmount?: number;
    lixKey?: string;
    lixTreatment?: string;
  };
  onResolveConflict?: (action: string, conflictId?: string) => void;
  onViewConflictingItem?: (type: string, id: string) => void;
}

export const ConflictResolutionPanel: React.FC<ConflictResolutionPanelProps> = ({
  product,
  configurationData,
  onResolveConflict,
  onViewConflictingItem
}) => {
  const { salesChannel, billingCycle, priceAmount, lixKey, lixTreatment } = configurationData;

  // Generate detailed conflicts using the enhanced utility function
  const conflicts = React.useMemo(() => {
    if (!salesChannel || !billingCycle) return [];

    const mockConfigRequest: ConfigurationRequest = {
      id: 'temp-validation',
      targetProductId: product.id,
      salesChannel: salesChannel as any,
      billingCycle: billingCycle as any,
      priceAmount: priceAmount || 0,
      lixKey,
      lixTreatment,
      status: 'Draft' as any,
      createdBy: 'Current User',
      createdDate: new Date().toISOString()
    };

    return checkDetailedChangeRequestConflicts(product, mockConfigRequest);
  }, [product, salesChannel, billingCycle, priceAmount, lixKey, lixTreatment]);

  // Get overall resolution suggestions
  const resolutionSuggestions = React.useMemo(() => {
    return getConflictResolutionSuggestions(conflicts);
  }, [conflicts]);

  if (conflicts.length === 0) {
    return null;
  }

  // Separate conflicts by severity
  const errors = conflicts.filter(c => c.severity === 'error');
  const warnings = conflicts.filter(c => c.severity === 'warning');
  const info = conflicts.filter(c => c.severity === 'info');

  const getAlertIcon = (severity: ConflictDetail['severity']) => {
    switch (severity) {
      case 'error': return <AlertTriangle size={16} />;
      case 'warning': return <Clock size={16} />;
      case 'info': return <Info size={16} />;
      default: return <Info size={16} />;
    }
  };


  const renderConflictCard = (conflict: ConflictDetail) => (
    <Card key={conflict.conflictingId} size="small" style={{ marginBottom: '16px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Space>
            {getAlertIcon(conflict.severity)}
            <Text strong>{conflict.title}</Text>
            <Tag color={
              conflict.severity === 'error' ? 'red' : 
              conflict.severity === 'warning' ? 'orange' : 'blue'
            }>
              {conflict.severity.toUpperCase()}
            </Tag>
          </Space>
          {conflict.conflictingId && (
            <Button
              type="text"
              size="small"
              icon={<ExternalLink size={12} />}
              onClick={() => onViewConflictingItem?.(conflict.type, conflict.conflictingId!)}
            >
              View
            </Button>
          )}
        </div>
        
        <Text type="secondary">{conflict.description}</Text>
        
        {conflict.conflictingId && (
          <div>
            <Text type="secondary">Conflicting {conflict.type.replace('_', ' ')}: </Text>
            <Text code>{conflict.conflictingId}</Text>
          </div>
        )}
        
        <div>
          <Text strong style={{ fontSize: '12px' }}>Suggestions:</Text>
          <ul style={{ margin: '4px 0', paddingLeft: '20px' }}>
            {conflict.suggestions.map((suggestion, index) => (
              <li key={index} style={{ fontSize: '13px', marginBottom: '2px' }}>
                <Text type="secondary">{suggestion}</Text>
              </li>
            ))}
          </ul>
        </div>
        
        <Space>
          {conflict.canOverride && (
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() => onResolveConflict?.('override', conflict.conflictingId)}
            >
              Override
            </Button>
          )}
          <Button
            size="small"
            onClick={() => onResolveConflict?.('acknowledge', conflict.conflictingId)}
          >
            Acknowledge
          </Button>
        </Space>
      </Space>
    </Card>
  );

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="large">
      {/* Critical Errors */}
      {errors.length > 0 && (
        <Alert
          type="error"
          showIcon
          icon={<AlertTriangle size={16} />}
          message={`${errors.length} Critical Conflict${errors.length > 1 ? 's' : ''} Detected`}
          description="The following conflicts must be resolved before proceeding:"
        />
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert
          type="warning"
          showIcon
          icon={<Clock size={16} />}
          message={`${warnings.length} Warning${warnings.length > 1 ? 's' : ''} Found`}
          description="Please review these potential issues:"
        />
      )}

      {/* Info */}
      {info.length > 0 && (
        <Alert
          type="info"
          showIcon
          icon={<Info size={16} />}
          message={`${info.length} Item${info.length > 1 ? 's' : ''} for Review`}
          description="Consider these recommendations:"
        />
      )}

      {/* Conflict Details */}
      <Space direction="vertical" style={{ width: '100%' }}>
        {[...errors, ...warnings, ...info].map(renderConflictCard)}
      </Space>

      {/* Resolution Suggestions */}
      {resolutionSuggestions.length > 0 && (
        <Card size="small" style={{ backgroundColor: colors.neutral[50], border: `1px solid ${colors.neutral[100]}` }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <RefreshCw size={16} />
              <Text strong>Recommended Actions:</Text>
            </Space>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              {resolutionSuggestions.map((suggestion, index) => (
                <li key={index} style={{ marginBottom: '4px' }}>
                  <Text type="secondary">{suggestion}</Text>
                </li>
              ))}
            </ul>
          </Space>
        </Card>
      )}

      {/* Global Actions */}
      <Row gutter={16}>
        <Col span={12}>
          <Button
            block
            type="primary"
            danger={errors.length > 0}
            disabled={errors.length > 0}
            onClick={() => onResolveConflict?.('proceed')}
          >
            {errors.length > 0 ? 'Resolve Conflicts First' : 'Proceed Anyway'}
          </Button>
        </Col>
        <Col span={12}>
          <Button
            block
            onClick={() => onResolveConflict?.('cancel')}
          >
            Cancel & Review
          </Button>
        </Col>
      </Row>

      {/* Current Configuration Summary */}
      <Card size="small" style={{ backgroundColor: colors.gray[50], border: `1px solid ${colors.gray[400]}` }}>
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
      </Card>
    </Space>
  );
};

// Legacy component for backwards compatibility
export const ConflictWarning: React.FC<ConflictResolutionPanelProps> = ConflictResolutionPanel; 