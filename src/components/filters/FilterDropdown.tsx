import React from 'react';
import { Select, Tooltip } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';

const { OptGroup, Option } = Select;

export interface Option {
  label: string;
  value: string;
}

export interface OptionGroup {
  label: string;
  options: Option[];
}

export type SelectOption = Option | OptionGroup;

interface FilterDropdownProps {
  placeholder: string;
  options: SelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  style?: React.CSSProperties;
  size?: SizeType;
  showOptionTooltip?: boolean;
  dropdownStyle?: React.CSSProperties;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ placeholder, options, value, onChange, style, size, showOptionTooltip = false, dropdownStyle }) => {
  const renderLabel = (label: string) => {
    if (showOptionTooltip) {
      return <Tooltip title={label} placement="right">{label}</Tooltip>;
    }
    return label;
  };

  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{ minWidth: 140, ...style }}
      allowClear
      showSearch
      optionFilterProp="label"
      size={size}
      dropdownStyle={dropdownStyle}
    >
      {options.map(opt => {
        if ('options' in opt) {
          return (
            <OptGroup key={opt.label} label={opt.label}>
              {opt.options.map(child => (
                <Option key={child.value} value={child.value} label={child.label}>
                  {renderLabel(child.label)}
                </Option>
              ))}
            </OptGroup>
          );
        }
        return (
          <Option key={opt.value} value={opt.value} label={opt.label}>
            {renderLabel(opt.label)}
          </Option>
        );
      })}
    </Select>
  );
};

export default FilterDropdown; 