import { Layout, Menu, Avatar, Breadcrumb, Button, theme, Space, Grid } from 'antd';
import { User, PanelLeft, Box, SquareSlash } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import LinkedInLogo from '../../assets/linkedin-logo.svg';
import { zIndex } from '../../theme';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useLayout } from '../../context/LayoutContext';
import { folderStructure, mockProducts } from '../../utils/mock-data';
import { formatGroupHeader, toTitleCase } from '../../utils/formatters/text';

const { Sider, Header, Content } = Layout;


// Component for section titles in the sidebar
const SectionTitle: React.FC<{ 
  title: string; 
  collapsed: boolean;
  isFirst?: boolean;
}> = ({ title, collapsed, isFirst = false }) => {
  if (collapsed) {
    return null; // Don't show section titles when collapsed
  }
  
  return (
    <div 
      className="sidebar-section-title"
      style={{
        fontSize: '12px',
        fontWeight: 500,
        color: '#6b7280',
        padding: '0 24px',
        marginTop: isFirst ? '24px' : '32px',
        marginBottom: '8px',
        textTransform: 'none'
      }}
    >
      {title}
    </div>
  );
};

// Component for sidebar menu items with smart tooltips

// Helper function to generate menu structure with sections
const generateMenuStructure = () => {
  // Create the menu structure with section groupings - using pure Ant Design structure
  const menuItems = [
    // Catalog Section
    {
      key: 'products',
      label: 'Products',
      icon: <Box size={14} />,
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
              label: <Link to={`/folder/${folder.toLowerCase().replace(/\s+/g, '-')}`}>{toTitleCase(folder)}</Link>
            }))
          }))
      ]
    },
    {
      key: 'offers',
      label: <Link to="/offers">Offers</Link>,
      icon: <SquareSlash size={14} />
    },
    {
      key: 'offer-groups',
      label: <Link to="/offer-groups">Offer groups</Link>,
      icon: <SquareSlash size={14} />
    },
    // Logic Section
    {
      key: 'rulesets',
      label: <Link to="/rulesets">Rulesets</Link>,
      icon: <SquareSlash size={14} />
    },
    {
      key: 'calculation-schemes',
      label: <Link to="/calculation-schemes">Calculation schemes</Link>,
      icon: <SquareSlash size={14} />
    },
    // Integrations Section  
    {
      key: 'platform-entity-mapping',
      label: <Link to="/platform-entity-mapping">Platform entity mapping</Link>,
      icon: <SquareSlash size={14} />
    },
    // Change Management Section
    {
      key: 'change-requests',
      label: <Link to="/change-requests">Change requests</Link>,
      icon: <SquareSlash size={14} />
    },
    {
      key: 'picasso-npi',
      label: <Link to="/picasso-npi">Picasso NPI</Link>,
      icon: <SquareSlash size={14} />
    }
  ];

  return menuItems;
};

const AppLayout = () => {
  const [manuallyToggled, setManuallyToggled] = useState(false); // Track if user manually toggled
  const [showLabels, setShowLabels] = useState(true); // for smooth text transition
  const [isScrolled, setIsScrolled] = useState(false);
  const [openKeys, setOpenKeys] = useState(['products']); // Controlled open keys
  const lastAutoExpandedRef = useRef<string | null>(null); // Track last auto-expanded selection
  const manualOverrideRef = useRef<boolean>(false); // Track if user has manually overridden auto-expand

  const location = useLocation();
  const { productName, folderName } = useBreadcrumb();
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
  const menuItems = useMemo(() => generateMenuStructure(), []);

  // Function to determine the selected menu key based on current path
  const getSelectedMenuKey = (pathname: string): string[] => {
    if (pathname === '/') return ['all-products'];
    
    if (pathname.startsWith('/folder/')) {
      // Extract folder name from URL (e.g., "/folder/all-lms-products" -> "all-lms-products")
      const folderName = pathname.replace('/folder/', '');
      
      // Find which LOB contains this folder by checking the folderStructure
      for (const [lob, folders] of Object.entries(folderStructure)) {
        for (const folder of folders) {
          const folderKey = folder.toLowerCase().replace(/\s+/g, '-');
          if (folderKey === folderName) {
            // Return the menu key for this specific folder
            return [`${lob.toLowerCase()}-${folderKey}`];
          }
        }
      }
      
      // Fallback to products if folder not found
      return ['products'];
    }
    
    if (pathname.startsWith('/product/')) {
      // Extract product ID from URL (e.g., "/product/5095285" -> "5095285")
      const productId = pathname.split('/product/')[1]?.split('/')[0];
      
      if (productId) {
        // Find the product to get its LOB and folder
        const product = mockProducts.find(p => p.id === productId);
        
        if (product && product.lob && product.folder) {
          // Generate the menu key for this product's folder
          const folderKey = product.folder.toLowerCase().replace(/\s+/g, '-');
          const menuKey = `${product.lob.toLowerCase()}-${folderKey}`;
          return [menuKey];
        }
      }
      
      // Fallback to products if product not found or doesn't have proper categorization
      return ['products'];
    }
    if (pathname === '/offers') return ['offers'];
    if (pathname === '/offer-groups') return ['offer-groups'];
    if (pathname === '/rulesets') return ['rulesets'];
    if (pathname === '/calculation-schemes') return ['calculation-schemes'];
    if (pathname === '/platform-entity-mapping') return ['platform-entity-mapping'];
    if (pathname === '/change-requests') return ['change-requests'];
    if (pathname === '/picasso-npi') return ['picasso-npi'];
    if (pathname === '/attribute-dictionary') return [];
    return []; // no selection for unknown routes
  };

  const selectedKeys = getSelectedMenuKey(location.pathname);

  // Helper functions to determine which keys belong to each section
  // Generate all possible folder keys dynamically
  const allFolderKeys = Object.entries(folderStructure).flatMap(([lob, folders]) =>
    folders.map(folder => `${lob.toLowerCase()}-${folder.toLowerCase().replace(/\s+/g, '-')}`)
  );
  
  // Generate LOB keys for accordion behavior
  const lobKeys = Object.keys(folderStructure).map(lob => lob.toLowerCase());

  // Auto-expand parent LOB when a folder is selected (only when selection changes)
  useEffect(() => {
    // Don't auto-expand if user has manually overridden
    if (manualOverrideRef.current) return;
    
    // Check if current selection is a folder (format: "lob-folder")
    const selectedFolder = selectedKeys.find(key => 
      key !== 'all-products' && allFolderKeys.includes(key)
    );
    
    if (selectedFolder) {
      // Only auto-expand if this is a new selection
      if (selectedFolder !== lastAutoExpandedRef.current) {
        // Extract the LOB from the folder key (e.g., "lts-recruiter" -> "lts")
        const lobKey = selectedFolder.split('-')[0];
        
        if (lobKeys.includes(lobKey)) {
          setOpenKeys(prev => {
            // Close other LOBs and open the one containing the selected folder
            const nonLobKeys = prev.filter(key => !lobKeys.includes(key));
            return [...nonLobKeys, lobKey];
          });
        }
        
        // Remember this selection to prevent repeated auto-expansions
        lastAutoExpandedRef.current = selectedFolder;
      }
    } else {
      // Reset when no folder is selected (e.g., on "All products" page)
      lastAutoExpandedRef.current = null;
      manualOverrideRef.current = false; // Reset manual override when leaving product pages
    }
  }, [selectedKeys, allFolderKeys, lobKeys]);
  
  const catalogKeys = ['products', 'offers', 'offer-groups', 'all-products', ...allFolderKeys];
  const logicKeys = ['rulesets', 'calculation-schemes'];
  const integrationsKeys = ['platform-entity-mapping'];
  const changeManagementKeys = ['change-requests', 'picasso-npi'];

  const getCatalogSelectedKeys = () => {
    return selectedKeys.filter(key => catalogKeys.includes(key));
  };

  // Custom handler for accordion behavior - only one LOB section can be open at a time
  const handleOpenChange = (keys: string[]) => {
    // Mark that user has manually overridden auto-expand behavior
    manualOverrideRef.current = true;
    
    // Find which LOB keys are being opened/closed
    const newLobKeys = keys.filter(key => lobKeys.includes(key));
    const currentLobKeys = openKeys.filter(key => lobKeys.includes(key));
    
    // If a new LOB is being opened, close all other LOBs
    if (newLobKeys.length > currentLobKeys.length) {
      // A LOB is being opened - keep only the newly opened LOB and non-LOB keys
      const newlyOpenedLob = newLobKeys.find(key => !currentLobKeys.includes(key));
      const nonLobKeys = keys.filter(key => !lobKeys.includes(key));
      
      if (newlyOpenedLob) {
        setOpenKeys([...nonLobKeys, newlyOpenedLob]);
      } else {
        setOpenKeys(nonLobKeys);
      }
    } else {
      // A LOB is being closed or non-LOB key is being toggled - allow normal behavior
      setOpenKeys(keys);
    }
  };
  const getLogicSelectedKeys = () => selectedKeys.filter(key => logicKeys.includes(key));
  const getIntegrationsSelectedKeys = () => selectedKeys.filter(key => integrationsKeys.includes(key));
  const getChangeManagementSelectedKeys = () => selectedKeys.filter(key => changeManagementKeys.includes(key));

  // Find the current menu item based on the path
  const currentMenuItem = location.pathname === '/' ? { key: 'products', label: 'Products', path: '/' } : null;

  const breadcrumbItems = [];
  if (currentMenuItem) {
    breadcrumbItems.push(
      <Breadcrumb.Item key={currentMenuItem.key}>
        <Link to={currentMenuItem.path}>{currentMenuItem.label}</Link>
      </Breadcrumb.Item>
    );
  }

  // Handle folder pages - add breadcrumb for folder pages
  if (location.pathname.startsWith('/folder/') && folderName) {
    breadcrumbItems.push(
      <Breadcrumb.Item key="catalog">
        <Link to="/">Products</Link>
      </Breadcrumb.Item>
    );
    // Note: Folder page itself doesn't show folder name in breadcrumb - only parent navigation
  }

  // Handle attribute dictionary page - no breadcrumb needed

  if (location.pathname.startsWith('/product/') && productName) {
    // Add Products link first for product pages
    if (!currentMenuItem) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="home">
          <Link to="/">Products</Link>
        </Breadcrumb.Item>
      );
    }

    // Add folder breadcrumb if available
    if (folderName) {
      breadcrumbItems.push(
        <Breadcrumb.Item key="folder">
          <Link to={`/folder/${folderName.toLowerCase().replace(/\s+/g, '-')}`}>
            {folderName}
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

      breadcrumbItems.push(
        <Breadcrumb.Item key="product">
          <Link to={productPath} style={{ color: 'var(--ant-color-text)' }}>
            {productName}
          </Link>
        </Breadcrumb.Item>
      );
    }
    // Note: Product page itself doesn't show product name in breadcrumb - only parent navigation


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
        <div>
          {/* Catalog Section */}
          <SectionTitle title="Catalog" collapsed={collapsed} isFirst={true} />
          <Menu 
            mode="inline" 
            selectedKeys={getCatalogSelectedKeys()}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            items={menuItems.slice(0, 3)} // Products, Offers, Offer Groups
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
          
          {/* Logic Section */}
          <SectionTitle title="Logic" collapsed={collapsed} />
          <Menu 
            mode="inline" 
            selectedKeys={getLogicSelectedKeys()}
            items={menuItems.slice(3, 5)} // Rulesets, Calculation Schemes
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
          
          {/* Integrations Section */}
          <SectionTitle title="Integrations" collapsed={collapsed} />
          <Menu 
            mode="inline" 
            selectedKeys={getIntegrationsSelectedKeys()}
            items={menuItems.slice(5, 6)} // Platform entity mapping
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
          
          {/* Change Management Section */}
          <SectionTitle title="Change management" collapsed={collapsed} />
          <Menu 
            mode="inline" 
            selectedKeys={getChangeManagementSelectedKeys()}
            items={menuItems.slice(6, 8)} // Change Requests, Picasso NPI
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
            /* Center submenu icons perfectly when collapsed */
            .collapsed-menu .ant-menu-submenu .ant-menu-item-icon {
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
              font-weight: 500 !important;
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

            /* Ensure all menu and submenu backgrounds are consistent */
            .sidebar-container .ant-menu,
            .sidebar-container .ant-menu-sub,
            .sidebar-container .ant-menu-submenu .ant-menu {
              background: transparent !important;
            }



            /* Ensure selected menu items have consistent blue styling for both text and icons */
            .sidebar-container .ant-menu-item-selected span,
            .sidebar-container .ant-menu-item-selected a,
            .sidebar-container .ant-menu-item-selected svg {
              color: #1677ff !important;
            }

            /* Default styling for non-selected folder icons */
            .sidebar-container .ant-menu-item:not(.ant-menu-item-selected) svg {
              color: #999 !important;
            }

            /* Hover state for menu items and submenu titles */
            .sidebar-container .ant-menu-item:hover span,
            .sidebar-container .ant-menu-item:hover a,
            .sidebar-container .ant-menu-item:hover svg,
            .sidebar-container .ant-menu-submenu-title:hover span,
            .sidebar-container .ant-menu-submenu-title:hover svg {
              color: #1677ff !important;
            }

            /* Ensure submenu titles have hover background like regular menu items */
            .sidebar-container .ant-menu-submenu-title:hover {
              background-color: rgba(0, 0, 0, 0.04) !important;
            }


          `}
        </style>
        
        {/* Custom breadcrumb styling */}
        <style>
          {`
            /* Custom breadcrumb styling to match design requirements */
            .ant-breadcrumb {
              font-size: 12px !important;
              font-weight: 500 !important;
            }
            
            .ant-breadcrumb .ant-breadcrumb-link,
            .ant-breadcrumb .ant-breadcrumb-separator {
              font-size: 12px !important;
              font-weight: 500 !important;
            }
            
            .ant-breadcrumb a {
              font-size: 12px !important;
              font-weight: 500 !important;
            }
          `}
        </style>
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