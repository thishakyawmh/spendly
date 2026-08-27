import { useUser, useAuth } from "@clerk/expo";
import { useRouter, useFocusEffect } from "expo-router";
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from "react-native";
import { useState, useCallback } from "react";
import { styles } from "@/assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { useTransactions } from "../../hooks/useTransactions";
import { formatDate } from "../../../lib/utils";
import PageLoader from "../../components/PageLoader";
import { useSettings } from "../../context/SettingsContext";
import SwipeableRow from "../../components/SwipeableRow";

export default function Page() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { colors, currencyInfo, currency } = useSettings();

  const { transactions, summary, isLoading, loadData, deleteTransaction } = useTransactions(
    user.id
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => deleteTransaction(id) },
    ]);
  };

  const handleMenuItemPress = (option) => {
    setShowMenu(false);
    if (option === "Sign Out") {
      signOut();
    } else if (option === "Profile") {
      router.push("/profile");
    } else if (option === "Settings") {
      router.push("/settings");
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      "Food & Drinks": "fast-food",
      "Shopping": "cart",
      "Transportation": "car",
      "Entertainment": "film",
      "Groceries": "basket",
      "Housing & Utilities": "home",
      "Health & Medical": "medkit",
      "Education": "book",
      "Bills & Subs": "receipt",
      "Savings": "trending-up",
      "Income": "cash",
      "Other": "ellipsis-horizontal",
    };
    return icons[category] || "ellipsis-horizontal";
  };

  // Dynamic light container colors adapted to active themes
  const getCategoryColor = (amount) => {
    const val = parseFloat(amount);
    return val >= 0 ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)"; 
  };

  const getIconColor = (amount) => {
    const val = parseFloat(amount);
    return val >= 0 ? colors.income : colors.expense; 
  };

  const renderTransaction = ({ item }) => (
    <SwipeableRow onDelete={() => handleDelete(item.id)} colors={colors}>
      <View style={[styles.transactionCard, { backgroundColor: colors.surface, borderColor: colors.outline, shadowColor: colors.shadow }]}>
        <View style={styles.transactionContent}>
          <View
            style={[
              styles.categoryIconContainer,
              { backgroundColor: getCategoryColor(item.amount) },
            ]}
          >
            <Ionicons
              name={getCategoryIcon(item.category)}
              size={20}
              color={getIconColor(item.amount)}
            />
          </View>
          <View style={styles.transactionLeft}>
            <Text style={[styles.transactionTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.transactionCategory, { color: colors.textLight }]}>{item.category}</Text>
          </View>
          <View style={styles.transactionRight}>
            <Text
              style={[
                styles.transactionAmount,
                { color: parseFloat(item.amount) >= 0 ? colors.income : colors.expense },
              ]}
            >
              {parseFloat(item.amount) >= 0 ? "+" : "-"}{currencyInfo.symbol}{" "}
              {Math.abs(parseFloat(item.amount)).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.transactionDate, { color: colors.textLight }]}>{formatDate(item.created_at)}</Text>
          </View>
        </View>
      </View>
    </SwipeableRow>
  );

  if (isLoading && !refreshing) return <PageLoader />;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        {/* HEADER: GREETINGS LEFT, AVATAR RIGHT */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.welcomeText, { color: colors.textLight }]}>Welcome back,</Text>
            <Text style={[styles.usernameText, { color: colors.text }]}>
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.firstName || user?.emailAddresses[0]?.emailAddress.split("@")[0] || "User"}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              {user?.imageUrl ? (
                <Image source={{ uri: user.imageUrl }} style={[styles.avatarImage, { borderColor: colors.outline }]} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryContainer, borderColor: colors.outline }]}>
                  <Text style={[styles.avatarText, { color: colors.onPrimaryContainer }]}>
                    {(user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress.charAt(0) || "U").toUpperCase()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* MINIMAL SLATE BALANCE CARD */}
        <View style={[styles.balanceCard, { backgroundColor: colors.darkAccent, shadowColor: colors.shadow }]}>
          <Text style={styles.balanceTitle}>Your Balance</Text>
          <View style={styles.balanceAmountContainer}>
            <Text style={styles.balanceAmount}>
              {currencyInfo.symbol}{" "}
              {parseFloat(summary.balance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </Text>
            <Text style={styles.balanceCurrency}>{currency}</Text>
          </View>
        </View>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Transactions</Text>
        </View>
      </View>

      <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="receipt-outline" size={56} color={colors.primary} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No transactions yet</Text>
            <Text style={[styles.emptySubText, { color: colors.textLight }]}>Start by adding your first transaction below</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity style={[styles.fabButton, { backgroundColor: colors.primary }]} onPress={() => router.push("/create")}>
        <Ionicons name="add" size={28} color={colors.primary === "#FFFFFF" ? "#111116" : "#FFFFFF"} />
      </TouchableOpacity>

      {/* DYNAMIC AVATAR POPUP MENU */}
      {showMenu && (
        <View style={styles.menuOverlay}>
          <TouchableOpacity
            style={styles.menuBackdrop}
            activeOpacity={1}
            onPress={() => setShowMenu(false)}
          />
          <View style={[styles.menuCard, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Profile")}>
              <Ionicons name="person-outline" size={16} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Profile</Text>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.outline }]} />
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Settings")}>
              <Ionicons name="settings-outline" size={16} color={colors.primary} />
              <Text style={[styles.menuItemText, { color: colors.text }]}>Settings</Text>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.outline }]} />
            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuItemPress("Sign Out")}>
              <Ionicons name="log-out-outline" size={16} color={colors.expense} />
              <Text style={[styles.menuItemText, { color: colors.expense }]}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
