import React, { useMemo, useState } from 'react';
import { Table, Typography, theme } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { GTMItem, ApprovalRequirement, GTMItemType, ExtendedApprovalStatus } from '../../utils/types';
import { formatShortDate } from '../../utils/formatters';
import GTMItemTypeTag from '../attributes/GTMItemTypeTag';
import ApprovalStatusTag from '../attributes/ApprovalStatusTag';
import GTMItemChangesModal from './GTMItemChangesModal';
import PriceEditorModal from '../pricing/PriceEditor/PriceEditorModal';

const { Text } = Typography;

interface GTMItemsTableProps {
  items: GTMItem[];
  renderMode?: 'approvals' | 'table' | 'both'; // New prop to control what to render
  motionStatus?: string; // GTM motion status to determine approval display
  motionId?: string; // Motion ID for navigation to changes page
}

const GTMItemsTable: React.FC<GTMItemsTableProps> = ({ items, renderMode = 'both', motionStatus, motionId }) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  
  // Modal state
  const [changesModalOpen, setChangesModalOpen] = useState(false);
  const [selectedGTMItem, setSelectedGTMItem] = useState<GTMItem | null>(null);
  
  // Price Editor Modal state
  const [priceEditorModalOpen, setPriceEditorModalOpen] = useState(false);
  const [editingGTMItem, setEditingGTMItem] = useState<GTMItem | null>(null);

  // Navigation to item-specific changes page
  const handleViewItemChanges = (item: GTMItem) => {
    if (motionId) {
      navigate(`/gtm-motions/${motionId}/items/${item.id}/changes`);
    }
  };

  // Modal handlers (backup - for emergency fallback button)
  const handleShowChanges = (item: GTMItem) => {
    setSelectedGTMItem(item);
    setChangesModalOpen(true);
  };

  const handleCloseModal = () => {
    setChangesModalOpen(false);
    setSelectedGTMItem(null);
  };

  const handleEditItem = (item: GTMItem) => {
    if (item.type === 'Price' && item.priceChange) {
      // For price items, open PriceEditorModal with locked context
      setEditingGTMItem(item);
      setPriceEditorModalOpen(true);
      handleCloseModal(); // Close the changes modal
    } else {
      // For non-price items, show info modal (future enhancement)
      console.log('Edit non-price GTM item:', item.id, 'Type:', item.type);
      handleCloseModal();
    }
  };

  const handleRemoveItem = (item: GTMItem) => {
    console.log('Remove GTM item:', item.id);
    // TODO: Show confirmation dialog and remove item from GTM motion
    handleCloseModal();
  };

  // Price Editor Modal handlers
  const handlePriceEditorClose = () => {
    setPriceEditorModalOpen(false);
    setEditingGTMItem(null);
  };

  // Helper to prepare prefilled context for editing
  const getPrefillContext = (gtmItem: GTMItem) => {
    if (!gtmItem.priceChange) return undefined;

    return {
      channel: gtmItem.priceChange.context.channel,
      billingCycle: gtmItem.priceChange.context.billingCycle,
      priceGroupAction: gtmItem.priceChange.impactType === 'CREATE_NEW_SKU' ? 'create' : 'update',
      existingPriceGroup: gtmItem.priceChange.impactType === 'UPDATE_EXISTING_SKU' ? {
        id: `existing-${gtmItem.productId}`, // Mock ID
        name: `${gtmItem.productName} Price Group`
      } : undefined,
      // Pre-fill current prices from the GTM item's price change data
      currentPrices: gtmItem.priceChange.currencyChanges.reduce((acc, change) => {
        acc[change.currencyCode] = change.currentAmount; // Use the current amount
        return acc;
      }, {} as Record<string, number>)
    };
  };

  // Calculate overall approval progress
  const allApprovers = useMemo(() => {
    const approverMap = new Map<string, ApprovalRequirement>();
    
    items.forEach(item => {
      item.approvalRequirements.forEach(req => {
        const existing = approverMap.get(req.team);
        if (!existing || 
            (req.status === 'Approved' && existing.status !== 'Approved') ||
            (req.status === 'Pending' && existing.status === 'Rejected')) {
          approverMap.set(req.team, req);
        }
      });
    });

    return Array.from(approverMap.values()).sort((a, b) => a.team.localeCompare(b.team));
  }, [items]);

  const approvedCount = allApprovers.filter(req => req.status === 'Approved').length;
  const totalCount = allApprovers.length;


  // Helper function to get changes summary text
  const getChangesSummary = (item: GTMItem): string => {
    if (item.type === 'Price' && item.priceChange?.currencyChanges) {
      const count = item.priceChange.currencyChanges.length;
      const action = item.priceChange.impactType === 'CREATE_NEW_SKU' ? 'created' : 'updated';
      return `${count} price point${count !== 1 ? 's' : ''} ${action}`;
    }
    
    // For non-price items, use the details field
    return item.details;
  };

  const columns: ColumnsType<GTMItem> = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 80,
      render: (type: GTMItemType) => (
        <GTMItemTypeTag itemType={type} variant="small" />
      ),
    },
    {
      title: 'Changes',
      dataIndex: 'changes',
      key: 'changes', 
      width: 140,
      render: (_: string, record: GTMItem) => (
        <Text>
          {getChangesSummary(record)}
        </Text>
      ),
    },
    {
      title: 'Product', 
      dataIndex: 'productName',
      key: 'productName',
      width: 160,
      render: (productName: string, record: GTMItem) => (
        <Link 
          to={`/product/${record.productId}`} 
          onClick={(e) => e.stopPropagation()}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '4px',
            fontWeight: 500, 
            fontSize: '13px'
          }}
        >
          {productName}
          <ChevronRight size={12} style={{ color: token.colorTextSecondary }} />
        </Link>
      ),
    },
    {
      title: '',
      key: 'actions',
      fixed: 'right' as const,
      width: 48,
      className: 'table-action-column',
      render: (_: string, _record: GTMItem) => (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
        }}>
          <ChevronRight 
            size={16} 
            style={{ 
              color: token.colorTextTertiary,
            }} 
          />
        </div>
      ),
    },
  ];

  // Helper function to convert approval status for display
  const getExtendedStatus = (status: string): ExtendedApprovalStatus => {
    // If GTM motion is in draft, all approvals should show "Not requested" since approvals haven't been requested yet
    if (motionStatus === 'Draft') {
      return 'Not requested';
    }
    
    if (status === 'Pending' || status === 'Approved' || status === 'Rejected') {
      return status;
    }
    return 'Not requested';
  };

  // Render different content based on mode
  if (renderMode === 'approvals') {
    // Simple approvals table
    const approvalsTableData = allApprovers.map((req, index) => ({
      key: index,
      team: req.team,
      status: getExtendedStatus(req.status),
      approvalInfo: req
    }));

    const approvalsColumns: ColumnsType<any> = [
      {
        title: 'Team',
        dataIndex: 'team',
        key: 'team',
        render: (team: string) => (
          <Text style={{ fontSize: token.fontSize, fontWeight: 500 }}>{team}</Text>
        ),
        // Let Team column take up remaining space
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        render: (status: ExtendedApprovalStatus) => (
          <ApprovalStatusTag status={status} variant="small" />
        ),
      },
      {
        title: 'Approved by',
        dataIndex: 'approvalInfo',
        key: 'approvedBy',
        render: (req: ApprovalRequirement) => {
          if (req.status !== 'Approved' || !req.approvedBy) {
            return (
              <Text style={{ fontSize: token.fontSize, color: token.colorTextTertiary }}>
                —
              </Text>
            );
          }

          // Convert team names to LDAP format (mock mapping for now)
          const ldapMapping: Record<string, string> = {
            'pricing.team': 'lkanazir',
            'legal.team': 'ahoman', 
            'tax.team': 'chhu',
            'revenue.team': 'lkanazir',
            'product.team': 'ahoman',
            'stratfin.team': 'chhu'
          };

          const ldap = ldapMapping[req.approvedBy.toLowerCase()] || req.approvedBy;

          return (
            <Text style={{ fontSize: token.fontSize, fontWeight: 500 }}>
              {ldap}
            </Text>
          );
        },
      },
      {
        title: 'Approval date',
        dataIndex: 'approvalInfo',
        key: 'approvalDate',
        render: (req: ApprovalRequirement) => {
          if (req.status !== 'Approved' || !req.approvedDate) {
            return (
              <Text style={{ fontSize: token.fontSize, color: token.colorTextTertiary }}>
                —
              </Text>
            );
          }

          const formattedDate = formatShortDate(req.approvedDate);

          return (
            <Text style={{ fontSize: token.fontSize, color: token.colorTextSecondary }}>
              {formattedDate}
            </Text>
          );
        },
      },
    ];

    return (
      <Table
        columns={approvalsColumns}
        dataSource={approvalsTableData}
        pagination={false}
        style={{
          backgroundColor: 'transparent',
        }}
      />
    );
  }

  if (renderMode === 'table') {
    return (
      <div>
        <Table
          size="large"
          columns={columns}
          dataSource={items}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          showHeader={true}
          onRow={(record) => ({
            onClick: () => handleViewItemChanges(record),
            style: { cursor: 'pointer' },
          })}
          rowClassName="gtm-items-table-row"
        />
        
        <style>
          {`
            .gtm-items-table-row:hover {
              background-color: ${token.colorFillAlter} !important;
            }
          `}
        </style>

        {/* GTM Item Changes Modal */}
        <GTMItemChangesModal
          open={changesModalOpen}
          onClose={handleCloseModal}
          gtmItem={selectedGTMItem}
          onEdit={handleEditItem}
          onRemove={handleRemoveItem}
        />

        {/* Price Editor Modal for editing GTM items */}
        {editingGTMItem && (
          <PriceEditorModal
            open={priceEditorModalOpen}
            onClose={handlePriceEditorClose}
            productName={editingGTMItem.productName}
            productId={editingGTMItem.productId}
            product={null} // Not needed for edit mode
            directEditMode={true}
            prefilledContext={getPrefillContext(editingGTMItem)}
          />
        )}
      </div>
    );
  }

  // Default 'both' mode - original layout for backward compatibility
  return (
    <div>
      {/* Approvals Section */}
      <div style={{ marginBottom: '32px' }}>
        {/* Progress Bar */}
        <div style={{ 
          width: '100%', 
          height: '16px', 
          backgroundColor: token.colorBgContainer,
          borderRadius: '8px',
          marginBottom: '12px',
          overflow: 'hidden',
          border: `1px solid ${token.colorBorder}`
        }}>
          <div 
            style={{ 
              width: `${totalCount > 0 ? (approvedCount / totalCount) * 100 : 0}%`,
              height: '100%',
              backgroundColor: token.colorSuccess,
              borderRadius: '7px',
              transition: 'width 0.3s ease'
            }} 
          />
        </div>
        
        <Text style={{ fontSize: '12px', color: token.colorTextSecondary, marginBottom: '16px', display: 'block' }}>
          {approvedCount}/{totalCount} teams approved
        </Text>
        
        {/* Team Status List */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
          {allApprovers.map((req, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ApprovalStatusTag status={getExtendedStatus(req.status)} variant="small" />
              <Text style={{ fontSize: '12px' }}>{req.team}</Text>
            </div>
          ))}
        </div>
      </div>

      {/* GTM Items Section */}
      <div>
        <Text style={{ fontWeight: 500, fontSize: '14px', display: 'block', marginBottom: '16px' }}>
          GTM items
        </Text>
        
        <Table
          size="large"
          columns={columns}
          dataSource={items}
          rowKey="id"
          pagination={false}
          scroll={{ x: 'max-content' }}
          showHeader={true}
          onRow={(record) => ({
            onClick: () => handleViewItemChanges(record),
            style: { cursor: 'pointer' },
          })}
          rowClassName="gtm-items-table-row"
        />
      </div>
      
      <style>
        {`
          .gtm-items-table-row:hover {
            background-color: ${token.colorFillAlter} !important;
          }
        `}
      </style>

      {/* GTM Item Changes Modal */}
      <GTMItemChangesModal
        open={changesModalOpen}
        onClose={handleCloseModal}
        gtmItem={selectedGTMItem}
        onEdit={handleEditItem}
        onRemove={handleRemoveItem}
      />

      {/* Price Editor Modal for editing GTM items */}
      {editingGTMItem && (
        <PriceEditorModal
          open={priceEditorModalOpen}
          onClose={handlePriceEditorClose}
          productName={editingGTMItem.productName}
          productId={editingGTMItem.productId}
          product={null} // Not needed for edit mode
          directEditMode={true}
          prefilledContext={getPrefillContext(editingGTMItem)}
        />
      )}
    </div>
  );
};

export default GTMItemsTable;
