import React, { useState } from 'react';
import { Modal, Button, Space, theme, Typography } from 'antd';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import ContextSelector from './ContextSelector';
import FieldPriceMatrix from './FieldPriceMatrix';
import SimplePriceTable from './SimplePriceTable';
import GTMMotionSelector, { type GTMMotionSelection } from './GTMMotionSelector';
import { addPriceChangesToGTMMotion, createAndAddGTMMotion } from '../../../utils/mock-data';

const { Title } = Typography;

interface PriceEditorModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
  product: any; // Full product data for context selection
  directEditMode?: boolean; // Skip Step 1 and go directly to Step 2
  prefilledContext?: any; // Pre-filled context for direct edit mode
}

const PriceEditorModal: React.FC<PriceEditorModalProps> = ({
  open,
  onClose,
  productName,
  productId, // Used for GTM Motion creation
  product,
  directEditMode = false,
  prefilledContext = null,
}) => {
  const { token } = theme.useToken();
  const [currentStep, setCurrentStep] = useState(directEditMode ? 1 : 0);
  const [selectedContext, setSelectedContext] = useState<any>(directEditMode ? prefilledContext : null);
  const [gtmMotionSelection, setGTMMotionSelection] = useState<GTMMotionSelection | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, 2)); // Max step is 2 (0-indexed) - Step 3 total
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, directEditMode ? 1 : 0)); // Min step depends on mode
  };

  const handleClose = () => {
    // Reset state based on mode
    if (directEditMode) {
      setCurrentStep(1);
      setSelectedContext(prefilledContext);
    } else {
      setCurrentStep(0);
      setSelectedContext(null);
    }
    setGTMMotionSelection(null);
    setIsSaving(false);
    onClose();
  };

  const handleGTMMotionSelectionChange = (selection: GTMMotionSelection) => {
    setGTMMotionSelection(selection);
  };

  const handleSave = async () => {
    if (!gtmMotionSelection) return;

    setIsSaving(true);
    
    try {
      console.log('Saving price changes...', {
        context: selectedContext,
        gtmSelection: gtmMotionSelection,
        productName: productName
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Actually save to GTM Motion
      if (gtmMotionSelection.mode === 'existing' && gtmMotionSelection.existingMotion) {
        // Add to existing GTM Motion
        const success = addPriceChangesToGTMMotion(
          gtmMotionSelection.existingMotion.id,
          productId,
          productName
        );
        
        if (!success) {
          throw new Error('Failed to add price changes to existing GTM Motion');
        }
        
        console.log(`✅ Added price changes to existing GTM Motion: ${gtmMotionSelection.existingMotion.name}`);
        
      } else if (gtmMotionSelection.mode === 'new' && gtmMotionSelection.newMotion) {
        // Create new GTM Motion
        const newMotion = createAndAddGTMMotion(
          gtmMotionSelection.newMotion.name,
          gtmMotionSelection.newMotion.description,
          gtmMotionSelection.newMotion.activationDate,
          productId,
          productName
        );
        
        console.log(`✅ Created new GTM Motion: ${newMotion.name} (ID: ${newMotion.id})`);
      }
      
      // Show success and close modal
      // TODO: Add success notification (toast)
      handleClose();
      
    } catch (error) {
      console.error('Failed to save price changes:', error);
      // TODO: Add error notification
    } finally {
      setIsSaving(false);
    }
  };

  const handleContextChange = (context: any) => {
    setSelectedContext(context);
  };

  const isContextValid = () => {
    if (!selectedContext) return false;
    
    // Check required fields (validity is now handled in Step 2)
    return !!(
      selectedContext.channel &&
      selectedContext.billingCycle &&
      selectedContext.priceGroupAction // Price group selection is required
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <ContextSelector 
            product={product} 
            onContextChange={handleContextChange} 
          />
        );
      case 1:
        if (!selectedContext) {
          return (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <Title level={4} style={{ color: token.colorTextSecondary }}>
                Step 2: Price Editing
              </Title>
              <p style={{ color: token.colorTextDescription }}>
                Please complete Step 1 to continue.
              </p>
            </div>
          );
        }

        const isFieldChannel = selectedContext.channel?.toLowerCase() === 'field';
        
        return (
          <div style={{ padding: '16px 0' }}>
            {isFieldChannel ? (
              <FieldPriceMatrix 
                selectedContext={selectedContext}
                product={product}
                onPriceChange={(currency, seatRange, tier, newPrice) => {
                  // Handle price changes for Field channel
                  console.log('Field price change:', { currency, seatRange, tier, newPrice });
                }}
              />
            ) : (
              <SimplePriceTable 
                selectedContext={selectedContext}
                product={product}
                onPriceChange={(currency, newPrice) => {
                  // Handle price changes for Desktop/iOS/GPB channels
                  console.log('Simple price change:', { currency, newPrice });
                }}
              />
            )}
          </div>
        );
      case 2:
        return (
          <div style={{ padding: '16px 0' }}>
            <GTMMotionSelector 
              onSelectionChange={handleGTMMotionSelectionChange}
              selectedProductName={productName}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title={
        <div style={{ position: 'relative' }}>
          <Title level={3} style={{ margin: 0 }}>
            {directEditMode ? 'Edit prices' : `Update prices for ${productName}`}
          </Title>
          {/* Full-width divider */}
          <div 
            style={{
              position: 'absolute',
              bottom: '-16px',
              left: '-24px',
              right: '-24px',
              height: '1px',
              backgroundColor: token.colorBorder,
            }}
          />
        </div>
      }
      open={open}
      onCancel={handleClose}
      width="95vw"
      style={{ 
        top: 20,
        maxWidth: '1400px',
      }}
      bodyStyle={{
        height: '90vh',
        maxHeight: '1000px',
        padding: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}
      styles={{
        header: {
          paddingBottom: '16px',
          position: 'relative',
          flexShrink: 0,
        },
        body: {
          padding: '0',
          overflow: 'hidden',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        },
        footer: {
          padding: '0',
          position: 'relative',
          flexShrink: 0,
        },
        wrapper: {
          paddingBottom: '0',
        },
        content: {
          paddingBottom: '0',
          height: '90vh',
          maxHeight: '1000px',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
      zIndex={1100}
      footer={
        <div style={{ position: 'relative' }}>
          {/* Full-width divider */}
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              height: '1px',
              backgroundColor: token.colorBorder,
            }}
          />
          <div style={{ 
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
          {/* Show step indicator */}
          <div style={{ 
            fontSize: '13px', 
            color: token.colorTextSecondary 
          }}>
            {directEditMode ? 
              (currentStep === 1 ? 'Step 1 of 2' : 'Step 2 of 2') :
              `Step ${currentStep + 1} of 3`
            }
          </div>
          
          <Space>
            <Button 
              onClick={handleClose}
              size="middle"
            >
              Cancel
            </Button>
            
            {/* Previous button - show when not on first step */}
            {(directEditMode && currentStep > 1) || (!directEditMode && currentStep > 0) ? (
              <Button 
                onClick={handlePrevious}
                icon={<ArrowLeft size={14} />}
                size="middle"
                disabled={isSaving}
              >
                Previous
              </Button>
            ) : null}
            
            {/* Continue/Save button logic */}
            {currentStep < 2 ? (
              <Button 
                type="primary"
                onClick={handleNext}
                icon={<ArrowRight size={14} />}
                size="middle"
                disabled={currentStep === 0 ? !isContextValid() : false}
              >
                Continue
              </Button>
            ) : (
              <Button 
                type="primary"
                onClick={handleSave}
                icon={<Save size={14} />}
                size="middle"
                disabled={!gtmMotionSelection || isSaving}
                loading={isSaving}
              >
                {isSaving ? 'Saving to draft...' : 'Save to draft GTM motion'}
              </Button>
            )}
          </Space>
          </div>
        </div>
      }
      destroyOnClose
    >
      <div style={{ 
        flex: 1, 
        overflow: 'auto', 
        padding: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {renderStepContent()}
      </div>
    </Modal>
  );
};

export default PriceEditorModal;
