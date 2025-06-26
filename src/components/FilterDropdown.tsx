import React from 'react';
import { Select, Typography, Space } from 'antd';

const { Text } = Typography;

interface FilterDropdownProps {
  label: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, options, placeholder, onChange, style }) => {
  return (
    <Space align="center" style={style}>
      <Text>{label}:</Text>
      <Select
        placeholder={placeholder}
        onChange={onChange}
        style={{ minWidth: 120 }}
        allowClear
      >
        {options.map(option => (
          <Select.Option key={option} value={option}>
            {option}
          </Select.Option>
        ))}
      </Select>
    </Space>
  );
};

export default FilterDropdown; 