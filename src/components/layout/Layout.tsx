import { Layout, Menu, Avatar, Breadcrumb, Button, theme, Space, Tooltip } from 'antd';
import { User, PanelLeft, Box, ChevronRight, Tag, DollarSign, SquareSlash, Folder, GitPullRequestArrow, Plus } from 'lucide-react';
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
    <div 
      ref={textRef as React.RefObject<HTMLDivElement>}
      style={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        maxWidth: '100%',
        minWidth: 0, // Important for flex children to shrink
        width: '100%'
      }}
    >
      {children}
    </div>
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
    // Products section at the top (no icon)
    {
      key: 'products',
      label: 'Products',
      icon: <Box size={14} />, // add the cube icon back for Products only
      className: 'sidebar-products-menu-item', // custom class for CSS targeting
      children: [
        {
          key: 'all-products',
          label: (
            <SidebarMenuItem text={toSentenceCase('All Products')} collapsed={collapsed}>
              <Link to="/">{toSentenceCase('All Products')}</Link>
            </SidebarMenuItem>
          )
        },
        // Sort LOBs with "Other" always last
        ...Object.entries(folderStructure)
          .sort(([lobA], [lobB]) => {
            if (lobA === 'Other') return 1; // Other goes to end
            if (lobB === 'Other') return -1; // Other goes to end
            return lobA.localeCompare(lobB); // Alphabetical for others
          })
          .map(([lob, folders]) => ({
            key: lob.toLowerCase(),
            className: 'sidebar-lob-menu-item', // Add this line for custom styling
            label: (
              <SidebarMenuItem text={toSentenceCase(lob)} collapsed={collapsed}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Folder size={14} color="#999" />
                  <span>{toSentenceCase(lob)}</span>
                </span>
              </SidebarMenuItem>
            ),
            // Sort folders alphabetically
            children: folders.slice().sort((a, b) => a.localeCompare(b)).map((folder) => ({
              key: `${lob.toLowerCase()}-${folder.toLowerCase().replace(/\s+/g, '-')}`,
              label: (
                <SidebarMenuItem text={toSentenceCase(folder)} collapsed={collapsed}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Folder size={14} color="#999" />
                    <Link to={`/folder/${folder.toLowerCase().replace(/\s+/g, '-')}`}>{toSentenceCase(folder)}</Link>
                  </span>
                </SidebarMenuItem>
              )
            }))
          }))
      ]
    },
    // New top-level pages in specified order (no icons)
    {
      key: 'offers',
      label: (
        <SidebarMenuItem text={toSentenceCase("Offers")} collapsed={collapsed}>
          <Link to="/offers">{toSentenceCase("Offers")}</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'offer-groups',
      label: (
        <SidebarMenuItem text={toSentenceCase("Offer Groups")} collapsed={collapsed}>
          <Link to="/offer-groups">{toSentenceCase("Offer Groups")}</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'rulesets',
      label: (
        <SidebarMenuItem text={toSentenceCase("Rulesets")} collapsed={collapsed}>
          <Link to="/rulesets">{toSentenceCase("Rulesets")}</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'calculation-schemes',
      label: (
        <SidebarMenuItem text={toSentenceCase("Calculation Schemes")} collapsed={collapsed}>
          <Link to="/calculation-schemes">{toSentenceCase("Calculation Schemes")}</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'change-requests',
      label: (
        <SidebarMenuItem text={toSentenceCase("Change Requests")} collapsed={collapsed}>
          <Link to="/change-requests">{toSentenceCase("Change Requests")}</Link>
        </SidebarMenuItem>
      ),
      icon: <GitPullRequestArrow size={14} />
    },

    {
      key: 'picasso-npi',
      label: (
        <SidebarMenuItem text={toSentenceCase("Picasso NPI")} collapsed={collapsed}>
          <Link to="/picasso-npi">{toSentenceCase("Picasso NPI")}</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    }
  ];

  return menuItems;
};

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showLabels, setShowLabels] = useState(true); // for smooth text transition
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { productName, skuId, priceGroupId, priceGroupName } = useBreadcrumb();
  const { maxWidth } = useLayout();
  const { token } = theme.useToken();

  // Calculate dynamic max width based on sidebar state and current page width
  // Add 160px (sidebar width difference) when collapsed
  const calculateDynamicWidth = (baseWidth: string) => {
    const widthValue = parseInt(baseWidth);
    return collapsed ? `${widthValue + 160}px` : baseWidth;
  };

  // Get the current max width from context (set by individual pages)
  const dynamicMaxWidth = calculateDynamicWidth(maxWidth);

  // Animate label hiding after collapse
  useEffect(() => {
    if (collapsed) {
      const timeout = setTimeout(() => setShowLabels(false), 180); // match transition duration
      return () => clearTimeout(timeout);
    } else {
      setShowLabels(true);
    }
  }, [collapsed]);

  // Note: We don't need to update maxWidth here since pages set their own base width

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
    // Check if this is a change request page
    const isChangeRequestPage = location.pathname.includes('/configuration/');
    
    // Add Home link first for product pages
    if (!currentMenuItem) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="home">
          <Link to={isChangeRequestPage ? "/change-requests" : "/"}>
            {isChangeRequestPage ? "Change requests" : "Products"}
          </Link>
        </Breadcrumb.Item>
      );
    }

    const isSkuPage = location.pathname.includes('/sku/');
    const isPriceGroupPage = location.pathname.includes('/price-group/');
    
    // Don't show product breadcrumb for change request pages
    if (!isChangeRequestPage) {
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
    }

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
            <span>{priceGroupName || priceGroupId}</span>
          </Space>
        </Breadcrumb.Item>
      );
    }

    if (isChangeRequestPage && productName) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="changeRequest">
          <Space size={4}>
            <GitPullRequestArrow size={14} />
            <span>{productName}</span>
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
        width={240} 
        style={{ 
          background: '#fff', 
          borderRight: '1px solid #f0f0f0',
          position: 'fixed',
          height: '100vh',
          overflow: 'overlay',
          zIndex: 1000,
          transition: 'width 180ms cubic-bezier(0.4,0,0.2,1)',
          willChange: 'width',
          scrollbarWidth: 'thin',
        }}
      >
        {/* Fixed Header Section */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: collapsed ? 'center' : 'space-between',
          height: 64, 
          padding: '0 12px',
          borderBottom: '1px solid #f0f0f0',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <img 
                src={LinkedInLogo} 
                alt="LinkedIn Logo" 
                style={{ width: 24, height: 24 }} 
              />
              <span className="sidebar-label" style={{ fontWeight: 600, fontSize: 18, letterSpacing: 0.1, transition: 'opacity 180ms cubic-bezier(0.4,0,0.2,1), transform 180ms cubic-bezier(0.4,0,0.2,1)', opacity: showLabels ? 1 : 0, transform: showLabels ? 'translateX(0)' : 'translateX(-8px)' }}>
                PCC
              </span>
            </div>
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
        <Menu 
          mode="inline" 
          defaultSelectedKeys={['all-products']}
          defaultOpenKeys={['products']}
          items={menuItems}
          inlineIndent={0}
          style={{ 
            border: 'none',
            padding: '6px 0px',
            ...(collapsed && {
              '--ant-menu-item-padding-horizontal': '0px',
              '--ant-menu-item-height': '32px',
              '--ant-menu-item-border-radius': '0px'
            })
          } as React.CSSProperties}
          className={collapsed ? 'collapsed-menu' : 'compact-menu'}
        />
        <style>
          {`
            /* Compact menu styling for smaller items */
            .compact-menu {
              --ant-menu-item-height: 32px;
              --ant-menu-item-padding-inline: 12px;
            }

            .compact-menu .ant-menu-item,
            .compact-menu .ant-menu-submenu-title {
              font-size: 13px;
              height: 32px !important;
              line-height: 32px !important;
            }

            .compact-menu .ant-menu-submenu > .ant-menu-submenu-title {
              height: 32px !important;
              line-height: 32px !important;
            }

            /* Custom indentation with inlineIndent=0 */
            /* Top level items (Products, Offers, etc.) - keep default padding */
            .compact-menu > .ant-menu-item,
            .compact-menu > .ant-menu-submenu > .ant-menu-submenu-title {
              padding-left: 16px !important;
              padding-right: 16px !important;
              margin-left: 8px !important;
              margin-right: 8px !important;
            }

            /* Level 1 items (All Products, LOB items) - minimal padding */
            .compact-menu .ant-menu-submenu .ant-menu > .ant-menu-item,
            .compact-menu .ant-menu-submenu .ant-menu > .ant-menu-submenu > .ant-menu-submenu-title {
              padding-left: 16px !important;
              padding-right: 16px !important;
              margin-left: 8px !important;
              margin-right: 8px !important;
            }

            /* Level 2 items (folder items within LOBs) - slight indent */
            .compact-menu .ant-menu-submenu .ant-menu .ant-menu-submenu .ant-menu > .ant-menu-item {
              padding-left: 28px !important;
              padding-right: 16px !important;
              margin-left: 8px !important;
              margin-right: 8px !important;
            }

            .collapsed-menu .ant-menu-item {
              text-align: center !important;
              padding: 0 !important;
            }
            .collapsed-menu .ant-menu-item .ant-menu-title-content {
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
            /* Center the Products icon perfectly when collapsed */
            .collapsed-menu .sidebar-products-menu-item .ant-menu-item-icon {
              margin-left: 0 !important;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
              position: absolute;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            /* Animate sidebar label text for smooth expand/collapse */
            .sidebar-label {
              display: inline-block;
              transition: opacity 180ms cubic-bezier(0.4,0,0.2,1), transform 180ms cubic-bezier(0.4,0,0.2,1);
              will-change: opacity, transform;
            }
            .ant-menu-title-content .sidebar-label {
              transition: opacity 180ms cubic-bezier(0.4,0,0.2,1), transform 180ms cubic-bezier(0.4,0,0.2,1);
              will-change: opacity, transform;
            }
            /* Custom style for LOB expandable sections only (not child folders) */
            /* Target ONLY the direct LOB submenu titles, not their children */
            .compact-menu .ant-menu-submenu .ant-menu > .ant-menu-submenu > .ant-menu-submenu-title,
            .compact-menu .ant-menu-submenu .ant-menu > .ant-menu-submenu > .ant-menu-submenu-title span {
              font-size: 12px !important;
              font-weight: 600 !important;
              color: #6b7280 !important;
            }

            /* Ensure child folders don't inherit LOB styling */
            .compact-menu .ant-menu-submenu .ant-menu .ant-menu-submenu .ant-menu .ant-menu-item,
            .compact-menu .ant-menu-submenu .ant-menu .ant-menu-submenu .ant-menu .ant-menu-item span {
              font-size: 13px !important;
              font-weight: normal !important;
              color: inherit !important;
            }
            
            /* Fix text truncation in sidebar menu items */
            .ant-menu-title-content {
              overflow: hidden !important;
              min-width: 0 !important;
              flex: 1 !important;
            }
            
            /* Ensure flex containers in menu items allow truncation */
            .ant-menu-item span[style*="display: flex"] {
              min-width: 0 !important;
              overflow: hidden !important;
            }
            
            /* Make sure links and text within flex containers can truncate */
            .ant-menu-item span[style*="display: flex"] > span:last-child,
            .ant-menu-item span[style*="display: flex"] > a {
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              white-space: nowrap !important;
              min-width: 0 !important;
              flex: 1 !important;
            }
          `}
        </style>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 240, backgroundColor: token.colorBgLayout }}>
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
            left: collapsed ? 80 : 240,
            zIndex: zIndex.header,
            transition: 'all 0.3s ease'
          }}
        >
          <Breadcrumb separator={<ChevronRight size={16} style={{ color: 'rgba(0, 0, 0, 0.45)' }} />}>{breadcrumbItems}</Breadcrumb>
          <Space size={16}>
            <Button 
              type="primary" 
              icon={<Plus size={16} />}
              onClick={() => {
                // Placeholder - functionality to be implemented later
                console.log('New GTM motion clicked');
              }}
            >
              New GTM motion
            </Button>
            <Avatar icon={<User size={20} />} />
          </Space>
        </Header>
        <Content style={{ 
          margin: '120px 24px 24px 24px', // Top margin to account for fixed header
          padding: 0, 
          minHeight: 280, 
          background: 'transparent',
        }}>
          <div style={{ maxWidth: dynamicMaxWidth, margin: '0 auto' }}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout; 