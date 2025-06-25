import { useState } from 'react';
import { Button, Typography, Input, Card, Space, Table, Switch, Alert, Tabs, Tag, Progress, DatePicker, Avatar, List } from 'antd';
import CreateProjectDialog from '../CreateProjectDialog';

const { Title, Paragraph, Text } = Typography;

const dataSource = [
  { key: '1', name: 'Alice', age: 28, email: 'alice@example.com', status: 'Active' },
  { key: '2', name: 'Bob', age: 34, email: 'bob@example.com', status: 'Inactive' },
];

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name', render: (text: string) => <b>{text}</b> },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Status', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
    )
  },
];

const listData = [
  {
    title: 'Design System',
    description: 'Update color palette and typography for new branding.',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    title: 'Frontend Refactor',
    description: 'Refactor dashboard layout for better accessibility.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
  }
];

function Home() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <Title level={1}>Product catalog</Title>
      <Paragraph type="secondary">
        Welcome to your team's dashboard. Here you can manage projects, view analytics, and collaborate with your team—all styled with Geist and Ant Design.
      </Paragraph>

      <Title level={2}>Quick Actions</Title>
      <Paragraph>
        Use these actions to get started quickly. You can create new projects, invite team members, or toggle features.
      </Paragraph>
      <Card>
        <Space>
          <Button type="primary" onClick={() => setDialogOpen(true)}>Create Project</Button>
          <Button>Invite Member</Button>
          <Switch defaultChecked />
          <Text type="secondary">Enable notifications</Text>
        </Space>
      </Card>

      <Title level={2} style={{ marginTop: 40 }}>Team Overview</Title>
      <Paragraph>
        Here's a summary of your team members and their current status.
      </Paragraph>
      <Card>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </Card>

      <Title level={3} style={{ marginTop: 32 }}>Recent Activity</Title>
      <Paragraph>
        Stay up to date with the latest changes and updates from your team.
      </Paragraph>
      <Card>
        <List
          itemLayout="horizontal"
          dataSource={listData}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={item.avatar} />}
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Card>

      <Title level={2} style={{ marginTop: 40 }}>Analytics</Title>
      <Paragraph>
        Track your progress and see how your projects are performing.
      </Paragraph>
      <Card>
        <Tabs
          defaultActiveKey="1"
          items={[
            { key: '1', label: 'Progress', children: <Progress percent={70} status="active" /> },
            { key: '2', label: 'Input', children: <Input placeholder="Type a note..." /> },
            { key: '3', label: 'Date', children: <DatePicker /> }
          ]}
        />
      </Card>

      <Title level={3} style={{ marginTop: 32 }}>System Alerts</Title>
      <Alert message="All systems operational. No issues detected." type="success" showIcon style={{ marginBottom: 16 }} />
      <Alert message="Reminder: Update your project documentation." type="info" showIcon />
      
      <CreateProjectDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </div>
  );
}

export default Home; 