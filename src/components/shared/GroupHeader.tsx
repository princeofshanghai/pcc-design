import React from 'react';
import { Typography, theme } from 'antd';
import { toSentenceCase, toTitleCase } from '../../utils/formatters';

const { Text } = Typography;

interface GroupHeaderProps {
  title: string;
  count: number;
  contextType: 'products' | 'skus' | 'price groups' | 'currencies' | 'price points';
}

const GroupHeader: React.FC<GroupHeaderProps> = ({ 
  title, 
  count, 
  contextType 
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

  return (
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
  );
};

export default GroupHeader; 