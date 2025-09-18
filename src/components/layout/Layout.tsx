import { Layout, Menu, Avatar, Breadcrumb, Button, theme, Space, Grid } from 'antd';
import { User, PanelLeft, Box, Folder, TicketPercent, Calculator, Workflow, Smartphone, ArrowBigRightDash, TableProperties, Rocket } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import LinkedInLogo from '../../assets/linkedin-logo.svg';
import { zIndex } from '../../theme';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useLayout } from '../../context/LayoutContext';
import { folderStructure, mockProducts } from '../../utils/mock-data';
import { formatGroupHeader, toTitleCase } from '../../utils/formatters/text';
import './Layout.css';

const { Sider, Header, Content } = Layout;


// SectionTitle component removed - using Ant Design's built-in item groups instead

// Component for sidebar menu items with smart tooltips

// Helper function to generate unified menu structure with Ant Design item groups
const generateMenuStructure = () => {
  const menuItems = [
    // Catalog Section - using Ant Design item group
    {
      type: 'group' as const,
      label: 'Catalog',
      children: [
        {
          key: 'products',
          label: 'Products',
          icon: <Box size={16} />,
          children: [
            // All Products - shows all products across all folders
            {
              key: 'all-products',
              label: <Link to="/">All products</Link>
            },
            // Sort LOBs with "Other" always last
            ...Object.entries(folderStructure)
              .sort(([lobA], [lobB]) => {
                if (lobA === 'Other') return 1;
                if (lobB === 'Other') return -1;
                return lobA.localeCompare(lobB);
              })
              .map(([lob, folders]) => ({
                key: lob.toLowerCase(),
                label: formatGroupHeader(lob),
                children: folders.slice().sort((a, b) => a.localeCompare(b)).map((folder) => ({
                  key: `${lob.toLowerCase()}-${folder.toLowerCase().replace(/\s+/g, '-')}`,
                  label: <Link to={`/folder/${folder.toLowerCase().replace(/\s+/g, '-')}`}>{toTitleCase(folder)}</Link>,
                  icon: <Folder size={16} />
                }))
              }))
          ]
        },
        {
          key: 'offers',
          label: <Link to="/offers">Offers</Link>,
          icon: <TicketPercent size={16} />
        },
        {
          key: 'offer-groups',
          label: <Link to="/offer-groups">Offer groups</Link>,
          icon: <TicketPercent size={16} />
        }
      ]
    },
    // Logic Section - using Ant Design item group
    {
      type: 'group' as const,
      label: 'Logic',
      children: [
        {
          key: 'rulesets',
          label: <Link to="/rulesets">Rulesets</Link>,
          icon: <Calculator size={16} />
        },
        {
          key: 'calculation-schemes',
          label: <Link to="/calculation-schemes">Calculation schemes</Link>,
          icon: <Workflow size={16} />
        }
      ]
    },
    // Integrations Section - using Ant Design item group
    {
      type: 'group' as const,
      label: 'Integrations',
      children: [
        {
          key: 'platform-entity-mapping',
          label: <Link to="/platform-entity-mapping">Platform entity mapping</Link>,
          icon: <Smartphone size={16} />
        }
      ]
    },
    // Change Management Section - using Ant Design item group
    {
      type: 'group' as const,
      label: 'Change management',
      children: [
        {
          key: 'gtm-motions',
          label: <Link to="/gtm-motions">GTM motions</Link>,
          icon: <Rocket size={16} />
        },
        {
          key: 'change-requests',
          label: <Link to="/change-requests">Change requests</Link>,
          icon: <ArrowBigRightDash size={16} />
        },
        {
          key: 'picasso-npi',
          label: <Link to="/picasso-npi">Picasso NPI</Link>,
          icon: <TableProperties size={16} />
        }
      ]
    }
  ];

  return menuItems;
};

const AppLayout = () => {
  // Simplified state - let Ant Design handle most of the complexity
  const [isScrolled, setIsScrolled] = useState(false);
  const [openKeys, setOpenKeys] = useState(['products']); // Only keep essential open keys state

  const location = useLocation();
  const { productName, folderName } = useBreadcrumb();
  const { collapsed, setCollapsed, getContentWidth } = useLayout();
  const { token } = theme.useToken();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  // Get standardized content width
  const contentWidth = getContentWidth();

  // Simplified responsive behavior - let Ant Design handle most of it
  useEffect(() => {
    if (screens.lg !== undefined) {
      if (!screens.lg) {
        // Auto-collapse on small screens
        setCollapsed(true);
      }
      // Note: Removed complex manual toggle tracking - Ant Design handles user interactions
    }
  }, [screens.lg, setCollapsed]);

  // Note: We don't need to update maxWidth here since pages set their own base width

  // Generate menu structure from mock data
  const menuItems = useMemo(() => generateMenuStructure(), []);

  // Simplified menu key selection using a lookup map
  const getSelectedMenuKey = useMemo(() => {
    const { pathname } = location;
    
    // Simple route mapping - much cleaner than complex logic
    const routeMap: Record<string, string[]> = {
      '/': ['all-products'],
      '/offers': ['offers'],
      '/offer-groups': ['offer-groups'],
      '/rulesets': ['rulesets'],
      '/calculation-schemes': ['calculation-schemes'],
      '/platform-entity-mapping': ['platform-entity-mapping'],
      '/change-requests': ['change-requests'],
      '/picasso-npi': ['picasso-npi'],
      '/attribute-dictionary': []
    };

    // Direct route match
    if (routeMap[pathname]) return routeMap[pathname];
    
    // Folder routes
    if (pathname.startsWith('/folder/')) {
      const folderName = pathname.replace('/folder/', '');
      // Find matching folder key in our structure
      for (const [lob, folders] of Object.entries(folderStructure)) {
        for (const folder of folders) {
          const folderKey = folder.toLowerCase().replace(/\s+/g, '-');
          if (folderKey === folderName) {
            return [`${lob.toLowerCase()}-${folderKey}`];
          }
        }
      }
      return ['products']; // Fallback
    }
    
    // Product routes (including SKUs and price groups)
    if (pathname.startsWith('/product/')) {
      const productId = pathname.split('/product/')[1]?.split('/')[0];
      const product = mockProducts.find(p => p.id === productId);
      
      if (product?.lob && product?.folder) {
        const folderKey = product.folder.toLowerCase().replace(/\s+/g, '-');
        return [`${product.lob.toLowerCase()}-${folderKey}`];
      }
      return ['products']; // Fallback
    }
    
    // GTM routes
    if (pathname.startsWith('/gtm-motions')) return ['gtm-motions'];
    
    return []; // Unknown routes
  }, [location.pathname]);

  const selectedKeys = getSelectedMenuKey;

  // Simplified auto-expand logic - much cleaner approach
  const lobKeys = useMemo(() => Object.keys(folderStructure).map(lob => lob.toLowerCase()), []);
  
  // Auto-expand parent LOB when navigating to a folder
  useEffect(() => {
    const selectedFolder = selectedKeys.find(key => 
      key && key.includes('-') && key !== 'all-products'
    );
    
    if (selectedFolder) {
      const lobKey = selectedFolder.split('-')[0];
      if (lobKeys.includes(lobKey)) {
        setOpenKeys(prev => {
          // Only update if not already open to avoid unnecessary re-renders
          if (!prev.includes(lobKey)) {
            return ['products', lobKey]; // Keep products open and add LOB
          }
          return prev;
        });
      }
    } else {
      // Reset to default when no specific folder is selected
      setOpenKeys(['products']);
    }
  }, [selectedKeys, lobKeys]);

  // Simplified accordion handler - let Ant Design handle most of the behavior
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // Find the current menu item based on the path
  // Note: We don't show breadcrumbs for root pages (they have no parent to navigate back to)
  const currentMenuItem = null; // No breadcrumb for root pages

  const breadcrumbItems = [];

  // Handle folder pages - add breadcrumb for folder pages
  if (location.pathname.startsWith('/folder/') && folderName) {
    breadcrumbItems.push(
      <Breadcrumb.Item key="catalog">
        <Link to="/">All products</Link>
      </Breadcrumb.Item>
    );
    // Note: Folder page itself doesn't show folder name in breadcrumb - only parent navigation
  }

  // Handle GTM Motion detail pages (not the root list page)
  const motionMatch = location.pathname.match(/^\/gtm-motions\/(.+)$/);
  if (motionMatch) {
    // Add GTM Motions root breadcrumb for child pages only
    breadcrumbItems.push(
      <Breadcrumb.Item key="gtm-motions">
        <Link to="/gtm-motions">GTM Motions</Link>
      </Breadcrumb.Item>
    );
    
    // This would show the motion name if we had it, but for now just show ID
    // In a real app, you'd fetch the motion name here or pass it through context
  }

  // Handle attribute dictionary page - no breadcrumb needed

  if (location.pathname.startsWith('/product/') && productName) {
    // Add Products link first for product pages
    if (!currentMenuItem) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="home">
          <Link to="/">All products</Link>
        </Breadcrumb.Item>
      );
    }

    // Add folder breadcrumb if available
    if (folderName) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="folder">
          <Link to={`/folder/${folderName.toLowerCase().replace(/\s+/g, '-')}`}>
            <Space size={4}>
              <Folder size={12} style={{ color: token.colorTextSecondary }} />
              {folderName}
            </Space>
          </Link>
        </Breadcrumb.Item>
      );
    }

    const isSkuPage = location.pathname.includes('/sku/');
    const isPriceGroupPage = location.pathname.includes('/price-group/');
    
    // Only show product breadcrumb for child pages (SKU, Price Group), not for the product page itself
    if (isSkuPage || isPriceGroupPage) {
      // Determine product path for linking back
      let productPath = location.pathname;
      if (isSkuPage) {
        productPath = location.pathname.substring(0, location.pathname.indexOf('/sku/'));
      } else if (isPriceGroupPage) {
        productPath = location.pathname.substring(0, location.pathname.indexOf('/price-group/'));
      }

      // Check for 'from' parameter to remember which tab to return to
      const urlParams = new URLSearchParams(location.search);
      const fromTab = urlParams.get('from');
      
      // Add tab parameter if specified
      if (fromTab && fromTab !== 'overview') {
        productPath += `?tab=${fromTab}`;
      }

      breadcrumbItems.push(
        <Breadcrumb.Item key="product">
          <Link to={productPath}>
            {productName}
          </Link>
        </Breadcrumb.Item>
      );
    }
    // Note: Product page itself doesn't show product name in breadcrumb - only parent navigation


  }

  // Add trailing separator to indicate current page level
  if (breadcrumbItems.length > 0) {
    breadcrumbItems.push(
      <Breadcrumb.Item key="trailing-separator">
        <span></span>
      </Breadcrumb.Item>
    );
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
        width={240}
        collapsedWidth={64}
        className="sidebar-container"
        style={{ 
          background: token.colorBgLayout, 
          borderRight: `1px solid ${token.colorBorder}`,
          position: 'fixed',
          height: '100vh',
          overflow: 'auto',
          zIndex: 1000,
          transition: 'width 180ms cubic-bezier(0.4,0,0.2,1)',
          willChange: 'width',
          // Remove scrollbar styling - handled by CSS below
        }}
      >
        <div className="sidebar-content-wrapper">
          {/* Fixed Header Section */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: collapsed ? 'center' : 'space-between',
            height: 64, 
            padding: collapsed ? '0 16px' : '0 12px 0 20px',
            background: token.colorBgLayout,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}>
          {!collapsed && (
            <Link 
              to="/" 
              className="sidebar-logo-link"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 8, 
                textDecoration: 'none',
                color: 'inherit',
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '6px',
                margin: '-8px -12px',
                transition: 'background-color 150ms ease'
              }}
            >
              <img 
                src={LinkedInLogo} 
                alt="LinkedIn Logo" 
                style={{ width: 24, height: 24 }} 
              />
              {!collapsed && (
                <span className="sidebar-label" style={{ fontWeight: 600, fontSize: 18, letterSpacing: 0.1 }}>
                  PCC
                </span>
              )}
            </Link>
          )}
          <Button
            icon={<PanelLeft size={18} />}
            onClick={() => setCollapsed(!collapsed)}
            type="text"
            style={{
              fontSize: '16px',
              color: '#666'
            }}
          />
        </div>
        <div style={{ paddingTop: '16px' }}>
          {/* Single unified menu with Ant Design item groups */}
          <Menu 
            mode="inline" 
            selectedKeys={selectedKeys}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={menuItems}
            inlineIndent={0}
            style={{ 
              border: 'none',
              padding: '0px',
              background: token.colorBgLayout,
              ...(collapsed && {
                '--ant-menu-item-padding-horizontal': '0px',
                '--ant-menu-item-height': '32px',
                '--ant-menu-item-border-radius': '0px'
              })
            } as React.CSSProperties}
            className={collapsed ? 'collapsed-menu' : 'compact-menu'}
          />
        </div>
        </div>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 64 : 240, backgroundColor: token.colorBgContainer }}>
        <Header 
          style={{ 
            background: isScrolled ? 'rgba(255, 255, 255, 0.8)' : token.colorBgContainer,
            backdropFilter: isScrolled ? 'blur(10px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(10px)' : 'none',
            padding: '0 24px 0 24px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: `1px solid ${token.colorBorder}`, 
            height: 48,
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? 64 : 240,
            zIndex: zIndex.header,
            transition: 'all 0.3s ease'
          }}
        >
          <Breadcrumb>
            {breadcrumbItems}
          </Breadcrumb>
          <Space size={16}>
            <Avatar size="small" icon={<User size={16} />} />
          </Space>
        </Header>
        <Content style={{ 
          margin: '80px 24px 24px 24px', // Top margin to account for fixed header
          padding: 0, 
          minHeight: 280, 
          background: 'transparent',
        }}>
          <div style={{ maxWidth: contentWidth, width: '100%', margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 