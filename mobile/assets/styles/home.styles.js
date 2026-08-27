// styles/home.styles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 12,
  },
  headerLeft: {
    justifyContent: "center",
  },
  welcomeText: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 12, // Reduced from 13
    color: COLORS.textLight,
    marginBottom: 2,
  },
  usernameText: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 16, // Reduced from 20 (Body Large / Title Medium)
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoutButton: {
    padding: 8,
    borderRadius: 100,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  avatarImage: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1.5,
    borderColor: COLORS.outline,
  },
  avatarPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primaryContainer,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  avatarText: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 18,
    color: COLORS.onPrimaryContainer,
  },
  // 🖤 Premium Slate Balance Card from reference design
  balanceCard: {
    backgroundColor: "#1A1A1A", // Dark Slate Black
    borderRadius: 28,
    padding: 24,
    marginBottom: 24,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 6,
  },
  balanceTitle: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceAmountContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
  },
  balanceAmount: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 28, // Reduced from 34 (Headline Medium)
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  balanceCurrency: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.4)",
    fontWeight: "600",
  },
  transactionsHeaderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 15, // Reduced from 17
    color: COLORS.text,
    letterSpacing: -0.1,
  },
  transactionsList: {
    flex: 1,
  },
  transactionsListContent: {
    paddingHorizontal: 20,
    paddingBottom: 96,
  },
  // 🔘 Flat Light-Grey rounded items from reference
  transactionCard: {
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  transactionContent: {
    flex: 1,
    flexDirection: "row",
    padding: 14,
    alignItems: "center",
  },
  categoryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  transactionLeft: {
    flex: 1,
  },
  transactionTitle: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 14, // Reduced from 15
    color: COLORS.text,
    marginBottom: 2,
  },
  transactionCategory: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 11, // Reduced from 12
    color: COLORS.textLight,
  },
  transactionRight: {
    alignItems: "flex-end",
    marginRight: 4,
  },
  transactionAmount: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 14, // Reduced from 15
    marginBottom: 2,
  },
  transactionDate: {
    fontFamily: "GoogleSans-Regular",
    fontSize: 10, // Reduced from 11
    color: COLORS.textLight,
  },
  deleteButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderLeftWidth: 1,
    borderLeftColor: "rgba(0, 0, 0, 0.05)",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 16,
    color: COLORS.text,
    marginTop: 12,
  },
  emptySubText: {
    fontFamily: "GoogleSans-Regular",
    fontSize: 13,
    color: COLORS.textLight,
    marginTop: 6,
    textAlign: "center",
    lineHeight: 18,
  },
  fabButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#1A1A1A", // Match the dark card for M3 high emphasis FAB
    borderRadius: 16,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  menuOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  menuBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "transparent", // invisible touch handler
  },
  menuCard: {
    position: "absolute",
    top: 60, // Positioned just below avatar
    right: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 6,
    width: 140,
    borderWidth: 1,
    borderColor: COLORS.outline,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  menuItemText: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 14,
    color: COLORS.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.outline,
    marginVertical: 4,
    marginHorizontal: 8,
  },
});
