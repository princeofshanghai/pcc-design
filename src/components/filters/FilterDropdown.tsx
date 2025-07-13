import React from 'react';
import { Select, Tooltip } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useTruncationDetection } from '../../hooks/useTruncationDetection';

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

// Component for dropdown options with smart tooltips
const DropdownOption: React.FC<{ 
  label: string; 
  showTooltip?: boolean;
}> = ({ label, showTooltip = false }) => {
  const { isTruncated, textRef } = useTruncationDetection(label, 200); // Approximate dropdown width

  if (!showTooltip) {
    return <span>{label}</span>;
  }

  const content = (
    <span ref={textRef} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {label}
    </span>
  );

  if (isTruncated) {
    return (
      <Tooltip title={label} placement="right">
        {content}
      </Tooltip>
    );
  }

  return content;
};

const FilterDropdown: React.FC<FilterDropdownProps> = ({ 
  placeholder, 
  options, 
  value, 
  onChange, 
  style, 
  size, 
  showOptionTooltip = false, 
  dropdownStyle 
}) => {
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
                  <DropdownOption label={child.label} showTooltip={showOptionTooltip} />
                </Option>
              ))}
            </OptGroup>
          );
        }
        return (
          <Option key={opt.value} value={opt.value} label={opt.label}>
            <DropdownOption label={opt.label} showTooltip={showOptionTooltip} />
          </Option>
        );
      })}
    </Select>
  );
};

export default FilterDropdown; 