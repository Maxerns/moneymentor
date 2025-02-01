import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const lightTheme = {
  background: "#F7F9FC",
  surface: "#FFFFFF",
  primary: "#00ADB5",
  text: "#344950",
  secondaryText: "#707070",
  border: "#E0E0E0",
  dangerText: "#FF0000",
};

export const darkTheme = {
  background: "#121212",
  surface: "#1E1E1E",
  primary: "#00ADB5",
  text: "#FFFFFF",
  secondaryText: "#B0BEC5",
  border: "#2C2C2C",
  dangerText: "#FF6B6B",
};

type Theme = typeof lightTheme;

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("isDarkMode");
      if (savedTheme !== null) {
        setIsDark(JSON.parse(savedTheme));
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);
      await AsyncStorage.setItem("isDarkMode", JSON.stringify(newTheme));
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
