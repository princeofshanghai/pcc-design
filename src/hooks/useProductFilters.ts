import { useState, useMemo, useEffect } from 'react';
import type { Product, Status, LOB } from '../utils/types';
import type { SelectOption } from '../components';
import { toSentenceCase, toTitleCase } from '../utils/formatters';
import { matchesMultiSelectFilter, matchesSingleSelectFilter, generateDynamicOptionsWithCounts } from '../utils/filterUtils';

// This function generates the grouped folder options from the full product list.
const getFolderGroupedOptions = (products: Product[]): SelectOption[] => {
  const lobs: LOB[] = [...new Set(products.map(p => p.lob))];
  return lobs.map(lob => ({
    label: lob,
    options: [...new Set(products.filter(p => p.lob === lob).map(p => p.folder))]
      .map(folder => ({ label: toTitleCase(folder), value: folder }))
  })).filter(group => group.options.length > 0);
};

export const useProductFilters = (initialProducts: Product[], initialLobFilter: LOB | null) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Single-select filters (existing)
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [lobFilter, setLobFilter] = useState<LOB | null>(initialLobFilter);
  const [folderFilter, setFolderFilter] = useState<string | null>(null);
  
  // Multi-select filters (new - demo with status)
  const [statusFilters, setStatusFilters] = useState<Status[]>([]);
  
  // View options
  const [groupBy, setGroupBy] = useState<string>('None');
  const [sortOrder, setSortOrder] = useState<string>('None');

  const folderOptions = useMemo(() => {
    if (lobFilter) {
      return [...new Set(initialProducts.filter(p => p.lob === lobFilter).map(p => p.folder))]
        .map(folder => ({ label: toTitleCase(folder), value: folder }));
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
    if (folderFilter) { products = products.filter(p => p.folder === folderFilter); }
    
    // Status filtering - use multiselect if active, otherwise single-select
    if (statusFilters.length > 0) {
      products = matchesMultiSelectFilter(products, statusFilters, p => p.status);
    } else if (statusFilter) {
      products = matchesSingleSelectFilter(products, statusFilter, p => p.status);
    }

    return products;
  }, [searchQuery, lobFilter, statusFilter, statusFilters, folderFilter, initialProducts]);

  // Helper function to sort products
  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      if (sortOrder === 'Name (A-Z)') { return a.name.localeCompare(b.name); }
      if (sortOrder === 'Name (Z-A)') { return b.name.localeCompare(a.name); }
      if (sortOrder === 'LOB (A-Z)') { return a.lob.localeCompare(b.lob); }
      if (sortOrder === 'LOB (Z-A)') { return b.lob.localeCompare(a.lob); }
      if (sortOrder === 'Folder (A-Z)') { return a.folder.localeCompare(b.folder); }
      if (sortOrder === 'Folder (Z-A)') { return b.folder.localeCompare(a.folder); }
      if (sortOrder === 'SKUs (Low to High)') { return a.skus.length - b.skus.length; }
      if (sortOrder === 'SKUs (High to Low)') { return b.skus.length - a.skus.length; }
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

    // Apply alphabetical ordering to group keys consistent with ViewOptions.tsx
    const sortedGroups: Record<string, Product[]> = {};
    Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .forEach(groupKey => {
        sortedGroups[groupKey] = grouped[groupKey];
      });

    return sortedGroups;
  }, [filteredProducts, groupBy, sortOrder]);

  const productCount = sortedProducts.length;

  // Generate dynamic filter options based on current filtering context
  const dynamicStatusOptions = useMemo(() => {
    // For status options, apply all filters EXCEPT status filters
    let productsForStatusOptions = initialProducts;
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      productsForStatusOptions = productsForStatusOptions.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.id.toLowerCase().includes(lowercasedQuery) ||
        p.folder.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply other non-status filters
    if (lobFilter) { 
      productsForStatusOptions = productsForStatusOptions.filter(p => p.lob === lobFilter); 
    }
    if (folderFilter) { 
      productsForStatusOptions = productsForStatusOptions.filter(p => p.folder === folderFilter); 
    }

    const optionsWithCounts = generateDynamicOptionsWithCounts(
      productsForStatusOptions,
      p => p.status,
      status => toSentenceCase(status)
    );

    // Format labels with counts
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialProducts, searchQuery, lobFilter, folderFilter]);

  const dynamicLobOptions = useMemo(() => {
    // For LOB options, apply all filters EXCEPT LOB filter
    let productsForLobOptions = initialProducts;
    
    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      productsForLobOptions = productsForLobOptions.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.id.toLowerCase().includes(lowercasedQuery) ||
        p.folder.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Apply other non-LOB filters
    if (statusFilters.length > 0) {
      productsForLobOptions = matchesMultiSelectFilter(productsForLobOptions, statusFilters, p => p.status);
    } else if (statusFilter) {
      productsForLobOptions = matchesSingleSelectFilter(productsForLobOptions, statusFilter, p => p.status);
    }
    if (folderFilter) { 
      productsForLobOptions = productsForLobOptions.filter(p => p.folder === folderFilter); 
    }

    const optionsWithCounts = generateDynamicOptionsWithCounts(
      productsForLobOptions,
      p => p.lob,
      lob => toSentenceCase(lob)
    );

    // Format labels WITHOUT counts for LOB options
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: option.label  // Remove the count formatting
    }));
  }, [initialProducts, searchQuery, statusFilter, statusFilters, folderFilter]);

  return {
    // Filter states and setters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    statusFilters,
    setStatusFilters,
    lobFilter,
    setLobFilter,
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
    
    // Dynamic filter options (new)
    dynamicStatusOptions,
    dynamicLobOptions,
  };
}; 