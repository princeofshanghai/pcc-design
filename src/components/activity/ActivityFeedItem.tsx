import React from 'react';

interface ActivityFeedItemProps {
  request: any;
  onViewDetails?: (requestId: string) => void;
}

// Placeholder component for activity feed items
const ActivityFeedItem: React.FC<ActivityFeedItemProps> = () => {
  return (
    <div style={{ padding: 16, border: '1px solid #f0f0f0', borderRadius: 4 }}>
      <p>Activity item placeholder</p>
    </div>
  );
};

export default ActivityFeedItem;