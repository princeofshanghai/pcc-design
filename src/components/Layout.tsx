import { Layout, Menu, Avatar, Breadcrumb } from 'antd';
import { UserOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { Link, useLocation, Outlet, type Location } from 'react-router-dom';
import LinkedInLogo from '../assets/linkedin-logo.svg';

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
  const location = useLocation();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed} width={220} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', height: 64, padding: 16 }}>
          <img src={LinkedInLogo} alt="LinkedIn Logo" style={{ width: 32, height: 32, marginRight: collapsed ? 0 : 12 }} />
          {!collapsed && <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: 1 }}>PCC</span>}
        </div>
        <Menu mode="inline" defaultSelectedKeys={['home']} items={menuItems} style={{ border: 'none' }} />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', height: 64 }}>
          <Breadcrumb style={{ flex: 1 }}>{getBreadcrumbItems(location)}</Breadcrumb>
          <Avatar icon={<UserOutlined />} />
        </Header>
        <Content style={{ padding: 32, minHeight: 0 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 