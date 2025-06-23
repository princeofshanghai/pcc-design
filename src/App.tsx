import React from 'react';
import { Layout, Menu, Typography, Avatar, Space, Badge, Row, Col, Statistic, ConfigProvider } from 'antd';
import {
  DashboardOutlined,
  TeamOutlined,
  ProjectOutlined,
  SettingOutlined,
  BellOutlined,
  UserOutlined,
  SearchOutlined,
  PlusOutlined
} from '@ant-design/icons';
import './App.css';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

// Shadcn/ui "Blue" theme tokens
const blueTheme = {
  token: {
    // Primary & Semantic Colors (from Shadcn's "Blue" theme)
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    
    // Backgrounds
    colorBgLayout: '#f8fafc',
    colorBgContainer: '#ffffff',
    
    // Borders & Outlines
    colorBorder: '#e2e8f0', // slate-200
    colorBorderSecondary: '#f1f5f9', // slate-100
    controlOutline: 'rgba(59, 130, 246, 0.4)', // Faded blue for focus rings
    
    // Text
    colorText: '#0f172a', // slate-900
    colorTextSecondary: '#64748b', // slate-500
    colorTextTertiary: '#94a3b8', // slate-400

    // Other tokens from previous theme to keep consistency
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    margin: 16,
    marginLG: 24,
    marginSM: 12,
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontWeightStrong: 600,
  },
};

function App() {
  return (
    <ConfigProvider theme={blueTheme}>
      <Layout style={{ minHeight: '100vh', background: blueTheme.token.colorBgLayout }}>
        {/* Header */}
        <Header style={{ 
          background: blueTheme.token.colorBgContainer, 
          padding: '0 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          borderBottom: `1px solid ${blueTheme.token.colorBorder}`,
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              background: blueTheme.token.colorPrimary, 
              color: 'white', 
              padding: '8px 12px', 
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '16px'
            }}>
              PCC Design
            </div>
          </div>
          
          <Space size="large">
            <SearchOutlined style={{ fontSize: '18px', color: blueTheme.token.colorTextSecondary }} />
            <Badge count={3}>
              <BellOutlined style={{ fontSize: '18px', color: blueTheme.token.colorTextSecondary }} />
            </Badge>
            <Avatar icon={<UserOutlined />} />
          </Space>
        </Header>

        <Layout>
          {/* Sidebar */}
          <Sider width={250} style={{ background: blueTheme.token.colorBgContainer, borderRight: `1px solid ${blueTheme.token.colorBorder}` }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['dashboard']}
              style={{ 
                height: '100%', 
                borderRight: 0, 
                paddingTop: '16px',
                background: blueTheme.token.colorBgContainer
              }}
            >
              <Menu.Item key="dashboard" icon={<DashboardOutlined />}>
                Dashboard
              </Menu.Item>
              <Menu.Item key="team" icon={<TeamOutlined />}>
                Team Management
              </Menu.Item>
              <Menu.Item key="projects" icon={<ProjectOutlined />}>
                Projects
              </Menu.Item>
              <Menu.Item key="settings" icon={<SettingOutlined />}>
                Settings
              </Menu.Item>
            </Menu>
          </Sider>

          {/* Main Content */}
          <Layout style={{ padding: '24px' }}>
            <Content style={{ background: 'transparent' }}>
              <div style={{ marginBottom: '32px' }}>
                <Title level={2} style={{ margin: 0, color: blueTheme.token.colorText }}>Dashboard</Title>
                <Text type="secondary" style={{ fontSize: '16px' }}>Welcome back! Here's an overview of your team's performance.</Text>
              </div>

              {/* Stats Section - Flat Design */}
              <div style={{ 
                background: blueTheme.token.colorBgContainer, 
                padding: '24px', 
                borderRadius: '8px',
                border: `1px solid ${blueTheme.token.colorBorder}`,
                marginBottom: '32px'
              }}>
                <Row gutter={[24, 24]}>
                  <Col xs={24} sm={12} lg={6}>
                    <div style={{ textAlign: 'center' }}>
                      <Statistic
                        title={<span style={{ color: blueTheme.token.colorTextSecondary, fontSize: '14px' }}>Active Projects</span>}
                        value={12}
                        valueStyle={{ color: blueTheme.token.colorPrimary, fontSize: '32px', fontWeight: 600 }}
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div style={{ textAlign: 'center' }}>
                      <Statistic
                        title={<span style={{ color: blueTheme.token.colorTextSecondary, fontSize: '14px' }}>Team Members</span>}
                        value={24}
                        valueStyle={{ color: blueTheme.token.colorSuccess, fontSize: '32px', fontWeight: 600 }}
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div style={{ textAlign: 'center' }}>
                      <Statistic
                        title={<span style={{ color: blueTheme.token.colorTextSecondary, fontSize: '14px' }}>Tasks Completed</span>}
                        value={156}
                        valueStyle={{ color: blueTheme.token.colorWarning, fontSize: '32px', fontWeight: 600 }}
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={12} lg={6}>
                    <div style={{ textAlign: 'center' }}>
                      <Statistic
                        title={<span style={{ color: blueTheme.token.colorTextSecondary, fontSize: '14px' }}>Pending Reviews</span>}
                        value={8}
                        valueStyle={{ color: blueTheme.token.colorError, fontSize: '32px', fontWeight: 600 }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Quick Actions & Recent Activity - Flat Design */}
              <Row gutter={[24, 24]}>
                <Col xs={24} lg={12}>
                  <div style={{ 
                    background: blueTheme.token.colorBgContainer, 
                    padding: '24px', 
                    borderRadius: '8px',
                    border: `1px solid ${blueTheme.token.colorBorder}`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: '20px'
                    }}>
                      <Title level={4} style={{ margin: 0, color: blueTheme.token.colorText }}>Quick Actions</Title>
                      <PlusOutlined style={{ color: blueTheme.token.colorTextSecondary, fontSize: '16px' }} />
                    </div>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <div style={{ 
                        padding: '16px', 
                        border: `1px solid ${blueTheme.token.colorBorder}`, 
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: blueTheme.token.colorBgContainer
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = blueTheme.token.colorPrimary;
                        e.currentTarget.style.background = blueTheme.token.colorBorderSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = blueTheme.token.colorBorder;
                        e.currentTarget.style.background = blueTheme.token.colorBgContainer;
                      }}>
                        <Text strong style={{ color: blueTheme.token.colorText }}>Create New Project</Text>
                      </div>
                      <div style={{ 
                        padding: '16px', 
                        border: `1px solid ${blueTheme.token.colorBorder}`, 
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: blueTheme.token.colorBgContainer
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = blueTheme.token.colorPrimary;
                        e.currentTarget.style.background = blueTheme.token.colorBorderSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = blueTheme.token.colorBorder;
                        e.currentTarget.style.background = blueTheme.token.colorBgContainer;
                      }}>
                        <Text strong style={{ color: blueTheme.token.colorText }}>Add Team Member</Text>
                      </div>
                      <div style={{ 
                        padding: '16px', 
                        border: `1px solid ${blueTheme.token.colorBorder}`, 
                        borderRadius: '6px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: blueTheme.token.colorBgContainer
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = blueTheme.token.colorPrimary;
                        e.currentTarget.style.background = blueTheme.token.colorBorderSecondary;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = blueTheme.token.colorBorder;
                        e.currentTarget.style.background = blueTheme.token.colorBgContainer;
                      }}>
                        <Text strong style={{ color: blueTheme.token.colorText }}>Schedule Review</Text>
                      </div>
                    </Space>
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <div style={{ 
                    background: blueTheme.token.colorBgContainer, 
                    padding: '24px', 
                    borderRadius: '8px',
                    border: `1px solid ${blueTheme.token.colorBorder}`
                  }}>
                    <Title level={4} style={{ margin: '0 0 20px 0', color: blueTheme.token.colorText }}>Recent Activity</Title>
                    <Space direction="vertical" style={{ width: '100%' }} size="middle">
                      <div style={{ 
                        padding: '16px', 
                        border: `1px solid ${blueTheme.token.colorBorderSecondary}`, 
                        borderRadius: '6px',
                        background: blueTheme.token.colorBorderSecondary
                      }}>
                        <Text strong style={{ color: blueTheme.token.colorText, display: 'block' }}>Project "Design System" updated</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>2 hours ago</Text>
                      </div>
                      <div style={{ 
                        padding: '16px', 
                        border: `1px solid ${blueTheme.token.colorBorderSecondary}`, 
                        borderRadius: '6px',
                        background: blueTheme.token.colorBorderSecondary
                      }}>
                        <Text strong style={{ color: blueTheme.token.colorText, display: 'block' }}>New team member added</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>4 hours ago</Text>
                      </div>
                      <div style={{ 
                        padding: '16px', 
                        border: `1px solid ${blueTheme.token.colorBorderSecondary}`, 
                        borderRadius: '6px',
                        background: blueTheme.token.colorBorderSecondary
                      }}>
                        <Text strong style={{ color: blueTheme.token.colorText, display: 'block' }}>Review completed for "Mobile App"</Text>
                        <Text type="secondary" style={{ fontSize: '12px' }}>1 day ago</Text>
                      </div>
                    </Space>
                  </div>
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;
