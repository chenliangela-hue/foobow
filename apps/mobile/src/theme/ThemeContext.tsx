import { ReactNode, createContext, useContext } from "react";
import { useColorScheme } from "react-native";
import { ThemeColors, colors } from "./theme";

const ThemeContext = createContext<ThemeColors>(colors.light);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const scheme = useColorScheme();
  return (
    <ThemeContext.Provider value={scheme === "dark" ? colors.dark : colors.light}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeColors(): ThemeColors {
  return useContext(ThemeContext);
}
