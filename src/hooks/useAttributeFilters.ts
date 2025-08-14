import { useState, useMemo } from 'react';
import type { Attribute, AttributeDomain, AttributeType } from '../utils/types';
import type { SelectOption } from '../components';
import { toSentenceCase } from '../utils/formatters';

export const useAttributeFilters = (initialAttributes: Attribute[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState<AttributeDomain | null>(null);
  const [typeFilter, setTypeFilter] = useState<AttributeType | null>(null);

  // Generate domain options with counts
  const domainOptions = useMemo((): SelectOption[] => {
    const domainCounts = initialAttributes.reduce((acc, attr) => {
      acc[attr.domain] = (acc[attr.domain] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(domainCounts).map(([domain, count]) => ({
      label: `${domain} (${count})`,
      value: domain,
    }));
  }, [initialAttributes]);

  // Generate type options with counts
  const typeOptions = useMemo((): SelectOption[] => {
    const typeCounts = initialAttributes.reduce((acc, attr) => {
      acc[attr.type] = (acc[attr.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      label: `${toSentenceCase(type)} (${count})`,
      value: type,
    }));
  }, [initialAttributes]);

  // Filter attributes based on current filters
  const filteredAttributes = useMemo(() => {
    let attributes = initialAttributes;

    // Search filtering
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      attributes = attributes.filter(attr =>
        attr.name.toLowerCase().includes(lowercasedQuery) ||
        attr.domain.toLowerCase().includes(lowercasedQuery)
      );
    }

    // Domain filtering
    if (domainFilter) {
      attributes = attributes.filter(attr => attr.domain === domainFilter);
    }

    // Type filtering
    if (typeFilter) {
      attributes = attributes.filter(attr => attr.type === typeFilter);
    }

    return attributes;
  }, [initialAttributes, searchQuery, domainFilter, typeFilter]);

  return {
    searchQuery,
    setSearchQuery,
    domainFilter,
    setDomainFilter,
    typeFilter,
    setTypeFilter,
    filteredAttributes,
    attributeCount: filteredAttributes.length,
    domainOptions,
    typeOptions,
  };
};
