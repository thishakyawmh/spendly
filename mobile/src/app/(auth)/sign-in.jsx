import { useSignIn } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getAuthStyles } from "@/assets/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useSettings } from "../../context/SettingsContext";

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { colors } = useSettings();
  const styles = getAuthStyles(colors);

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        console.log(result);
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Sign in failed. Please check your credentials.");
      console.log(err);
    }
  };

  const onGoogleSignInPress = async () => {
    try {
      const { createdSessionId, setActive: setSSOActive, signIn: ssoSignIn, signUp: ssoSignUp } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: Linking.createURL("oauth-callback"),
      });

      const targetSessionId = createdSessionId || ssoSignIn?.createdSessionId || ssoSignUp?.createdSessionId;

      if (targetSessionId && setSSOActive) {
        await setSSOActive({ session: targetSessionId });
        router.replace("/");
      }
    } catch (err) {
      console.error("[Google SSO Error]", err);
      setError("Google sign-in failed. Please try again.");
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
      extraScrollHeight={30}
    >
      <View style={styles.container}>
        <Image source={require("@/assets/images/revenue-i4.png")} style={styles.illustration} />
        <Text style={styles.title}>Welcome Back</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={colors.expense} />
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Google SSO Button */}
        <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignInPress}>
          <Ionicons name="logo-google" size={20} color={colors.primary} />
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={colors.textLight}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        />

        <View style={[styles.passwordContainer, error && styles.errorInput]}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            placeholder="Enter password"
            placeholderTextColor={colors.textLight}
            secureTextEntry={!showPassword}
            onChangeText={(password) => setPassword(password)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={onSignInPress}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>

          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.linkText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
