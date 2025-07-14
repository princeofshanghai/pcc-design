import { useState, useEffect, useRef } from 'react';

/**
 * Hook for detecting text truncation and conditionally showing tooltips
 * @param text - The text content to measure
 * @param maxWidth - Optional maximum width constraint
 * @returns Object with isTruncated boolean and textRef for the element
 */
export const useTruncationDetection = (text: string, maxWidth?: number) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!textRef.current || !text) {
        setIsTruncated(false);
        return;
      }

      const element = textRef.current;
      
      // Get the computed styles from the actual element
      const computedStyle = window.getComputedStyle(element);
      
      // Create a temporary element to measure natural text width
      const tempElement = document.createElement('span');
      tempElement.style.visibility = 'hidden';
      tempElement.style.position = 'absolute';
      tempElement.style.top = '-9999px';
      tempElement.style.left = '-9999px';
      tempElement.style.whiteSpace = 'nowrap';
      tempElement.style.fontSize = computedStyle.fontSize;
      tempElement.style.fontFamily = computedStyle.fontFamily;
      tempElement.style.fontWeight = computedStyle.fontWeight;
      tempElement.style.fontStyle = computedStyle.fontStyle;
      tempElement.style.letterSpacing = computedStyle.letterSpacing;
      tempElement.style.padding = '0';
      tempElement.style.margin = '0';
      tempElement.style.border = 'none';
      tempElement.textContent = text;

      document.body.appendChild(tempElement);
      const naturalWidth = tempElement.getBoundingClientRect().width;
      document.body.removeChild(tempElement);

      // Determine available width
      let availableWidth: number;
      if (maxWidth) {
        availableWidth = maxWidth;
      } else {
        // Use the actual element's content width
        const elementRect = element.getBoundingClientRect();
        const elementPadding = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        availableWidth = elementRect.width - elementPadding;
      }

      // Check if text is truncated (with small tolerance for rounding)
      const isTextTruncated = naturalWidth > availableWidth + 1;
      setIsTruncated(isTextTruncated);
    };

    // Check immediately and after a delay to handle dynamic styles
    checkTruncation();
    const timer = setTimeout(checkTruncation, 200);

    // Also check on resize
    const resizeObserver = new ResizeObserver(() => {
      setTimeout(checkTruncation, 50);
    });

    if (textRef.current) {
      resizeObserver.observe(textRef.current);
    }

    return () => {
      clearTimeout(timer);
      resizeObserver.disconnect();
    };
  }, [text, maxWidth]);

  return { isTruncated, textRef };
}; 