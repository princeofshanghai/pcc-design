import React, { useMemo, useState } from 'react';
import { Space } from 'antd';
import { mockProducts } from '../utils/mock-data';
import {
  PageHeader,
  ChangeRequestListTable,
  FilterBar
} from '../components';
import { GitPullRequestArrow } from 'lucide-react';
import type { ConfigurationRequest } from '../utils/types';

interface ConfigurationRequestWithProduct extends ConfigurationRequest {
  productName: string;
}

const ChangeRequestsPlaceholder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Combine all change requests with their product information
  const allChangeRequests = useMemo(() => {
    const requests: ConfigurationRequestWithProduct[] = [];
    
    mockProducts.forEach(product => {
      if (product.configurationRequests) {
        product.configurationRequests.forEach(request => {
          requests.push({
            ...request,
            productName: product.name
          });
        });
      }
    });

    return requests.sort((a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime());
  }, []);

  // Filter change requests based on search and status
  const filteredRequests = useMemo(() => {
    let filtered = allChangeRequests;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.id.toLowerCase().includes(query) ||
        request.productName.toLowerCase().includes(query) ||
        request.salesChannel.toLowerCase().includes(query) ||
        request.billingCycle.toLowerCase().includes(query) ||
        request.createdBy.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    return filtered;
  }, [allChangeRequests, searchQuery, statusFilter]);

  const clearAllFilters = () => {
    setSearchQuery('');
    setStatusFilter(null);
  };

  // Status filter options
  const statusOptions = [
    { label: 'Pending Review', value: 'Pending Review' },
    { label: 'In EI', value: 'In EI' },
    { label: 'Live', value: 'Live' },
    { label: 'Failed', value: 'Failed' },
    { label: 'Draft', value: 'Draft' }
  ];

  return (
    <div style={{ width: '100%' }}>
      {/* Header and Search Area */}
      <div style={{ marginBottom: 24 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <PageHeader
            icon={<GitPullRequestArrow />}
            iconSize={24}
            title="Change Requests"
            subtitle={`${filteredRequests.length} change request${filteredRequests.length !== 1 ? 's' : ''} found`}
          />

          <FilterBar
            displayMode="inline"
            filterSize="large"
            search={{
              placeholder: "Search by request ID, product, channel, or creator...",
              onChange: setSearchQuery,
            }}
            onClearAll={clearAllFilters}
            filters={[
              {
                placeholder: "All statuses",
                options: statusOptions,
                value: statusFilter,
                onChange: (value) => setStatusFilter(value as string ?? null),
              },
            ]}
          />
        </Space>
      </div>

      {/* Content Area */}
      <div>
        <ChangeRequestListTable requests={filteredRequests} />
      </div>
    </div>
  );
};

export default ChangeRequestsPlaceholder; 