import React, { createContext, useContext, useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/config";

export const lightTheme = {
  background: "#F7F9FC",
  surface: "#FFFFFF",
  primary: "#00ADB5",
  text: "#344950",
  secondaryText: "#707070",
  border: "#E0E0E0",
  icon: "#344950",
  card: "#FFFFFF",
  budget: "#E0F7FA",
  modalBackground: "rgba(0, 0, 0, 0.5)",
  success: "#4CAF50",
  error: "#FF0000",
  chart: "#B3E5FC",
};

export const darkTheme = {
  background: "#121212",
  surface: "#1E1E1E",
  primary: "#00ADB5",
  text: "#FFFFFF",
  secondaryText: "#B0BEC5",
  border: "#2C2C2C",
  icon: "#FFFFFF",
  card: "#2C2C2C",
  budget: "#1E3A3D",
  modalBackground: "rgba(0, 0, 0, 0.8)",
  success: "#66BB6A",
  error: "#FF5252",
  chart: "#1E3A3D",
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
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadUserTheme(user.uid);
      } else {
        setUserId(null);
        setIsDark(false); // Reset the theme when loggin out
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserTheme = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().isDarkMode !== undefined) {
        setIsDark(docSnap.data().isDarkMode);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const loadDefaultTheme = async () => {
    setIsDark(false);
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark;
      setIsDark(newTheme);

      if (userId) {
        const docRef = doc(db, "users", userId);
        await setDoc(docRef, { isDarkMode: newTheme }, { merge: true });
      }
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
