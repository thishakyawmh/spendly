import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSettings, CURRENCIES } from "../../context/SettingsContext";

export default function SettingsScreen() {
  const router = useRouter();
  const {
    currency,
    theme,
    colors,
    currencyInfo,
    updateCurrency,
    updateTheme,
  } = useSettings();

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter currencies based on search query
  const filteredCurrencies = Object.entries(CURRENCIES).filter(
    ([code, info]) =>
      code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      info.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    settingLabel: {
      fontFamily: "GoogleSans-Medium",
      fontSize: 15,
      color: colors.text,
    },
    settingValueText: {
      fontFamily: "GoogleSans-Regular",
      fontSize: 14,
      color: colors.textLight,
    },
    // Segmented control style for themes
    segmentContainer: {
      flexDirection: "row",
      backgroundColor: colors.surfaceVariant,
      padding: 4,
      borderRadius: 100,
      marginTop: 8,
      marginBottom: 8,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: 8,
      alignItems: "center",
      borderRadius: 100,
    },
    segmentButtonActive: {
      backgroundColor: colors.surface,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    segmentText: {
      fontFamily: "GoogleSans-Medium",
      fontSize: 13,
      color: colors.textLight,
    },
    segmentTextActive: {
      color: colors.primary,
    },
    // Modal styles
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
      backgroundColor: colors.surface,
    },
    modalTitle: {
      fontFamily: "GoogleSans-Bold",
      fontSize: 18,
      color: colors.text,
      flex: 1,
      marginLeft: 16,
    },
    searchBar: {
      fontFamily: "GoogleSans-Regular",
      backgroundColor: colors.surfaceVariant,
      borderRadius: 12,
      margin: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    currencyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.outline,
    },
    currencyCode: {
      fontFamily: "GoogleSans-Bold",
      fontSize: 15,
      color: colors.text,
    },
    currencyName: {
      fontFamily: "GoogleSans-Regular",
      fontSize: 14,
      color: colors.textLight,
      marginTop: 2,
    },
    currencySymbol: {
      fontFamily: "GoogleSans-Bold",
      fontSize: 16,
      color: colors.primary,
    },
  };

  return (
    <View style={dynamicStyles.container}>
      {/* HEADER */}
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={dynamicStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* GENERAL SETTINGS CARD */}
        <View style={dynamicStyles.card}>
          <View style={dynamicStyles.sectionHeader}>
            <Ionicons name="options-outline" size={18} color={colors.primary} />
            <Text style={dynamicStyles.sectionTitle}>General</Text>
          </View>

          <TouchableOpacity
            style={dynamicStyles.settingRow}
            onPress={() => setCurrencyModalVisible(true)}
          >
            <View style={dynamicStyles.settingLeft}>
              <Ionicons name="cash-outline" size={20} color={colors.textLight} />
              <View>
                <Text style={dynamicStyles.settingLabel}>Currency</Text>
                <Text style={dynamicStyles.settingValueText}>
                  {currencyInfo.name} ({currencyInfo.symbol})
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        </View>

        {/* APPEARANCE SETTINGS CARD */}
        <View style={dynamicStyles.card}>
          <View style={dynamicStyles.sectionHeader}>
            <Ionicons name="color-palette-outline" size={18} color={colors.primary} />
            <Text style={dynamicStyles.sectionTitle}>Appearance</Text>
          </View>

          {/* THEME SELECTION */}
          <Text style={[dynamicStyles.settingLabel, { marginTop: 8 }]}>Theme</Text>
          <View style={dynamicStyles.segmentContainer}>
            {["light", "dark", "system"].map((t) => (
              <TouchableOpacity
                key={t}
                style={[
                  dynamicStyles.segmentButton,
                  theme === t && dynamicStyles.segmentButtonActive,
                ]}
                onPress={() => updateTheme(t)}
              >
                <Text
                  style={[
                    dynamicStyles.segmentText,
                    theme === t && dynamicStyles.segmentTextActive,
                  ]}
                >
                  {t.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CURRENCY SELECT MODAL */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={currencyModalVisible}
        onRequestClose={() => setCurrencyModalVisible(false)}
      >
        <View style={dynamicStyles.modalContainer}>
          <View style={dynamicStyles.modalHeader}>
            <TouchableOpacity onPress={() => setCurrencyModalVisible(false)} style={{ padding: 4 }}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={dynamicStyles.modalTitle}>Select Currency</Text>
          </View>

          <TextInput
            style={dynamicStyles.searchBar}
            placeholder="Search currency..."
            placeholderTextColor={colors.textLight}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />

          <FlatList
            data={filteredCurrencies}
            keyExtractor={([code]) => code}
            renderItem={({ item: [code, info] }) => (
              <TouchableOpacity
                style={dynamicStyles.currencyRow}
                onPress={() => {
                  updateCurrency(code);
                  setCurrencyModalVisible(false);
                  setSearchQuery("");
                }}
              >
                <View>
                  <Text style={dynamicStyles.currencyCode}>
                    {code}{" "}
                    {currency === code && (
                      <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
                    )}
                  </Text>
                  <Text style={dynamicStyles.currencyName}>{info.name}</Text>
                </View>
                <Text style={dynamicStyles.currencySymbol}>{info.symbol}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}
