import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/expo";
import { useState } from "react";
import { API_URL } from "../../../constants/api";
import { styles } from "@/assets/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import { useSettings } from "../../context/SettingsContext";

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "groceries", name: "Groceries", icon: "basket" },
  { id: "housing", name: "Housing & Utilities", icon: "home" },
  { id: "medical", name: "Health & Medical", icon: "medkit" },
  { id: "education", name: "Education", icon: "book" },
  { id: "bills", name: "Bills & Subs", icon: "receipt" },
  { id: "savings", name: "Savings", icon: "trending-up" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { colors, currencyInfo } = useSettings();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) return Alert.alert("Error", "Please enter a transaction title");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedCategory) return Alert.alert("Error", "Please select a category");

    setIsLoading(true);
    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });

      if (response.ok) {
        Alert.alert("Success", "Transaction added successfully", [
          { text: "OK", onPress: () => router.replace("/") },
        ]);
      } else {
        Alert.alert("Error", "Failed to save transaction");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <View style={[styles.header, { borderBottomColor: colors.outline }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Transaction</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            { backgroundColor: colors.primaryContainer },
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.onPrimaryContainer} />
          ) : (
            <Ionicons name="checkmark" size={18} color={colors.onPrimaryContainer} />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        {/* TYPE SELECTOR (EXPENSE / INCOME) */}
        <View style={[styles.typeSelector, { backgroundColor: colors.surfaceVariant }]}>
          <TouchableOpacity
            style={[styles.typeButton, isExpense && [styles.typeButtonActive, { backgroundColor: colors.surface }]]}
            onPress={() => setIsExpense(true)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={20}
              color={isExpense ? colors.expense : colors.textLight}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, { color: colors.textLight }, isExpense && [styles.typeButtonTextActive, { color: colors.text }]]}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeButton, !isExpense && [styles.typeButtonActive, { backgroundColor: colors.surface }]]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-down-circle"
              size={20}
              color={!isExpense ? colors.income : colors.textLight}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, { color: colors.textLight }, !isExpense && [styles.typeButtonTextActive, { color: colors.text }]]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        {/* AMOUNT CONTAINER */}
        <View style={[styles.amountContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={[styles.currencySymbol, { color: colors.text }]}>{currencyInfo.symbol}</Text>
          <TextInput
            style={[styles.amountInput, { color: colors.text }]}
            placeholder="0.00"
            placeholderTextColor={colors.textLight}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* TITLE INPUT CONTAINER */}
        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
          <Ionicons
            name="create-outline"
            size={22}
            color={colors.primary}
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Transaction Title"
            placeholderTextColor={colors.textLight}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* CATEGORY GRID */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16, marginBottom: 16 }]}>Category</Text>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => {
            const isActive = selectedCategory === category.name;
            return (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(category.name)}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    { backgroundColor: colors.surface, borderColor: colors.outline },
                    isActive && [styles.categoryCircleActive, { backgroundColor: colors.primaryContainer, borderColor: colors.primary }],
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={20}
                    color={isActive ? colors.primary : colors.textLight}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryLabel,
                    { color: colors.textLight },
                    isActive && [styles.categoryLabelActive, { color: colors.primary }],
                  ]}
                  numberOfLines={2}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {isLoading && (
        <View style={[styles.loadingContainer, { backgroundColor: "rgba(255, 255, 255, 0.4)" }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </View>
  );
};

export default CreateScreen;
