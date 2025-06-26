import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  placeholder: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onChange, style }) => {
  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      allowClear
      prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
    />
  );
};

export default SearchBar; 