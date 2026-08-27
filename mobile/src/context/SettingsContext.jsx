import React, { createContext, useState, useEffect, useContext } from "react";
import { useColorScheme, Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

export const CURRENCIES = {
  USD: { symbol: "$", name: "United States Dollar" },
  EUR: { symbol: "€", name: "Euro" },
  GBP: { symbol: "£", name: "British Pound" },
  JPY: { symbol: "¥", name: "Japanese Yen" },
  AUD: { symbol: "A$", name: "Australian Dollar" },
  CAD: { symbol: "C$", name: "Canadian Dollar" },
  INR: { symbol: "₹", name: "Indian Rupee" },
  LKR: { symbol: "Rs", name: "Sri Lankan Rupee" },
  AED: { symbol: "د.إ", name: "UAE Dirham" },
  CNY: { symbol: "¥", name: "Chinese Yuan" },
  CHF: { symbol: "CHF", name: "Swiss Franc" },
  SGD: { symbol: "S$", name: "Singapore Dollar" },
  NZD: { symbol: "NZ$", name: "New Zealand Dollar" },
};

const themePalettes = {
  monochrome: {
    light: { primary: "#111111", primaryContainer: "#E5E7EB", onPrimaryContainer: "#111111" },
    dark: { primary: "#FFFFFF", primaryContainer: "#2D2D3D", onPrimaryContainer: "#FFFFFF" },
  },
};

const getThemeColors = (activeTheme) => {
  const isDark = activeTheme === "dark";
  const palette = themePalettes.monochrome[isDark ? "dark" : "light"];

  return {
    ...palette,
    darkAccent: isDark ? "#1E1E24" : "#111111", // Pure black card in light mode, charcoal card in dark mode
    background: isDark ? "#111116" : "#F8FAF9", // High contrast background
    surface: isDark ? "#1E1E24" : "#FFFFFF",
    surfaceVariant: isDark ? "#282833" : "#F3F4F6",
    onSurface: isDark ? "#F3F4F6" : "#1F2937",
    onSurfaceVariant: isDark ? "#9CA3AF" : "#4B5563",
    outline: isDark ? "#2D2D3D" : "#E5E7EB",
    text: isDark ? "#F3F4F6" : "#1F2937",
    textLight: isDark ? "#9CA3AF" : "#4B5563",
    border: isDark ? "#2D2D3D" : "#E5E7EB",
    card: isDark ? "#1E1E24" : "#FFFFFF",
    white: "#FFFFFF",
    income: isDark ? "#34D399" : "#10B981", // Keeps green for positive cashflow/income
    expense: isDark ? "#F87171" : "#EF4444", // Keeps red for negative cashflow/expense
    shadow: isDark ? "rgba(0, 0, 0, 0.4)" : "rgba(0, 0, 0, 0.03)",
    secondary: "#4F7CAC",
    warning: "#F59E0B",
  };
};

const getStorageItem = async (key) => {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    }
    return await SecureStore.getItemAsync(key);
  } catch (err) {
    console.warn("Storage read error:", err);
    return null;
  }
};

const setStorageItem = async (key, value) => {
  try {
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch (err) {
    console.warn("Storage write error:", err);
  }
};

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();

  const [currency, setCurrencyState] = useState("USD");
  const [theme, setThemeState] = useState("system");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const storedCurrency = await getStorageItem("setting_currency");
      const storedTheme = await getStorageItem("setting_theme");

      if (storedCurrency) setCurrencyState(storedCurrency);
      if (storedTheme) setThemeState(storedTheme);
      setIsLoaded(true);
    };
    loadSettings();
  }, []);

  const updateCurrency = async (val) => {
    setCurrencyState(val);
    await setStorageItem("setting_currency", val);
  };

  const updateTheme = async (val) => {
    setThemeState(val);
    await setStorageItem("setting_theme", val);
  };

  const activeTheme = theme === "system" ? systemColorScheme : theme;
  const colors = getThemeColors(activeTheme);
  const currencyInfo = CURRENCIES[currency] || CURRENCIES.USD;

  return (
    <SettingsContext.Provider
      value={{
        currency,
        theme,
        isLoaded,
        activeTheme,
        colors,
        currencyInfo,
        updateCurrency,
        updateTheme,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
