import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useUser } from "@clerk/expo";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../../context/SettingsContext";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { colors } = useSettings();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [password, setPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [updatingName, setUpdatingName] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);

  const handlePickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "We need access to your photo library to update your avatar.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        const selectedUri = result.assets[0].uri;
        setUpdatingAvatar(true);

        // Fetch local URI and convert to Blob for uploading to Clerk
        const response = await fetch(selectedUri);
        const blob = await response.blob();

        await user.setProfileImage({ file: blob });
        Alert.alert("Success", "Profile photo updated successfully.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Upload Failed",
        err.errors?.[0]?.longMessage || err.message || "An error occurred uploading the image."
      );
    } finally {
      setUpdatingAvatar(false);
    }
  };

  const handleUpdateName = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Validation Error", "First Name and Last Name cannot be empty.");
      return;
    }
    setUpdatingName(true);
    try {
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      Alert.alert("Success", "Profile information updated successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Update Failed", err.errors?.[0]?.longMessage || "An error occurred.");
    } finally {
      setUpdatingName(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!password || password.length < 8) {
      Alert.alert("Validation Error", "Password must be at least 8 characters long.");
      return;
    }
    setUpdatingPassword(true);
    try {
      await user.update({
        password: password,
      });
      setPassword("");
      Alert.alert("Success", "Password updated successfully.");
    } catch (err) {
      console.error(err);
      Alert.alert("Update Failed", err.errors?.[0]?.longMessage || "An error occurred.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
      backgroundColor: colors.surface,
    },
    headerTitle: {
      fontFamily: "GoogleSans-Bold",
      fontSize: 18,
      color: colors.text,
      marginLeft: 16,
    },
    scrollContent: {
      padding: 16,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      padding: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.outline,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 16,
    },
    sectionTitle: {
      fontFamily: "GoogleSans-Bold",
      fontSize: 16,
      color: colors.text,
    },
    avatarContainer: {
      alignItems: "center",
      marginBottom: 20,
      gap: 12,
    },
    avatarWrapper: {
      position: "relative",
      width: 90,
      height: 90,
      borderRadius: 45,
      overflow: "hidden",
      borderWidth: 1.5,
      borderColor: colors.outline,
    },
    avatarImage: {
      width: "100%",
      height: "100%",
    },
    avatarPlaceholder: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    avatarPlaceholderText: {
      fontFamily: "GoogleSans-Bold",
      fontSize: 26,
    },
    avatarLoadingOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      justifyContent: "center",
      alignItems: "center",
    },
    uploadButton: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1.2,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 100,
      gap: 8,
    },
    uploadButtonText: {
      fontFamily: "GoogleSans-Bold",
      fontSize: 13,
    },
    label: {
      fontFamily: "GoogleSans-Medium",
      fontSize: 13,
      color: colors.textLight,
      marginBottom: 6,
      marginLeft: 4,
    },
    input: {
      fontFamily: "GoogleSans-Regular",
      backgroundColor: colors.surfaceVariant,
      borderRadius: 14,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surfaceVariant,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: colors.outline,
      marginBottom: 16,
      paddingHorizontal: 14,
    },
    passwordInput: {
      flex: 1,
      fontFamily: "GoogleSans-Regular",
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
    },
    eyeIcon: {
      padding: 4,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 100,
      paddingVertical: 12,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 4,
      flexDirection: "row",
    },
    buttonText: {
      fontFamily: "GoogleSans-Medium",
      color: colors.onPrimary || (colors.primary === "#FFFFFF" ? "#111111" : "#FFFFFF"),
      fontSize: 14,
      letterSpacing: 0.1,
    },
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={dynamicStyles.container}>
        {/* HEADER */}
        <View style={dynamicStyles.header}>
          <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={dynamicStyles.headerTitle}>Edit Profile</Text>
        </View>

        <ScrollView contentContainerStyle={dynamicStyles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* PERSONAL INFORMATION CARD */}
          <View style={dynamicStyles.card}>
            <View style={dynamicStyles.sectionHeader}>
              <Ionicons name="person-outline" size={18} color={colors.primary} />
              <Text style={dynamicStyles.sectionTitle}>Personal Info</Text>
            </View>

            {/* AVATAR EDIT VIEW */}
            <View style={dynamicStyles.avatarContainer}>
              <View style={dynamicStyles.avatarWrapper}>
                {user?.imageUrl ? (
                  <Image source={{ uri: user.imageUrl }} style={dynamicStyles.avatarImage} />
                ) : (
                  <View style={[dynamicStyles.avatarPlaceholder, { backgroundColor: colors.primaryContainer }]}>
                    <Text style={[dynamicStyles.avatarPlaceholderText, { color: colors.onPrimaryContainer }]}>
                      {user?.firstName?.[0]?.toUpperCase() || ""}
                      {user?.lastName?.[0]?.toUpperCase() || ""}
                    </Text>
                  </View>
                )}
                {updatingAvatar && (
                  <View style={dynamicStyles.avatarLoadingOverlay}>
                    <ActivityIndicator size="small" color={colors.white} />
                  </View>
                )}
              </View>
              <TouchableOpacity
                style={[dynamicStyles.uploadButton, { borderColor: colors.primary }]}
                onPress={handlePickImage}
                disabled={updatingAvatar}
              >
                <Ionicons name="camera-outline" size={16} color={colors.primary} />
                <Text style={[dynamicStyles.uploadButtonText, { color: colors.primary }]}>Change Photo</Text>
              </TouchableOpacity>
            </View>

            <Text style={dynamicStyles.label}>First Name</Text>
            <TextInput
              style={dynamicStyles.input}
              value={firstName}
              placeholder="First Name"
              placeholderTextColor={colors.textLight}
              onChangeText={(val) => setFirstName(val)}
            />

            <Text style={dynamicStyles.label}>Last Name</Text>
            <TextInput
              style={dynamicStyles.input}
              value={lastName}
              placeholder="Last Name"
              placeholderTextColor={colors.textLight}
              onChangeText={(val) => setLastName(val)}
            />

            <TouchableOpacity
              style={dynamicStyles.button}
              onPress={handleUpdateName}
              disabled={updatingName}
            >
              {updatingName ? (
                <ActivityIndicator size="small" color={colors.onPrimary || (colors.primary === "#FFFFFF" ? "#111111" : "#FFFFFF")} style={{ marginRight: 8 }} />
              ) : null}
              <Text style={dynamicStyles.buttonText}>Save Info</Text>
            </TouchableOpacity>
          </View>

          {/* SECURITY CARD */}
          <View style={dynamicStyles.card}>
            <View style={dynamicStyles.sectionHeader}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.primary} />
              <Text style={dynamicStyles.sectionTitle}>Security</Text>
            </View>

            <Text style={dynamicStyles.label}>New Password</Text>
            <View style={dynamicStyles.passwordContainer}>
              <TextInput
                style={dynamicStyles.passwordInput}
                value={password}
                placeholder="Enter new password"
                placeholderTextColor={colors.textLight}
                secureTextEntry={!showPassword}
                onChangeText={(val) => setPassword(val)}
              />
              <TouchableOpacity
                style={dynamicStyles.eyeIcon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={dynamicStyles.button}
              onPress={handleUpdatePassword}
              disabled={updatingPassword}
            >
              {updatingPassword ? (
                <ActivityIndicator size="small" color={colors.onPrimary || (colors.primary === "#FFFFFF" ? "#111111" : "#FFFFFF")} style={{ marginRight: 8 }} />
              ) : null}
              <Text style={dynamicStyles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
