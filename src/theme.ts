import { type ThemeConfig } from 'antd';
import type { LOB } from './utils/types';

export const zIndex = {
  header: 1001,
  drawer: 1020,
  modal: 1050,
};

// Official Tailwind CSS Color Palette
// Reference: https://tailwindcss.com/docs/colors
export const TAILWIND_COLORS = {
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712'
  },
  green: {
    500: '#22c55e'
  },
  red: {
    500: '#ef4444'
  }
} as const;

const themeConfig: ThemeConfig = {
  token: {
    // Font & Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontWeightStrong: 500,
    fontSize: 13,
    fontSizeSM: 12, // Small font size - used in chip small variant and other small text
    fontSizeLG: 14,
    fontSizeHeading1: 24,
    fontSizeHeading2: 20,
    fontSizeHeading3: 16,
    fontSizeHeading4: 14,
    lineHeight: 1.5715,
    
    // Colors - Now using exact Tailwind values
    colorSuccess: TAILWIND_COLORS.green[500], // Tailwind Green 500
    colorError: TAILWIND_COLORS.red[500], // Tailwind Red 500
    colorText: TAILWIND_COLORS.gray[900], // Tailwind Gray 900 (primary text)
    colorTextSecondary: TAILWIND_COLORS.gray[500], // Tailwind Gray 500 (secondary text)
    colorTextTertiary: TAILWIND_COLORS.gray[400], // Tailwind Gray 400 (tertiary text)
    colorTextQuaternary: TAILWIND_COLORS.gray[300], // Tailwind Gray 300 (disabled text)
    colorBorder: TAILWIND_COLORS.gray[200], // Tailwind Gray 200 (primary borders)
    colorBorderSecondary: TAILWIND_COLORS.gray[100], // Tailwind Gray 100 (secondary borders)
    colorBgLayout: TAILWIND_COLORS.gray[50], // Tailwind Gray 50 (layout background)
    colorBgContainer: '#ffffff', // White (container background)
  },
  components: {
    Modal: {
      titleFontSize: 20,
      titleColor: TAILWIND_COLORS.gray[800], // Tailwind Gray 800 (was #222)
    },
    
    Card: {
      headerFontSize: 18,
      colorTextHeading: TAILWIND_COLORS.gray[900], // Tailwind Gray 900 (was rgba(0, 0, 0, 0.92))
    },
    Select: {
      colorTextPlaceholder: TAILWIND_COLORS.gray[900], // Tailwind Gray 900 (was rgba(0, 0, 0, 0.92))
    },
    
    Button: {
      colorBorder: TAILWIND_COLORS.gray[300], // Tailwind Gray 300 (default button borders)
      borderColorDisabled: TAILWIND_COLORS.gray[300], // Tailwind Gray 300 (disabled button borders)
    },
    
    Table: {
      headerBg: TAILWIND_COLORS.gray[50], // Tailwind Gray 50 (was #fafafa)
      headerColor: TAILWIND_COLORS.gray[500], // Tailwind Gray 500 (secondary text color)
      borderColor: TAILWIND_COLORS.gray[200], // Tailwind Gray 200 (table row borders)
      borderRadius: 0, // No rounded corners on tables
    },
    
    Tabs: {
      titleFontSize: 13,
      // Set font weight for tab labels (both normal and active states)
      fontWeightStrong: 500,
      // Border beneath tabs - using consistent gray-200 token
      colorBorderSecondary: TAILWIND_COLORS.gray[200], // Tailwind Gray 200 (tabs border)
    },
    
    Message: {
      colorBgElevated: TAILWIND_COLORS.gray[800],  // Tailwind Gray 800 (dark background)
      colorText: '#ffffff',        // White text
      colorTextSecondary: TAILWIND_COLORS.gray[300], // Tailwind Gray 300 (light gray secondary text)
      colorIcon: '#ffffff',        // White icons
      colorSuccess: TAILWIND_COLORS.green[500],     // Tailwind Green 500 (consistent with main theme)
      colorError: TAILWIND_COLORS.red[500],       // Tailwind Red 500 (consistent with main theme)
      borderRadiusLG: 8,           // Rounded corners
    }
  },
};

export const LOB_COLORS: Record<LOB, string> = {
  Premium: 'blue',
  LTS: 'purple',
  LMS: 'geekblue',
  LSS: 'cyan',
  Other: 'default',
};

export default themeConfig;