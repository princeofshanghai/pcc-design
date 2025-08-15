/**
 * Shared TypeScript interfaces for common component patterns
 * This file consolidates repeated prop interfaces across components
 */

import type { ReactNode } from 'react';
import type { Product, SalesChannel, BillingCycle, ColumnVisibility, ColumnOrder, ColumnConfig } from '../utils/types';

// ============================================
// COMMON COMPONENT PROPS
// ============================================

/**
 * Standard props for components that can be muted/disabled
 */
export interface MutableProps {
  muted?: boolean;
}

/**
 * Standard props for components with variant styling
 */
export interface VariantProps {
  variant?: 'default' | 'prominent' | 'subtle';
}

/**
 * Standard props for components with size variants
 */
export interface SizeProps {
  size?: 'small' | 'medium' | 'large' | number;
}

/**
 * Standard props for components that can show/hide labels
 */
export interface LabelProps {
  showLabel?: boolean;
}

/**
 * Combined props for display components (badges, tags, etc.)
 */
export interface DisplayComponentProps extends MutableProps, SizeProps, LabelProps {}

// ============================================
// TABLE COMPONENT INTERFACES
// ============================================

/**
 * Standard props for table components with column configuration
 */
export interface TableProps {
  visibleColumns?: ColumnVisibility;
  columnOrder?: ColumnOrder;
  onColumnVisibilityChange?: (columns: ColumnVisibility) => void;
  onColumnOrderChange?: (order: ColumnOrder) => void;
}

/**
 * Props for tables with product data
 */
export interface ProductTableProps extends TableProps {
  products: Product[];
  loading?: boolean;
}

/**
 * Props for grouped table displays
 */
export interface GroupedTableProps extends TableProps {
  groupedData: Record<string, any[]>;
  groupBy?: string;
  sortOrder?: string;
}

// ============================================
// FORM COMPONENT INTERFACES
// ============================================

/**
 * Standard form field props
 */
export interface FormFieldProps {
  value?: any;
  onChange?: (value: any) => void;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
}

/**
 * Props for configuration forms
 */
export interface ConfigurationFormProps {
  product: Product;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  onFieldChange?: (data: any) => void;
}

// ============================================
// LAYOUT COMPONENT INTERFACES
// ============================================

/**
 * Standard props for page header components
 */
export interface PageHeaderProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  iconSize?: number;
  entityType?: string;
  rightAlignedId?: string;
  channels?: SalesChannel[];
  billingCycles?: BillingCycle[];
  validityText?: string;
  tagContent?: ReactNode;
  onBack?: () => void;
  actions?: ReactNode;
  lastUpdatedBy?: string;
  lastUpdatedAt?: Date;
  onEdit?: () => void;
  compact?: boolean;
  enableOpticalAlignment?: boolean;
}

/**
 * Standard props for page section components
 */
export interface PageSectionProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Props for detail section components
 */
export interface DetailSectionProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  noBodyPadding?: boolean;
  className?: string;
}

// ============================================
// FILTER & VIEW COMPONENTS
// ============================================

/**
 * Configuration for filter options
 */
export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

/**
 * Configuration for filter groups
 */
export interface FilterConfig {
  key: string;
  label: string;
  type: 'single' | 'multi';
  options: FilterOption[];
  value?: string | string[];
  onChange?: (value: string) => void;
  onMultiChange?: (values: string[]) => void;
}

/**
 * Props for filter bar components
 */
export interface FilterBarProps {
  search?: {
    placeholder: string;
    onChange: (query: string) => void;
    style?: React.CSSProperties;
  };
  filters?: FilterConfig[];
  onClearAll?: () => void;
  viewOptions?: ViewOptionsConfig;
  displayMode?: 'inline' | 'drawer';
  filterSize?: 'small' | 'middle' | 'large';
  searchAndViewSize?: 'small' | 'middle' | 'large';
  actions?: ReactNode[];
}

/**
 * Configuration for view options (grouping, sorting, columns)
 */
export interface ViewOptionsConfig {
  groupBy?: {
    value: string;
    setter: (group: string) => void;
    options: string[];
    disabled?: boolean;
  };
  sortOrder?: {
    value: string;
    setter: (order: string) => void;
    options: string[];
  };
  viewMode?: {
    value: 'card' | 'list';
    setter: (mode: 'card' | 'list') => void;
  };
  columnOptions?: ColumnConfig[];
  visibleColumns?: ColumnVisibility;
  setVisibleColumns?: (columns: ColumnVisibility) => void;
  columnOrder?: ColumnOrder;
  setColumnOrder?: (order: ColumnOrder) => void;
  defaultVisibleColumns?: ColumnVisibility;
}

// ============================================
// CONFLICT & VALIDATION INTERFACES
// ============================================

/**
 * Props for conflict resolution components
 */
export interface ConflictResolutionProps {
  product: Product;
  configurationData: {
    salesChannel?: string;
    billingCycle?: string;
    priceAmount?: number;
    lixKey?: string;
    lixTreatment?: string;
  };
  onResolveConflict?: (action: string, conflictId?: string) => void;
  onViewConflictingItem?: (type: string, id: string) => void;
}

/**
 * Standard validation state interface
 */
export interface ValidationState {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldErrors: Record<string, string>;
}

// ============================================
// EXPERIMENTAL & FEATURE FLAGS
// ============================================

/**
 * Props for experimental feature components
 */
export interface ExperimentalProps {
  lixKey?: string;
  lixTreatment?: string;
  variant?: 'default' | 'detailed';
  showTooltip?: boolean;
  onLearnMore?: () => void;
}

// ============================================
// STATUS & STATE COMPONENTS
// ============================================

/**
 * Props for status display components
 */
export interface StatusProps extends DisplayComponentProps {
  status: string;
  showDescription?: boolean;
}

/**
 * Props for timeline/progress components
 */
export interface TimelineProps {
  stages: Array<{
    key: string;
    title: string;
    description?: string;
    color?: string;
  }>;
  currentStage?: string;
  completedStages?: string[];
  failedStage?: string;
}

// ============================================
// UTILITY TYPES
// ============================================

/**
 * Standard callback function types
 */
export type CallbackFunction = () => void;
export type ValueCallback<T = any> = (value: T) => void;
export type EventCallback<T = any> = (event: T) => void;

/**
 * Common styling prop types
 */
export interface StyleProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props that include children and standard styling
 */
export interface ContainerProps extends StyleProps {
  children: ReactNode;
}

/**
 * Standard loading state props
 */
export interface LoadingProps {
  loading?: boolean;
  loadingText?: string;
}

/**
 * Standard error state props
 */
export interface ErrorProps {
  error?: string | null;
  onRetry?: CallbackFunction;
}

/**
 * Combined async state props
 */
export interface AsyncStateProps extends LoadingProps, ErrorProps {}
