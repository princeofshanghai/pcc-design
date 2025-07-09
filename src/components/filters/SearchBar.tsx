import React from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

interface SearchBarProps {
  placeholder: string;
  onChange: (value: string) => void;
  style?: React.CSSProperties;
  size?: SizeType;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder, onChange, style, size }) => {
  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={style}
      allowClear
      prefix={<Search size={16} color={'rgba(0,0,0,.25)'} />}
      size={size}
    />
  );
};

export default SearchBar; 