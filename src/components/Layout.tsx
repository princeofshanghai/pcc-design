import { Layout, Menu, Avatar, Breadcrumb, Button, theme, Space } from 'antd';
import { User, PanelLeft, Box, ChevronRight, Tag, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import LinkedInLogo from '../assets/linkedin-logo.svg';
import { zIndex } from '../theme';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { useLayout } from '../context/LayoutContext';

const { Sider, Header, Content } = Layout;

const menuItems = [
  { 
    key: 'home', 
    label: 'Product Catalog', 
    path: '/',
    icon: <Box size={16} />
  },
  // Add more menu items here as you add pages
];

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { productName, skuId, priceGroupId } = useBreadcrumb();
  const { maxWidth } = useLayout();
  const { token } = theme.useToken();

  // Find the current menu item based on the path
  const currentMenuItem = menuItems.find(item => item.path === location.pathname);

  const breadcrumbItems = [];
  if (currentMenuItem) {
    breadcrumbItems.push(
      <Breadcrumb.Item key={currentMenuItem.key}>
        <Link to={currentMenuItem.path}>{currentMenuItem.label}</Link>
      </Breadcrumb.Item>
    );
  }

  if (location.pathname.startsWith('/product/') && productName) {
    // Add Home link first for product pages
    if (!currentMenuItem) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="home">
          <Link to="/">Product Catalog</Link>
        </Breadcrumb.Item>
      );
    }

    const isSkuPage = location.pathname.includes('/sku/');
    const isPriceGroupPage = location.pathname.includes('/price-group/');
    
    // Determine product path for linking back
    let productPath = location.pathname;
    if (isSkuPage) {
      productPath = location.pathname.substring(0, location.pathname.indexOf('/sku/'));
    } else if (isPriceGroupPage) {
      productPath = location.pathname.substring(0, location.pathname.indexOf('/price-group/'));
    }

    breadcrumbItems.push(
      <Breadcrumb.Item key="product">
        <Space size={4} style={{ color: 'var(--ant-color-text-secondary)' }}>
          <Box size={14} />
          {(isSkuPage || isPriceGroupPage) ? (
            <Link to={productPath} style={{ color: 'var(--ant-color-text)' }}>
              {productName}
            </Link>
          ) : (
            <span style={{ color: 'var(--ant-color-text)'}}>{productName}</span>
          )}
        </Space>
      </Breadcrumb.Item>
    );

    if (isSkuPage && skuId) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="sku">
          <Space size={4}>
            <Tag size={14} />
            <span>SKU: {skuId}</span>
          </Space>
        </Breadcrumb.Item>
      );
    }

    if (isPriceGroupPage && priceGroupId) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="priceGroup">
          <Space size={4}>
            <DollarSign size={14} />
            <span>Price Group: {priceGroupId}</span>
          </Space>
        </Breadcrumb.Item>
      );
    }
  }

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
            icon={<PanelLeft size={20} />}
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
          items={menuItems.map(item => ({ 
            key: item.key, 
            icon: item.icon,
            label: <Link to={item.path}>{item.label}</Link> 
          }))}
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
      <Layout style={{ marginLeft: collapsed ? 80 : 220, backgroundColor: token.colorBgLayout }}>
        <Header 
          style={{ 
            background: isScrolled ? 'rgba(255, 255, 255, 0.8)' : token.colorBgContainer,
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
          <Breadcrumb separator={<ChevronRight size={16} style={{ color: 'rgba(0, 0, 0, 0.45)' }} />}>{breadcrumbItems}</Breadcrumb>
          <Avatar icon={<User size={20} />} />
        </Header>
        <Content style={{ 
          margin: '120px 24px 24px 24px', // Top margin to account for fixed header
          padding: 0, 
          minHeight: 280, 
          background: 'transparent',
        }}>
          <div style={{ maxWidth, margin: '0 auto', transition: 'max-width 0.3s ease' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 