import React, { useState } from 'react';
import { Dropdown, theme } from 'antd';
import type { MenuProps, ButtonProps } from 'antd';
import { ChevronDown, Check } from 'lucide-react';

export interface ModeSelectorOption {
  key: string;
  label: string;
  description: string;
}

export interface ModeSelectorButtonProps {
  options: ModeSelectorOption[];
  defaultSelected: string;
  onExecute: (selectedKey: string) => void;
  onSelectionChange?: (selectedKey: string) => void;
  buttonProps?: Omit<ButtonProps, 'onClick' | 'icon'>; // Exclude onClick and icon since we control those
  size?: 'small' | 'middle' | 'large';
  disabled?: boolean;
}

const ModeSelectorButton: React.FC<ModeSelectorButtonProps> = ({
  options,
  defaultSelected,
  onExecute,
  onSelectionChange,
  buttonProps = {},
  size = 'middle',
  disabled = false,
}) => {
  const { token } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState<string>(defaultSelected);

  // Handle action mode change from dropdown
  const handleSelectionChange = (key: string) => {
    setSelectedKey(key);
    onSelectionChange?.(key);
  };

  // Handle main button click - execute current selection
  const handleExecute = () => {
    onExecute(selectedKey);
  };

  // Find the currently selected option to display its label
  const selectedOption = options.find(option => option.key === selectedKey);
  const buttonText = selectedOption?.label || options[0]?.label || 'Select';

  // Build dropdown menu items
  const menuItems: MenuProps['items'] = options.map(option => ({
    key: option.key,
    label: (
      <div style={{ padding: '4px 0', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ 
          width: '16px', 
          height: '16px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          {selectedKey === option.key && <Check size={14} color={token.colorPrimary} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ color: token.colorText }}>
            {option.label}
          </div>
          <div style={{ 
            fontSize: token.fontSizeSM, 
            color: token.colorTextSecondary,
            marginTop: '2px'
          }}>
            {option.description}
          </div>
        </div>
      </div>
    ),
    onClick: () => handleSelectionChange(option.key),
  }));

  return (
    <Dropdown.Button
      {...buttonProps}
      icon={<ChevronDown size={14} />}
      menu={{ items: menuItems }}
      onClick={handleExecute}
      size={size}
      disabled={disabled}
    >
      {buttonText}
    </Dropdown.Button>
  );
};

export default ModeSelectorButton;
