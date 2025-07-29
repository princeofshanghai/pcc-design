import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';

interface DetailPageLayoutProps {
  header: React.ReactNode;
  tabItems: TabsProps['items'];
  defaultActiveKey?: string;
  onTabChange?: (key: string) => void;
  className?: string;
}

const DetailPageLayout: React.FC<DetailPageLayoutProps> = ({
  header,
  tabItems,
  defaultActiveKey,
  onTabChange,
  className
}) => {
  const [activeKey, setActiveKey] = useState(defaultActiveKey || tabItems?.[0]?.key || '');

  const handleTabChange = (key: string) => {
    setActiveKey(key);
    onTabChange?.(key);
  };

  // Find the active tab content
  const activeTabContent = tabItems?.find(item => item.key === activeKey)?.children;

  return (
    <div className={`detail-page-layout ${className || ''}`} style={{ width: '100%' }}>
      {/* Header + Tabs Section - Full Width Background */}
      <div 
        className="detail-page-header-section"
        style={{
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          marginTop: '-56px',
          paddingTop: '56px',
          paddingBottom: '0'
        }}
      >
        {/* Content Container - Remove extra padding to match Layout's container system */}
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
          // Removed padding: '0 24px' - Layout's Content already provides 24px margin
        }}>
          {/* Header */}
          <div style={{ marginBottom: '48px' }}>
            {header}
          </div>
          
          {/* Tabs */}
          <div className="detail-page-tabs">
            <Tabs
              activeKey={activeKey}
              onChange={handleTabChange}
              items={tabItems?.map(item => ({
                ...item,
                children: null
              }))}
              style={{ marginBottom: '0' }}
            />
          </div>
        </div>
      </div>
      
      {/* Tab Content Section */}
      <div style={{ marginTop: '48px' }}>
        {activeTabContent}
      </div>
    </div>
  );
};

export default DetailPageLayout; 