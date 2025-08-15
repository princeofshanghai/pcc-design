import { Layout, Avatar, Breadcrumb, Button, theme, Space, Tooltip } from 'antd';
import { User, ChevronRight, BookMarked } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { zIndex } from '../../theme';

const { Header } = Layout;

interface AppHeaderProps {
  collapsed: boolean;
  isScrolled: boolean;
  breadcrumbItems: React.ReactNode[];
}

const AppHeader: React.FC<AppHeaderProps> = ({
  collapsed,
  isScrolled,
  breadcrumbItems
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <Header 
      className={`app-header ${collapsed ? 'collapsed' : 'expanded'} ${isScrolled ? 'scrolled' : 'not-scrolled'}`}
      style={{ 
        backgroundColor: token.colorBgContainer,
        zIndex: zIndex.header
      }}
    >
      <Breadcrumb 
        separator={<ChevronRight size={16} className="breadcrumb-separator" />}
      >
        {breadcrumbItems}
      </Breadcrumb>
      <Space size={16}>
        <Tooltip title="Attribute dictionary" placement="bottom" overlayStyle={{ zIndex: 9999 }}>
          <Button
            type="text"
            icon={<BookMarked size={16} />}
            onClick={() => navigate('/attribute-dictionary')}
            className={`header-button ${location.pathname === '/attribute-dictionary' ? 'active' : 'inactive'}`}
            style={{
              color: location.pathname === '/attribute-dictionary' ? token.colorPrimary : '#666',
              backgroundColor: location.pathname === '/attribute-dictionary' ? `${token.colorPrimary}10` : 'transparent'
            }}
          />
        </Tooltip>
        <Avatar size="small" icon={<User size={16} />} />
      </Space>
    </Header>
  );
};

export default AppHeader;
