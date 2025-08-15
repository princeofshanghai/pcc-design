import { Layout, Breadcrumb, theme, Grid } from 'antd';
import { useState, useEffect, useMemo } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useBreadcrumb } from '../../context/BreadcrumbContext';
import { useLayout } from '../../context/LayoutContext';
import AppSidebar from './AppSidebar';
import AppHeader from './AppHeader';
import AppContent from './AppContent';
import './Layout.css';

const AppLayout = () => {
  const [manuallyToggled, setManuallyToggled] = useState(false);
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



  // Scroll detection for header styling
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function to determine the selected menu key based on current path
  const getSelectedMenuKey = (pathname: string): string[] => {
    const segments = pathname.split('/').filter(Boolean);
    
    if (pathname === '/') return ['all-products'];
    if (pathname === '/attribute-dictionary') return [];
    if (pathname.startsWith('/product/')) return ['all-products'];
    if (pathname.startsWith('/sku/')) return ['all-products'];
    if (pathname.startsWith('/price-group/')) return ['all-products'];
    if (pathname.startsWith('/change-request/')) return ['change-requests'];
    if (pathname === '/change-requests') return ['change-requests'];
    if (pathname.startsWith('/folder/')) {
      const folderKey = segments[1];
      return [folderKey];
    }
    
    return [pathname.slice(1)];
  };

  // Generate breadcrumb items based on current location and context
  const breadcrumbItems = useMemo(() => {
    const items = [
      <Breadcrumb.Item key="home">
        <Link to="/">Products</Link>
      </Breadcrumb.Item>
    ];

    if (location.pathname === '/attribute-dictionary') {
      items.push(
        <Breadcrumb.Item key="attribute-dictionary">
          Attribute Dictionary
        </Breadcrumb.Item>
      );
    } else if (location.pathname.startsWith('/product/') && productName) {
      items.push(
        <Breadcrumb.Item key="product">
          {productName}
        </Breadcrumb.Item>
      );
    } else if (location.pathname.startsWith('/sku/') && skuId) {
      if (productName) {
        items.push(
          <Breadcrumb.Item key="product">
            <Link to={`/product/${location.pathname.split('/')[2]}`}>
              {productName}
            </Link>
          </Breadcrumb.Item>
        );
      }
      items.push(
        <Breadcrumb.Item key="sku">
          SKU {skuId}
        </Breadcrumb.Item>
      );
    } else if (location.pathname.startsWith('/price-group/') && priceGroupId) {
      items.push(
        <Breadcrumb.Item key="price-group">
          {priceGroupName || `Price Group ${priceGroupId}`}
        </Breadcrumb.Item>
      );
    } else if (location.pathname.startsWith('/change-request/')) {
      items.push(
        <Breadcrumb.Item key="change-requests">
          <Link to="/change-requests">Change Requests</Link>
        </Breadcrumb.Item>
      );
      const requestId = location.pathname.split('/')[2];
      if (requestId) {
        items.push(
          <Breadcrumb.Item key="change-request">
            Request #{requestId}
          </Breadcrumb.Item>
        );
      }
    } else if (location.pathname === '/change-requests') {
      items.push(
        <Breadcrumb.Item key="change-requests">
          Change Requests
        </Breadcrumb.Item>
      );
    }

    return items;
  }, [location.pathname, productName, skuId, priceGroupId, priceGroupName]);

  // Menu selection helpers
  const getCatalogSelectedKeys = () => {
    return getSelectedMenuKey(location.pathname);
  };

  const getLogicSelectedKeys = () => {
    return getSelectedMenuKey(location.pathname);
  };

  const getIntegrationsSelectedKeys = () => {
    return getSelectedMenuKey(location.pathname);
  };

  // Sidebar event handlers
  const handleSidebarCollapse = (collapsed: boolean) => {
    setContextCollapsed(collapsed);
  };

  const handleManualToggle = () => {
    setContextCollapsed(!collapsed);
    setManuallyToggled(true);
  };

  return (
    <Layout>
      <AppSidebar
        collapsed={collapsed}
        onCollapse={handleSidebarCollapse}
        onManualToggle={handleManualToggle}
        getCatalogSelectedKeys={getCatalogSelectedKeys}
        getLogicSelectedKeys={getLogicSelectedKeys}
        getIntegrationsSelectedKeys={getIntegrationsSelectedKeys}
      />
      <Layout className={`app-layout-main ${collapsed ? 'collapsed' : ''}`} style={{ backgroundColor: token.colorBgContainer }}>
        <AppHeader
          collapsed={collapsed}
          isScrolled={isScrolled}
          breadcrumbItems={breadcrumbItems}
        />
        <AppContent
          contentWidth={contentWidth}
        />
      </Layout>
    </Layout>
  );
};

export default AppLayout;