import React from 'react';
import { Steps, Typography, Space, Tag, Card } from 'antd';
import { Clock, Eye, CheckCircle, XCircle, FileText } from 'lucide-react';
import type { ChangeRequestStatus as ChangeRequestStatusType, ConfigurationRequest } from '../../utils/types';

const { Text, Title } = Typography;

interface ChangeRequestTimelineProps {
  request: ConfigurationRequest;
  showDetails?: boolean;
  vertical?: boolean;
}

const TIMELINE_STAGES = [
  {
    key: 'draft',
    title: 'Draft',
    description: 'Configuration request created',
    icon: <FileText size={16} />,
    color: '#722ed1'
  },
  {
    key: 'pending_review',
    title: 'Pending Review',
    description: 'Awaiting approval',
    icon: <Clock size={16} />,
    color: '#fa8c16'
  },
  {
    key: 'in_staging',
    title: 'In EI',
    description: 'Testing in EI environment',
    icon: <Eye size={16} />,
    color: '#1677ff'
  },
  {
    key: 'live',
    title: 'Live',
    description: 'Deployed to production',
    icon: <CheckCircle size={16} />,
    color: '#52c41a'
  }
] as const;

export const ChangeRequestTimeline: React.FC<ChangeRequestTimelineProps> = ({
  request,
  showDetails = true,
  vertical = false
}) => {
  // Map status to timeline position
  const getTimelinePosition = (status: ChangeRequestStatusType): number => {
    switch (status) {
      case 'Pending Review':
        return 1;
      case 'In EI':
        return 2;
      case 'Live':
        return 3;
      case 'Failed':
        return Math.max(1, TIMELINE_STAGES.findIndex(stage => stage.key === 'pending_review'));
      default:
        return 0;
    }
  };

  const currentPosition = getTimelinePosition(request.status);
  const isFailed = request.status === 'Failed';

  // Generate timeline items
  const timelineItems = TIMELINE_STAGES.map((stage, index) => {
    let status: 'wait' | 'process' | 'finish' | 'error' = 'wait';
    
    if (isFailed && index >= currentPosition) {
      status = 'error';
    } else if (index < currentPosition) {
      status = 'finish';
    } else if (index === currentPosition) {
      status = isFailed ? 'error' : 'process';
    }

    const isCompleted = index < currentPosition;
    const isCurrent = index === currentPosition;

    return {
      title: (
        <Space>
          {stage.icon}
          <Text strong={isCurrent}>{stage.title}</Text>
          {isCurrent && (
            <Tag color={isFailed ? 'red' : stage.color} style={{ marginLeft: 8 }}>
              {isFailed ? 'Failed' : 'Current'}
            </Tag>
          )}
        </Space>
      ),
      description: showDetails ? (
        <Space direction="vertical" size={4}>
          <Text type="secondary">{stage.description}</Text>
          {isCompleted && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Completed • {new Date(request.createdDate).toLocaleDateString()}
            </Text>
          )}
          {isCurrent && !isFailed && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              In Progress • Started {new Date(request.createdDate).toLocaleDateString()}
            </Text>
          )}
          {isCurrent && isFailed && (
            <Text type="danger" style={{ fontSize: '12px' }}>
              Failed • {new Date(request.createdDate).toLocaleDateString()}
            </Text>
          )}
        </Space>
      ) : stage.description,
      status,
      icon: React.cloneElement(stage.icon, { 
        size: 16, 
        color: isCompleted ? '#52c41a' : isCurrent ? (isFailed ? '#ff4d4f' : stage.color) : '#d9d9d9' 
      })
    };
  });

  return (
    <Card>
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <div>
          <Title level={4}>Configuration Timeline</Title>
          <Text type="secondary">
            Track the progress of your configuration request through each stage
          </Text>
        </div>

        <Steps
          current={currentPosition}
          status={isFailed ? 'error' : 'process'}
          direction={vertical ? 'vertical' : 'horizontal'}
          items={timelineItems}
        />

        {showDetails && (
          <div style={{ 
            background: '#fafafa', 
            padding: '16px', 
            borderRadius: '8px', 
            border: '1px solid #d9d9d9' 
          }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Text strong>Request Details:</Text>
              <Space wrap>
                <Text type="secondary">ID:</Text>
                <Text code>{request.id}</Text>
                <Text type="secondary">•</Text>
                <Text type="secondary">Created:</Text>
                <Text>{new Date(request.createdDate).toLocaleString()}</Text>
                <Text type="secondary">•</Text>
                <Text type="secondary">By:</Text>
                <Text>{request.createdBy}</Text>
              </Space>
              <Space wrap>
                <Text type="secondary">Configuration:</Text>
                <Tag color="blue">{request.salesChannel}</Tag>
                <Tag color="purple">{request.billingCycle}</Tag>
                <Tag color="green">${request.priceAmount.toFixed(2)}</Tag>
                {request.lixKey && (
                  <Tag color="orange">LIX: {request.lixKey}</Tag>
                )}
              </Space>
            </Space>
          </div>
        )}

        {isFailed && (
          <div style={{ 
            background: '#fff2f0', 
            padding: '16px', 
            borderRadius: '8px', 
            border: '1px solid #ffccc7' 
          }}>
            <Space>
              <XCircle size={16} color="#ff4d4f" />
              <Text strong style={{ color: '#ff4d4f' }}>Configuration Failed</Text>
            </Space>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                The configuration request encountered an error during processing. 
                Please review the configuration and try again, or contact support for assistance.
              </Text>
            </div>
          </div>
        )}
      </Space>
    </Card>
  );
};

// Compact version for use in lists or smaller spaces
interface CompactTimelineProps {
  status: ChangeRequestStatusType;
  showLabels?: boolean;
}

export const CompactTimeline: React.FC<CompactTimelineProps> = ({
  status,
  showLabels = true
}) => {
  const currentPosition = React.useMemo(() => {
    switch (status) {
      case 'Pending Review':
        return 1;
      case 'In EI':
        return 2;
      case 'Live':
        return 3;
      case 'Failed':
        return 1;
      default:
        return 0;
    }
  }, [status]);

  const isFailed = status === 'Failed';

  const compactItems = TIMELINE_STAGES.map((stage, index) => {
    const isCompleted = index < currentPosition;
    const isCurrent = index === currentPosition;
    const dotColor = isCompleted ? '#52c41a' : isCurrent ? (isFailed ? '#ff4d4f' : stage.color) : '#d9d9d9';

    return {
      title: showLabels ? stage.title : '',
      icon: (
        <div 
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: dotColor,
            border: isCurrent ? `2px solid ${dotColor}` : 'none',
            boxShadow: isCurrent ? `0 0 0 2px ${dotColor}20` : 'none'
          }}
        />
      )
    };
  });

  return (
    <Steps
      current={currentPosition}
      status={isFailed ? 'error' : 'process'}
      size="small"
      items={compactItems}
    />
  );
}; 