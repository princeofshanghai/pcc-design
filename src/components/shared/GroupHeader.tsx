import React from 'react';
import { Typography, theme } from 'antd';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { toSentenceCase } from '../../utils/formatters';

const { Text } = Typography;

interface GroupHeaderProps {
  title: string;
  count: number;
  contextType?: 'products' | 'skus' | 'price groups' | 'currencies' | 'price points'; // Optional for backwards compatibility
  isExpanded?: boolean;
  onToggle?: () => void;
  isExpandable?: boolean;
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ 
  title, 
  count, 
  isExpanded = false,
  onToggle,
  isExpandable = false
}) => {
  const { token } = theme.useToken();

  // Format the title - show only the value, not the attribute name
  const displayTitle = toSentenceCase(title);

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
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Text style={{ 
          fontSize: token.fontSize, 
          fontWeight: 500,
          lineHeight: 1.2
        }}>
          {displayTitle}
        </Text>
        <Text 
          type="secondary" 
          style={{ 
            fontSize: token.fontSizeSM
          }}
        >
          ({count})
        </Text>
      </div>
    </div>
  );
};

export default GroupHeader; 