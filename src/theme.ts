import { type ThemeConfig } from 'antd';
import type { LOB } from './utils/types';

// Z-index management
export const zIndex = {
  header: 1001,
  drawer: 1020,
  modal: 1050,
};

// Extended spacing system based on existing usage patterns
export const spacing = {
  // Micro spacing
  xs: 2,     // 2px - fine adjustments
  sm: 4,     // 4px - tight gaps, small padding
  md: 6,     // 6px - button padding
  lg: 8,     // 8px - standard gaps
  xl: 12,    // 12px - larger gaps, standard padding
  xxl: 16,   // 16px - section spacing
  xxxl: 24,  // 24px - large section spacing
  xxxxl: 32, // 32px - major section spacing
  
  // Component-specific spacing patterns
  badge: '3px 8px 3px 7px', // Standard badge/pill padding
  card: '12px 16px',        // Card content padding
  button: '6px 8px',        // Button padding
};

// Border radius system
export const borderRadius = {
  sm: 4,     // 4px - small elements
  md: 6,     // 6px - buttons, cards
  lg: 8,     // 8px - larger cards
  pill: 50,  // 50px - pill-shaped elements (badges, tags)
};

// Shadow system for consistent elevation
export const shadows = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.03)',       // Subtle shadow for cards
  md: '0 2px 8px rgba(0, 0, 0, 0.09)',       // Hover shadow for interactive cards
  lg: '0 4px 16px rgba(0, 0, 0, 0.12)',      // Prominent shadow for modals
  none: 'none',                               // No shadow
};

// Extended color palette based on actual usage
export const colors = {
  // Primary brand colors
  blue: {
    50: '#f0f5ff',   // Very light blue backgrounds
    100: '#91d5ff',  // Light blue borders
    500: '#1677ff',  // Primary blue
    600: '#1890ff',  // Slightly darker blue
  },
  
  // Success colors  
  green: {
    50: '#f6ffed',   // Success background
    100: '#b7eb8f',  // Success border
    500: '#52c41a',  // Success icon/text
    600: '#22c55e',  // Primary success (from existing theme)
  },
  
  // Error colors
  red: {
    50: '#fff2f0',   // Error background  
    100: '#ffccc7',  // Error border
    500: '#ff4d4f',  // Error icon/text
    600: '#ef4444',  // Primary error (from existing theme)
  },
  
  // Warning colors
  orange: {
    50: '#fff7e6',   // Warning background
    100: '#ffd591',  // Warning border
    500: '#fa8c16',  // Warning icon/text
    600: '#d46b08',  // Darker warning text
  },
  
  // Purple colors (for LTS, experiments)
  purple: {
    500: '#722ed1', // Purple tags, experimental indicators
  },
  
  // Gray scale (comprehensive)
  gray: {
    50: '#fafafa',   // Lightest background
    100: '#f5f5f5',  // Light background, hover states
    200: '#f0f0f0',  // Borders, dividers
    300: '#e8e8e8',  // Muted borders
    400: '#d9d9d9',  // Standard borders
    500: '#999999',  // Muted text, disabled state
    600: '#666666',  // Secondary text
    700: '#595959',  // Darker secondary text
    800: '#8c8c8c',  // Tertiary text
    900: '#c1c1c1',  // Very muted text (expired items)
  },
  
  // Neutral system colors
  neutral: {
    50: '#f6f8fa',   // Card backgrounds
    100: '#d1d9e0',  // Card borders
    white: '#ffffff',
    black: '#000000',
  },
  
  // Special purpose colors
  avatar: [
    '#1677ff', '#52c41a', '#722ed1', '#fa8c16', 
    '#eb2f96', '#13c2c2', '#f5222d', '#faad14',
    '#1890ff', // Avatar background colors
  ],
  
  // Sales channel specific (LinkedIn branding)
  linkedin: {
    blue: '#01A9FC',
    green: '#00D95F', 
    yellow: '#FFBC00',
    red: '#FF5722',
  },
};

// Font size system (extending existing)
export const fontSize = {
  xs: 11,    // 11px - very small text
  sm: 12,    // 12px - small text, labels
  base: 13,  // 13px - standard component text
  md: 14,    // 14px - body text (existing)
  lg: 16,    // 16px - larger text
  xl: 18,    // 18px - card headers
  xxl: 20,   // 20px - section headers
  xxxl: 28,  // 28px - page titles
};

const themeConfig: ThemeConfig = {
  token: {
    // Font & Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontWeightStrong: 500,
    fontSize: fontSize.md,
    fontSizeLG: fontSize.md,
    fontSizeHeading1: fontSize.xxxl,
    fontSizeHeading2: fontSize.xxl,
    fontSizeHeading3: fontSize.lg,
    fontSizeHeading4: fontSize.md,
    lineHeight: 1.5715,
    
    // Colors (keeping existing + adding semantic mappings)
    colorSuccess: colors.green[600],
    colorError: colors.red[600], 
    colorText: 'rgba(0, 0, 0, 0.92)',
    colorTextSecondary: '#6b7280', // Tailwind Gray 500
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextQuaternary: 'rgba(0, 0, 0, 0.45)',
    colorBorder: colors.gray[400],
    colorBorderSecondary: '#e5e5e5',
    colorBgLayout: colors.gray[50],
    colorBgContainer: colors.neutral.white,
    
    // Extended spacing tokens
    marginXS: spacing.xs,
    marginSM: spacing.sm,
    margin: spacing.lg,
    marginMD: spacing.xl,
    marginLG: spacing.xxl,
    marginXL: spacing.xxxl,
    
    // Border radius tokens
    borderRadius: borderRadius.sm,
    borderRadiusSM: borderRadius.sm,
    borderRadiusLG: borderRadius.lg,
    borderRadiusOuter: borderRadius.md,
  },
  components: {
    Modal: {
      titleFontSize: fontSize.xxl,
      titleColor: '#222',
    },
    
    Card: {
      headerFontSize: fontSize.xl,
      colorTextHeading: 'rgba(0, 0, 0, 0.92)',
    },
    
    Select: {
      colorTextPlaceholder: 'rgba(0, 0, 0, 0.92)',
    },
    
    Message: {
      colorBgElevated: '#2f2f2f',          // Dark background
      colorText: colors.neutral.white,      // White text
      colorTextSecondary: '#bfbfbf',       // Light gray secondary text
      colorIcon: colors.neutral.white,      // White icons
      colorSuccess: colors.green[500],     // Success icon color
      colorError: colors.red[500],         // Error icon color
      borderRadiusLG: borderRadius.lg,     // Rounded corners
    },
    
    Table: {
      headerBg: colors.gray[50],
      headerColor: colors.gray[600],
      headerSortActiveBg: colors.gray[100],
      headerSortHoverBg: colors.gray[100],
      bodySortBg: colors.gray[50],
      rowHoverBg: colors.gray[100],
    }
  },
};

// LOB color mapping (keeping existing functionality)
export const LOB_COLORS: Record<LOB, string> = {
  Premium: 'blue',
  LTS: 'purple', 
  LMS: 'geekblue',
  LSS: 'cyan',
  Other: 'default',
};

// Utility functions for working with our design tokens
export const getColor = (path: string) => {
  const keys = path.split('.');
  let current: any = colors;
  for (const key of keys) {
    current = current[key];
    if (current === undefined) return undefined;
  }
  return current;
};

export const getSpacing = (size: keyof typeof spacing) => spacing[size];
export const getBorderRadius = (size: keyof typeof borderRadius) => borderRadius[size];
export const getFontSize = (size: keyof typeof fontSize) => fontSize[size];
export const getShadow = (size: keyof typeof shadows) => shadows[size];

export default themeConfig;