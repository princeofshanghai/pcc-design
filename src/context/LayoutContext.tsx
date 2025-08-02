import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type LayoutContextType = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  getContentWidth: () => string;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);

  // Standard width calculation based on sidebar state
  // Collapsed: 64px sidebar (+176px more space vs expanded 240px)
  const getContentWidth = () => {
    const standardWidth = collapsed ? '1696px' : '1520px';
    const maxWidth = '1800px';
    return `min(${standardWidth}, ${maxWidth})`;
  };

  const value = { collapsed, setCollapsed, getContentWidth };

  return (
    <LayoutContext.Provider value={value}>
      {children}
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextType => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}; 