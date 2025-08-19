import React from 'react';
import { Input } from 'antd';
import { Search } from 'lucide-react';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import './SearchBar.css';

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
      style={{
        border: '1px solid #e5e7eb', // Gray-200 border
        backgroundColor: '#f9fafb', // Gray-50 background
        ...style
      }}
      allowClear
      prefix={<Search size={16} color={'#9ca3af'} />} // Gray-400 search icon
      size={size}
      className="search-bar-input"
    />
  );
};

export default SearchBar; 