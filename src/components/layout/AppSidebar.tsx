import { Layout, Menu, Button, theme, Tooltip, Typography } from 'antd';
import { PanelLeft, Box, SquareSlash, Folder } from 'lucide-react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import LinkedInLogo from '../../assets/linkedin-logo.svg';
import { folderStructure } from '../../utils/navigation-config';
import { toSentenceCase, toTitleCase } from '../../utils/formatters/text';
import { colors, spacing } from '../../theme';

const { Sider } = Layout;
const { Text } = Typography;

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
        color: colors.gray[500],
        padding: `0 ${spacing.xxxl}px`,
        marginTop: isFirst ? `${spacing.xxxl}px` : `${spacing.xxxl + spacing.lg}px`,
        marginBottom: `${spacing.lg}px`,
        textTransform: 'none'
      }}
    >
      {title}
    </div>
  );
};

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

    // Create ResizeObserver to watch for layout changes
    const observer = new ResizeObserver(checkTruncation);
    if (contentRef.current) {
      observer.observe(contentRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [collapsed, text]);

  const content = (
    <div ref={contentRef} style={{ width: '100%', minWidth: 0 }}>
      {children}
    </div>
  );

  // Show tooltip only when text is actually truncated and not collapsed
  if (shouldShowTooltip && !collapsed) {
    return (
      <Tooltip
        title={text}
        placement="right"
        overlayStyle={{ zIndex: 9999 }}
      >
        {content}
      </Tooltip>
    );
  }

  return content;
};

// Helper function to generate menu structure with sections
const generateMenuStructure = (collapsed: boolean) => {
  // Create the menu structure with section groupings
  const menuItems = [
    // Catalog Section
    {
      key: 'products',
      label: 'Products',
      icon: <Box size={14} />,
      className: 'sidebar-products-menu-item',
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
            if (lobA === 'Other') return 1;
            if (lobB === 'Other') return -1;
            return lobA.localeCompare(lobB);
          })
          .map(([lob, folders]) => ({
            key: lob.toLowerCase(),
            className: 'sidebar-lob-menu-item',
            label: (
              <SidebarMenuItem text={toSentenceCase(lob)} collapsed={collapsed}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Folder size={14} color="#999" />
                  <span>{toSentenceCase(lob)}</span>
                </span>
              </SidebarMenuItem>
            ),
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
    {
      key: 'offers',
      label: (
        <SidebarMenuItem text="Offers" collapsed={collapsed}>
          <Link to="/offers">Offers</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'offer-groups',
      label: (
        <SidebarMenuItem text="Offer Groups" collapsed={collapsed}>
          <Link to="/offer-groups">Offer Groups</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'rulesets',
      label: (
        <SidebarMenuItem text="Rulesets" collapsed={collapsed}>
          <Link to="/rulesets">Rulesets</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'calculation-schemes',
      label: (
        <SidebarMenuItem text="Calculation Schemes" collapsed={collapsed}>
          <Link to="/calculation-schemes">Calculation Schemes</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'platform-entity-mapping',
      label: (
        <SidebarMenuItem text="Platform Entity Mapping" collapsed={collapsed}>
          <Link to="/platform-entity-mapping">Platform Entity Mapping</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'change-requests',
      label: (
        <SidebarMenuItem text="Change Requests" collapsed={collapsed}>
          <Link to="/change-requests">Change Requests</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    },
    {
      key: 'picasso-npi',
      label: (
        <SidebarMenuItem text="Picasso NPI" collapsed={collapsed}>
          <Link to="/picasso-npi">Picasso NPI</Link>
        </SidebarMenuItem>
      ),
      icon: <SquareSlash size={14} />
    }
  ];

  return menuItems;
};

interface AppSidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onManualToggle: () => void;
  getCatalogSelectedKeys: () => string[];
  getLogicSelectedKeys: () => string[];
  getIntegrationsSelectedKeys: () => string[];
  getChangeManagementSelectedKeys: () => string[];
}

const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  onCollapse,
  onManualToggle,
  getCatalogSelectedKeys,
  getLogicSelectedKeys,
  getIntegrationsSelectedKeys,
  getChangeManagementSelectedKeys
}) => {
  const { token } = theme.useToken();

  // Generate menu structure from mock data
  const menuItems = useMemo(() => generateMenuStructure(collapsed), [collapsed]);

  return (
    <Sider
      className="sidebar-container"
      width={240}
      collapsedWidth={64}
      collapsed={collapsed}
      onCollapse={onCollapse}
      style={{
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 1000,
        background: token.colorBgLayout,
        borderRight: `1px solid ${colors.gray[200]}`,
        overflow: 'auto'
      }}
    >
      <div className="sidebar-content-wrapper">
        {/* Logo and toggle section */}
        <div style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? `0 ${spacing.xl}px` : `0 ${spacing.xxxl}px`
        }}>
          {!collapsed && (
            <Link 
              to="/" 
              className="sidebar-logo-link"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: `${spacing.xl}px`,
                textDecoration: 'none',
                color: 'inherit',
                minWidth: 0
              }}
            >
              <img 
                src={LinkedInLogo} 
                alt="LinkedIn" 
                style={{ 
                  width: '24px', 
                  height: '24px',
                  flexShrink: 0
                }} 
              />
              <Text 
                strong 
                style={{ 
                  fontSize: '16px',
                  lineHeight: '20px',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                PCC
              </Text>
            </Link>
          )}
          
          <Button
            type="text"
            icon={<PanelLeft size={16} />}
            onClick={onManualToggle}
            style={{
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: token.colorTextSecondary,
              flexShrink: 0,
              marginLeft: collapsed ? 0 : 'auto'
            }}
          />
        </div>
        
        <div>
          {/* Catalog Section */}
          <SectionTitle title="Catalog" collapsed={collapsed} isFirst={true} />
          <Menu 
            mode="inline" 
            selectedKeys={getCatalogSelectedKeys()}
            defaultOpenKeys={['products']}
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
            items={menuItems.slice(5, 6)} // Platform Entity Mapping
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
    </Sider>
  );
};

export default AppSidebar;
