// Layout.tsx – Reusable layout component with header and sidebar navigation
import React, { useState } from 'react';
import { Layout, Menu, Avatar, Space, Badge } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons';
import LinkedInLogo from '../assets/linkedin-logo.svg';
import blueTheme from '../theme';

const { Header, Sider, Content } = Layout;

interface AppLayoutProps {
  children: React.ReactNode;
  selectedKey?: string;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, selectedKey = 'dashboard' }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh', background: blueTheme.token.colorBgLayout }}>
      <Sider
        theme="light"
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={250}
        style={{ 
          background: blueTheme.token.colorBgContainer, 
          borderRight: `1px solid ${blueTheme.token.colorBorder}`, 
          borderTop: `1px solid ${blueTheme.token.colorBorder}`,
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 1000,
          overflow: 'auto'
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '0' : '0 16px',
          background: 'transparent',
          marginBottom: 8
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: collapsed ? 0 : 10,
            width: '100%',
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'gap 0.2s'
          }}>
            <img src={LinkedInLogo} alt="LinkedIn Logo" style={{ width: 24, height: 24, display: 'block' }} />
            {!collapsed && (
              <span className="sider-brand-text">PCC</span>
            )}
          </div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={[selectedKey]}
          style={{
            fontSize: blueTheme.token.fontSizeSM,
            height: 'calc(100vh - 64px)',
            borderRight: 0,
            background: blueTheme.token.colorBgContainer
          }}
        >
          <Menu.Item key="catalog" icon={<AppstoreOutlined />}>
            Product Catalog
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{
          background: blueTheme.token.colorBgContainer,
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${blueTheme.token.colorBorder}`,
          height: 64,
          position: 'sticky',
          top: 0,
          zIndex: 999,
          width: '100%'
        }}>
          <div /> {/* Empty div for spacing/alignment */}
          <Space size="large">
            <SearchOutlined style={{ fontSize: '18px', color: blueTheme.token.colorTextSecondary }} />
            <Badge count={3}>
              <BellOutlined style={{ fontSize: '18px', color: blueTheme.token.colorTextSecondary }} />
            </Badge>
            <Avatar icon={<UserOutlined />} size={blueTheme.token.avatarSize} />
          </Space>
        </Header>
        <Content className="responsive-content">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 