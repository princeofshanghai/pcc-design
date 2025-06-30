import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface BreadcrumbContextType {
  productName: string | null;
  setProductName: (name: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productName, setProductName] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ productName, setProductName }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}; 