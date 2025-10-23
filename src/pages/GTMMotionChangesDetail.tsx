import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Space, Button } from 'antd';
import { useBreadcrumb } from '../context/BreadcrumbContext';
import { mockGTMMotions } from '../utils/mock-data';
import PriceChangesTable from '../components/pricing/PriceEditor/PriceChangesTable';
import PriceEditorModal from '../components/pricing/PriceEditor/PriceEditorModal';
import { PageHeader } from '../components';
import dayjs from 'dayjs';

const GTMMotionChangesDetail: React.FC = () => {
  const { motionId, itemId } = useParams<{ motionId: string; itemId: string }>();
  const navigate = useNavigate();
  const { setFolderName, setGtmMotionName } = useBreadcrumb();
  
  // Price Editor Modal state
  const [priceEditorOpen, setPriceEditorOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const motion = mockGTMMotions.find(m => m.id === motionId);
  // Find the specific GTM item (refresh when refreshTrigger changes)
  const item = useMemo(() => {
    // Include refreshTrigger in dependency to force re-computation
    return motion?.items.find(item => item.id === itemId);
  }, [motion, itemId, refreshTrigger]);

  // Set up breadcrumb context for GTM motion changes detail
  React.useEffect(() => {
    setFolderName(null);
    if (motion) {
      setGtmMotionName(motion.name);
    }
    return () => {
      setFolderName(null);
      setGtmMotionName(null);
    };
  }, [setFolderName, setGtmMotionName, motion]);

  // Convert single GTM item to unified changes format
  const unifiedChanges = useMemo(() => {
    if (!item) return [];

    const allChanges: any[] = [];

    // Process only the single item (not all items in motion)
    // Check for price changes in the correct location (item.priceChange.currencyChanges)
    if (item.priceChange && item.priceChange.currencyChanges && Array.isArray(item.priceChange.currencyChanges)) {
      item.priceChange.currencyChanges.forEach((change, changeIndex) => {
        // Calculate change amount and percentage
        const changeAmount = change.changeAmount || (change.newAmount - change.currentAmount);
        const changePercentage = change.changePercentage || 
          (change.currentAmount === 0 ? 100 : (changeAmount / change.currentAmount) * 100);
        
        const baseChange = {
          id: `${item.id}-change-${changeIndex}`,
          currency: change.currencyCode,
          currencyName: change.currencyCode, // Use currency code as name for now
          currentPrice: change.currentAmount,
          newPrice: change.newAmount,
          change: {
            amount: changeAmount,
            percentage: changePercentage
          },
          validity: item.priceChange?.context?.validityPeriod?.validFrom 
            ? `${new Date(item.priceChange.context.validityPeriod.validFrom).toLocaleDateString()} - present`
            : 'Using defaults',
          status: (change.currentAmount === 0 ? 'new' : 'updated') as 'new' | 'updated',
          // Add product context for GTM (multiple products)
          productName: item.productName,
          productId: item.productId
        };

        // Check if this is a Field product to determine the correct format
        const isFieldProduct = item.priceChange?.context?.channel === 'Field';
        
        if (isFieldProduct) {
          // Field product: use expandable format with seat ranges and tiers from individual currency changes
          const seatRange = change.seatRange || 'Unknown range';
          const tier = change.tier || 'Base';
            
          allChanges.push({
            ...baseChange,
            type: 'field' as const,
            context: `${seatRange} seats, ${tier}`,
            seatRange: seatRange,
            tier: tier
          });
        } else {
          // Non-Field product: use simple format
          allChanges.push({
            ...baseChange,
            type: 'simple' as const,
            context: 'Base price' as const
          });
        }
      });
    }

    return allChanges;
  }, [item]);


  const handleEditPrices = () => {
    setPriceEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setPriceEditorOpen(false);
  };

  const handleSaveSuccess = (updated: boolean) => {
    if (updated) {
      // Trigger data refresh by incrementing the trigger
      setRefreshTrigger(prev => prev + 1);
    }
  };


  if (!motion || !item) {
    return (
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <PageHeader
          entityType="GTM Item"
          title={!motion ? "Motion Not Found" : "Item Not Found"}
          compact
        />
        <Button onClick={() => navigate('/gtm-motions')}>
          Back to GTM Motions
        </Button>
      </Space>
    );
  }


  return (
    <Space direction="vertical" style={{ width: '100%' }} size="middle">
      <PageHeader
        entityType="GTM Item"
        title={`GTM item in ${motion.name}`}
        actions={[
          <Button 
            key="edit"
            type="primary"
            onClick={handleEditPrices}
            disabled={motion.status !== 'Draft'}
          >
            Edit prices
          </Button>
        ]}
        compact
      />


      {/* Changes Table */}
      <PriceChangesTable
        changes={unifiedChanges}
        title=""
        mode="gtm"
        showSummary={true} // Show SKU context
        showFiltering={false} // Disable filtering for GTM context
        className="gtm-changes-table"
        skuContext={{
          action: item.priceChange?.impactType === 'CREATE_NEW_SKU' ? 'create' : 'update',
          productName: item.productName,
          channel: item.priceChange?.context?.channel || '',
          billingCycle: item.priceChange?.context?.billingCycle || '',
          skuIds: item.priceChange?.targetSkuId ? [item.priceChange.targetSkuId] : undefined
        }}
      />

      {/* Price Editor Modal */}
      <PriceEditorModal
        open={priceEditorOpen}
        onClose={handleCloseEditor}
        productName={item.productName}
        productId={item.productId}
        product={null} // We'll need to fetch this if required
        initialStep={1} // Start at price editing step (Step 1)
        directEditMode={true}
        prefilledContext={{
          channel: item.priceChange?.context?.channel,
          billingCycle: item.priceChange?.context?.billingCycle,
          priceGroupAction: item.priceChange?.context?.priceGroupAction,
          validityStartDate: item.priceChange?.context?.validityPeriod?.validFrom 
            ? dayjs(item.priceChange.context.validityPeriod.validFrom) 
            : null,
          validityEndDate: item.priceChange?.context?.validityPeriod?.validUntil 
            ? dayjs(item.priceChange.context.validityPeriod.validUntil) 
            : null,
        }}
        existingPriceData={{
          currencyChanges: item.priceChange?.currencyChanges || []
        }}
        gtmItemId={item.id}
        gtmMotionId={motion.id}
        onSaveToGTM={handleSaveSuccess}
      />

    </Space>
  );
};

export default GTMMotionChangesDetail;
