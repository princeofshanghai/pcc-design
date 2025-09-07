import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Typography, Space, Tabs, Tag, theme, Steps, Table, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Check, X, Clock } from 'lucide-react';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { mockGTMMotions } from '../utils/mock-data';
import type { GTMMotionStatus, GTMItem, ApprovalRequirement } from '../utils/types';
import { formatFullDate } from '../utils/formatters';
import {
  PageHeader,
  PageSection,
  AttributeDisplay,
  AttributeGroup,
  CopyableId,
  InfoPopover,
} from '../components';

const { Title, Text } = Typography;

// Status progression for timeline
const STATUS_PROGRESSION: GTMMotionStatus[] = [
  'Draft',
  'Submitted', 
  'Pending approvals',
  'Approved',
  'Pending to prod',
  'Complete'
];

// Get current step index based on status
const getCurrentStep = (status: GTMMotionStatus): number => {
  return STATUS_PROGRESSION.indexOf(status);
};

// Status descriptions for timeline tooltips
const getStatusDescription = (status: GTMMotionStatus): string => {
  switch (status) {
    case 'Draft': 
      return 'Product managers and business stakeholders can collaborate and add/remove items. All fields are editable.';
    case 'Submitted': 
      return 'Motion has been submitted for processing. Only name, description, and activation date can be edited. Items are locked.';
    case 'Pending approvals': 
      return 'Waiting for required approvals from stakeholders. No changes can be made except to cancel the motion.';
    case 'Approved': 
      return 'All approvals completed. Motion is ready for production deployment on the scheduled activation date.';
    case 'Pending to prod': 
      return 'Deployment to production is in progress. This process takes up to 24 hours. Motion cannot be cancelled.';
    case 'Complete': 
      return 'All changes have been successfully deployed to production. Motion is now historical.';
    default: 
      return 'Unknown status';
  }
};

// Get approval status icon
const getApprovalIcon = (status: string) => {
  switch (status) {
    case 'Approved':
      return <Check size={14} style={{ color: '#22c55e' }} />;
    case 'Rejected': 
      return <X size={14} style={{ color: '#ef4444' }} />;
    case 'Pending':
    default:
      return <Clock size={14} style={{ color: '#f59e0b' }} />;
  }
};

// Enhanced GTM Items Table with Approvals
interface EnhancedGTMItemsTableProps {
  items: GTMItem[];
}

const EnhancedGTMItemsTable: React.FC<EnhancedGTMItemsTableProps> = ({ items }) => {
  const { token } = theme.useToken();

  // Calculate overall approval progress
  const allApprovers = useMemo(() => {
    const approverMap = new Map<string, ApprovalRequirement>();
    
    items.forEach(item => {
      item.approvalRequirements.forEach(req => {
        const existing = approverMap.get(req.team);
        if (!existing || 
            (req.status === 'Approved' && existing.status !== 'Approved') ||
            (req.status === 'Pending' && existing.status === 'Rejected')) {
          approverMap.set(req.team, req);
        }
      });
    });

    return Array.from(approverMap.values()).sort((a, b) => a.team.localeCompare(b.team));
  }, [items]);

  const approvedCount = allApprovers.filter(req => req.status === 'Approved').length;
  const totalCount = allApprovers.length;

  const columns: ColumnsType<GTMItem> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: string) => (
        <Tag color="blue" style={{ fontSize: '10px', lineHeight: '18px' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Product', 
      dataIndex: 'productName',
      key: 'productName',
      width: 160,
      render: (productName: string, record: GTMItem) => (
        <div>
          <Link to={`/product/${record.productId}`} onClick={(e) => e.stopPropagation()}>
            <Text style={{ fontWeight: 500, fontSize: '13px' }}>{productName}</Text>
          </Link>
          <br />
          <Text style={{ color: token.colorTextSecondary, fontSize: '12px' }}>
            {record.details}
          </Text>
        </div>
      ),
    },
    {
      title: 'Approval Progress',
      dataIndex: 'approvalRequirements',
      key: 'approvalRequirements',
      render: (requirements: ApprovalRequirement[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center' }}>
          {requirements.map((req, index) => (
            <InfoPopover
              key={index}
              content={
                req.status === 'Approved' && req.approvedBy 
                  ? `Approved by ${req.approvedBy} on ${formatFullDate(req.approvedDate || '').split(' at ')[0]}`
                  : `${req.team} approval ${req.status.toLowerCase()}`
              }
              placement="top"
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                cursor: 'help'
              }}>
                {getApprovalIcon(req.status)}
                <Text style={{ fontSize: '12px' }}>{req.team}</Text>
                {req.status === 'Approved' && req.approvedDate && (
                  <Text style={{ 
                    fontSize: '11px', 
                    color: token.colorTextTertiary,
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    ({formatFullDate(req.approvedDate).split(' at ')[0].split(', ')[1]})
                  </Text>
                )}
              </div>
            </InfoPopover>
          ))}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (_: string, record: GTMItem) => {
        const allApproved = record.approvalRequirements.every(req => req.status === 'Approved');
        const displayStatus = allApproved ? 'Ready' : 'Pending';
        const displayColor = allApproved ? 'success' : 'warning';

        return (
          <Tag color={displayColor} style={{ fontSize: '11px' }}>
            {displayStatus}
          </Tag>
        );
      },
    },
  ];

  return (
    <div>
      {/* Motion Approval Progress Header */}
      <div style={{ 
        marginBottom: '20px',
        padding: '16px',
        backgroundColor: token.colorBgLayout,
        borderRadius: token.borderRadius,
        border: `1px solid ${token.colorBorder}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 500, fontSize: '14px' }}>Motion Approval Progress</Text>
          <Text style={{ fontWeight: 500, fontSize: '14px' }}>
            {approvedCount}/{totalCount} teams approved
          </Text>
        </div>
        <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allApprovers.map((req, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {getApprovalIcon(req.status)}
              <Text style={{ fontSize: '12px' }}>{req.team}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Items Table */}
      <Table
        size="small"
        columns={columns}
        dataSource={items}
        rowKey="id"
        pagination={false}
        showHeader={true}
      />
    </div>
  );
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
          <Button key="edit" type="primary">Edit Motion</Button>,
          <Button key="submit">Submit for Approval</Button>
        );
        break;
      case 'Submitted':
        actions.push(
          <Button key="edit" type="default">Edit Details</Button>
        );
        break;
      case 'Pending approvals':
        actions.push(
          <Button key="cancel" danger>Cancel Motion</Button>
        );
        break;
      case 'Approved':
        actions.push(
          <Button key="schedule" type="primary">Schedule Activation</Button>
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
          <EnhancedGTMItemsTable items={motion.items} />
        </PageSection>
      ),
    },
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="GTM Motion"
        title={motion.name}
        tagContent={
          <InfoPopover 
            content={getStatusDescription(motion.status)}
            placement="bottom"
            maxWidth={320}
          >
            <Tag 
              color={motion.status === 'Complete' ? 'success' : 
                     motion.status === 'Approved' ? 'success' :
                     motion.status === 'Pending approvals' ? 'warning' :
                     motion.status === 'Submitted' ? 'processing' :
                     'default'}
              style={{ cursor: 'help', fontSize: '12px' }}
            >
              {motion.status}
            </Tag>
          </InfoPopover>
        }
        rightAlignedId={motion.id}
        actions={renderActions()}
        compact
      />

      {/* Status Timeline */}
      <div style={{ 
        padding: '20px 24px', 
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadius,
        border: `1px solid ${token.colorBorder}`,
        marginBottom: '8px'
      }}>
        <Steps
          current={currentStep}
          size="small"
          items={STATUS_PROGRESSION.map((status, index) => ({
            title: status,
            description: index === currentStep ? 'Current' : undefined,
          }))}
        />
      </div>

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
