export const zIndex = {
  header: 1001,
  modal: 1050,
};

const themeConfig = {
  token: {
    fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
    fontSizeHeading1: 28,
    fontSizeHeading2: 20,
    fontSizeHeading3: 16,
    fontWeightStrong: 500,
    lineHeightHeading: 1.2,
    zIndexHeader: 1001,
    zIndexModal: 1050,
  },
  components: {
    Modal: {
      titleFontSize: 20,
      titleFontWeight: 500,
      titleColor: '#222',
      zIndexPopup: 1050,
    },
    Drawer: {
      zIndexPopup: 1100,  // ← Same level as modal
    },
    Notification: {
      zIndexPopup: 1110,  // ← Higher than modal for notifications
    },
    Message: {
      zIndexPopup: 1110,  // ← Same level as notifications
    },
    Popover: {
      zIndexPopup: 1120,  // ← Higher than notifications
    },
    Tooltip: {
      zIndexPopup: 1130,  // ← Highest for tooltips
    },
    Dropdown: {
      zIndexPopup: 1120,  // ← Same level as popover
    },
    Select: {
      zIndexPopup: 1120,  // ← Same level as dropdown
    },
    DatePicker: {
      zIndexPopup: 1120,  // ← Same level as dropdown
    },
    TimePicker: {
      zIndexPopup: 1120,  // ← Same level as dropdown
    },
    Cascader: {
      zIndexPopup: 1120,  // ← Same level as dropdown
    },
    TreeSelect: {
      zIndexPopup: 1120,  // ← Same level as dropdown
    },
    Table: {
      headerFontSize: 12,
      headerFontWeight: 500,
      headerColor: '#333',
      fontSize: 15,
      color: '#222',
    },
  },
};

export default themeConfig;