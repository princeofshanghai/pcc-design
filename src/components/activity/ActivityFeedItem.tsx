import React from 'react';
import { Card, Typography, Space, Button, Row, Col } from 'antd';
import { ExternalLink } from 'lucide-react';
import type { ConfigurationRequest } from '../../utils/types';
import { ChangeRequestStatus } from '../configuration/ChangeRequestStatus';

const { Text } = Typography;

interface ActivityFeedItemProps {
  request: ConfigurationRequest;
  onViewDetails: (requestId: string) => void;
}

// Helper function to generate business-focused activity descriptions
const getActivityDescription = (request: ConfigurationRequest): string => {
  // For now, all requests are pricing changes - future extensible for other types
  return `Add ${request.salesChannel} + ${request.billingCycle} pricing ($${request.priceAmount})`;
};

const getActivityIcon = (request: ConfigurationRequest): string => {
  // For now, all requests are pricing changes - future extensible for other types
  return '💰';
};

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({
  request,
  onViewDetails
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const icon = getActivityIcon(request);
  const description = getActivityDescription(request);

  return (
    <Card 
      size="small" 
      style={{ 
        backgroundColor: '#ffffff', // Clean white background
        border: '1px solid #d9d9d9', // Standard Ant border
        marginBottom: 8
      }}
    >
      <Row align="middle" justify="space-between">
        <Col flex="auto">
          <Space direction="vertical" size={4}>
            {/* Main activity line */}
            <Space>
              <span style={{ fontSize: '16px' }}>{icon}</span>
              <Text strong style={{ fontSize: '14px' }}>
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
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {request.createdBy}
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                •
              </Text>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {formatTimeAgo(request.createdDate)}
              </Text>
              {request.generatedSkuId && (
                <>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    •
                  </Text>
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    Created {request.generatedPriceGroupId?.slice(0, 7)}..., {request.generatedSkuId?.slice(0, 7)}...
                  </Text>
                </>
              )}
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