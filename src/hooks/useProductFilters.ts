import { useState, useMemo, useEffect } from 'react';
import type { Product, Status, LOB, SalesChannel } from '../utils/types';
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
  const [channelFilters, setChannelFilters] = useState<SalesChannel[]>([]);
  
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

    // Channel filtering - check if product has SKUs with any of the selected channels
    if (channelFilters.length > 0) {
      products = products.filter(p => {
        if (!p.skus || p.skus.length === 0) return false;
        const productChannels = p.skus.map(sku => sku.salesChannel);
        return channelFilters.some(channel => productChannels.includes(channel));
      });
    }

    return products;
  }, [searchQuery, lobFilter, statusFilter, statusFilters, channelFilters, folderFilter, initialProducts]);

  // Helper function to sort products
  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    sorted.sort((a, b) => {
      if (sortOrder === 'Product ID (A-Z)') { return a.id.localeCompare(b.id); }
      if (sortOrder === 'Product ID (Z-A)') { return b.id.localeCompare(a.id); }
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
      let key: string;
      
      if (groupBy === 'Channel') {
        // For channel grouping, group by the primary channel (most common in SKUs)
        if (!product.skus || product.skus.length === 0) {
          key = 'No SKUs';
        } else {
          const channelCounts = product.skus.reduce((counts, sku) => {
            counts[sku.salesChannel] = (counts[sku.salesChannel] || 0) + 1;
            return counts;
          }, {} as Record<string, number>);
          
          // Find the most common channel
          key = Object.entries(channelCounts)
            .sort(([,a], [,b]) => b - a)[0][0];
        }
      } else {
        key = product[groupBy.toLowerCase() as keyof Product] as string;
      }
      
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

    // Format labels with counts for LOB options
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialProducts, searchQuery, statusFilter, statusFilters, folderFilter]);

  // Generate dynamic channel options with counts
  const dynamicChannelOptions = useMemo(() => {
    let productsForChannelOptions = initialProducts;

    // Apply current filters (except channel) to generate accurate counts
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      productsForChannelOptions = productsForChannelOptions.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.id.toLowerCase().includes(lowercasedQuery) ||
        p.folder.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    if (lobFilter) { 
      productsForChannelOptions = productsForChannelOptions.filter(p => p.lob === lobFilter); 
    }
    if (folderFilter) { 
      productsForChannelOptions = productsForChannelOptions.filter(p => p.folder === folderFilter); 
    }
    
    // Status filtering
    if (statusFilters.length > 0) {
      productsForChannelOptions = matchesMultiSelectFilter(productsForChannelOptions, statusFilters, p => p.status);
    } else if (statusFilter) {
      productsForChannelOptions = matchesSingleSelectFilter(productsForChannelOptions, statusFilter, p => p.status);
    }

    // Extract all unique channels from products' SKUs
    const allChannels = new Set<SalesChannel>();
    productsForChannelOptions.forEach(product => {
      if (product.skus && product.skus.length > 0) {
        product.skus.forEach(sku => {
          allChannels.add(sku.salesChannel);
        });
      }
    });

    const optionsWithCounts = generateDynamicOptionsWithCounts(
      Array.from(allChannels).map(channel => ({ channel })),
      item => item.channel,
      channel => channel === 'iOS' ? 'iOS' : toSentenceCase(channel)
    );

    // Format labels with counts for channel options
    return optionsWithCounts.map(option => ({
      value: option.value,
      label: `${option.label} (${option.count})`
    }));
  }, [initialProducts, searchQuery, statusFilter, statusFilters, lobFilter, folderFilter]);

  return {
    // Filter states and setters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    statusFilters,
    setStatusFilters,
    channelFilters,
    setChannelFilters,
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
    dynamicChannelOptions,
  };
}; 