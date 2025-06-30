import { type ThemeConfig } from 'antd';
import type { LOB } from './utils/types';

export const zIndex = {
  header: 1001,
  modal: 1050,
};

const themeConfig: ThemeConfig = {
  token: {
    // Font & Typography
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontFamilyCode: "'Geist Mono', Menlo, Monaco, 'Courier New', monospace",
    fontWeightStrong: 500,
    fontSize: 14,
    fontSizeLG: 14,
    fontSizeHeading1: 24,
    fontSizeHeading2: 18,
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
    }
  },
};

export const LOB_COLORS: Record<LOB, string> = {
  Premium: 'blue',
  LTS: 'purple',
  LMS: 'geekblue',
  LSS: 'cyan',
};

export default themeConfig;