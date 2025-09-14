import React, { useState } from 'react';
import { Modal, Button, Space, theme, Typography, Radio } from 'antd';
import { ArrowLeft, ArrowRight, Save, FileText, Copy } from 'lucide-react';
import ContextSelector from './ContextSelector';
import FieldPriceMatrix from './FieldPriceMatrix';
import SimplePriceTable from './SimplePriceTable';
import PriceChangesSummary from './PriceChangesSummary';
import GTMMotionSelector, { type GTMMotionSelection } from './GTMMotionSelector';
import { addPriceChangesToGTMMotion, createAndAddGTMMotion } from '../../../utils/mock-data';

const { Title, Text } = Typography;

interface PriceEditorModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
  product: any; // Full product data for context selection
  directEditMode?: boolean; // Skip Step 1 and go directly to Step 2
  prefilledContext?: any; // Pre-filled context for direct edit mode
  initialCreationMethod?: 'blank' | 'clone' | null; // Pre-select creation method
}

const PriceEditorModal: React.FC<PriceEditorModalProps> = ({
  open,
  onClose,
  productName,
  productId, // Used for GTM Motion creation
  product,
  directEditMode = false,
  prefilledContext = null,
  initialCreationMethod = null,
}) => {
  const { token } = theme.useToken();
  const [currentStep, setCurrentStep] = useState(directEditMode ? 1 : 0);
  const [selectedContext, setSelectedContext] = useState<any>(directEditMode ? prefilledContext : null);
  const [gtmMotionSelection, setGTMMotionSelection] = useState<GTMMotionSelection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // New state for creation method - initialize with prop
  const [creationMethod, setCreationMethod] = useState<'blank' | 'clone' | null>(initialCreationMethod);
  
  // State to track price changes for the review step
  const [priceChanges, setPriceChanges] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Real-time tracking of changes in Step 1 (price editing)
  const [hasRealTimeChanges, setHasRealTimeChanges] = useState(false);
  
  // State persistence for Step 2 <-> Step 3 navigation
  const [savedSimplePriceInputs, setSavedSimplePriceInputs] = useState<Record<string, string>>({});
  const [savedFieldPriceInputs, setSavedFieldPriceInputs] = useState<Record<string, Record<string, Record<string, string>>>>({});
  
  // Refs to access current state from child components
  const fieldPriceRef = React.useRef<any>(null);
  const simplePriceRef = React.useRef<any>(null);

  // Reset state when modal opens or initialCreationMethod changes
  React.useEffect(() => {
    if (open) {
      if (directEditMode) {
        setCurrentStep(1);
        setSelectedContext(prefilledContext);
      } else {
        setCurrentStep(0);
        setSelectedContext(null);
        setCreationMethod(initialCreationMethod);
      }
      setGTMMotionSelection(null);
      setIsSaving(false);
      setPriceChanges([]);
      setHasChanges(false);
      setHasRealTimeChanges(false);
      setSavedSimplePriceInputs({}); // Clear saved price inputs on modal open
      setSavedFieldPriceInputs({});
    }
  }, [open, directEditMode, prefilledContext, initialCreationMethod]);

  const handleNext = () => {
    // If moving from step 1 (price editing) to step 2 (review), capture changes
    if (currentStep === 1) {
      captureAndDetectChanges();
    }
    setCurrentStep(prev => Math.min(prev + 1, 3)); // Max step is 3 (0-indexed) - Step 4 total
  };

  const captureAndDetectChanges = () => {
    if (!selectedContext) return;

    const isFieldChannel = selectedContext.channel?.toLowerCase() === 'field';
    let currentState = null;

    try {
      // Get current state from the appropriate ref
      if (isFieldChannel && fieldPriceRef.current) {
        currentState = fieldPriceRef.current.getCurrentState();
      } else if (!isFieldChannel && simplePriceRef.current) {
        currentState = simplePriceRef.current.getCurrentState();
      }

      if (!currentState) {
        console.warn('Could not get current state from pricing components');
        setPriceChanges([]);
        setHasChanges(false);
        return;
      }

      const changes = detectPriceChanges(
        isFieldChannel,
        currentState.priceInputs,
        currentState.priceData,
        currentState.validityDates
      );

      console.log('🔍 Detected changes:', changes);
      setPriceChanges(changes);
      setHasChanges(changes.length > 0);
      
      // Save price inputs for Step 2 <-> Step 3 persistence
      if (isFieldChannel) {
        setSavedFieldPriceInputs(currentState.priceInputs || {});
      } else {
        setSavedSimplePriceInputs(currentState.priceInputs || {});
      }
    } catch (error) {
      console.error('Error capturing changes:', error);
      setPriceChanges([]);
      setHasChanges(false);
    }
  };

  const handlePrevious = () => {
    const newStep = Math.max(currentStep - 1, directEditMode ? 1 : 0);
    
    // Clear saved price inputs when going back to Step 0 (context selection)
    if (newStep === 0) {
      setSavedSimplePriceInputs({});
      setSavedFieldPriceInputs({});
    }
    
    setCurrentStep(newStep);
  };

  const handleClose = () => {
    // Reset state based on mode
    if (directEditMode) {
      setCurrentStep(1);
      setSelectedContext(prefilledContext);
    } else {
      setCurrentStep(0);
      setSelectedContext(null);
      setCreationMethod(initialCreationMethod); // Reset to initial creation method
    }
    setGTMMotionSelection(null);
    setIsSaving(false);
    setPriceChanges([]);
    setHasChanges(false);
    setHasRealTimeChanges(false);
    setSavedSimplePriceInputs({}); // Clear saved price inputs
    setSavedFieldPriceInputs({});
    onClose();
  };

  const handleGTMMotionSelectionChange = (selection: GTMMotionSelection) => {
    setGTMMotionSelection(selection);
  };


  // Helper function to detect and format price changes
  const detectPriceChanges = (isFieldChannel: boolean, priceInputs: any, currentPrices: any, validityInfo: any) => {
    const changes: any[] = [];
    
    if (isFieldChannel) {
      // Field channel change detection
      Object.entries(priceInputs).forEach(([currency, seatRangeData]: [string, any]) => {
        Object.entries(seatRangeData).forEach(([seatRange, tierData]: [string, any]) => {
          Object.entries(tierData).forEach(([tier, newPriceInput]) => {
            const priceInput = newPriceInput as string;
            if (!priceInput || priceInput.trim() === '') return;
            
            const newPriceValue = parseFloat(priceInput.replace(/,/g, ''));
            if (isNaN(newPriceValue) || newPriceValue < 0) return;
            
            const currentPrice = currentPrices[currency]?.[seatRange]?.[tier] || null;
            const hasChanged = currentPrice === null || Math.abs(newPriceValue - currentPrice) >= 0.01;
            
            if (hasChanged) {
              const change = currentPrice !== null ? {
                amount: newPriceValue - currentPrice,
                percentage: currentPrice === 0 ? 0 : ((newPriceValue - currentPrice) / currentPrice) * 100
              } : { amount: newPriceValue, percentage: 100 };
              
              changes.push({
                currency,
                currencyName: getCurrencyName(currency),
                seatRange,
                tier: tier === 'NULL_TIER' ? 'Base' : tier,
                currentPrice,
                newPrice: newPriceValue,
                change,
                validity: formatValidity(validityInfo)
              });
            }
          });
        });
      });
    } else {
      // Non-field channel change detection
      Object.entries(priceInputs).forEach(([currency, newPriceInput]) => {
        const priceInput = newPriceInput as string;
        if (!priceInput || priceInput.trim() === '') return;
        
        const newPriceValue = parseFloat(priceInput.replace(/,/g, ''));
        if (isNaN(newPriceValue) || newPriceValue < 0) return;
        
        const currentPrice = currentPrices[currency] || null;
        const hasChanged = currentPrice === null || Math.abs(newPriceValue - currentPrice) >= 0.01;
        
        if (hasChanged) {
          const change = currentPrice !== null ? {
            amount: newPriceValue - currentPrice,
            percentage: currentPrice === 0 ? 0 : ((newPriceValue - currentPrice) / currentPrice) * 100
          } : { amount: newPriceValue, percentage: 100 };
          
          changes.push({
            currency,
            currencyName: getCurrencyName(currency),
            currentPrice,
            newPrice: newPriceValue,
            change,
            validity: formatValidity(validityInfo)
          });
        }
      });
    }
    
    return changes;
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

  // Helper function to format validity information
  const formatValidity = (validityInfo: any): string => {
    if (!validityInfo) return 'Using defaults';
    
    const { startDate, endDate } = validityInfo;
    if (!startDate) return 'Using defaults';
    
    const startText = startDate.format('MMM D, YYYY');
    const endText = endDate ? endDate.format('MMM D, YYYY') : 'present';
    return `${startText} - ${endText}`;
  };

  // Helper function to get dynamic title based on current flow
  const getDynamicTitle = (): string => {
    if (directEditMode) {
      const priceGroupId = selectedContext?.existingPriceGroup?.id || prefilledContext?.existingPriceGroup?.id;
      if (priceGroupId) {
        return `Edit price group ${priceGroupId} in ${productName}`;
      }
      return `Edit price group in ${productName}`;
    } else {
      return `Create new price group in ${productName}`;
    }
  };

  // Helper function to get dynamic subtitle based on current state  
  const getDynamicSubtitle = (): React.ReactNode => {
    // For edit mode: always show subtitle if we have context
    if (directEditMode && selectedContext) {
      return formatSubtitle(selectedContext);
    }
    
    // For create mode: only show subtitle from Step 2 onwards when we have context
    if (!directEditMode && currentStep >= 1 && selectedContext) {
      return formatSubtitle(selectedContext);
    }
    
    return null;
  };

  // Helper function to format subtitle consistently
  const formatSubtitle = (context: any): React.ReactNode => {
    const { channel, billingCycle, lixKey, lixTreatment } = context;
    
    if (!channel || !billingCycle) {
      return null;
    }

    const parts = [channel, billingCycle];
    
    // Add LIX info if both key and treatment exist
    if (lixTreatment && lixKey) {
      parts.push(`${lixKey} (${lixTreatment})`);
    }

    return (
      <Text style={{ fontSize: '14px', color: token.colorTextSecondary, marginTop: '4px', display: 'block', fontWeight: 400 }}>
        {parts.join(' • ')}
      </Text>
    );
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

  const isCreationMethodValid = () => {
    if (directEditMode) return true; // Skip validation for direct edit
    
    // Must select creation method
    if (!creationMethod) return false;
    
    // Must have valid context
    return isContextValid();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div style={{ padding: '16px 0' }}>
            {/* Creation Method Selection */}
            <div style={{ marginBottom: '32px', maxWidth: '640px', margin: '0 auto' }}>
              <Radio.Group
                value={creationMethod}
                onChange={(e) => setCreationMethod(e.target.value)}
                style={{ width: '100%' }}
              >
                <div style={{ display: 'flex', gap: '16px', width: '100%' }}>
                  {/* Create from blank card */}
                 <div
                   onClick={() => setCreationMethod('blank')}
                   style={{
                     flex: 1,
                     padding: '24px 16px',
                     border: `1px solid ${creationMethod === 'blank' ? token.colorPrimary : token.colorBorder}`,
                     borderRadius: token.borderRadius,
                     backgroundColor: creationMethod === 'blank' ? token.colorPrimaryBg : token.colorBgContainer,
                     cursor: 'pointer',
                     transition: 'all 0.2s ease',
                     display: 'flex',
                     flexDirection: 'column',
                     alignItems: 'center',
                     gap: '12px'
                   }}
                 >
                   <FileText size={20} style={{ color: token.colorText }} />
                   <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                     Create from blank
                   </div>
                 </div>

                  {/* Clone from existing card */}
                  <div
                    onClick={() => setCreationMethod('clone')}
                    style={{
                      flex: 1,
                      padding: '24px 16px',
                      border: `1px solid ${creationMethod === 'clone' ? token.colorPrimary : token.colorBorder}`,
                      borderRadius: token.borderRadius,
                      backgroundColor: creationMethod === 'clone' ? token.colorPrimaryBg : token.colorBgContainer,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <Copy size={20} style={{ color: token.colorText }} />
                    <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                      Clone from existing
                    </div>
                  </div>
                </div>
              </Radio.Group>
            </div>

            {/* Context Selection - show when creation method selected */}
            {creationMethod && (
              <div style={{ maxWidth: '640px', margin: '0 auto', marginTop: '32px' }}>
                <Title level={3} style={{ marginBottom: '16px' }}>
                  {creationMethod === 'blank' ? 'Configure new price group' : 'Choose price group to clone'}
                </Title>
                <ContextSelector 
                  product={product} 
                  onContextChange={handleContextChange} 
                  creationMethod={creationMethod}
                  prefilledContext={!directEditMode ? prefilledContext : null}
                />
              </div>
            )}
          </div>
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
                initialPriceInputs={savedFieldPriceInputs}
                onPriceChange={(currency, seatRange, tier, newPrice) => {
                  // Handle price changes for Field channel
                  console.log('Field price change:', { currency, seatRange, tier, newPrice });
                }}
                onHasChanges={setHasRealTimeChanges}
                onGetCurrentState={fieldPriceRef}
              />
            ) : (
              <SimplePriceTable 
                selectedContext={selectedContext}
                product={product}
                initialPriceInputs={savedSimplePriceInputs}
                onPriceChange={(currency, newPrice) => {
                  // Handle price changes for Desktop/iOS/GPB channels
                  console.log('Simple price change:', { currency, newPrice });
                }}
                onHasChanges={setHasRealTimeChanges}
                onGetCurrentState={simplePriceRef}
              />
            )}
          </div>
        );
      case 2:
        // Review changes step
        return (
          <div style={{ padding: '16px 0' }}>
            <PriceChangesSummary
              productName={productName}
              isFieldChannel={selectedContext?.channel?.toLowerCase() === 'field'}
              changes={priceChanges}
              priceGroupAction={selectedContext?.priceGroupAction || 'create'}
            />
          </div>
        );
      case 3:
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
            <Title level={3} style={{ margin: 0, fontSize: token.fontSizeHeading2 }}>
              {getDynamicTitle()}
            </Title>
            {getDynamicSubtitle()}
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
              `Step ${currentStep + 1} of 4`
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
            {currentStep < 3 ? (
              <Button 
                type="primary"
                onClick={handleNext}
                icon={<ArrowRight size={14} />}
                size="middle"
                disabled={
                  currentStep === 0 ? !isCreationMethodValid() :
                  currentStep === 1 ? !hasRealTimeChanges :
                  currentStep === 2 ? !hasChanges : false
                }
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
