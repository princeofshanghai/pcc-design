import { Layout, Menu, Avatar, Breadcrumb, Button, theme, Space, Grid } from 'antd';
import { User, PanelLeft, Box, Folder, TicketPercent, Calculator, Workflow, Smartphone, ArrowBigRightDash, TableProperties, Rocket } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import LinkedInLogo from '../../assets/linkedin-logo.svg';
import { zIndex } from '../../theme';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useLayout } from '../../context/LayoutContext';
import { folderStructure, mockProducts } from '../../utils/mock-data';
import { formatGroupHeader, toTitleCase } from '../../utils/formatters/text';
import TruncatedText from '../shared/TruncatedText';
import './Layout.css';

const { Sider, Header, Content } = Layout;


// SectionTitle component removed - using Ant Design's built-in item groups instead

// Component for sidebar menu items with smart tooltips

// Helper function to generate unified menu structure with Ant Design item groups
const generateMenuStructure = (navigate: (path: string) => void, currentPath: string) => {
  const menuItems = [
    // Catalog Section - using Ant Design item group
    {
      type: 'group' as const,
      label: 'Catalog',
      children: [
        {
          key: 'products',
          label: (
            <span 
              onClick={(e) => {
                e.stopPropagation(); // Prevent default expand/collapse
                navigate('/');
              }}
              style={{ cursor: 'pointer' }}
            >
              Products
            </span>
          ),
          icon: <Box size={16} />,
          className: currentPath === '/' ? 'selected-expandable-item' : undefined,
          children: [
            // Sort LOBs with "Other" always last, and create clickable+expandable items
            ...Object.entries(folderStructure)
              .sort(([lobA], [lobB]) => {
                if (lobA === 'Other') return 1;
                if (lobB === 'Other') return -1;
                return lobA.localeCompare(lobB);
              })
              .map(([lob, folders]) => {
                // Special cases for LMS and Other - just pages, no children
                if (lob === 'LMS') {
                  return {
                    key: lob.toLowerCase(),
                    label: 'LMS', // Remove Link wrapper - handled by Menu onClick
                    icon: <Folder size={16} />
                  };
                }
                
                if (lob === 'Other') {
                  return {
                    key: lob.toLowerCase(),
                    label: 'Other', // Remove Link wrapper - handled by Menu onClick
                    icon: <Folder size={16} />
                  };
                }
                
                // For other LOBs - expandable + clickable
                const lobKey = lob.toLowerCase();
                const lobRoute = `/${lobKey}-products`;
                const isLobSelected = currentPath === lobRoute;
                
                return {
                  key: lobKey,
                  label: (
                    <span 
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent default expand/collapse
                        navigate(lobRoute);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {formatGroupHeader(lob)}
                    </span>
                  ),
                  icon: <Folder size={16} />,
                  className: isLobSelected ? 'selected-expandable-item' : undefined,
                  children: folders.slice().sort((a, b) => a.localeCompare(b)).map((folder) => ({
                    key: `${lobKey}-${folder.toLowerCase().replace(/\s+/g, '-')}`,
                    label: (
                      <span 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent default expand/collapse
                          const folderPath = folder.toLowerCase().replace(/\s+/g, '-');
                          navigate(`/folder/${folderPath}`);
                        }}
                        style={{ 
                          cursor: 'pointer',
                          display: 'block',
                          width: '100%'
                        }}
                      >
                        <TruncatedText 
                          text={toTitleCase(folder)}
                          placement="right"
                          showTooltip={true}
                        />
                      </span>
                    ),
                    icon: <Folder size={16} />
                  }))
                };
              })
          ]
        },
        {
          key: 'offers',
          label: 'Offers', // Remove Link wrapper - handled by Menu onClick
          icon: <TicketPercent size={16} />
        },
        {
          key: 'offer-groups',
          label: 'Offer groups', // Remove Link wrapper - handled by Menu onClick
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
          label: 'Rulesets', // Remove Link wrapper - handled by Menu onClick
          icon: <Calculator size={16} />
        },
        {
          key: 'calculation-schemes',
          label: 'Calculation schemes', // Remove Link wrapper - handled by Menu onClick
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
          label: 'Platform entity mapping', // Remove Link wrapper - handled by Menu onClick
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
          label: 'GTM motions', // Remove Link wrapper - handled by Menu onClick
          icon: <Rocket size={16} />
        },
        {
          key: 'change-requests',
          label: 'Change requests', // Remove Link wrapper - handled by Menu onClick
          icon: <ArrowBigRightDash size={16} />
        },
        {
          key: 'picasso-npi',
          label: 'Picasso NPI', // Remove Link wrapper - handled by Menu onClick
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

  const location = useLocation();
  const navigate = useNavigate();
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
  const menuItems = useMemo(() => generateMenuStructure(navigate, location.pathname), [navigate, location.pathname]);

  // Simplified menu key selection using a lookup map
  const getSelectedMenuKey = useMemo(() => {
    const { pathname } = location;
    
    // Simple route mapping - much cleaner than complex logic
    const routeMap: Record<string, string[]> = {
      '/': ['products'], // Products page (expandable + clickable)
      '/lms-products': ['lms'], // LMS page (just clickable)
      '/lss-products': ['lss'], // LSS page (expandable + clickable)
      '/lts-products': ['lts'], // LTS page (expandable + clickable)
      '/premium-products': ['premium'], // Premium page (expandable + clickable)
      '/other-products': ['other'], // Other page (just clickable)
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

  // Handle menu item navigation - only for non-expandable items without custom click handlers
  const handleMenuClick = ({ key }: { key: string }) => {
    // Navigation mapping for non-expandable items only
    // (Expandable items now handle their own navigation via custom click handlers)
    const navigationMap: Record<string, string> = {
      // Only non-expandable items that don't have custom handlers
      'lms': '/lms-products', // Non-expandable LOB item
      'other': '/other-products', // Non-expandable LOB item
      'offers': '/offers',
      'offer-groups': '/offer-groups',
      
      // Logic section
      'rulesets': '/rulesets',
      'calculation-schemes': '/calculation-schemes',
      
      // Integrations section
      'platform-entity-mapping': '/platform-entity-mapping',
      
      // Change Management section
      'gtm-motions': '/gtm-motions',
      'change-requests': '/change-requests',
      'picasso-npi': '/picasso-npi',
    };

    // Handle direct navigation for non-expandable items
    const route = navigationMap[key];
    if (route) {
      navigate(route);
    }
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

  // Handle LOB pages - show "All products" breadcrumb for pages like /lss-products, /premium-products, etc.
  // Exclude folder pages to avoid duplicate breadcrumbs
  if (location.pathname.endsWith('-products') && 
      location.pathname !== '/' && 
      !location.pathname.startsWith('/folder/')) {
    breadcrumbItems.push(
      <Breadcrumb.Item key="home">
        <Link to="/">All products</Link>
      </Breadcrumb.Item>
    );
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
            inlineCollapsed={collapsed} // Let Ant Design handle collapsed state natively
            selectedKeys={selectedKeys}
            onClick={handleMenuClick}
            items={menuItems}
            inlineIndent={16} // Reduce from default 24px to 16px for less indentation
            style={{ 
              background: 'transparent', // Keep transparent to match gray sidebar
            }}
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