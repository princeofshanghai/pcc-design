import React from 'react';
import { Tag, Typography, Space, Tooltip } from 'antd';
import { Clock, Wrench, CheckCircle, XCircle } from 'lucide-react';
import type { ChangeRequestStatus as ChangeRequestStatusType } from '../../utils/types';
import { toSentenceCase } from '../../utils/formatters/text';

const { Text } = Typography;

interface ChangeRequestStatusProps {
  status: ChangeRequestStatusType;
  showIcon?: boolean;
  showLabel?: boolean;
  tooltip?: boolean;
}

const STATUS_CONFIG = {
  'Pending Review': {
    color: 'orange',
    icon: <Clock size={14} />,
    label: toSentenceCase('Pending Review'),
    description: 'Change request is waiting for review and approval'
  },
  'In EI': {
    color: 'blue',
    icon: <Wrench size={14} />,
    label: toSentenceCase('In EI'),
    description: 'Change request is being tested in the EI environment'
  },
  'Live': {
    color: 'green',
    icon: <CheckCircle size={14} />,
    label: toSentenceCase('Live'),
    description: 'Change request has been successfully deployed to production'
  },
  'Failed': {
    color: 'red',
    icon: <XCircle size={14} />,
    label: toSentenceCase('Failed'),
    description: 'Change request deployment encountered errors and failed'
  }
} as const;

export const ChangeRequestStatus: React.FC<ChangeRequestStatusProps> = ({
  status,
  showIcon = true,
  showLabel = true,
  tooltip = false
}) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return (
      <Tag color="default">
        {showIcon && <XCircle size={14} />}
        {showLabel && <span style={{ marginLeft: showIcon ? 4 : 0 }}>Unknown</span>}
      </Tag>
    );
  }

  const tagContent = (
    <Tag color={config.color}>
      <Space size={4}>
        {showIcon && config.icon}
        {showLabel && <span>{config.label}</span>}
      </Space>
    </Tag>
  );

  if (tooltip) {
    return (
      <Tooltip title={config.description} placement="top">
        {tagContent}
      </Tooltip>
    );
  }

  return tagContent;
};

// Additional component for more detailed status display
interface DetailedChangeRequestStatusProps {
  status: ChangeRequestStatusType;
  timestamp?: string;
  showProgress?: boolean;
}

export const DetailedChangeRequestStatus: React.FC<DetailedChangeRequestStatusProps> = ({
  status,
  timestamp,
  showProgress = false
}) => {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return (
      <Space direction="vertical" size={4}>
        <ChangeRequestStatus status={status} tooltip />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          Unknown status
        </Text>
      </Space>
    );
  }

  // Progress indicators
  const getProgressSteps = () => {
    const steps = ['Pending Review', 'In EI', 'Live'] as const;
    const currentIndex = steps.indexOf(status as any);
    const failedStatus = status === 'Failed';

    return steps.map((step, index) => {
      let stepStatus: 'completed' | 'current' | 'pending' | 'failed' = 'pending';
      
      if (failedStatus && index <= currentIndex) {
        stepStatus = 'failed';
      } else if (index < currentIndex) {
        stepStatus = 'completed';
      } else if (index === currentIndex) {
        stepStatus = 'current';
      }

      const stepConfig = STATUS_CONFIG[step];
      const stepColor = stepStatus === 'completed' ? 'green' : 
                      stepStatus === 'current' ? stepConfig.color :
                      stepStatus === 'failed' ? 'red' : 'default';

             return (
         <Tag 
           key={step} 
           color={stepColor} 
           style={{ 
             opacity: stepStatus === 'pending' ? 0.5 : 1,
             marginRight: 4
           }}
         >
           <Space size={2}>
             {React.cloneElement(stepConfig.icon, { size: 12 })}
             <span style={{ fontSize: '11px' }}>{step}</span>
           </Space>
         </Tag>
       );
    });
  };

  return (
    <Space direction="vertical" size={8} style={{ width: '100%' }}>
      <Space>
        <ChangeRequestStatus status={status} tooltip />
        {timestamp && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {new Date(timestamp).toLocaleString()}
          </Text>
        )}
      </Space>
      
      <Text type="secondary" style={{ fontSize: '12px' }}>
        {config.description}
      </Text>

      {showProgress && (
        <div style={{ marginTop: 8 }}>
          <Text strong style={{ fontSize: '12px', marginBottom: 4, display: 'block' }}>
            Progress:
          </Text>
          <Space size={4} wrap>
            {getProgressSteps()}
          </Space>
        </div>
      )}
    </Space>
  );
}; 