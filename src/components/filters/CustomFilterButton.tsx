import React, { useState } from 'react';
import { Button, Dropdown, Checkbox, Radio, Input, Space, theme, Tag } from 'antd';
import { ChevronDown, X, Search, CirclePlus } from 'lucide-react';
import type { SizeType } from 'antd/es/config-provider/SizeContext';
import { toSentenceCase } from '../../utils/formatters';
import { TAILWIND_COLORS } from '../../theme';

// Create CSS for hover states - this will be injected once per component instance
const createFilterButtonStyles = (primaryColor: string) => `
  .custom-filter-button {
    transition: all 0.2s ease;
  }
  
  .custom-filter-button.has-selections {
    border: 1px solid ${TAILWIND_COLORS.gray[300]} !important;
  }
  
  .custom-filter-button.no-selections {
    border: 1px dashed ${TAILWIND_COLORS.gray[300]} !important;
  }
  
  .custom-filter-button:hover:not(:disabled) {
    border-color: ${primaryColor} !important;
    color: ${primaryColor} !important;
  }
  
  .custom-filter-button:focus:not(:disabled) {
    border-color: ${primaryColor} !important;
    box-shadow: 0 0 0 2px ${primaryColor}1a !important;
  }
  
  /* Custom thin scrollbar */
  .custom-scrollbar::-webkit-scrollbar {
    width: 6px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
  }
  
  /* Firefox scrollbar */
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
  }
`;

// Reuse the same interfaces from FilterDropdown for compatibility
export interface Option {
  label: string;
  value: string;
}

export interface OptionGroup {
  label: string;
  options: Option[];
}

export type SelectOption = Option | OptionGroup;

interface CustomFilterButtonProps {
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
  disableSearch?: boolean;
  
  // View selector behavior props (new)
  excludeFromClearAll?: boolean;
  hideClearButton?: boolean;
  preventDeselection?: boolean;
  
  // Custom display props
  customDisplayValue?: (value: string | null, multiValue?: string[]) => string;
  icon?: React.ReactNode;
}

const CustomFilterButton: React.FC<CustomFilterButtonProps> = ({
  placeholder,
  options,
  value,
  onChange,
  multiSelect = false,
  multiValue,
  onMultiChange,
  style,
  size = 'middle',
  dropdownStyle,
  className,
  disableSearch = false,
  hideClearButton = false,
  preventDeselection = false,
  customDisplayValue,
  icon
}) => {
  const { token } = theme.useToken();
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = React.useRef<any>(null);

  // Inject styles with theme colors if not already present
  React.useEffect(() => {
    if (typeof document !== 'undefined' && !document.getElementById('custom-filter-button-styles')) {
      const styleElement = document.createElement('style');
      styleElement.id = 'custom-filter-button-styles';
      styleElement.textContent = createFilterButtonStyles(token.colorPrimary);
      document.head.appendChild(styleElement);
    }
  }, [token.colorPrimary]);

  // Auto-focus search input when dropdown opens
  React.useEffect(() => {
    if (isOpen && !disableSearch && searchInputRef.current) {
      // Use setTimeout to ensure the input is rendered before focusing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, disableSearch]);

  // Determine if filter has selections
  const hasSelections = multiSelect ? 
    (multiValue?.length ?? 0) > 0 : 
    value != null;

  // Determine if this is a validity filter (should keep original behavior)
  const isValidityFilter = preventDeselection;

  // Get clean label without count
  const getCleanLabel = (fullLabel: string): string => {
    return fullLabel.replace(/\s*\(\d+\)$/, '');
  };

  // Convert plural words to singular properly
  const getSingularForm = (word: string): string => {
    const lowerWord = word.toLowerCase();
    
    // Handle common plural patterns
    if (lowerWord.endsWith('ies')) {
      // categories → category, companies → company
      return word.slice(0, -3) + 'y';
    } else if (lowerWord.endsWith('ses') || lowerWord.endsWith('ches') || lowerWord.endsWith('shes') || lowerWord.endsWith('xes')) {
      // statuses → status, batches → batch, dishes → dish, boxes → box
      return word.slice(0, -2);
    } else if (lowerWord.endsWith('ves')) {
      // lives → life, knives → knife
      return word.slice(0, -3) + 'fe';
    } else if (lowerWord.endsWith('s') && !lowerWord.endsWith('ss')) {
      // channels → channel, folders → folder (but not "class" → "clas")
      return word.slice(0, -1);
    }
    
    // Return as-is if no plural pattern matches
    return word;
  };

  // Get clean singular filter name from placeholder
  const getFilterName = (placeholder: string): string => {
    // Remove "All " prefix and get the base word
    const baseWord = placeholder.replace(/^All\s+/i, '');
    // Convert to singular
    const singular = getSingularForm(baseWord);
    return toSentenceCase(singular);
  };

  // Generate button text based on selections (without numbers)
  const getButtonText = () => {
    // Use custom display value function if provided
    if (customDisplayValue) {
      return customDisplayValue(value || null, multiValue);
    }
    
    if (multiSelect && multiValue && multiValue.length > 0) {
      const selectedLabels = multiValue.map(val => {
        // Find label for this value in options and clean it of numbers
        for (const opt of options) {
          if ('options' in opt) {
            const found = opt.options.find(child => child.value === val);
            if (found) return getCleanLabel(found.label);
          } else {
            if (opt.value === val) return getCleanLabel(opt.label);
          }
        }
        return val;
      });

      if (selectedLabels.length === 1) {
        return { label: `${getFilterName(placeholder)}:`, values: selectedLabels[0] };
      } else if (selectedLabels.length === 2) {
        return { label: `${getFilterName(placeholder)}:`, values: `${selectedLabels[0]}, ${selectedLabels[1]}` };
      } else {
        return { label: `${getFilterName(placeholder)}:`, values: `${selectedLabels[0]}, ${selectedLabels[1]} +${selectedLabels.length - 2} more` };
      }
    } else if (!multiSelect && value) {
      // Find label for single select value and clean it of numbers
      for (const opt of options) {
        if ('options' in opt) {
          const found = opt.options.find(child => child.value === value);
          if (found) return { label: `${getFilterName(placeholder)}:`, values: getCleanLabel(found.label) };
        } else {
          if (opt.value === value) return { label: `${getFilterName(placeholder)}:`, values: getCleanLabel(opt.label) };
        }
      }
      return { label: `${getFilterName(placeholder)}:`, values: value };
    }

    // For inactive state, use the clean singular form
    return getFilterName(placeholder);
  };

  // Handle dropdown visibility
  const handleDropdownVisibleChange = (visible: boolean) => {
    setIsOpen(visible);
    if (!visible) {
      setSearchText(''); // Reset search when closing
    }
  };

  // Handle clear action
  const handleClear = () => {
    if (multiSelect && onMultiChange) {
      onMultiChange([]);
    } else if (!multiSelect && onChange) {
      onChange(null);
    }
    // Keep dropdown open after clearing
  };

  // Filter options based on search
  const getFilteredOptions = () => {
    if (disableSearch || !searchText) return options;

    return options.map(opt => {
      if ('options' in opt) {
        const filteredChildren = opt.options.filter(child =>
          child.label.toLowerCase().includes(searchText.toLowerCase())
        );
        return filteredChildren.length > 0 ? { ...opt, options: filteredChildren } : null;
      } else {
        return opt.label.toLowerCase().includes(searchText.toLowerCase()) ? opt : null;
      }
    }).filter(Boolean) as SelectOption[];
  };

  // Handle single select change
  const handleSingleSelectChange = (optionValue: string) => {
    if (preventDeselection) {
      // View selector mode - always select the clicked option (no deselection)
      onChange?.(optionValue);
    } else {
      // Traditional filter mode - toggle selection
      const newValue = value === optionValue ? null : optionValue;
      onChange?.(newValue);
    }
    // Keep dropdown open like multiselect
  };

  // Handle multi select change
  const handleMultiSelectChange = (optionValue: string, checked: boolean) => {
    if (!onMultiChange || !multiValue) return;

    const newValues = checked
      ? [...multiValue, optionValue]
      : multiValue.filter(v => v !== optionValue);
    
    onMultiChange(newValues);
  };

  // Get count for an option value
  const getOptionCount = (optionValue: string): number => {
    // Parse count from label if it exists (e.g., "Active (5)" -> 5)
    for (const opt of options) {
      if ('options' in opt) {
        const found = opt.options.find(child => child.value === optionValue);
        if (found) {
          const match = found.label.match(/\((\d+)\)$/);
          return match ? parseInt(match[1]) : 0;
        }
      } else {
        if (opt.value === optionValue) {
          const match = opt.label.match(/\((\d+)\)$/);
          return match ? parseInt(match[1]) : 0;
        }
      }
    }
    return 0;
  };

  // Render dropdown content
  const renderDropdownContent = () => {
    const filteredOptions = getFilteredOptions();

    return (
      <div 
        style={{
          minWidth: '280px',
          width: 'max-content',
          maxWidth: '400px',
          backgroundColor: token.colorBgElevated,
          borderRadius: token.borderRadius,
          boxShadow: token.boxShadowSecondary,
          padding: '8px',
          ...dropdownStyle
        }}
      >
        {/* Search input */}
        {!disableSearch && (
          <div style={{ marginBottom: '8px' }}>
            <Input
              ref={searchInputRef}
              placeholder="Search..."
              prefix={<Search size={14} color={'#9ca3af'} />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              allowClear
              className="dropdown-search-input"
              style={{ 
                width: '100%',
                border: '1px solid #e5e7eb', // Gray-200 border (same as SearchBar)
                backgroundColor: '#f9fafb' // Gray-50 background (same as SearchBar)
              }}
            />
          </div>
        )}

        {/* Options list */}
        <div 
          style={{ 
            maxHeight: 'min(400px, 40vh)', 
            overflowY: 'auto',
            paddingRight: '8px', // Extra space for scrollbar
            marginRight: '-8px'   // Pull back to align with container
          }}
          className="custom-scrollbar"
        >
          <Space direction="vertical" style={{ width: '100%' }} size={4}>
            {filteredOptions.map(opt => {
              if ('options' in opt) {
                // Option group
                return (
                  <div key={opt.label}>
                    <div style={{ 
                      fontWeight: 500, 
                      color: token.colorTextSecondary, 
                      fontSize: '12px',
                      marginTop: '8px',
                      marginBottom: '4px',
                      paddingLeft: '4px'
                    }}>
                      {opt.label}
                    </div>
                    {opt.options.map(child => {
                      const count = getOptionCount(child.value);
                      const cleanLabel = getCleanLabel(child.label);
                      return (
                        <div key={child.value} style={{ paddingLeft: '4px' }}>
                          <div style={{ 
                            width: '100%', 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '4px 8px 4px 0'
                          }}>
                            {multiSelect ? (
                              <Checkbox
                                checked={multiValue?.includes(child.value) ?? false}
                                onChange={(e) => handleMultiSelectChange(child.value, e.target.checked)}
                                style={{ margin: 0, flex: 1 }}
                              >
                                {cleanLabel}
                              </Checkbox>
                            ) : (
                              <Radio
                                checked={value === child.value}
                                onChange={() => handleSingleSelectChange(child.value)}
                                style={{ margin: 0, flex: 1 }}
                              >
                                {cleanLabel}
                              </Radio>
                            )}
                            {count > 0 && (
                              <span style={{ 
                                color: token.colorTextTertiary, 
                                fontSize: token.fontSizeSM,
                                marginLeft: '8px',
                                flexShrink: 0
                              }}>
                                {count}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                // Simple option
                const count = getOptionCount(opt.value);
                const cleanLabel = getCleanLabel(opt.label);
                const showDivider = (opt as any).showDivider;
                const isLatest = (opt as any).isLatest;
                
                return (
                  <div key={opt.value}>
                    {/* Divider above option if needed */}
                    {showDivider && (
                      <div style={{ 
                        borderTop: `1px solid ${token.colorBorderSecondary}`, 
                        margin: '8px 0' 
                      }} />
                    )}
                    
                    <div style={{ 
                      width: '100%', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '4px 8px 4px 0'
                    }}>
                      {multiSelect ? (
                        <Checkbox
                          checked={multiValue?.includes(opt.value) ?? false}
                          onChange={(e) => handleMultiSelectChange(opt.value, e.target.checked)}
                          style={{ margin: 0, flex: 1 }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {cleanLabel}
                            {isLatest && (
                              <Tag color="orange" style={{ margin: 0, fontSize: '10px', padding: '0 4px', height: '16px', lineHeight: '16px' }}>
                                Latest
                              </Tag>
                            )}
                          </div>
                        </Checkbox>
                      ) : (
                        <Radio
                          checked={value === opt.value}
                          onChange={() => handleSingleSelectChange(opt.value)}
                          style={{ margin: 0, flex: 1 }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {cleanLabel}
                            {isLatest && (
                              <Tag color="orange" style={{ margin: 0, fontSize: '10px', padding: '0 4px', height: '16px', lineHeight: '16px' }}>
                                Latest
                              </Tag>
                            )}
                          </div>
                        </Radio>
                      )}
                      {count > 0 && (
                        <span style={{ 
                          color: token.colorTextTertiary, 
                          fontSize: token.fontSizeSM,
                          marginLeft: '8px',
                          flexShrink: 0
                        }}>
                          {count}
                        </span>
                      )}
                    </div>
                  </div>
                );
              }
            })}
          </Space>
        </div>

        {/* Clear button */}
        {hasSelections && !hideClearButton && (
          <>
            <div style={{ 
              borderTop: `1px solid ${token.colorBorderSecondary}`, 
              margin: '8px 0' 
            }} />
            <Button
              type="link"
              size="small"
              onClick={handleClear}
              style={{ 
                padding: '0',
                height: 'auto',
                color: token.colorPrimary
              }}
            >
              Clear
            </Button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className={className} style={style}>
      <Dropdown
        open={isOpen}
        onOpenChange={handleDropdownVisibleChange}
        dropdownRender={() => renderDropdownContent()}
        trigger={['click']}
        placement="bottomLeft"
      >
        <Button
          size={size}
          className={`custom-filter-button ${hasSelections ? 'has-selections' : 'no-selections'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 11px',
          }}
          icon={(() => {
            if (isValidityFilter) {
              // Validity filters: use custom icon or ChevronDown, X on right when selected
              return hasSelections && !hideClearButton ? 
                <X size={12} onClick={(e) => { e.stopPropagation(); handleClear(); }} style={{ cursor: 'pointer' }} /> : 
                (icon || <ChevronDown size={12} />);
            } else {
              // Regular filters: new behavior (CirclePlus/X on left)
              return hasSelections && !hideClearButton ? 
                <X size={12} onClick={(e) => { e.stopPropagation(); handleClear(); }} style={{ cursor: 'pointer' }} /> : 
                <CirclePlus size={12} />;
            }
          })()}
          iconPosition={isValidityFilter ? "end" : "start"}
        >
          {(() => {
            const buttonText = getButtonText();
            if (typeof buttonText === 'string') {
              return buttonText;
            } else {
              // Has selections - render label in neutral and values in blue
              return (
                <span>
                  <span style={{ color: token.colorText }}>{buttonText.label}</span>
                  <span style={{ color: token.colorPrimary, marginLeft: '4px' }}>{buttonText.values}</span>
                </span>
              );
            }
          })()}
        </Button>
      </Dropdown>
    </div>
  );
};

export default CustomFilterButton;
