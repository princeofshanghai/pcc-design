import React, { useState } from 'react';
import { Modal, Button, Space, theme, Typography, Radio } from 'antd';
import { ArrowLeft, ArrowRight, Save, FileText, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContextSelector from './ContextSelector';
import SkuSelector from './SkuSelector';
import FieldPriceMatrix from './FieldPriceMatrix';
import SimplePriceTable from './SimplePriceTable';
import PriceChangesSummary from './PriceChangesSummary';
import GTMMotionSelector, { type GTMMotionSelection } from './GTMMotionSelector';
import { ChannelTag, BillingCycleTag } from '../../index';
import { addPriceChangesToGTMMotion, createAndAddGTMMotion } from '../../../utils/mock-data';
import { showSuccessMessage, showErrorMessage } from '../../../utils/messageUtils';

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
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(directEditMode ? 2 : 0);
  const [selectedContext, setSelectedContext] = useState<any>(directEditMode ? prefilledContext : null);
  const [gtmMotionSelection, setGTMMotionSelection] = useState<GTMMotionSelection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // New state for creation method - initialize with prop
  const [creationMethod, setCreationMethod] = useState<'blank' | 'clone' | null>(initialCreationMethod);
  
  // SKU selection state
  const [skuSelection, setSkuSelection] = useState<{ action: 'create' | 'update'; selectedSku?: any } | null>(null);
  
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
        setCurrentStep(2); // Start at price editing step
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
    if (directEditMode) {
      // Direct edit mode: Step 2 (price editing) → Step 3 (review) → Step 4 (GTM)
      if (currentStep === 2) {
        // Capture changes before going to review
        captureAndDetectChanges();
        setCurrentStep(3); // Go to review step
      } else if (currentStep === 3) {
        setCurrentStep(4); // Go to GTM step
      }
    } else {
      // Create mode: Regular step progression
      if (currentStep === 2) {
        // If moving from price editing (step 2) to review (step 3), capture changes
        captureAndDetectChanges();
      }
      
      // Always increment by 1 - consistent 5 steps (0-4)
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
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
    if (directEditMode) {
      // Direct edit mode: Step 4 (GTM) → Step 3 (review) → Step 2 (price editing)
      if (currentStep === 4) {
        setCurrentStep(3); // Go back to review
      } else if (currentStep === 3) {
        setCurrentStep(2); // Go back to price editing
      }
    } else {
      // Create mode: Regular step decrement
      const newStep = Math.max(currentStep - 1, 0);
      
      // Clear saved price inputs when going back to Step 0 (context selection)
      if (newStep === 0) {
        setSavedSimplePriceInputs({});
        setSavedFieldPriceInputs({});
      }
      
      setCurrentStep(newStep);
    }
  };

  const handleClose = () => {
    // Reset state based on mode
    if (directEditMode) {
      setCurrentStep(2);
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
      return `Edit price points in price group for ${productName}`;
    } else {
      return `Create new price group in ${productName}`;
    }
  };

  // Helper function to get title content with inline tags
  const getTitleWithTags = (): React.ReactNode => {
    const title = getDynamicTitle();
    
    // Get context for tags - show live updates in all steps when we have context
    let context = null;
    if (directEditMode && selectedContext) {
      context = selectedContext;
    } else if (!directEditMode && selectedContext) {
      // Show tags in all steps (including Step 1) when we have any context
      context = selectedContext;
    }

    // Build tags array based on what's available (partial selections allowed)
    const tags = [];
    if (context?.channel) {
      tags.push(
        <ChannelTag 
          key="channel"
          channel={context.channel} 
          variant="small" 
          showIcon={false} 
        />
      );
    }
    if (context?.billingCycle) {
      tags.push(
        <BillingCycleTag 
          key="billingCycle"
          billingCycle={context.billingCycle} 
          variant="small" 
          showIcon={false} 
        />
      );
    }

    // If no tags to show, show just the title
    if (tags.length === 0) {
      return (
        <Title level={3} style={{ margin: 0, fontSize: token.fontSizeHeading2 }}>
          {title}
        </Title>
      );
    }

    // Show title with available tags
    return (
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <Title level={3} style={{ margin: 0, fontSize: token.fontSizeHeading2 }}>
          {title}
        </Title>
        <Space size={8}>
          {tags}
        </Space>
      </div>
    );
  };

  // Helper function to get dynamic subtitle based on current state  
  const getDynamicSubtitle = (): React.ReactNode => {
    // For edit mode: always show subtitle if we have context
    if (directEditMode && selectedContext) {
      return formatSubtitle(selectedContext);
    }
    
    // For create mode: show subtitle in all steps when we have context (including Step 1)
    if (!directEditMode && selectedContext) {
      return formatSubtitle(selectedContext);
    }
    
    return null;
  };

  // Helper function to format subtitle consistently - now only handles LIX
  const formatSubtitle = (context: any): React.ReactNode => {
    const { lixKey, lixTreatment } = context;
    
    // Only show LIX info if both key and treatment exist
    if (!lixKey || !lixTreatment) {
      return null;
    }

    return (
      <Text style={{ fontSize: '14px', color: token.colorTextSecondary, marginTop: '4px', display: 'block', fontWeight: 400 }}>
        LIX: {lixKey} ({lixTreatment})
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
      
      let motionId: string;
      
      // Actually save to GTM Motion
      if (gtmMotionSelection.mode === 'existing' && gtmMotionSelection.existingMotion) {
        // Add to existing GTM Motion
        const success = addPriceChangesToGTMMotion(
          gtmMotionSelection.existingMotion.id,
          productId,
          productName,
          priceChanges,
          selectedContext
        );
        
        if (!success) {
          throw new Error('Failed to add price changes to existing GTM Motion');
        }
        
        motionId = gtmMotionSelection.existingMotion.id;
        console.log(`✅ Added price changes to existing GTM Motion: ${gtmMotionSelection.existingMotion.name}`);
        
      } else if (gtmMotionSelection.mode === 'new' && gtmMotionSelection.newMotion) {
        // Create new GTM Motion
        const newMotion = createAndAddGTMMotion(
          gtmMotionSelection.newMotion.name,
          gtmMotionSelection.newMotion.description,
          gtmMotionSelection.newMotion.activationDate,
          productId,
          productName,
          priceChanges,
          selectedContext
        );
        
        motionId = newMotion.id;
        console.log(`✅ Created new GTM Motion: ${newMotion.name} (ID: ${newMotion.id})`);
      } else {
        throw new Error('Invalid GTM Motion selection');
      }
      
      // Show success toast and navigate to GTM motion detail
      showSuccessMessage('Changes added to GTM motion');
      handleClose();
      navigate(`/gtm-motions/${motionId}`);
      
    } catch (error) {
      console.error('Failed to save price changes:', error);
      showErrorMessage('Failed to save changes. Please try again.');
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
        // SKU Action step - always show meaningful content
        const existingSkus = selectedContext?.existingSkusForContext || [];
        
        if (existingSkus.length > 0) {
          // Show SKU selector when existing SKUs found
          return (
            <div style={{ padding: '16px 0' }}>
              <div style={{ maxWidth: '640px', margin: '0 auto', marginBottom: '24px' }}>
                <Title level={3} style={{ marginBottom: '16px' }}>
                  Choose Action for Existing SKUs
                </Title>
                <SkuSelector
                  existingSkus={existingSkus}
                  product={product}
                  onSelectionChange={setSkuSelection}
                />
              </div>
            </div>
          );
        } else {
          // Show confirmation when creating new SKU
          return (
            <div style={{ padding: '16px 0' }}>
              <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
                <Title level={3} style={{ marginBottom: '16px' }}>
                  Ready to Create New SKU
                </Title>
                <div style={{ 
                  padding: '24px',
                  backgroundColor: token.colorSuccessBg,
                  border: `1px solid ${token.colorSuccessBorder}`,
                  borderRadius: token.borderRadius,
                  marginBottom: '16px'
                }}>
                  <div style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>
                    Creating new SKU and price group for:
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '8px',
                    fontSize: '14px'
                  }}>
                    <ChannelTag channel={selectedContext?.channel} variant="small" showIcon={false} />
                    <span>•</span>
                    <BillingCycleTag billingCycle={selectedContext?.billingCycle} variant="small" showIcon={false} />
                    {selectedContext?.lixKey && (
                      <>
                        <span>•</span>
                        <span>{selectedContext.lixKey} ({selectedContext.lixTreatment})</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }
        break;
      case 2:
        // Price editing step
        if (!selectedContext) {
          return (
            <div style={{ padding: '32px 0', textAlign: 'center' }}>
              <Title level={4} style={{ color: token.colorTextSecondary }}>
                Step 3: Price Editing
              </Title>
              <p style={{ color: token.colorTextDescription }}>
                Please complete previous steps to continue.
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
      case 3:
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
      case 4:
        // GTM Selection step
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
            {getTitleWithTags()}
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
              (() => {
                // Direct edit mode: Steps 2, 3, 4 displayed as "Step 1 of 3", "Step 2 of 3", "Step 3 of 3"
                const displayStep = currentStep - 1; // Convert step 2→1, step 3→2, step 4→3
                return `Step ${displayStep} of 3`;
              })() :
              `Step ${currentStep + 1} of 5`
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
            {(directEditMode && currentStep > 2) || (!directEditMode && currentStep > 0) ? (
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
            {(directEditMode && currentStep < 4) || (!directEditMode && currentStep < 4) ? (
              <Button 
                type="primary"
                onClick={handleNext}
                icon={<ArrowRight size={14} />}
                size="middle"
                disabled={
                  directEditMode ? (
                    // Direct edit mode validation
                    currentStep === 2 ? !hasRealTimeChanges :  // Price editing step
                    currentStep === 3 ? !hasChanges : false    // Review step
                  ) : (
                    // Create mode validation
                    currentStep === 0 ? !isCreationMethodValid() :
                    currentStep === 1 ? (() => {
                      const existingSkus = selectedContext?.existingSkusForContext || [];
                      // Step 1 (SKU Action): either no SKUs (auto-create) or user made selection
                      return existingSkus.length > 0 ? !skuSelection : false;
                    })() :
                    currentStep === 2 ? !hasRealTimeChanges :  // Price editing step
                    currentStep === 3 ? !hasChanges : false    // Review step
                  )
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
