import React, { useState } from 'react';
import { Select, Tooltip } from 'antd';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { useTruncationDetection } from '../../hooks/useTruncationDetection';
import { toSentenceCase } from '../../utils/formatters';

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
  
  // Single-select mode (existing)
  value?: string | null;
  onChange?: (value: string | null) => void;
  
  // Multi-select mode (new)
  multiSelect?: boolean;
  multiValue?: string[];
  onMultiChange?: (values: string[]) => void;
  
  // Common props
  style?: React.CSSProperties;
  size?: SizeType;
  showOptionTooltip?: boolean;
  dropdownStyle?: React.CSSProperties;
  className?: string;
}

// Component for dropdown options with smart tooltips
const DropdownOption: React.FC<{ 
  label: string; 
  showTooltip?: boolean;
}> = ({ label, showTooltip = false }) => {
  const { isTruncated, textRef } = useTruncationDetection(label);

  // Parse label to separate text and count
  const parseLabel = (fullLabel: string) => {
    const countMatch = fullLabel.match(/^(.+?)\s*\((\d+)\)$/);
    if (countMatch) {
      return {
        text: countMatch[1].trim(),
        count: countMatch[2]
      };
    }
    return { text: fullLabel, count: null };
  };

  const { text, count } = parseLabel(label);

  if (!showTooltip) {
    return (
      <span style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <span>{text}</span>
        {count && (
          <span style={{ 
            fontSize: '11px', 
            color: '#999', 
            marginLeft: '8px',
            fontWeight: 400
          }}>
            {count}
          </span>
        )}
      </span>
    );
  }

  const content = (
    <span 
      ref={textRef as React.RefObject<HTMLSpanElement>}
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <span style={{ 
        overflow: 'hidden', 
        textOverflow: 'ellipsis', 
        whiteSpace: 'nowrap',
        flex: 1
      }}>
        {text}
      </span>
      {count && (
        <span style={{ 
          fontSize: '11px', 
          color: '#999', 
          marginLeft: '8px',
          fontWeight: 400,
          flexShrink: 0
        }}>
          {count}
        </span>
      )}
    </span>
  );

  if (isTruncated) {
    return (
      <Tooltip title={text} placement="right">
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
  multiSelect = false,
  multiValue,
  onMultiChange,
  style, 
  size, 
  showOptionTooltip = false, 
  dropdownStyle,
  className 
}) => {
  // State for managing search input independently
  const [searchValue, setSearchValue] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  
  // Apply sentence casing to placeholder for consistency
  const formattedPlaceholder = toSentenceCase(placeholder);
  
  // Determine what placeholder to show based on state
  const getDisplayPlaceholder = () => {
    if (isOpen && searchValue === '') {
      return 'Search...';
    }
    return formattedPlaceholder;
  };
  
  // Handle search input changes
  const handleSearch = (searchText: string) => {
    setSearchValue(searchText);
  };
  
  // Handle dropdown visibility changes
  const handleDropdownVisibleChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset search when dropdown closes
      setSearchValue('');
    }
  };

  // Multi-select mode
  if (multiSelect) {
    return (
      <Select
        mode="multiple"
        value={multiValue}
        onChange={onMultiChange}
        placeholder={getDisplayPlaceholder()}
        className={className}
        style={{ 
          minWidth: 140, 
          ...style
        }}
        allowClear
        showSearch
        searchValue={searchValue}
        onSearch={handleSearch}
        onDropdownVisibleChange={handleDropdownVisibleChange}
        optionFilterProp="label"
        size={size}
        dropdownStyle={dropdownStyle}
        maxTagCount={2}
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
  }

  // Single-select mode (existing behavior)
  return (
    <Select
      value={value}
      onChange={onChange}
      placeholder={getDisplayPlaceholder()}
      className={className}
      style={{ 
        minWidth: 140, 
        ...style
      }}
      allowClear
      showSearch
      searchValue={searchValue}
      onSearch={handleSearch}
      onDropdownVisibleChange={handleDropdownVisibleChange}
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