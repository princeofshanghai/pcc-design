import React from 'react';
import { Typography, theme } from 'antd';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { toSentenceCase, toTitleCase } from '../../utils/formatters';

const { Text } = Typography;

interface GroupHeaderProps {
  title: string;
  count: number;
  contextType: 'products' | 'skus' | 'price groups' | 'currencies' | 'price points';
  isExpanded?: boolean;
  onToggle?: () => void;
  isExpandable?: boolean;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ 
  title, 
  count, 
  contextType,
  isExpanded = false,
  onToggle,
  isExpandable = false
}) => {
  const { token } = theme.useToken();

  // Format the title - show only the value, not the attribute name
  const displayTitle = toSentenceCase(title);
  
  // Format the subtitle with count and context (handle singular/plural)
  const getContextText = (count: number, type: string): string => {
    if (count === 1) {
      // Convert plural forms to singular
      switch (type) {
        case 'products': return 'product';
        case 'skus': return 'sku';
        case 'price groups': return 'price group';
        case 'currencies': return 'currency';
        case 'price points': return 'price point';
        default: return type;
      }
    }
    return type; // Already plural
  };

  const subtitle = `${count} ${getContextText(count, contextType)}`;

  const handleClick = () => {
    if (isExpandable && onToggle) {
      onToggle();
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        cursor: isExpandable ? 'pointer' : 'default'
      }}
      onClick={handleClick}
    >
      {isExpandable && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          color: token.colorTextSecondary
        }}>
          {isExpanded ? (
            <ChevronDown size={14} />
          ) : (
            <ChevronRight size={14} />
          )}
        </div>
      )}
      <div>
        <Text style={{ 
          fontSize: token.fontSizeHeading3, 
          fontWeight: 500,
          display: 'block',
          lineHeight: 1.2
        }}>
          {displayTitle}
        </Text>
        <Text 
          type="secondary" 
          style={{ 
            fontSize: token.fontSizeSM,
            display: 'block',
            marginTop: '2px'
          }}
        >
          {subtitle}
        </Text>
      </div>
    </div>
  );
};

export default GroupHeader; 