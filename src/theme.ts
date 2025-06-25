import { type ThemeConfig } from 'antd';

export const zIndex = {
  header: 1001,
  modal: 1050,
};

const themeConfig: ThemeConfig = {
  token: {
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSizeHeading1: 28,
    fontSizeHeading2: 20,
    fontSizeHeading3: 16,
    fontWeightStrong: 500,
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