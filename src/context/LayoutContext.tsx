import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type LayoutContextType = {
  maxWidth: string;
  setMaxWidth: (width: string) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [maxWidth, setMaxWidth] = useState('1024px'); // Default max-width

  const value = { maxWidth, setMaxWidth };

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