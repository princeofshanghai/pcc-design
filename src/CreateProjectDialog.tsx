import { Modal, Form, Input, Select, DatePicker, Button } from 'antd';
import { useState } from 'react';

interface CreateProjectDialogProps {
  open: boolean;
  onClose: () => void;
}

const { TextArea } = Input;

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Create project"
      open={open}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical">
        <Form.Item label="Project Name" name="name" rules={[{ required: true, message: 'Please enter a project name' }]}> 
          <Input placeholder="Enter project name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <TextArea rows={3} placeholder="Describe your project..." />
        </Form.Item>
        <Form.Item label="Category" name="category">
          <Select placeholder="Select category">
            <Select.Option value="design">Design</Select.Option>
            <Select.Option value="development">Development</Select.Option>
            <Select.Option value="marketing">Marketing</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item label="Due Date" name="dueDate">
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" block onClick={onClose}>Create Project</Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateProjectDialog; 