import { type ThemeConfig } from 'antd';

export const zIndex = {
  header: 1001,
  modal: 1050,
};

const themeConfig: ThemeConfig = {
  token: {
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontFamilyCode: "'Geist Mono', Menlo, Monaco, 'Courier New', monospace",
    colorTextQuaternary: 'rgba(0, 0, 0, 0.45)',
    colorBgLayout: '#fafafa',
    colorText: 'rgba(0, 0, 0, 0.92)',
    colorTextSecondary: 'rgba(0, 0, 0, 0.56)',
    fontSizeHeading1: 28,
    fontSizeHeading2: 20,
    fontSizeHeading3: 16,
    fontSizeHeading4: 14,
    fontWeightStrong: 500,
    fontSizeLG: 14,
  },
  components: {
    Modal: {
      titleFontSize: 20,
      titleColor: '#222',
    },
    Table: {
      fontSize: 15,
    },
  },
};

export default themeConfig;