import { Layout, Menu, Avatar, Breadcrumb, Button, theme, Space, Tooltip, Grid } from 'antd';
import { User, PanelLeft, Box, ChevronRight, Tag, DollarSign, SquareSlash, Folder, GitPullRequestArrow, Plus } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import LinkedInLogo from '../../assets/linkedin-logo.svg';
import { zIndex } from '../../theme';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useLayout } from '../../context/LayoutContext';
import { folderStructure } from '../../utils/mock-data';
import { toSentenceCase, toTitleCase } from '../../utils/formatters/text';

const { Sider, Header, Content } = Layout;



// Component for sidebar menu items with smart tooltips
const SidebarMenuItem: React.FC<{
  children: React.ReactNode;
  text: string;
  collapsed: boolean;
}> = ({ children, text, collapsed }) => {
  const [shouldShowTooltip, setShouldShowTooltip] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (collapsed) {
      setShouldShowTooltip(false);
      return;
    }

    const checkTruncation = () => {
      if (!contentRef.current) {
        setShouldShowTooltip(false);
        return;
      }

      const element = contentRef.current;
      
      // Find the actual text element (Link or span) that contains the text
      let textElement: Element | null = null;
      
      // Look for Link elements first
      const linkElement = element.querySelector('a');
      if (linkElement && linkElement.textContent?.trim() === text) {
        textElement = linkElement;
      } else {
        // Look for span elements
        const spanElements = element.querySelectorAll('span');
        for (const span of spanElements) {
          if (span.textContent?.trim() === text) {
            textElement = span;
            break;
          }
        }
      }
      
      // If we found the text element, check if it's truncated
      let isOverflowing = false;
      if (textElement) {
        isOverflowing = textElement.scrollWidth > textElement.clientWidth;
      } else {
        // Fallback: check the wrapper element
        isOverflowing = element.scrollWidth > element.clientWidth;
      }
      
      setShouldShowTooltip(isOverflowing);
    };

    // Check immediately and after a small delay to handle rendering
    checkTruncation();
    const timer = setTimeout(checkTruncation, 100);

    // Check on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkTruncation, 50);
    });

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [collapsed, text]);

  if (collapsed) {
    // When collapsed, let Ant Design handle tooltips automatically
    return <>{children}</>;
  }

  // When expanded, use our truncation detection
  const content = (
    <div 
      ref={contentRef}
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

  if (shouldShowTooltip) {
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
                <SidebarMenuItem text={toTitleCase(folder)} collapsed={collapsed}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Folder size={14} color="#999" />
                    <Link to={`/folder/${folder.toLowerCase().replace(/\s+/g, '-')}`}>{toTitleCase(folder)}</Link>
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
  const [manuallyToggled, setManuallyToggled] = useState(false); // Track if user manually toggled
  const [showLabels, setShowLabels] = useState(true); // for smooth text transition
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { productName, skuId, priceGroupId, priceGroupName } = useBreadcrumb();
  const { collapsed: contextCollapsed, setCollapsed: setContextCollapsed, getContentWidth } = useLayout();
  const { token } = theme.useToken();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();

  // Sync local collapsed state with context
  const collapsed = contextCollapsed;
  
  // Get standardized content width
  const contentWidth = getContentWidth();

  // Handle responsive sidebar collapse
  useEffect(() => {
    // Only auto-collapse/expand if user hasn't manually toggled on large screens
    if (screens.lg !== undefined) {
      if (!screens.lg) {
        // Screen is smaller than lg (992px) - auto-collapse
        setContextCollapsed(true);
        // Reset manual toggle state when going to small screen
        setManuallyToggled(false);
      } else if (screens.lg && !manuallyToggled) {
        // Screen is lg or larger AND user hasn't manually collapsed - auto-expand
        setContextCollapsed(false);
      }
    }
  }, [screens.lg, manuallyToggled, setContextCollapsed]);

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
        collapsedWidth={64}
        className="sidebar-container"
        style={{ 
          background: '#fff', 
          borderRight: '1px solid #f0f0f0',
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
            background: '#fff',
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
              <span className="sidebar-label" style={{ fontWeight: 600, fontSize: 18, letterSpacing: 0.1, transition: 'opacity 180ms cubic-bezier(0.4,0,0.2,1), transform 180ms cubic-bezier(0.4,0,0.2,1)', opacity: showLabels ? 1 : 0, transform: showLabels ? 'translateX(0)' : 'translateX(-8px)' }}>
                PCC
              </span>
            </Link>
          )}
          <Button
            icon={<PanelLeft size={18} />}
            onClick={() => {
              const newCollapsed = !collapsed;
              setContextCollapsed(newCollapsed);
              // Mark as manually toggled only on large screens
              // On small screens, we don't track manual toggles since sidebar should stay collapsed
              if (screens.lg) {
                setManuallyToggled(true);
              }
            }}
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
        </div>
        <style>
          {`
            /* Modern invisible scrollbar approach */
            .sidebar-container {
              scrollbar-width: none; /* Firefox */
              -ms-overflow-style: none; /* IE/Edge */
            }

            /* Sidebar content wrapper for proper spacing */
            .sidebar-content-wrapper {
              height: 100%;
              padding-right: 8px; /* Consistent right spacing for expanded state */
            }

            /* Collapsed state: remove right padding, center content */
            .sidebar-container.ant-layout-sider-collapsed .sidebar-content-wrapper {
              padding-right: 0;
            }

            .sidebar-container::-webkit-scrollbar {
              width: 0px; /* Chrome/Safari - completely hidden */
              background: transparent;
            }

            /* Show subtle overlay scrollbar only on hover */
            .sidebar-container:hover::-webkit-scrollbar {
              width: 4px;
            }

            .sidebar-container:hover::-webkit-scrollbar-track {
              background: transparent;
            }

            .sidebar-container:hover::-webkit-scrollbar-thumb {
              background: rgba(0, 0, 0, 0.2);
              border-radius: 2px;
            }

            .sidebar-container:hover::-webkit-scrollbar-thumb:hover {
              background: rgba(0, 0, 0, 0.4);
            }

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

            /* Consistent spacing for all menu items */
            /* Top level items (Products, Offers, etc.) */
            .compact-menu > .ant-menu-item,
            .compact-menu > .ant-menu-submenu > .ant-menu-submenu-title {
              padding-left: 16px !important;
              padding-right: 24px !important;
              margin-left: 8px !important;
              margin-right: 8px !important;
            }

            /* Level 1 items (All Products, LOB items) */
            .compact-menu .ant-menu-submenu .ant-menu > .ant-menu-item,
            .compact-menu .ant-menu-submenu .ant-menu > .ant-menu-submenu > .ant-menu-submenu-title {
              padding-left: 16px !important;
              padding-right: 24px !important;
              margin-left: 8px !important;
              margin-right: 8px !important;
            }

            /* Level 2 items (folder items within LOBs) - slight indent */
            .compact-menu .ant-menu-submenu .ant-menu .ant-menu-submenu .ant-menu > .ant-menu-item {
              padding-left: 28px !important;
              padding-right: 24px !important;
              margin-left: 8px !important;
              margin-right: 8px !important;
            }

            .collapsed-menu .ant-menu-item,
            .collapsed-menu .ant-menu-submenu-title {
              text-align: center !important;
              padding: 0 !important;
              margin: 0 !important;
              width: 100% !important;
            }
            .collapsed-menu .ant-menu-item .ant-menu-title-content,
            .collapsed-menu .ant-menu-submenu-title .ant-menu-title-content {
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
              width: 100% !important;
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

            /* Clean menu item spacing with wrapper approach */
            .compact-menu .ant-menu-item,
            .compact-menu .ant-menu-submenu-title {
              margin-left: 8px !important;
              margin-right: 8px !important;
              box-sizing: border-box !important;
            }

            /* Hover effect for logo/text link */
            .sidebar-logo-link:hover {
              background-color: rgba(0, 0, 0, 0.04) !important;
            }
          `}
        </style>
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 64 : 240, backgroundColor: token.colorBgLayout }}>
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
            height: 48,
            position: 'fixed',
            top: 0,
            right: 0,
            left: collapsed ? 64 : 240,
            zIndex: zIndex.header,
            transition: 'all 0.3s ease'
          }}
        >
          <Breadcrumb separator={<ChevronRight size={16} style={{ color: 'rgba(0, 0, 0, 0.45)' }} />}>{breadcrumbItems}</Breadcrumb>
          <Space size={12}>
            <Button 
              type="primary" 
              size="small"
              icon={<Plus size={14} />}
              onClick={() => {
                // Placeholder - functionality to be implemented later
                console.log('New GTM motion clicked');
              }}
            >
              New GTM motion
            </Button>
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