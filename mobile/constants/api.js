import { Platform } from "react-native";

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;

const getApiUrl = () => {
  if (configuredApiUrl) return configuredApiUrl.replace(/\/+$/, "");
  if (Platform.OS === "android") {
    return "http://10.0.2.2:5001/api";
  }
  return "http://localhost:5001/api";
};

export const API_URL = getApiUrl();
