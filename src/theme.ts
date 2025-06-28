import { type ThemeConfig } from 'antd';

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
    colorText: 'rgba(0, 0, 0, 0.92)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.64)',
    colorTextTertiary: 'rgba(0, 0, 0, 0.45)',
    colorTextQuaternary: 'rgba(0, 0, 0, 0.45)',
    colorBorder: '#d9d9d9',
    colorBorderSecondary: '#f0f0f0',
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
    }
  },
};

export default themeConfig;