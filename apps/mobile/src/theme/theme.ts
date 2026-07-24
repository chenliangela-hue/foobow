// Buddhist colour symbolism: gold = enlightenment, vermilion/朱红 = sacred and
// protective (one of the five Buddhas), saffron = monk robes / renunciation.
// `jade` is kept as the accent key name for compatibility but now carries
// vermilion; there are no greens in the palette.
export const colors = {
  light: {
    bg: "#f8f2e7",
    surface: "#fffaf1",
    surfaceStrong: "#ffffff",
    ink: "#2b1f18",
    muted: "#6d5a4a",
    line: "rgba(43, 31, 24, 0.16)",
    jade: "#9d2b20",
    bamboo: "#c8701c",
    coral: "#a8382a",
    gold: "#b88928",
    goldGlow: "rgba(184, 137, 40, 0.22)",
    cardBorder: "rgba(184, 137, 40, 0.18)",
    shadow: "rgba(70, 45, 25, 0.14)"
  },
  dark: {
    bg: "#17110e",
    surface: "#241b16",
    surfaceStrong: "#2d221b",
    ink: "#f6ece0",
    muted: "#b8a595",
    line: "rgba(246, 236, 224, 0.14)",
    jade: "#e0705c",
    bamboo: "#e79a4d",
    coral: "#e0705c",
    gold: "#e6b95c",
    goldGlow: "rgba(230, 185, 92, 0.25)",
    cardBorder: "rgba(230, 185, 92, 0.20)",
    shadow: "rgba(0, 0, 0, 0.4)"
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
