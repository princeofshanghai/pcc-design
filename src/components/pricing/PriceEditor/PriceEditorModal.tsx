import React, { useState } from 'react';
import { Drawer, Button, Space, theme, Typography, Radio, Steps, Collapse, DatePicker, AutoComplete, Switch, Select, Alert } from 'antd';
import { ArrowLeft, ArrowRight, Save, File, Copy, X, Check, Plus, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FieldPriceMatrix from './FieldPriceMatrix';
import SimplePriceTable from './SimplePriceTable';
import PriceChangesTable from './PriceChangesTable';
import GTMMotionSelector, { type GTMMotionSelection } from './GTMMotionSelector';
import { addPriceChangesToGTMMotion, createAndAddGTMMotion, updateGTMItemPrices } from '../../../utils/mock-data';
import { showSuccessMessage, showErrorMessage } from '../../../utils/messageUtils';
import type { SalesChannel, BillingCycle } from '../../../utils/types';
import { getChannelIcon } from '../../../utils/channelIcons';
import CopyableId from '../../shared/CopyableId';
import dayjs from 'dayjs';

const { Title } = Typography;

interface PriceEditorModalProps {
  open: boolean;
  onClose: () => void;
  productName: string;
  productId: string;
  product: any; // Full product data for context selection
  directEditMode?: boolean; // Skip Step 1 and go directly to Step 2
  prefilledContext?: any; // Pre-filled context for direct edit mode
  initialStep?: number; // Starting step (0=Configure, 1=Price editing, 2=Review)
  initialCreationMethod?: 'blank' | 'clone' | null; // Pre-select creation method
  existingPriceData?: {
    currencyChanges: Array<{
      currencyCode: string;
      currentAmount: number;
      newAmount: number;
      changeAmount: number;
      changePercentage: number;
      seatRange?: string; // For Field products
      tier?: string; // For Field products
    }>;
  }; // For editing existing GTM items
  gtmItemId?: string; // GTM item ID for updates
  gtmMotionId?: string; // GTM motion ID for updates
  onSaveToGTM?: (updated: boolean) => void; // Callback after save
}

const PriceEditorModal: React.FC<PriceEditorModalProps> = ({
  open,
  onClose,
  productName,
  productId, // Used for GTM Motion creation
  product,
  directEditMode = false,
  prefilledContext = null,
  initialStep = 0,
  initialCreationMethod = null,
  existingPriceData = null,
  gtmItemId = null,
  gtmMotionId = null,
  onSaveToGTM = null,
}) => {
  const { token } = theme.useToken();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(initialStep); // Start at specified step
  const [selectedContext, setSelectedContext] = useState<any>(directEditMode ? prefilledContext : null);
  const [gtmMotionSelection, setGTMMotionSelection] = useState<GTMMotionSelection | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Note: creationMethod is now handled within configData.method
  
  
  // SKU detection alert state
  const [skuAlert, setSkuAlert] = useState<{
    show: boolean;
    type: 'error' | 'success';
    message: string;
    actionButton?: {
      text: string;
      action: () => void;
    };
  }>({
    show: false,
    type: 'success',
    message: '',
    actionButton: undefined
  });
  
  // Configuration collapse state
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [activeCollapseKeys, setActiveCollapseKeys] = useState<string[]>(['method']);
  const [showValidUntil, setShowValidUntil] = useState(false);
  const [isExperiment, setIsExperiment] = useState<boolean | null>(null); // null = no choice made yet
  const [configData, setConfigData] = useState({
    method: null as 'blank' | 'clone' | null,
    channel: null as string | null,
    billingCycle: null as string | null,
    lixKey: null as string | null,
    lixTreatment: null as string | null,
    clonePriceGroup: null as any,
    validityStartDate: null as any, // Empty by default - user must choose
    validityEndDate: null as any
  });

  // All possible options from types
  const ALL_CHANNELS: SalesChannel[] = ['Desktop', 'Field', 'iOS', 'GPB'];
  const ALL_BILLING_CYCLES: BillingCycle[] = ['Monthly', 'Quarterly', 'Annual'];

  // Helper function to format price display (extracted from PriceGroupTable.tsx logic)
  const formatPriceDisplay = (priceGroup: any): string => {
    if (!priceGroup?.pricePoints || priceGroup.pricePoints.length === 0) {
      return 'No price points';
    }

    // Filter for active price points only
    const activePricePoints = priceGroup.pricePoints.filter((p: any) => p.status === 'Active');
    
    if (activePricePoints.length === 0) {
      return 'No active price points';
    }
    
    // Look for USD first
    const usdPrice = activePricePoints.find((p: any) => p.currencyCode === 'USD');
    
    if (usdPrice) {
      // If USD exists, show USD price with additional count
      const additionalActivePricePoints = activePricePoints.length - 1;
      const zeroDecimalCurrencies = new Set([
        'BIF', 'CLP', 'DJF', 'GNF', 'JPY', 'KMF', 'KRW', 'MGA',
        'PYG', 'RWF', 'UGX', 'VND', 'VUV', 'XAF', 'XOF', 'XPF'
      ]);
      
      const amount = zeroDecimalCurrencies.has(usdPrice.currencyCode) 
        ? Math.round(usdPrice.amount) 
        : usdPrice.amount.toFixed(2);
        
      const priceText = `USD ${amount}`;
      
      if (additionalActivePricePoints > 0) {
        return `${priceText} +${additionalActivePricePoints} more`;
      } else {
        return priceText;
      }
    } else {
      // If no USD, just show count of non-USD price points
      const count = activePricePoints.length;
      return `${count} non-USD price point${count === 1 ? '' : 's'}`;
    }
  };

  // Helper function to render price group option label with styled ID
  const renderPriceGroupLabel = (pg: any) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <CopyableId 
        id={pg.id || 'Unknown ID'} 
        readOnly 
        size="small" 
        withBackground 
      />
      <span>
        {pg.channel || 'Unknown Channel'} • {pg.billingCycle || 'Unknown Billing'} • {formatPriceDisplay(pg)}
      </span>
    </div>
  );

  // Extract data from product for form options
  const formOptions = React.useMemo(() => {
    if (!product?.skus) {
      return {
        channels: ALL_CHANNELS,
        billingCycles: ALL_BILLING_CYCLES,
        lixKeys: [],
        lixTreatments: [],
        availableClonePriceGroups: []
      };
    }

    // Available price groups for cloning (only from current product)
    const priceGroupMap = new Map();
    product.skus.forEach((sku: any) => {
      const pg = sku.priceGroup;
      if (pg && !priceGroupMap.has(pg.id)) {
        priceGroupMap.set(pg.id, {
          ...pg,
          channel: sku.salesChannel,
          billingCycle: sku.billingCycle,
          lix: sku.lix || null
        });
      }
    });

    const availableClonePriceGroups = Array.from(priceGroupMap.values()).map((pg: any) => ({
      label: renderPriceGroupLabel(pg),
      value: pg.id,
      searchLabel: `ID ${pg.id || 'Unknown ID'} - ${pg.channel || 'Unknown Channel'} • ${pg.billingCycle || 'Unknown Billing'} • ${formatPriceDisplay(pg)}`, // Plain text for searching
      priceGroup: pg
    }));

    // Extract LIX keys
    const existingLixKeys = [...new Set(
      product.skus
        .filter((sku: any) => sku.lix?.key)
        .map((sku: any) => sku.lix.key)
    )];

    // Extract LIX treatments for selected key
    const existingLixTreatments = configData.lixKey 
      ? [...new Set(
          product.skus
            .filter((sku: any) => sku.lix?.key === configData.lixKey && sku.lix?.treatment)
            .map((sku: any) => sku.lix.treatment)
        )]
      : [];

    return {
      channels: ALL_CHANNELS,
      billingCycles: ALL_BILLING_CYCLES,
      lixKeys: existingLixKeys,
      lixTreatments: existingLixTreatments,
      availableClonePriceGroups
    };
  }, [product, configData.lixKey]);
  
  
  // State to track price changes for the review step
  const [priceChanges, setPriceChanges] = useState<any[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Real-time tracking of changes in Step 1 (price editing)
  const [hasRealTimeChanges, setHasRealTimeChanges] = useState(false);
  
  // State persistence for Step 2 <-> Step 3 navigation
  const [savedSimplePriceInputs, setSavedSimplePriceInputs] = useState<Record<string, string>>({});
  const [savedFieldPriceInputs, setSavedFieldPriceInputs] = useState<Record<string, Record<string, Record<string, string>>>>({});
  const [savedSelectedCurrencies, setSavedSelectedCurrencies] = useState<string[]>([]);
  const [savedCurrencyOrder, setSavedCurrencyOrder] = useState<string[]>([]);
  
  // Refs to access current state from child components
  const fieldPriceRef = React.useRef<any>(null);
  const simplePriceRef = React.useRef<any>(null);

  // Build selectedContext when all configuration sections are complete
  React.useEffect(() => {
    if (!directEditMode) {
      const allSectionsComplete = ['method', 'channel', 'billing', 'validity', 'lix'].every(
        section => completedSections.has(section)
      );
      
      if (allSectionsComplete && configData.method && configData.channel && configData.billingCycle) {
        // Build the context from configData
        const context = {
          channel: configData.channel,
          billingCycle: configData.billingCycle,
          lixKey: configData.lixKey || null,
          lixTreatment: configData.lixTreatment || null,
          clonePriceGroup: configData.clonePriceGroup || null,
          priceGroupAction: 'create', // Always create for the configure flow
          // Check for existing SKUs for context conflict detection
          existingSkusForContext: [] // This will be populated by conflict detection logic
        };
        
        setSelectedContext(context);
      } else if (!allSectionsComplete) {
        // Reset context if sections are incomplete
        setSelectedContext(null);
      }
    }
  }, [completedSections, configData, directEditMode]);

  // Reset state when modal opens or initialCreationMethod changes
  React.useEffect(() => {
    if (open) {
      if (directEditMode) {
        setCurrentStep(initialStep); // Start at specified step
        setSelectedContext(prefilledContext);
        // Pre-populate configData with inherited values from prefilledContext
        setConfigData({
          method: null, // Not applicable for direct edit
          channel: prefilledContext?.channel || null,
          billingCycle: prefilledContext?.billingCycle || null,
          lixKey: prefilledContext?.lixKey || null,
          lixTreatment: prefilledContext?.lixTreatment || null,
          clonePriceGroup: null, // Not applicable for direct edit
          validityStartDate: null as any, // Empty by default - user must choose (editable)
          validityEndDate: null // Default to null (editable)
        });
        // Mark inherited sections as complete, only validity needs user input
        setCompletedSections(new Set(['channel', 'billing', 'lix']));
        setActiveCollapseKeys(['validity']); // Start with validity section open
        setShowValidUntil(false); // Reset valid until visibility
        setIsExperiment(!!(prefilledContext?.lixKey)); // Set based on inherited LIX
      } else {
        setCurrentStep(initialStep);
        setSelectedContext(null);
        // Reset configuration data
        setConfigData({
          method: null,
          channel: null,
          billingCycle: null,
          lixKey: null,
          lixTreatment: null,
          clonePriceGroup: null,
          validityStartDate: null as any, // Reset to empty - user must choose
          validityEndDate: null
        });
        setCompletedSections(new Set());
        setActiveCollapseKeys(['method']);
        setShowValidUntil(false); // Reset valid until visibility
        setIsExperiment(null); // Reset experiment choice - no choice made yet
      }
      setGTMMotionSelection(null);
      setIsSaving(false);
      setPriceChanges([]);
      setHasChanges(false);
      setHasRealTimeChanges(false);
      
      // Handle price data initialization
      if (existingPriceData?.currencyChanges) {
        // Pre-populate with existing GTM item data
        const simplePrices: Record<string, string> = {};
        const fieldPrices: Record<string, Record<string, Record<string, string>>> = {};
        const currencies: string[] = [];
        
        existingPriceData.currencyChanges.forEach(change => {
          currencies.push(change.currencyCode);
          
          // Check if this has field-specific data (seatRange/tier)
          if ((change as any).seatRange && (change as any).tier) {
            // Field product format: currency -> seatRange -> tier -> price
            const seatRange = (change as any).seatRange;
            const tier = (change as any).tier;
            
            if (!fieldPrices[change.currencyCode]) {
              fieldPrices[change.currencyCode] = {};
            }
            if (!fieldPrices[change.currencyCode][seatRange]) {
              fieldPrices[change.currencyCode][seatRange] = {};
            }
            fieldPrices[change.currencyCode][seatRange][tier] = change.newAmount.toString();
          } else {
            // Simple product format: currency -> price
            simplePrices[change.currencyCode] = change.newAmount.toString();
          }
        });
        
        setSavedSimplePriceInputs(simplePrices);
        setSavedFieldPriceInputs(fieldPrices);
        setSavedSelectedCurrencies(currencies);
      } else {
        // Clear/reset for new price creation
        setSavedSimplePriceInputs({});
        setSavedFieldPriceInputs({});
        setSavedSelectedCurrencies(directEditMode ? [] : ['USD']); // USD default for create flow, empty for direct edit
      }
      setSavedCurrencyOrder([]); // Clear saved currency order on modal open
    }
  }, [open, directEditMode, prefilledContext, initialCreationMethod, initialStep, existingPriceData]);


  const handleNext = () => {
    if (currentStep === 0) {
      // Step 0 (Configure) → Step 1 (Price editing)
      // Trigger SKU conflict checking when transitioning to pricing step
      if (!directEditMode) {
        checkSkuConflicts();
      }
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Step 1 (Price editing) → Step 2 (Review)
      captureAndDetectChanges();
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Step 2 (Review) → Step 3 (GTM)
      setCurrentStep(3);
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

  // Custom header component for the drawer
  const renderCustomHeader = () => (
    <div style={{
      padding: '16px 24px',
      borderBottom: `1px solid ${token.colorBorder}`,
      backgroundColor: token.colorBgContainer,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: '16px'
    }}>
      {/* Left side - Title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <Title level={3} style={{ margin: 0, fontSize: token.fontSizeHeading2 }}>
          {directEditMode 
            ? `Edit price points for ${productName}`
            : `Create price group for ${productName}`
          }
        </Title>
      </div>
      
      {/* Right side - Close button only */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <Button 
          type="text"
          size="small"
          icon={<X size={16} />}
          onClick={handleClose}
          style={{
            color: token.colorTextSecondary,
            padding: '4px',
            height: '24px',
            width: '24px',
            minWidth: '24px'
          }}
        />
      </div>
    </div>
  );

  // Vertical Steps navigation component
  const renderStepsNavigation = () => {
    const createStepItems = () => {
      if (directEditMode) {
        // Direct edit flow: 4 steps (same as create flow)
        return [
          {
            title: 'Configure'
          },
          {
            title: 'Set price points'
          },
          {
            title: 'Review'
          },
          {
            title: 'Add to GTM motion'
          }
        ];
      } else {
        // Create flow: 4 steps  
        return [
          {
            title: 'Configure'
          },
          {
            title: 'Set price points'
          },
          {
            title: 'Review'
          },
          {
            title: 'Add to GTM motion'
          }
        ];
      }
    };

    const getCurrentStepIndex = () => {
      // Both modes now use steps 0,1,2,3 → display as 0,1,2,3
      return currentStep;
    };

    return (
      <div style={{
        width: '220px',
        padding: '32px 24px',
        borderRight: `1px solid ${token.colorBorder}`,
        backgroundColor: token.colorBgContainer,
        flexShrink: 0
      }}>
        <div className="price-editor-steps">
          <Steps
            size="small"
            direction="vertical"
            current={getCurrentStepIndex()}
            items={createStepItems()}
          />
        </div>
        
        {/* Custom styling for step font weight */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .price-editor-steps .ant-steps-item-title {
              font-weight: ${token.fontWeightStrong} !important;
            }
          `
        }} />
      </div>
    );
  };

  // Get dynamic content container styles based on current step
  const getContentContainerStyle = () => {
    const isPriceEditingStep = (
      (directEditMode && currentStep === 1) || // Direct edit: step 1 is price editing
      (!directEditMode && currentStep === 1)   // Create: step 1 is price editing  
    );

    if (isPriceEditingStep) {
      // Price editing step: use full width with minimal padding
      return {
        padding: '32px 24px', // Reduced horizontal padding
        display: 'flex',
        flexDirection: 'column' as const,
        width: '100%',        // No width constraints
        flex: 1
      };
    } else {
      // Other steps: centered with max width
      return {
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column' as const,
        maxWidth: '1200px', // Increased from 1000px for better collapse panel display
        margin: '0 auto',
        width: '100%',
        flex: 1
      };
    }
  };

  // Helper function to format context for display
  const formatContextDisplay = (channel: string, billingCycle: string, lixKey: string | null, lixTreatment: string | null) => {
    const lixPart = (lixKey && lixTreatment) 
      ? `${lixKey} (${lixTreatment})`
      : 'No experiment';
    
    return `${channel} • ${billingCycle} • ${lixPart}`;
  };

  // SKU uniqueness detection logic
  const detectExistingSkus = (channel: string, billingCycle: string, lixKey: string | null, lixTreatment: string | null) => {
    if (!product?.skus) {
      return [];
    }

    // Find SKUs that match the selected context exactly
    return product.skus.filter((sku: any) => {
      const channelMatch = sku.salesChannel === channel;
      const billingMatch = sku.billingCycle === billingCycle;
      
      // LIX comparison - handle null/undefined values properly
      const skuLixKey = sku.lix?.key || null;
      const skuLixTreatment = sku.lix?.treatment || null;
      const selectedLixKeyNormalized = lixKey || null;
      const selectedLixTreatmentNormalized = lixTreatment || null;
      
      const lixMatch = (skuLixKey === selectedLixKeyNormalized) && 
                       (skuLixTreatment === selectedLixTreatmentNormalized);

      return channelMatch && billingMatch && lixMatch;
    });
  };

  // Configuration collapse helpers
  const markSectionComplete = (section: string) => {
    setCompletedSections(prev => new Set([...prev, section]));
    
    // Auto-open next section
    const sectionOrder = directEditMode 
      ? ['channel', 'billing', 'validity', 'lix'] // Skip method in direct edit mode
      : ['method', 'channel', 'billing', 'validity', 'lix'];
    
    let currentIndex = sectionOrder.indexOf(section);
    
    // Find next available (non-locked and non-completed) section
    let nextSection = null;
    for (let i = currentIndex + 1; i < sectionOrder.length; i++) {
      const candidateSection = sectionOrder[i];
      
      // Skip if section is locked (when cloning and it's channel or billing)
      const isLocked = configData.clonePriceGroup && 
                      (candidateSection === 'channel' || candidateSection === 'billing');
      
      // Skip if section is already completed
      const isCompleted = completedSections.has(candidateSection);
      
      if (!isLocked && !isCompleted) {
        nextSection = candidateSection;
        break;
      }
    }
    
    if (nextSection) {
      setActiveCollapseKeys([nextSection]);
    } else {
      // No more sections to open, collapse all
      setActiveCollapseKeys([]);
    }
  };

  const updateConfigData = (field: string, value: any) => {
    // Special handling when switching to 'blank' method - clear all copied data
    if (field === 'method' && value === 'blank') {
      setConfigData(prev => ({
        ...prev,
        [field]: value,
        // Clear all copied/inherited data for fresh start
        clonePriceGroup: null,
        channel: null,
        billingCycle: null,
        lixKey: null,
        lixTreatment: null
      }));
      // Reset completed sections that were auto-filled from copying
      setCompletedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete('channel');
        newSet.delete('billing');
        newSet.delete('lix');
        return newSet;
      });
      // Clear any existing alerts
      setSkuAlert({ show: false, type: 'success', message: '', actionButton: undefined });
    } else {
      // Normal update for other fields
      setConfigData(prev => ({ ...prev, [field]: value }));
      
      // Clear any existing alerts when user modifies SKU-defining fields during configuration
      if (['channel', 'billingCycle', 'lixKey', 'lixTreatment'].includes(field)) {
        setSkuAlert({ show: false, type: 'success', message: '', actionButton: undefined });
      }
    }
    // Note: Completion is now handled by Continue buttons, not automatic
  };

  const handleClonePriceGroupSelection = (priceGroupId: string | null) => {
    if (!priceGroupId) {
      // Clear selection
      setConfigData(prev => ({
        ...prev,
        clonePriceGroup: null,
        channel: null,
        billingCycle: null,
        lixKey: null,
        lixTreatment: null
      }));
      // Reset completed sections
      setCompletedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete('channel');
        newSet.delete('billing');
        newSet.delete('lix');
        return newSet;
      });
      return;
    }

    // Find the selected price group
    const selectedOption = formOptions.availableClonePriceGroups.find(
      option => option.value === priceGroupId
    );

    if (selectedOption?.priceGroup) {
      const priceGroup = selectedOption.priceGroup;
      
      // Update config data with clone selection and auto-fill channel/billing
      setConfigData(prev => ({
        ...prev,
        clonePriceGroup: priceGroup,
        channel: priceGroup.channel,
        billingCycle: priceGroup.billingCycle,
        // Reset LIX - user sets independently 
        lixKey: null,
        lixTreatment: null
      }));

      // Auto-complete channel and billing sections
      setCompletedSections(prev => new Set([...prev, 'channel', 'billing']));
    }
  };

  // Function to check SKU conflicts and update alerts
  const checkSkuConflicts = () => {
    // Only run in create mode and when all required fields are present
    if (directEditMode || !configData.channel || !configData.billingCycle) {
      setSkuAlert({ show: false, type: 'success', message: '', actionButton: undefined });
      return;
    }

    // Handle the case where isExperiment is null (no choice made yet) or false (no experiment)
    const effectiveLixKey = (isExperiment === null || isExperiment === false) ? null : configData.lixKey;
    const effectiveLixTreatment = (isExperiment === null || isExperiment === false) ? null : configData.lixTreatment;

    const existingSkus = detectExistingSkus(
      configData.channel,
      configData.billingCycle,
      effectiveLixKey,
      effectiveLixTreatment
    );

    const contextDisplay = formatContextDisplay(
      configData.channel,
      configData.billingCycle,
      effectiveLixKey,
      effectiveLixTreatment
    );

    if (existingSkus.length > 0) {
      // Conflict detected
      const existingSku = existingSkus[0];
      setSkuAlert({
        show: true,
        type: 'error',
        message: `A SKU (${contextDisplay}) already exists and is associated with price group ${existingSku.priceGroup.id}. Edit the price points for the price group or change your selections above.`,
        actionButton: {
          text: 'Edit price points',
          action: () => {
            onClose(); // Close the drawer
            navigate(`/products/${productId}/price-groups/${existingSku.priceGroup.id}`);
          }
        }
      });
    } else {
      // No conflict - success case
      setSkuAlert({
        show: true,
        type: 'success',
        message: `A new SKU (${contextDisplay}) will be created and associated with this price group.`,
        actionButton: undefined
      });
    }
  };

  const handleSectionContinue = (section: string) => {
    // Special handling for LIX section
    if (section === 'lix') {
      // If user hasn't made explicit choice, clicking Continue means "No experiment"
      if (isExperiment === null) {
        setIsExperiment(false);
      }
    }

    // Mark section as complete - this will also handle opening the next available section
    markSectionComplete(section);
    
    // Note: SKU conflict checking now happens only on final "Continue to pricing" button
  };

  const canContinueSection = (section: string): boolean => {
    switch (section) {
      case 'method':
        // For blank method, just need method selection
        if (configData.method === 'blank') return true;
        // For clone method, need both method AND price group selection
        if (configData.method === 'clone') return !!configData.clonePriceGroup;
        // No method selected yet
        return false;
      case 'channel':
        return !!configData.channel;
      case 'billing':
        return !!configData.billingCycle;
      case 'lix':
        // Continue enabled by default - suggests "No experiment" is simple path
        if (isExperiment === null) return true; // Default to enabled (no experiment)
        // If experiment switch is off, section is complete
        if (isExperiment === false) return true;
        // If experiment switch is on, both key and treatment are required
        return !!(configData.lixKey && configData.lixTreatment);
      case 'validity':
        return !!configData.validityStartDate;
      default:
        return false;
    }
  };

  const canExpandSection = (section: string): boolean => {
    // If clone price group is selected, disable channel and billing sections
    if (configData.clonePriceGroup && (section === 'channel' || section === 'billing')) {
      return false;
    }
    
    // If direct edit mode, disable channel, billing, and lix sections (only allow validity)
    if (directEditMode && (section === 'channel' || section === 'billing' || section === 'lix')) {
      return false;
    }

    const sectionOrder = directEditMode 
      ? ['channel', 'billing', 'validity', 'lix'] // Skip method in direct edit mode
      : ['method', 'channel', 'billing', 'validity', 'lix'];
    const currentIndex = sectionOrder.indexOf(section);
    
    // Can always expand if already completed
    if (completedSections.has(section)) return true;
    
    // Can expand if it's the first section
    if (currentIndex === 0) return true;
    
    // Can expand if previous section is completed
    const previousSection = sectionOrder[currentIndex - 1];
    return completedSections.has(previousSection);
  };

  const renderConfigureStep = () => {
    const items = [
      {
        key: 'method',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {completedSections.has('method') && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: token.colorSuccess,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={12} style={{ color: 'white' }} />
                </div>
              )}
              <span style={{ fontWeight: token.fontWeightStrong, color: token.colorText }}>
               Create or copy
              </span>
            </div>
            {configData.method && (
              <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
                {configData.method === 'blank' 
                  ? 'Create from blank' 
                  : configData.clonePriceGroup 
                    ? `Copy from price group ${configData.clonePriceGroup.id}`
                    : 'Clone from existing'
                }
              </span>
            )}
          </div>
        ),
        children: (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              marginBottom: '16px', 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize 
            }}>
              Choose how to start
            </div>
            
            <Radio.Group
              value={configData.method}
              onChange={(e) => updateConfigData('method', e.target.value)}
              style={{ width: '100%' }}
            >
              <div style={{ display: 'flex', gap: '16px', width: '100%', marginBottom: '24px' }}>
                <div
                  onClick={() => updateConfigData('method', 'blank')}
                  style={{
                    flex: 1,
                    padding: '24px 16px',
                    border: `1px solid ${configData.method === 'blank' ? token.colorPrimary : token.colorBorder}`,
                    borderRadius: token.borderRadius,
                    backgroundColor: configData.method === 'blank' ? token.colorPrimaryBg : token.colorBgContainer,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <File size={20} style={{ color: token.colorTextSecondary }} />
                  <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                    Create from blank
                  </div>
                  <div style={{ 
                    fontSize: token.fontSizeSM, 
                    color: token.colorTextSecondary, 
                    textAlign: 'center',
                    lineHeight: '1.4'
                  }}>
                    Configure new price group from scratch
                  </div>
                </div>

                <div
                  onClick={() => updateConfigData('method', 'clone')}
                  style={{
                    flex: 1,
                    padding: '24px 16px',
                    border: `1px solid ${configData.method === 'clone' ? token.colorPrimary : token.colorBorder}`,
                    borderRadius: token.borderRadius,
                    backgroundColor: configData.method === 'clone' ? token.colorPrimaryBg : token.colorBgContainer,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <Copy size={20} style={{ color: token.colorTextSecondary }} />
                  <div style={{ fontSize: '14px', fontWeight: '500', textAlign: 'center' }}>
                    Copy from existing
                  </div>
                  <div style={{ 
                    fontSize: token.fontSizeSM, 
                    color: token.colorTextSecondary, 
                    textAlign: 'center',
                    lineHeight: '1.4'
                  }}>
                    Copy structure and currencies from another price group
                  </div>
                </div>
              </div>
            </Radio.Group>
            
            {/* Price Group Selector - Only show when Clone is selected */}
            {configData.method === 'clone' && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  marginBottom: '8px', 
                  fontSize: token.fontSize, 
                  fontWeight: token.fontWeightStrong,
                  color: token.colorText 
                }}>
                  Select price group to copy
                </div>
                <Select
                  showSearch
                  placeholder="Select price group..."
                  size="large"
                  style={{ width: '100%' }}
                  value={configData.clonePriceGroup?.id || null}
                  onChange={(value) => handleClonePriceGroupSelection(value)}
                  options={formOptions.availableClonePriceGroups}
                  allowClear
                  optionFilterProp="searchLabel"
                  optionRender={(option) => option.label} // Use rich ReactNode for dropdown display
                  labelRender={(option) => {
                    // Custom render for selected value display
                    const selectedOption = formOptions.availableClonePriceGroups.find(
                      opt => opt.value === option?.value
                    );
                    if (selectedOption?.priceGroup) {
                      return renderPriceGroupLabel(selectedOption.priceGroup);
                    }
                    return option?.label;
                  }}
                />
                <div style={{ 
                  marginTop: '8px', 
                  color: token.colorTextSecondary, 
                  fontSize: token.fontSizeSM 
                }}>
                </div>
              </div>
            )}
            
            {/* Continue Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                disabled={!canContinueSection('method')}
                onClick={() => handleSectionContinue('method')}
                icon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            </div>
          </div>
        ),
        collapsible: canExpandSection('method') ? undefined : 'disabled' as const
      },
      
      {
        key: 'channel',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {completedSections.has('channel') && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: token.colorSuccess,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={12} style={{ color: 'white' }} />
                </div>
              )}
              <span style={{ 
                fontWeight: token.fontWeightStrong, 
                color: canExpandSection('channel') ? token.colorText : token.colorTextTertiary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Channel
                {(configData.clonePriceGroup || directEditMode) && (
                  <>
                    <Lock size={14} style={{ color: token.colorTextSecondary }} />
                    <span style={{ 
                      fontWeight: 'normal', 
                      color: token.colorTextSecondary,
                      fontSize: token.fontSize
                    }}>
                      {configData.clonePriceGroup 
                        ? 'Copied from price group'
                        : 'Copied from price group'
                      }
                    </span>
                  </>
                )}
              </span>
            </div>
            {configData.channel && (
              <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
                {configData.channel}
              </span>
            )}
          </div>
        ),
        children: (configData.clonePriceGroup || directEditMode) ? (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize,
              textAlign: 'center',
              padding: '24px 0'
            }}>
              {configData.clonePriceGroup 
                ? 'This section is locked because you selected a price group to clone from.'
                : 'This section is locked because you are editing an existing price group.'
              }
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              marginBottom: '16px', 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize 
            }}>
              Which channel is this price group for?
            </div>
            
            {/* Channel Selection Cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {formOptions.channels.map((channel) => {
                const icon = getChannelIcon(channel);
                const isSelected = configData.channel === channel;
                
                return (
                  <div
                    key={channel}
                    onClick={() => updateConfigData('channel', channel)}
                    style={{
                      flex: '1',
                      minWidth: '140px',
                      padding: '20px 16px',
                      border: `1px solid ${isSelected ? token.colorPrimary : token.colorBorder}`,
                      borderRadius: token.borderRadius,
                      backgroundColor: isSelected ? token.colorPrimaryBg : token.colorBgContainer,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      color: token.colorText, 
                      fontSize: '20px' 
                    }}>
                      {icon}
                    </div>
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: token.fontWeightStrong, 
                      color: token.colorText 
                    }}>
                      {channel}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Continue Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                disabled={!canContinueSection('channel')}
                onClick={() => handleSectionContinue('channel')}
                icon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            </div>
          </div>
        ),
        collapsible: canExpandSection('channel') ? undefined : 'disabled' as const
      },
      
      {
        key: 'billing',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {completedSections.has('billing') && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: token.colorSuccess,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={12} style={{ color: 'white' }} />
                </div>
              )}
              <span style={{ 
                fontWeight: token.fontWeightStrong, 
                color: canExpandSection('billing') ? token.colorText : token.colorTextTertiary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                Billing cycle
                {(configData.clonePriceGroup || directEditMode) && (
                  <>
                    <Lock size={14} style={{ color: token.colorTextSecondary }} />
                    <span style={{ 
                      fontWeight: 'normal', 
                      color: token.colorTextSecondary,
                      fontSize: token.fontSize
                    }}>
                      {configData.clonePriceGroup 
                        ? 'Copied from price group'
                        : 'Inherited from existing price group'
                      }
                    </span>
                  </>
                )}
              </span>
            </div>
            {configData.billingCycle && (
              <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
                {configData.billingCycle}
              </span>
            )}
          </div>
        ),
        children: (configData.clonePriceGroup || directEditMode) ? (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize,
              textAlign: 'center',
              padding: '24px 0'
            }}>
              {configData.clonePriceGroup 
                ? 'This section is locked because you selected a price group to clone from.'
                : 'This section is locked because you are editing an existing price group.'
              }
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              marginBottom: '16px', 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize 
            }}>
              How frequently is this billed?
            </div>
            
            {/* Billing Frequency Cards */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {formOptions.billingCycles.map((cycle) => {
                const isSelected = configData.billingCycle === cycle;
                
                return (
                  <div
                    key={cycle}
                    onClick={() => updateConfigData('billingCycle', cycle)}
                    style={{
                      flex: '1',
                      minWidth: '140px',
                      padding: '20px 16px',
                      border: `1px solid ${isSelected ? token.colorPrimary : token.colorBorder}`,
                      borderRadius: token.borderRadius,
                      backgroundColor: isSelected ? token.colorPrimaryBg : token.colorBgContainer,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ 
                      fontSize: '14px', 
                      fontWeight: token.fontWeightStrong, 
                      color: token.colorText 
                    }}>
                      {cycle}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Continue Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                disabled={!canContinueSection('billing')}
                onClick={() => handleSectionContinue('billing')}
                icon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            </div>
          </div>
        ),
        collapsible: canExpandSection('billing') ? undefined : 'disabled' as const
      },
      
      {
        key: 'validity',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {completedSections.has('validity') && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: token.colorSuccess,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={12} style={{ color: 'white' }} />
                </div>
              )}
              <span style={{ 
                fontWeight: token.fontWeightStrong, 
                color: canExpandSection('validity') ? token.colorText : token.colorTextTertiary 
              }}>
                Validity
              </span>
            </div>
            {configData.validityStartDate && (
              <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
                {configData.validityStartDate?.format('MMM D, YYYY')}
                {configData.validityEndDate 
                  ? ` - ${configData.validityEndDate.format('MMM D, YYYY')}`
                  : ' - Present'
                }
              </span>
            )}
          </div>
        ),
        children: (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              marginBottom: '16px', 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize 
            }}>
              Set when price points will be active. You can modify it for individual price points later.
            </div>
            {/* Validity Date Pickers */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Valid From DatePicker */}
                <div>
                  <div style={{ 
                    marginBottom: '8px', 
                    fontSize: token.fontSize, 
                    fontWeight: token.fontWeightStrong,
                    color: token.colorText 
                  }}>
                    Valid from <span style={{ color: token.colorError }}>*</span>
                  </div>
                  <DatePicker
                    placeholder="Select start date"
                    size="large"
                    style={{ width: '100%' }}
                    value={configData.validityStartDate}
                    onChange={(date) => updateConfigData('validityStartDate', date)}
                    format="MMM D, YYYY"
                    disabledDate={(current) => {
                      // Disable past dates
                      return current && current.isBefore(dayjs(), 'day');
                    }}
                  />
                </div>

                {/* Valid Until Section */}
                <div>
                  {!showValidUntil && !configData.validityEndDate ? (
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'flex-end', 
                      height: '100%', 
                      paddingBottom: '8px' // Align with DatePicker baseline
                    }}>
                      <Button
                        type="text"
                        style={{ 
                          color: token.colorPrimary,
                          padding: '4px 0',
                          height: 'auto',
                          fontSize: token.fontSize
                        }}
                        icon={<Plus size={16} />}
                        onClick={() => setShowValidUntil(true)}
                      >
                        Add valid until
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <div style={{ 
                        marginBottom: '8px', 
                        fontSize: token.fontSize, 
                        fontWeight: token.fontWeightStrong,
                        color: token.colorText 
                      }}>
                        Valid until (optional)
                      </div>
                      <DatePicker
                        placeholder="Present"
                        size="large"
                        style={{ width: '100%' }}
                        value={configData.validityEndDate}
                        onChange={(date) => {
                          updateConfigData('validityEndDate', date);
                          // If user clears the date, hide the input again
                          if (!date) {
                            setShowValidUntil(false);
                          }
                        }}
                        format="MMM D, YYYY"
                        allowClear
                        disabledDate={(current) => {
                          if (!configData.validityStartDate) return false;
                          // Disable dates before valid from date
                          return current && current.isBefore(configData.validityStartDate, 'day');
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Continue Button - only show in create mode, edit mode uses footer button */}
            {!directEditMode && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  type="primary"
                  disabled={!canContinueSection('validity')}
                  onClick={() => handleSectionContinue('validity')}
                  icon={<ArrowRight size={16} />}
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        ),
        collapsible: canExpandSection('validity') ? undefined : 'disabled' as const
      },
      
      {
        key: 'lix',
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {completedSections.has('lix') && (
                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: token.colorSuccess,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={12} style={{ color: 'white' }} />
                </div>
              )}
              <span style={{ 
                fontWeight: token.fontWeightStrong, 
                color: canExpandSection('lix') ? token.colorText : token.colorTextTertiary,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                LIX experiment
                {directEditMode && (
                  <>
                    <Lock size={14} style={{ color: token.colorTextSecondary }} />
                    <span style={{ 
                      fontWeight: 'normal', 
                      color: token.colorTextSecondary,
                      fontSize: token.fontSize
                    }}>
                      Inherited from existing price group
                    </span>
                  </>
                )}
              </span>
            </div>
            <span style={{ color: token.colorTextSecondary, fontSize: token.fontSize }}>
              {isExperiment === null
                ? '' // Empty until user makes a choice
                : isExperiment 
                  ? ((configData.lixKey && configData.lixTreatment) 
                      ? `${configData.lixKey} (${configData.lixTreatment})`
                      : 'Experiment enabled'
                    )
                  : 'No experiment'
              }
            </span>
          </div>
        ),
        children: directEditMode ? (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize,
              textAlign: 'center',
              padding: '24px 0'
            }}>
              This section is locked because you are editing an existing price group.
            </div>
          </div>
        ) : (
          <div style={{ padding: '8px 0' }}>
            <div style={{ 
              marginBottom: '16px', 
              color: token.colorTextSecondary, 
              fontSize: token.fontSize 
            }}>
        
            </div>
            {/* LIX Experiment Switch */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: isExperiment === true ? '24px' : '0' 
              }}>
                <Switch 
                  checked={isExperiment === true} // Handle null state
                  onChange={(checked) => {
                    setIsExperiment(checked);
                    // Clear LIX data when turning off experiment
                    if (!checked) {
                      updateConfigData('lixKey', null);
                      updateConfigData('lixTreatment', null);
                    }
                    // Clear any existing alerts when user modifies experiment settings during configuration
                    setSkuAlert({ show: false, type: 'success', message: '', actionButton: undefined });
                  }}
                />
                <span style={{ 
                  fontSize: token.fontSize,
                  color: token.colorText,
                  fontWeight: token.fontWeightStrong
                }}>
                  This price group is part of an experiment
                </span>
              </div>

              {/* LIX Configuration Inputs - only show when experiment is enabled */}
              {isExperiment === true && (
                <div style={{ maxWidth: '400px' }}>
                  {/* LIX Key AutoComplete */}
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ 
                      marginBottom: '8px', 
                      fontSize: token.fontSize, 
                      fontWeight: token.fontWeightStrong,
                      color: token.colorText 
                    }}>
                      LIX key
                    </div>
                    <AutoComplete
                      placeholder="Enter LIX key"
                      size="large"
                      allowClear
                      value={configData.lixKey}
                      options={formOptions.lixKeys.length > 0 ? [{
                        label: 'Existing',
                        options: formOptions.lixKeys.map(key => ({ value: key }))
                      }] : []}
                      onChange={(value) => {
                        updateConfigData('lixKey', value || null);
                        // Clear treatment when key changes
                        if (value !== configData.lixKey) {
                          updateConfigData('lixTreatment', null);
                        }
                      }}
                      filterOption={(inputValue, option: any) => {
                        if (!option?.value || typeof option.value !== 'string') return false;
                        return option.value.toLowerCase().includes(inputValue.toLowerCase());
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>

                  {/* LIX Treatment AutoComplete */}
                  <div>
                    <div style={{ 
                      marginBottom: '8px', 
                      fontSize: token.fontSize, 
                      fontWeight: token.fontWeightStrong,
                      color: token.colorText 
                    }}>
                      LIX treatment
                    </div>
                    <AutoComplete
                      placeholder="Enter LIX treatment"
                      size="large"
                      allowClear
                      value={configData.lixTreatment}
                      options={formOptions.lixTreatments.length > 0 ? [{
                        label: 'Existing',
                        options: formOptions.lixTreatments.map(treatment => ({ value: treatment }))
                      }] : []}
                      onChange={(value) => updateConfigData('lixTreatment', value || null)}
                      filterOption={(inputValue, option: any) => {
                        if (!option?.value || typeof option.value !== 'string') return false;
                        return option.value.toLowerCase().includes(inputValue.toLowerCase());
                      }}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              )}
            </div>
            
            {/* Continue Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                disabled={!canContinueSection('lix')}
                onClick={() => handleSectionContinue('lix')}
                icon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
            </div>
          </div>
        ),
        collapsible: canExpandSection('lix') ? undefined : 'disabled' as const
      }
    ];

    // Filter items based on mode
    const filteredItems = directEditMode 
      ? items.filter(item => item.key === 'validity') // In edit mode, only show editable validity section
      : items;

    return (
      <div style={{ width: '100%', padding: '16px 0' }}>
        <Collapse
          activeKey={activeCollapseKeys}
          onChange={(keys) => {
            const validKeys = (keys as string[]).filter(key => canExpandSection(key));
            setActiveCollapseKeys(validKeys);
          }}
          items={filteredItems}
          size="large"
        />
        
        {/* SKU Detection Alert */}
        {skuAlert.show && (
          <div style={{ marginTop: '24px' }}>
            <Alert
              type={skuAlert.type}
              message={
                <div style={{ 
                  lineHeight: '1.5',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}>
                  {skuAlert.message}
                </div>
              }
              action={skuAlert.actionButton ? (
                <Button
                  type="text"
                  style={{ 
                    color: token.colorPrimary,
                    fontWeight: token.fontWeightStrong
                  }}
                  onClick={skuAlert.actionButton.action}
                >
                  {skuAlert.actionButton.text}
                </Button>
              ) : undefined}
              showIcon
            />
          </div>
        )}
      </div>
    );
  };

  const handlePrevious = () => {
    // Both modes now follow: Step 0 (Configure) → Step 1 (Price editing) → Step 2 (Review) → Step 3 (GTM)
    const newStep = Math.max(currentStep - 1, 0);
    
    // Clear saved price inputs when going back to Step 0 (configure)
    if (newStep === 0) {
      setSavedSimplePriceInputs({});
      setSavedFieldPriceInputs({});
      setSkuAlert({ show: false, type: 'success', message: '', actionButton: undefined }); // Clear SKU alert
    }
    
    setCurrentStep(newStep);
  };

  const handleClose = () => {
    // Reset state based on mode
    if (directEditMode) {
      setCurrentStep(0); // Both modes start at configure step
      setSelectedContext(prefilledContext);
    } else {
      setCurrentStep(0);
      setSelectedContext(null);
      // Reset configuration data
      setConfigData({
        method: null,
        channel: null,
        billingCycle: null,
        lixKey: null,
        lixTreatment: null,
        clonePriceGroup: null,
        validityStartDate: null as any, // Reset to empty - user must choose
        validityEndDate: null
      });
      setCompletedSections(new Set());
      setActiveCollapseKeys(['method']);
      setShowValidUntil(false); // Reset valid until visibility
      setIsExperiment(null); // Reset experiment choice - no choice made yet
    }
    setGTMMotionSelection(null);
    setIsSaving(false);
    setPriceChanges([]);
    setHasChanges(false);
    setHasRealTimeChanges(false);
    setSavedSimplePriceInputs({}); // Clear saved price inputs
    setSavedFieldPriceInputs({});
    setSavedSelectedCurrencies([]); // Clear saved currency selection
    setSavedCurrencyOrder([]); // Clear saved currency order
    setSkuAlert({ show: false, type: 'success', message: '', actionButton: undefined }); // Clear SKU alert
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

  // Helper function to convert existing priceChanges to unified format for new table
  const convertToUnifiedChanges = (changes: any[], isFieldChannel: boolean) => {
    return changes.map((change, index) => {
      const baseChange = {
        id: `change-${index}`,
        currency: change.currency,
        currencyName: change.currencyName || change.currency,
        currentPrice: change.currentPrice,
        newPrice: change.newPrice,
        change: change.change,
        validity: change.validity || 'Using defaults',
        status: (change.currentPrice === null ? 'new' : 'updated') as 'new' | 'updated'
      };

      if (isFieldChannel) {
        // Field channel: include seat range and tier info
        return {
          ...baseChange,
          type: 'field' as const,
          context: change.seatRange && change.tier 
            ? `${change.seatRange} seats, ${change.tier}`
            : `${change.seatRange || 'Unknown'} seats`,
          seatRange: change.seatRange || 'Unknown',
          tier: change.tier || 'Base'
        };
      } else {
        // Simple channel: just base price
        return {
          ...baseChange,
          type: 'simple' as const,
          context: 'Base price' as const
        };
      }
    });
  };


  // Handle updating existing GTM item
  const handleUpdateExistingGTMItem = async () => {
    setIsSaving(true);
    
    try {
      console.log('Updating existing GTM item...', {
        gtmItemId,
        gtmMotionId,
        context: selectedContext,
        priceChanges
      });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the existing GTM item
      const success = updateGTMItemPrices(
        gtmMotionId!,
        gtmItemId!,
        priceChanges,
        selectedContext
      );
      
      if (!success) {
        throw new Error('Failed to update GTM item');
      }
      
      console.log(`✅ Updated GTM item: ${gtmItemId}`);
      
      // Show success message
      showSuccessMessage(`Price changes have been updated successfully.`);
      
      // Call success callback
      if (onSaveToGTM) {
        onSaveToGTM(true);
      }
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('❌ Error updating GTM item:', error);
      showErrorMessage('Failed to update price changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    // Handle GTM item update vs creation
    if (gtmItemId && gtmMotionId) {
      // Update existing GTM item
      await handleUpdateExistingGTMItem();
      return;
    }
    
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
          gtmMotionSelection.newMotion.description || undefined,
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




  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderConfigureStep();
      case 1:
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
                initialSelectedCurrencies={savedSelectedCurrencies}
                initialCurrencyOrder={savedCurrencyOrder}
                onPriceChange={(currency, newPrice) => {
                  // Handle price changes for Desktop/iOS/GPB channels
                  console.log('Simple price change:', { currency, newPrice });
                }}
                onCurrencySelectionChange={setSavedSelectedCurrencies}
                onOrderChange={setSavedCurrencyOrder}
                onHasChanges={setHasRealTimeChanges}
                onGetCurrentState={simplePriceRef}
              />
            )}
          </div>
        );
      case 2: {
        // Review changes step - using block scope to avoid variable conflicts
        const reviewIsFieldChannel = selectedContext?.channel?.toLowerCase() === 'field';
        const unifiedChanges = convertToUnifiedChanges(priceChanges, reviewIsFieldChannel);
        
        return (
          <div style={{ padding: '16px 0' }}>
            {/* Price Changes Review Table */}
            <PriceChangesTable
              changes={unifiedChanges}
              title="Review price changes"
              mode="review"
              showSummary={true}
              showFiltering={true}
              skuContext={{
                action: selectedContext?.priceGroupAction === 'create' ? 'create' : 'update',
                productName: productName,
                channel: selectedContext?.channel || '',
                billingCycle: selectedContext?.billingCycle || '',
                skuIds: selectedContext?.existingPriceGroup?.id ? [selectedContext.existingPriceGroup.id] : undefined
              }}
            />
          </div>
        );
      }
      case 3:
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
    <Drawer
      placement="bottom"
      height="100vh"
      width="100vw"
      mask={false}
      closable={false}
      open={open}
      onClose={handleClose}
      zIndex={1020} // Using theme.ts zIndex.drawer
      styles={{
        body: {
          padding: 0,
          backgroundColor: token.colorBgLayout,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden' // Prevent body scroll
        },
        content: {
          backgroundColor: token.colorBgContainer,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden' // Let inner content handle scrolling
        }
      }}
      footer={
        <div style={{ 
          borderTop: `1px solid ${token.colorBorder}`,
          backgroundColor: token.colorBgContainer,
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {/* Left side - empty space for balance */}
          <div></div>
          
          {/* Right side - Action buttons */}
          <Space>
            <Button 
              onClick={handleClose}
              size="middle"
            >
              Cancel
            </Button>
            
            {/* Previous button - show when not on first step */}
            {currentStep > 0 ? (
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
            {(directEditMode && currentStep < 3) || (!directEditMode && currentStep < 3) ? (
              <Button 
                type="primary"
                onClick={handleNext}
                icon={<ArrowRight size={14} />}
                size="middle"
                disabled={
                  directEditMode ? (
                    // Direct edit mode validation
                    currentStep === 1 ? !hasRealTimeChanges :  // Price editing step
                    currentStep === 2 ? !hasChanges : false    // Review step
                  ) : (
                    // Create mode validation (4 steps: 0-3)
                    currentStep === 0 ? (() => {
                      // Step 0: All collapse sections must be completed
                      const requiredSections = directEditMode 
                        ? ['validity'] // In edit mode, only validity section is shown and required
                        : ['method', 'channel', 'billing', 'validity', 'lix'];
                      const allSectionsComplete = requiredSections.every(
                        section => completedSections.has(section)
                      );
                      return !allSectionsComplete || (!directEditMode && skuAlert.show && skuAlert.type === 'error');
                    })() : 
                    currentStep === 1 ? !hasRealTimeChanges :  // Price editing step
                    currentStep === 2 ? !hasChanges : false    // Review step
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
      }
      destroyOnClose
    >
      {/* Custom Header */}
      {renderCustomHeader()}
      
      {/* Main Layout - Two columns */}
      <div style={{ 
        flex: 1, 
        display: 'flex',
        overflow: 'hidden',
        minHeight: 0 // Ensure flex child can shrink
      }}>
        {/* Left: Steps Navigation */}
        {renderStepsNavigation()}
        
        {/* Right: Main Content */}
        <div style={{ 
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={getContentContainerStyle()}>
            {renderStepContent()}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default PriceEditorModal;
