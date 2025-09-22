import React from 'react';
import InfoPopover from './InfoPopover';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  showTooltip?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
  className?: string;
  style?: React.CSSProperties;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength,
  showTooltip = true,
  placement = 'right',
  className = '',
  style = {}
}) => {
  // Determine if text should be truncated
  const shouldTruncate = maxLength ? text.length > maxLength : false;
  const displayText = shouldTruncate && maxLength ? text.substring(0, maxLength) + '...' : text;
  
  // Base styles for CSS-based truncation (when maxLength is not provided)
  const truncationStyles = !maxLength ? {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
    width: '100%',
    display: 'block',
    ...style
  } : style;

  const content = (
    <span 
      className={className}
      style={truncationStyles}
      title={!showTooltip ? text : undefined} // Fallback title for accessibility
    >
      {displayText}
    </span>
  );

  // Show popover if enabled and text is truncated, or if text would overflow with CSS truncation
  if (showTooltip && (shouldTruncate || !maxLength)) {
    return (
      <InfoPopover 
        content={text} 
        placement={placement}
      >
        {content}
      </InfoPopover>
    );
  }

  return content;
};

export default TruncatedText;
