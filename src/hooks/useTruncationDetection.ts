import { useState, useEffect, useRef } from 'react';

/**
 * Hook for detecting text truncation and conditionally showing tooltips
 * @param text - The text content to measure
 * @param containerWidth - Optional fixed width to measure against
 * @returns Object with isTruncated boolean and textRef for the element
 */
export const useTruncationDetection = (text: string, containerWidth?: number) => {
  const [isTruncated, setIsTruncated] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const checkTruncation = () => {
      if (!textRef.current) return;

      // Create a temporary element to measure text width
      const tempSpan = document.createElement('span');
      tempSpan.style.visibility = 'hidden';
      tempSpan.style.position = 'absolute';
      tempSpan.style.whiteSpace = 'nowrap';
      tempSpan.style.fontSize = window.getComputedStyle(textRef.current).fontSize;
      tempSpan.style.fontFamily = window.getComputedStyle(textRef.current).fontFamily;
      tempSpan.style.fontWeight = window.getComputedStyle(textRef.current).fontWeight;
      tempSpan.textContent = text;

      document.body.appendChild(tempSpan);
      const textWidth = tempSpan.offsetWidth;
      document.body.removeChild(tempSpan);

      const availableWidth = containerWidth || textRef.current.offsetWidth;
      setIsTruncated(textWidth > availableWidth);
    };

    // Delay to ensure styles are applied
    const timer = setTimeout(checkTruncation, 150);
    return () => clearTimeout(timer);
  }, [text, containerWidth]);

  return { isTruncated, textRef };
}; 