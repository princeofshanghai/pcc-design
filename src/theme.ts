const blueTheme = {
  token: {
    // Primary & Semantic Colors (from Shadcn's "Blue" theme)
    colorPrimary: '#3b82f6',
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    // Backgrounds
    colorBgLayout: '#ffffff',
    colorBgContainer: '#ffffff',
    // Borders & Outlines
    colorBorder: '#e2e8f0', // slate-200
    colorBorderSecondary: '#f1f5f9', // slate-100
    controlOutline: 'rgba(59, 130, 246, 0.4)', // Faded blue for focus rings
    // Text
    colorText: '#0f172a', // slate-900
    colorTextSecondary: '#64748b', // slate-500
    colorTextTertiary: '#94a3b8', // slate-400
    // Typography (Geist/Vercel scale)
    fontWeightStrong: 600, // Geist uses semibold for headings
    fontSizeHeading1: 32, // Geist Heading 32
    fontSizeHeading2: 24, // Geist Heading 24
    fontSizeHeading3: 20, // Geist Heading 20
    fontSizeHeading4: 16, // Geist Heading 16
    fontSize: 16, // Geist Copy 16 (body)
    fontSizeSM: 14, // Geist Copy 14, Label 14
    fontSizeXS: 12, // Geist Label 12
    lineHeight: 1.6, // Modern readable body
    lineHeightHeading: 1.2, // Compact headings
    fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    // Sider trigger color matching
    lightTriggerBg: '#ffffff',
    lightTriggerColor: '#64748b',
    avatarSize: 28,
  },
};

export default blueTheme; 