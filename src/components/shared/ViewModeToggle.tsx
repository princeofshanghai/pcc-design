import React from 'react';
import { theme } from 'antd';

interface ViewModeOption {
  key: string;
  label: string;
  icon: React.ReactNode;
}

interface ViewModeToggleProps {
  value: string;
  onChange: (value: string) => void;
  options: ViewModeOption[];
  storageKey?: string; // Optional localStorage key for persistence
}

const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  value,
  onChange,
  options,
  storageKey
}) => {
  const { token } = theme.useToken();

  const handleOptionClick = (optionKey: string) => {
    onChange(optionKey);
    
    // Save to localStorage if storageKey is provided
    if (storageKey) {
      localStorage.setItem(storageKey, optionKey);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      gap: '8px',
      width: '288px' // Fixed width to prevent menu width changes
    }}>
      {options.map((option) => {
        const isSelected = value === option.key;
        
        return (
          <div
            key={option.key}
            onClick={() => handleOptionClick(option.key)}
            style={{
              flex: 1,
              padding: '16px 12px',
              border: `1px solid ${isSelected ? token.colorPrimary : token.colorBorder}`,
              borderRadius: token.borderRadius,
              backgroundColor: isSelected ? token.colorPrimaryBg : token.colorBgContainer,
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s ease',
              userSelect: 'none'
            }}
            onMouseEnter={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = token.colorPrimary;
                e.currentTarget.style.backgroundColor = token.colorPrimaryBg;
              }
            }}
            onMouseLeave={(e) => {
              if (!isSelected) {
                e.currentTarget.style.borderColor = token.colorBorder;
                e.currentTarget.style.backgroundColor = token.colorBgContainer;
              }
            }}
          >
            <div style={{ 
              color: isSelected ? token.colorPrimary : token.colorText,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {option.icon}
            </div>
            <span style={{
              fontSize: token.fontSizeSM,
              color: isSelected ? token.colorPrimary : token.colorText,
              fontWeight: isSelected ? 500 : 400,
              textAlign: 'center',
              whiteSpace: 'nowrap' // Prevent text wrapping
            }}>
              {option.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default ViewModeToggle;
