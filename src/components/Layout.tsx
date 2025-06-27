import { Layout, Menu, Avatar, Breadcrumb, Button } from 'antd';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, type Location } from 'react-router-dom';
import LinkedInLogo from '../assets/linkedin-logo.svg';
import { zIndex } from '../theme';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { key: 'home', label: <Link to="/">Home</Link> },
  // Add more menu items here as you add pages
];

function getBreadcrumbItems(location: Location) {
  // Split the path and create breadcrumb items
  const pathSnippets: string[] = location.pathname.split('/').filter((i: string) => i);
  const breadcrumbItems = [
    <Breadcrumb.Item key="home">
      <Link to="/">Home</Link>
    </Breadcrumb.Item>
  ];
  pathSnippets.forEach((_segment: string, _idx: number) => {
    // For future nested routes
    // You can customize label per route if needed
  });
  return breadcrumbItems;
}

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsed={collapsed} 
        width={220} 
        style={{ 
          background: '#fff', 
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          height: '100vh',
          zIndex: 1000
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'space-between',
          height: 64, 
          padding: '0 16px',
          borderBottom: '1px solid #f0f0f0'
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img 
                src={LinkedInLogo} 
                alt="LinkedIn Logo" 
                style={{ width: 24, height: 24 }} 
              />
              <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: 0.1 }}>
                PCC
              </span>
            </div>
          )}
          <Button
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            type="text"
            style={{
              fontSize: '16px',
              color: '#666'
            }}
          />
        </div>
        <Menu 
          mode="inline" 
          defaultSelectedKeys={['home']} 
          items={menuItems} 
          style={{ 
            border: 'none',
            padding: '8px',
            // Center menu items when collapsed
            ...(collapsed && {
              '--ant-menu-item-padding-horizontal': '0px',
              '--ant-menu-item-height': '40px',
              '--ant-menu-item-border-radius': '0px'
            })
          }}
          className={collapsed ? 'collapsed-menu' : ''}
        />
        <style>
          {`
            .collapsed-menu .ant-menu-item {
              text-align: center !important;
              padding: 0 !important;
            }
            .collapsed-menu .ant-menu-item .ant-menu-title-content {
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
          `}
        </style>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 220 }}>
        <Header 
          style={{ 
            background: isScrolled ? 'rgba(255, 255, 255, 0.8)' : '#fff',
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
            padding: '0 24px 0 24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: isScrolled ? '1px solid rgba(240, 240, 240, 0.8)' : '1px solid #f0f0f0', 
            height: 64,
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? 80 : 220,
            zIndex: zIndex.header,
            transition: 'all 0.3s ease'
          }}
        >
          <Breadcrumb>{getBreadcrumbItems(location)}</Breadcrumb>
          <Avatar icon={<UserOutlined />} />
        </Header>
        <Content style={{ 
          margin: '120px 24px 24px 24px', // Top margin to account for fixed header
          padding: 0, 
          minHeight: 280, 
          background: 'transparent',
        }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 