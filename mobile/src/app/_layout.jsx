import { useEffect } from "react";
import { Platform, LogBox } from "react-native";
import { Slot } from "expo-router";
import SafeScreen from "../components/SafeScreen";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { SettingsProvider } from "../context/SettingsContext";

LogBox.ignoreLogs([
  "Clerk: Clerk has been loaded with development keys",
  "Cannot connect to Expo CLI",
]);

SplashScreen.preventAutoHideAsync();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "GoogleSans-Regular": require("../../assets/fonts/GoogleSans-Regular.ttf"),
    "GoogleSans-Medium": require("../../assets/fonts/GoogleSans-Medium.ttf"),
    "GoogleSans-Bold": require("../../assets/fonts/GoogleSans-Bold.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === "web" && typeof document !== "undefined") {
      if (!document.getElementById("clerk-captcha")) {
        const captchaDiv = document.createElement("div");
        captchaDiv.id = "clerk-captcha";
        document.body.appendChild(captchaDiv);
      }
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <SettingsProvider>
        <SafeScreen>
          <Slot />
        </SafeScreen>
        <StatusBar style="dark" />
      </SettingsProvider>
    </ClerkProvider>
  );
}
