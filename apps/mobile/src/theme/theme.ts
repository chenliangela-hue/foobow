export const colors = {
  light: {
    bg: "#f6f1e8",
    surface: "#fffaf1",
    surfaceStrong: "#ffffff",
    ink: "#23302f",
    muted: "#5b635c",
    line: "rgba(35, 48, 47, 0.14)",
    jade: "#0f6c64",
    bamboo: "#5c6b2e",
    coral: "#9d3f30",
    gold: "#b88928",
    goldGlow: "rgba(184, 137, 40, 0.22)",
    cardBorder: "rgba(184, 137, 40, 0.18)",
    shadow: "rgba(52, 44, 31, 0.12)"
  },
  dark: {
    bg: "#141818",
    surface: "#1f2625",
    surfaceStrong: "#25302f",
    ink: "#f0f5ee",
    muted: "#a2ada4",
    line: "rgba(240, 245, 238, 0.14)",
    jade: "#22a396",
    bamboo: "#8ca049",
    coral: "#e06c5a",
    gold: "#e6b95c",
    goldGlow: "rgba(230, 185, 92, 0.25)",
    cardBorder: "rgba(230, 185, 92, 0.20)",
    shadow: "rgba(0, 0, 0, 0.35)"
  }
};

export const layout = {
  minTouchTarget: 48,
  borderRadius: {
    sm: 8,
    md: 14,
    lg: 20,
    full: 9999
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32
  }
};

export const typography = {
  fontFamilySerif: "Georgia",
  fontFamilySans: "System",
  sizes: {
    eyebrow: 13,
    caption: 14,
    body: 16,
    bodySenior: 18,
    title: 22,
    titleSenior: 24,
    header: 28,
    headerSenior: 32
  },
  lineHeights: {
    tight: 1.1,
    normal: 1.4,
    relaxed: 1.6
  }
};

export type ThemeColors = typeof colors.light;
