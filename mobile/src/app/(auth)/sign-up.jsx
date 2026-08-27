import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useSignUp } from "@clerk/expo/legacy";
import { useSSO } from "@clerk/expo";
import { useRouter } from "expo-router";
import { getAuthStyles } from "@/assets/styles/auth.styles.js";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useSettings } from "../../context/SettingsContext";

WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { startSSOFlow } = useSSO();
  const router = useRouter();
  const { colors } = useSettings();
  const styles = getAuthStyles(colors);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    if (!firstName.trim() || !lastName.trim() || !emailAddress.trim() || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      setPendingVerification(true);
      setError("");
    } catch (err) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is already in use. Please try another.");
      } else {
        setError(err.errors?.[0]?.longMessage || "An error occurred. Please try again.");
      }
      console.log(err);
    }
  };

  // Handle Google SSO
  const onGoogleSignUpPress = async () => {
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
      setError("Google sign-up failed. Please try again.");
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      setError(err.errors?.[0]?.longMessage || "Verification failed. Please try again.");
      console.error(err);
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.verificationContainer}>
        <Text style={styles.verificationTitle}>Verify your email</Text>
        <Text style={styles.verificationSubtitle}>
          We sent a 6-digit verification code to {emailAddress}. Enter it below to proceed.
        </Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={20} color={colors.expense} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={() => setError("")}>
              <Ionicons name="close" size={20} color={colors.expense} />
            </TouchableOpacity>
          </View>
        ) : null}

        <TextInput
          style={[
            styles.verificationInput,
            code ? { letterSpacing: 8, fontFamily: "GoogleSans-Bold" } : { letterSpacing: 0, fontFamily: "GoogleSans-Regular" },
            error && styles.errorInput
          ]}
          value={code}
          placeholder="Enter 6-digit code"
          placeholderTextColor={colors.textLight}
          keyboardType="number-pad"
          maxLength={6}
          onChangeText={(code) => setCode(code)}
        />

        <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1 }}
      contentContainerStyle={{ flexGrow: 1 }}
      enableOnAndroid={true}
      enableAutomaticScroll={true}
    >
      <View style={styles.container}>
        <Image source={require("@/assets/images/revenue-i2.png")} style={styles.illustration} />

        <Text style={styles.title}>Create Account</Text>

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
        <TouchableOpacity style={styles.googleButton} onPress={onGoogleSignUpPress}>
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
          autoCapitalize="words"
          value={firstName}
          placeholderTextColor={colors.textLight}
          placeholder="First Name"
          onChangeText={(val) => setFirstName(val)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="words"
          value={lastName}
          placeholderTextColor={colors.textLight}
          placeholder="Last Name"
          onChangeText={(val) => setLastName(val)}
        />

        <TextInput
          style={[styles.input, error && styles.errorInput]}
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailAddress}
          placeholderTextColor={colors.textLight}
          placeholder="Enter email"
          onChangeText={(email) => setEmailAddress(email)}
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

        <TouchableOpacity style={styles.button} onPress={onSignUpPress}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
