import React from 'react';
import { Modal, Button, Space, Typography } from 'antd';
import { Pencil, Trash2 } from 'lucide-react';
import type { GTMItem } from '../../utils/types';
import PriceChangesSummary from '../pricing/PriceEditor/PriceChangesSummary';

const { Title, Text } = Typography;

interface GTMItemChangesModalProps {
  open: boolean;
  onClose: () => void;
  gtmItem: GTMItem | null;
  onEdit: (item: GTMItem) => void;
  onRemove: (item: GTMItem) => void;
}

const GTMItemChangesModal: React.FC<GTMItemChangesModalProps> = ({
  open,
  onClose,
  gtmItem,
  onEdit,
  onRemove,
}) => {
  if (!gtmItem) return null;

  // Helper to get edit action text
  const getEditActionText = (itemType: string): string => {
    switch (itemType) {
      case 'Price':
        return 'Edit prices';
      case 'Product name':
        return 'Edit product name';
      case 'Product description':
        return 'Edit product description';
      case 'Feature':
        return 'Edit feature';
      case 'Archive':
        return 'Edit archive status';
      default:
        return 'Edit';
    }
  };

  // Render content based on item type
  const renderContent = () => {
    if (gtmItem.type === 'Price' && gtmItem.priceChange) {
      const priceChange = gtmItem.priceChange; // Store reference to avoid repeated null checks
      
      // For price items, use the existing PriceChangesSummary component
      // We need to convert the priceChange data to the format expected by PriceChangesSummary
      const changes = priceChange.currencyChanges.map(currencyChange => ({
        currency: currencyChange.currencyCode,
        currencyName: getCurrencyName(currencyChange.currencyCode),
        currentPrice: currencyChange.currentAmount,
        newPrice: currencyChange.newAmount,
        change: {
          amount: currencyChange.newAmount - currencyChange.currentAmount,
          percentage: currencyChange.currentAmount === 0 ? 
            (currencyChange.newAmount > 0 ? 100 : 0) : 
            ((currencyChange.newAmount - currencyChange.currentAmount) / currencyChange.currentAmount) * 100
        },
        validity: priceChange.context.channel && priceChange.context.billingCycle ? 
          `${priceChange.context.channel} - ${priceChange.context.billingCycle}` : 
          'Current pricing context'
      }));

      const isFieldChannel = priceChange.context.channel?.toLowerCase() === 'field';

      return (
        <PriceChangesSummary
          productName={gtmItem.productName}
          isFieldChannel={isFieldChannel}
          changes={changes}
          priceGroupAction={priceChange.impactType === 'CREATE_NEW_SKU' ? 'create' : 'update'}
          hideTitle={true}
        />
      );
    } else {
      // For non-price items, show before/after comparison
      return (
        <div style={{ padding: '16px 0' }}>
          <Title level={4} style={{ marginBottom: '16px' }}>
            {gtmItem.type} Change
          </Title>
          
          {gtmItem.beforeValue && gtmItem.afterValue ? (
            <div style={{ 
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '6px',
              border: '1px solid #d9d9d9'
            }}>
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>Current:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text>{gtmItem.beforeValue}</Text>
                </div>
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ fontSize: '13px', color: '#666', fontWeight: 500 }}>New:</Text>
                <div style={{ marginTop: '4px' }}>
                  <Text style={{ fontWeight: 500 }}>{gtmItem.afterValue}</Text>
                </div>
              </div>
              
              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e8e8e8' }}>
                <Text style={{ fontSize: '12px', color: '#999' }}>
                  Created by {gtmItem.createdBy} on {new Date(gtmItem.createdDate).toLocaleDateString()}
                </Text>
              </div>
            </div>
          ) : (
            // Fallback for items without before/after values
            <div style={{ 
              padding: '16px',
              backgroundColor: '#fafafa',
              borderRadius: '6px',
              border: '1px solid #d9d9d9'
            }}>
              <Text strong>Change Details:</Text>
              <div style={{ marginTop: '8px' }}>
                <Text>{gtmItem.details}</Text>
              </div>
              
              <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                <Text type="secondary">
                  Created by {gtmItem.createdBy} on {new Date(gtmItem.createdDate).toLocaleDateString()}
                </Text>
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  // Helper function to get currency display name
  const getCurrencyName = (currencyCode: string): string => {
    const currencyNames: Record<string, string> = {
      'USD': 'US Dollar',
      'EUR': 'Euro', 
      'GBP': 'British Pound',
      'JPY': 'Japanese Yen',
      'CAD': 'Canadian Dollar',
      'AUD': 'Australian Dollar',
      'SGD': 'Singapore Dollar',
      'HKD': 'Hong Kong Dollar',
      'CNY': 'Chinese Yuan',
      'INR': 'Indian Rupee',
    };
    return currencyNames[currencyCode] || currencyCode;
  };

  return (
    <Modal
      title={`${gtmItem.type} changes for ${gtmItem.productName}`}
      open={open}
      onCancel={onClose}
      width={800}
      zIndex={1200}
      styles={{
        body: {
          paddingTop: '32px'
        }
      }}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left side - Remove button */}
          <Button
            icon={<Trash2 size={14} />}
            onClick={() => onRemove(gtmItem)}
            danger
          >
            Remove from motion
          </Button>

          {/* Right side - Edit and Cancel buttons */}
          <Space>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="primary"
              icon={<Pencil size={14} />}
              onClick={() => onEdit(gtmItem)}
            >
              {getEditActionText(gtmItem.type)}
            </Button>
          </Space>
        </div>
      }
    >
      {renderContent()}
    </Modal>
  );
};

export default GTMItemChangesModal;
