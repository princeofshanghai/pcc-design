import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

const { Content } = Layout;

interface AppContentProps {
  contentWidth: string;
}

const AppContent: React.FC<AppContentProps> = ({
  contentWidth
}) => {
  return (
    <Content className="app-content">
      <div className="content-container" style={{ maxWidth: contentWidth }}>
        <Outlet />
      </div>
    </Content>
  );
};

export default AppContent;
