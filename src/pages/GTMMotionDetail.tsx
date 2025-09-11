import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Space, Tabs, theme, Steps, Button, Tag } from 'antd';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { mockGTMMotions } from '../utils/mock-data';
import type { GTMMotionStatus } from '../utils/types';
import { formatFullDate } from '../utils/formatters';
import {
  PageHeader,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  CopyableId,
  GTMStatusTag,
  GTMItemsTable,
} from '../components';

const { Title } = Typography;

// Status progression for timeline
const STATUS_PROGRESSION: GTMMotionStatus[] = [
  'Draft',
  'Submitted',
  'Activating in EI',
  'Ready for Approvals',
  'Review in Progress',
  'Approvals Completed', 
  'Scheduled for Activation',
  'Activating in Prod',
  'Completed'
];

// Get current step index based on status
const getCurrentStep = (status: GTMMotionStatus): number => {
  return STATUS_PROGRESSION.indexOf(status);
};

// Status descriptions for the vertical timeline
const getStatusDescription = (status: GTMMotionStatus): string => {
  const descriptions: Record<GTMMotionStatus, string> = {
    'Draft': 'Add, edit, or remove items. Collaborate with your team before submitting.',
    'Submitted': 'Motion is in the system. Items are locked, but details can still be updated.',
    'Activating in EI': 'Changes are being deployed to testing environment. No action needed.',
    'Ready for Approvals': 'Motion is ready. You can start the approval process when ready.',
    'Review in Progress': 'Approval requests sent to stakeholders. Motion is locked during review.',
    'Approvals Completed': 'All approvals complete! Set your activation date (minimum 72 hours).',
    'Scheduled for Activation': 'Motion is approved and scheduled. Will activate automatically at the scheduled time.',
    'Activating in Prod': 'Changes are going live now. This process cannot be stopped.',
    'Completed': 'Success! All changes are now live.',
    'Cancelled': 'Motion was cancelled. No changes were made. Can be used as a template.',
  };
  return descriptions[status];
};



const GTMMotionDetail: React.FC = () => {
  const { token } = theme.useToken();
  const { motionId } = useParams<{ motionId: string }>();
  const { setFolderName } = useBreadcrumb();
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Clear folder name for GTM motion detail
  React.useEffect(() => {
    setFolderName(null);
    return () => setFolderName(null);
  }, [setFolderName]);

  const motion = mockGTMMotions.find(m => m.id === motionId);

  if (!motion) {
    return <Title level={2}>GTM Motion not found</Title>;
  }

  const currentStep = getCurrentStep(motion.status);
  const totalItems = motion.items.length;

  // Status-based action buttons  
  const renderActions = () => {
    const actions = [];
    
    switch (motion.status) {
      case 'Draft':
        actions.push(
          <Button key="edit" type="default">Edit Motion</Button>,
          <Button key="submit" type="primary">Submit GTM Motion</Button>
        );
        break;
      case 'Submitted':
        actions.push(
          <Button key="edit" type="default">Edit Details</Button>
        );
        break;
      case 'Activating in EI':
        // No actions during EI deployment
        break;
      case 'Ready for Approvals':
        actions.push(
          <Button key="start-review" type="primary">Start Review</Button>
        );
        break;
      case 'Review in Progress':
        actions.push(
          <Button key="cancel" danger>Cancel Motion</Button>
        );
        break;
      case 'Approvals Completed':
        actions.push(
          <Button key="set-date" type="primary">Set Activation Date</Button>
        );
        break;
      case 'Scheduled for Activation':
        actions.push(
          <Button key="cancel" danger>Cancel Motion</Button>
        );
        break;
      case 'Activating in Prod':
        // Point of no return - no actions available
        break;
      case 'Completed':
        // Historical - no actions needed
        break;
      case 'Cancelled':
        actions.push(
          <Button key="clone" type="default">Clone Motion</Button>
        );
        break;
    }
    
    return actions;
  };

  const tabItems = [
    {
      key: 'overview',
      label: 'Overview',
      children: (
        <PageSection title="Summary" hideDivider={true}>
          <AttributeGroup>
            <AttributeDisplay layout="horizontal" label="Motion ID">
              <CopyableId id={motion.id} />
            </AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Description">
              {motion.description}
            </AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Activation Date">
              {formatFullDate(motion.activationDate)}
            </AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Created By">
              {motion.createdBy}
            </AttributeDisplay>
            <AttributeDisplay layout="horizontal" label="Created Date">
              {formatFullDate(motion.createdDate)}
            </AttributeDisplay>
            {motion.updatedDate && (
              <AttributeDisplay layout="horizontal" label="Last Updated">
                {formatFullDate(motion.updatedDate)}
              </AttributeDisplay>
            )}
          </AttributeGroup>
        </PageSection>
      ),
    },
    {
      key: 'items-approvals',
      label: `Items & Approvals (${totalItems})`,
      children: (
        <PageSection title="Items & Approvals" hideDivider={true}>
          <GTMItemsTable items={motion.items} />
        </PageSection>
      ),
    },
    {
      key: 'activation-progress',
      label: 'Activation Progress',
      children: (
        <PageSection title="" hideDivider={true}>
          <div style={{ maxWidth: 600 }}>
            <div
              className="vertical-timeline"
              style={{
                '--timeline-spacing': '32px'
              } as React.CSSProperties}
            >
              <style>
                {`
                  .vertical-timeline .ant-steps-vertical .ant-steps-item {
                    padding-bottom: var(--timeline-spacing) !important;
                  }
                  .vertical-timeline .ant-steps-vertical .ant-steps-item:last-child {
                    padding-bottom: 0 !important;
                  }
                `}
              </style>
              <Steps
                direction="vertical"
                current={currentStep}
                status={motion.status === 'Cancelled' ? 'error' : 'process'}
                items={STATUS_PROGRESSION.map((status, index) => {
                  const isCurrent = index === currentStep;
                  const isCompleted = index < currentStep;
                  const isCancelled = motion.status === 'Cancelled';
                  
                  return {
                    title: (
                      <div style={{ 
                        fontSize: 14, // 14px as requested
                        fontWeight: 500,
                        marginBottom: 4,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                      }}>
                        {status}
                        {isCurrent && !isCancelled && (
                          <Tag 
                            color="blue"
                            style={{ 
                              fontSize: token.fontSizeSM,
                              lineHeight: 1.2,
                              padding: '1px 6px'
                            }}
                          >
                            Current
                          </Tag>
                        )}
                      </div>
                    ),
                    description: (
                      <div style={{ 
                        color: token.colorTextSecondary, 
                        fontSize: token.fontSize, // 13px from theme
                        fontWeight: 400, // Regular weight
                        lineHeight: 1.4
                      }}>
                        {getStatusDescription(status)}
                      </div>
                    ),
                    status: isCancelled ? 'error' : 
                            isCompleted ? 'finish' :
                            isCurrent ? 'process' : 'wait'
                  };
                })}
              />
            </div>
          </div>
        </PageSection>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="GTM Motion"
        title={motion.name}
        tagContent={<GTMStatusTag status={motion.status} />}
        rightAlignedId={motion.id}
        actions={renderActions()}
        compact
      />


      <Tabs
        activeKey={activeTab}
        items={tabItems}
        onChange={(key) => {
          setActiveTab(key);
        }}
      />
    </Space>
  );
};

export default GTMMotionDetail;
