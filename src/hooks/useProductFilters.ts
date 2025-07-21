import { useState, useMemo, useEffect } from 'react';
import type { Product, LOB, Status } from '../utils/types';
import type { SelectOption } from '../components';

// This function generates the grouped folder options from the full product list.
const getFolderGroupedOptions = (products: Product[]): SelectOption[] => {
  const lobs: LOB[] = [...new Set(products.map(p => p.lob))];
  return lobs.map(lob => ({
    label: lob,
    options: [...new Set(products.filter(p => p.lob === lob).map(p => p.folder))]
      .map(folder => ({ label: folder, value: folder }))
  })).filter(group => group.options.length > 0);
};

export const useProductFilters = (initialProducts: Product[], lobFilter: LOB | null) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  const [groupBy, setGroupBy] = useState<string>('None');
  const [sortOrder, setSortOrder] = useState<string>('None');

  const folderOptions = useMemo(() => {
    if (lobFilter) {
      return [...new Set(initialProducts.filter(p => p.lob === lobFilter).map(p => p.folder))]
        .map(folder => ({ label: folder, value: folder }));
    }
    // When no LOB is selected, show grouped options
    return getFolderGroupedOptions(initialProducts);
  }, [lobFilter, initialProducts]);

  useEffect(() => {
    if (lobFilter) {
      const validFolders = initialProducts
        .filter(p => p.lob === lobFilter)
        .map(p => p.folder);
      
      if (folderFilter && !validFolders.includes(folderFilter)) {
        setFolderFilter(null);
      }
    }
  }, [lobFilter, folderFilter, initialProducts]);

  const filteredProducts = useMemo(() => {
    let products = initialProducts;

    // Filtering only
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.id.toLowerCase().includes(lowercasedQuery) ||
        p.folder.toLowerCase().includes(lowercasedQuery)
      );
    }
    if (lobFilter) { products = products.filter(p => p.lob === lobFilter); }
    if (statusFilter) { products = products.filter(p => p.status === statusFilter); }
    if (folderFilter) { products = products.filter(p => p.folder === folderFilter); }

    return products;
  }, [searchQuery, lobFilter, statusFilter, folderFilter, initialProducts]);

  // Helper function to sort products
  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      if (sortOrder === 'Name (A-Z)') { return a.name.localeCompare(b.name); }
      if (sortOrder === 'Name (Z-A)') { return b.name.localeCompare(a.name); }
      return 0;
    });
    return sorted;
  };

  const sortedProducts = useMemo(() => {
    // If no grouping, sort all filtered products
    if (groupBy === 'None') {
      return sortProducts(filteredProducts);
    }
    // If grouping is active, return filtered products (sorting happens within groups)
    return filteredProducts;
  }, [filteredProducts, sortOrder, groupBy]);

  const groupedProducts = useMemo(() => {
    if (groupBy === 'None') return null;
    
    // First group the filtered products
    const grouped = filteredProducts.reduce((acc, product) => {
      const key = product[groupBy.toLowerCase() as keyof Product] as string;
      if (!acc[key]) { acc[key] = []; }
      acc[key].push(product);
      return acc;
    }, {} as Record<string, Product[]>);

    // Then sort within each group
    Object.keys(grouped).forEach(key => {
      grouped[key] = sortProducts(grouped[key]);
    });

    return grouped;
  }, [filteredProducts, groupBy, sortOrder]);

  const productCount = sortedProducts.length;

  return {
    // Filter states and setters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    folderFilter,
    setFolderFilter,
    
    // View options states and setters
    groupBy,
    setGroupBy,
    sortOrder,
    setSortOrder,

    // Derived data
    sortedProducts,
    groupedProducts,
    productCount,
    folderOptions,
  };
}; 