// Buddhist colour symbolism: gold = enlightenment, vermilion/朱红 = sacred and
// protective (one of the five Buddhas), saffron = monk robes / renunciation.
// `jade` is kept as the accent key name for compatibility but now carries
// vermilion; there are no greens in the palette.
export const colors = {
  light: {
    bg: "#FFF9F2",
    surface: "#ffffff",
    surfaceStrong: "#F7F1E9",
    ink: "#1F2937",
    muted: "#4B5563",
    line: "rgba(31, 41, 55, 0.12)",
    jade: "#2E7D6B",
    bamboo: "#EFBC78",
    coral: "#8d2518",
    gold: "#EFBC78",
    goldGlow: "rgba(239, 188, 120, 0.35)",
    cardBorder: "#E5E7EB",
    shadow: "rgba(0, 0, 0, 0.08)"
  },
  dark: {
    bg: "#052f31",
    surface: "#07383a",
    surfaceStrong: "#0a4648",
    ink: "#fffaf0",
    muted: "#aaf0d6",
    line: "rgba(255, 255, 255, 0.16)",
    jade: "#70d6b0",
    bamboo: "#efc978",
    coral: "#f4b8a8",
    gold: "#efc978",
    goldGlow: "rgba(239, 201, 120, 0.35)",
    cardBorder: "rgba(239, 201, 120, 0.28)",
    shadow: "rgba(0, 0, 0, 0.45)"
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
