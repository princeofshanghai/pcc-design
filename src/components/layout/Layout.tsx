import { Layout, Menu, Avatar, Breadcrumb, Button, theme, Space, Tooltip } from 'antd';
import { User, PanelLeft, Box, ChevronRight, Tag, DollarSign } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import LinkedInLogo from '../../assets/linkedin-logo.svg';
import { zIndex } from '../../theme';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useLayout } from '../../context/LayoutContext';
import { folderStructure } from '../../utils/mock-data';
import { toSentenceCase } from '../../utils/formatters/text';
import { useTruncationDetection } from '../../hooks/useTruncationDetection';

const { Sider, Header, Content } = Layout;



// Component for sidebar menu items with smart tooltips
const SidebarMenuItem: React.FC<{
  children: React.ReactNode;
  text: string;
  collapsed: boolean;
}> = ({ children, text, collapsed }) => {
  const { isTruncated, textRef } = useTruncationDetection(text);

  if (collapsed) {
    // When collapsed, let Ant Design handle tooltips automatically
    return <>{children}</>;
  }

  // When expanded, use our truncation detection
  const content = (
    <span 
      ref={textRef as React.RefObject<HTMLSpanElement>}
      style={{ 
        display: 'block', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        maxWidth: '100%'
      }}
    >
      {children}
    </span>
  );

  if (isTruncated) {
    return (
      <Tooltip title={text} placement="right">
        {content}
      </Tooltip>
    );
  }

  return content;
};

// Helper function to generate menu structure from predefined folder structure
const generateMenuStructure = (collapsed: boolean) => {
  // Create the menu structure
  const menuItems = [
    {
      key: 'products',
      label: 'Products',
      icon: <Box size={16} />,
      children: [
        {
          key: 'all-products',
          label: (
            <SidebarMenuItem text={toSentenceCase('All Products')} collapsed={collapsed}>
              <Link to="/">{toSentenceCase('All Products')}</Link>
            </SidebarMenuItem>
          )
        },
        ...Object.entries(folderStructure).map(([lob, folders]) => ({
          key: lob.toLowerCase(),
          label: (
            <SidebarMenuItem text={lob} collapsed={collapsed}>
              <span>{lob}</span>
            </SidebarMenuItem>
          ),
          children: folders.map((folder) => ({
            key: `${lob.toLowerCase()}-${folder.toLowerCase().replace(/\s+/g, '-')}`,
            label: (
              <SidebarMenuItem text={folder} collapsed={collapsed}>
                <Link to={`/folder/${folder.toLowerCase().replace(/\s+/g, '-')}`}>{folder}</Link>
              </SidebarMenuItem>
            )
          }))
        }))
      ]
    }
  ];

  return menuItems;
};

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { productName, skuId, priceGroupId } = useBreadcrumb();
  const { maxWidth } = useLayout();
  const { token } = theme.useToken();

  // Generate menu structure from mock data
  const menuItems = useMemo(() => generateMenuStructure(collapsed), [collapsed]);

  // Find the current menu item based on the path
  const currentMenuItem = location.pathname === '/' ? { key: 'all-products', label: 'Products', path: '/' } : null;

  const breadcrumbItems = [];
  if (currentMenuItem) {
    breadcrumbItems.push(
      <Breadcrumb.Item key={currentMenuItem.key}>
        <Link to={currentMenuItem.path}>{currentMenuItem.label}</Link>
      </Breadcrumb.Item>
    );
  }

  // Handle folder pages - add breadcrumb for folder pages
  if (location.pathname.startsWith('/folder/')) {
    breadcrumbItems.push(
      <Breadcrumb.Item key="catalog">
        <Link to="/">Products</Link>
      </Breadcrumb.Item>
    );
  }

  if (location.pathname.startsWith('/product/') && productName) {
    // Add Home link first for product pages
    if (!currentMenuItem) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="home">
          <Link to="/">Products</Link>
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
          defaultSelectedKeys={['all-products']}
          defaultOpenKeys={['products']}
          items={menuItems}
          inlineIndent={16}
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