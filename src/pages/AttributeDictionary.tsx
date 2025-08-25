import React from 'react';
import { Space } from 'antd';
import { PageHeader, FilterBar, AttributeDictionaryTable } from '../components';
import { mockAttributes } from '../utils/mock-data';
import { useAttributeFilters } from '../hooks/useAttributeFilters';
import type { AttributeDomain, AttributeType } from '../utils/types';

const AttributeDictionary: React.FC = () => {
  const {
    setSearchQuery,
    domainFilter,
    setDomainFilter,
    typeFilter,
    setTypeFilter,
    filteredAttributes,
    domainOptions,
    typeOptions,
  } = useAttributeFilters(mockAttributes);

  const clearAllFilters = () => {
    setSearchQuery('');
    setDomainFilter(null);
    setTypeFilter(null);
  };

  // Static page subtitle
  const pageSubtitle = "Provides definitions and owners for all product related attributes at LinkedIn";

  return (
    <div style={{ width: '100%' }}>
      {/* Header and Search Area */}
      <div style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <PageHeader
            title="Attribute dictionary"
            subtitle={pageSubtitle}
          />

          <FilterBar
            displayMode="inline"
            useCustomFilters={true}
            search={{
              placeholder: "Search by attribute name or domain...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllFilters}
            filters={[
              {
                placeholder: "All domains",
                options: domainOptions,
                value: domainFilter,
                onChange: (value: string | null) => setDomainFilter((value as AttributeDomain) ?? null),
              },
              {
                placeholder: "All types",
                options: typeOptions,
                value: typeFilter,
                onChange: (value: string | null) => setTypeFilter((value as AttributeType) ?? null),
              },
            ]}
          />
        </Space>
      </div>

      {/* Content Area */}
      <div>
        <AttributeDictionaryTable attributes={filteredAttributes} />
      </div>
    </div>
  );
};

export default AttributeDictionary;
