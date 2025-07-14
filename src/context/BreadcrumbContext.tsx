import React, { createContext, useState, useContext, type ReactNode } from 'react';

interface BreadcrumbContextType {
  productName: string | null;
  setProductName: (name: string | null) => void;
  skuId: string | null;
  setSkuId: (id: string | null) => void;
  priceGroupId: string | null;
  setPriceGroupId: (id: string | null) => void;
  priceGroupName: string | null;
  setPriceGroupName: (name: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [productName, setProductName] = useState<string | null>(null);
  const [skuId, setSkuId] = useState<string | null>(null);
  const [priceGroupId, setPriceGroupId] = useState<string | null>(null);
  const [priceGroupName, setPriceGroupName] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider value={{ 
      productName, setProductName, 
      skuId, setSkuId,
      priceGroupId, setPriceGroupId,
      priceGroupName, setPriceGroupName
    }}>
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