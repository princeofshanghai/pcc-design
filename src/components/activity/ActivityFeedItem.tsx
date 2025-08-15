import React from 'react';
import { Card, Typography, Space, Button, Row, Col } from 'antd';
import { ExternalLink, DollarSign } from 'lucide-react';
import type { ConfigurationRequest } from '../../utils/types';
import { ChangeRequestStatus } from '../configuration/ChangeRequestStatus';
import { getUserLdap } from '../../utils/users';
import { colors } from '../../theme';

const { Text } = Typography;

interface ActivityFeedItemProps {
  request: ConfigurationRequest;
  onViewDetails: (requestId: string) => void;
}

// Helper function to generate business-focused activity descriptions
const getActivityDescription = (request: ConfigurationRequest): string => {
  // For now, all requests are pricing changes - future extensible for other types
  const { salesChannel, billingCycle, priceAmount } = request;
  return `Add ${salesChannel} + ${billingCycle} pricing ($${priceAmount})`;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getActivityIcon = (): React.ReactElement => {
  // Future: determine activity type based on request properties
  // For now, all requests are pricing changes
  // TODO: derive from request.type or request.category when those fields exist
  
  // Currently all requests are pricing, but future-ready for other types
  return <DollarSign size={16} />;
  
  // Future implementation when request.type exists:
  // switch (request.type) {
  //   case 'pricing':
  //     return <DollarSign size={16} />;
  //   case 'metadata':
  //     return <FileText size={16} />;
  //   case 'features':
  //     return <Grid2x2Check size={16} />;
  //   default:
  //     return <DollarSign size={16} />;
  // }
};

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = (props) => {
  const { request, onViewDetails } = props;
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    } else if (diffInHours < 48) {
      return '1 day ago';
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const icon = getActivityIcon();
  const description = getActivityDescription(request);

  return (
    <Card 
      size="small" 
      style={{ 
        backgroundColor: '#ffffff', // Clean white background
        border: `1px solid ${colors.gray[400]}`, // Standard border
        marginBottom: 8
      }}
    >
      <Row align="middle" justify="space-between">
        <Col flex="auto">
          <Space direction="vertical" size={4}>
            {/* Main activity line */}
            <Space>
              {icon}
              <Text style={{ fontSize: '14px', fontWeight: 500 }}>
                {description}
              </Text>
              <ChangeRequestStatus status={request.status} />
              {request.lixKey && (
                <span style={{ 
                  backgroundColor: '#fff7e6', 
                  color: '#d46b08', 
                  padding: '2px 6px', 
                  borderRadius: '4px', 
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  LIX
                </span>
              )}
            </Space>
            
            {/* Details line */}
            <Space wrap>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                {getUserLdap(request.createdBy)}
              </Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                •
              </Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                {formatTimeAgo(request.createdDate)}
              </Text>

            </Space>
          </Space>
        </Col>
        <Col>
          <Button 
            size="small"
            icon={<ExternalLink size={12} />}
            onClick={() => onViewDetails(request.id)}
          >
            View change request
          </Button>
        </Col>
      </Row>
    </Card>
  );
}; 