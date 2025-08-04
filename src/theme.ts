import { type ThemeConfig } from 'antd';
import type { LOB } from './utils/types';

export const zIndex = {
  header: 1001,
  drawer: 1020,
  modal: 1050,
};

const themeConfig: ThemeConfig = {
  token: {
    // Font & Typography
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontWeightStrong: 500,
    fontSize: 14,
    fontSizeLG: 14,
    fontSizeHeading1: 28,
    fontSizeHeading2: 20,
    fontSizeHeading3: 16,
    fontSizeHeading4: 14,
    lineHeight: 1.5715,
    
    // Colors
    colorSuccess: '#22c55e', // Tailwind Green 500
    colorError: '#ef4444', // Tailwind Red 500
    colorText: 'rgba(0, 0, 0, 0.92)',
    colorTextSecondary: '#6b7280', // Tailwind Gray 500
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextQuaternary: 'rgba(0, 0, 0, 0.45)',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#e5e5e5',
    colorBgLayout: '#fafafa',
    colorBgContainer: '#ffffff',
  },
  components: {
    Modal: {
      titleFontSize: 20,
      titleColor: '#222',
    },
    
    Card: {
      headerFontSize: 18,
      colorTextHeading: 'rgba(0, 0, 0, 0.92)',
    },
    Select: {
      colorTextPlaceholder: 'rgba(0, 0, 0, 0.92)',
    },
    
    Message: {
      colorBgElevated: '#2f2f2f',  // Dark background
      colorText: '#ffffff',        // White text
      colorTextSecondary: '#bfbfbf', // Light gray secondary text
      colorIcon: '#ffffff',        // White icons
      colorSuccess: '#52c41a',     // Success icon color
      colorError: '#ff4d4f',       // Error icon color
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