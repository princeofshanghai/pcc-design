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
    fontFamily: 'Geist, Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
    fontSize: 14, // Dub body text
    fontSizeSM: 13, // Dub sidebar/menu
    fontSizeXS: 12, // Metadata/labels
    fontSizeHeading1: 20, // Dub H1 (page/section title)
    fontSizeHeading2: 18, // Dub H2 (subsection)
    fontSizeHeading3: 16, // Dub H3 (small header)
    fontSizeHeading4: 15, // Dub H4 (tiny header)
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightStrong: 600,
    lineHeight: 1.4, // Body
    lineHeightHeading: 1.2, // Headings
    // Sider trigger color matching
    lightTriggerBg: '#ffffff',
    lightTriggerColor: '#64748b',
    avatarSize: 28,
    // Responsive Spacing System (8px grid, mobile-first)
    // Content margins scale with screen size
    contentMarginXS: 16, // Mobile (320px+)
    contentMarginSM: 24, // Tablet (768px+)
    contentMarginMD: 32, // Desktop (1024px+)
    contentMarginLG: 40, // Large desktop (1440px+)
    contentMarginXL: 48, // Extra large (1920px+)
    // Section spacing
    sectionSpacingXS: 24, // Mobile
    sectionSpacingSM: 32, // Tablet
    sectionSpacingMD: 40, // Desktop
    sectionSpacingLG: 48, // Large desktop
    sectionSpacingXL: 56, // Extra large
    // Component spacing
    componentSpacingXS: 16, // Mobile
    componentSpacingSM: 20, // Tablet
    componentSpacingMD: 24, // Desktop
    componentSpacingLG: 32, // Large desktop
    componentSpacingXL: 40, // Extra large
  },
};

export default blueTheme; 