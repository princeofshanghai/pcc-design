const themeConfig = {
  token: {
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSizeHeading1: 28,
    fontSizeHeading2: 20,
    fontSizeHeading3: 16,
    fontWeightStrong: 500,
    lineHeightHeading: 1.2,
  },
  components: {
    Modal: {
      titleFontSize: 20,
      titleFontWeight: 500,
      titleColor: '#222',
    },
    Table: {
      headerFontSize: 12,
      headerFontWeight: 500,
      headerColor: '#333',
      fontSize: 15,         // Table cell font size
      color: '#222',        // Table cell text color
      // fontFamily: "'Geist', ...", // Optional, usually not needed if global fontFamily is Geist
    },
  },
};

export default themeConfig;