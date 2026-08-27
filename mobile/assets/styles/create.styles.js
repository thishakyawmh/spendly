// styles/create.styles.js
import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.outline,
  },
  headerTitle: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 18, // M3 Title Large (was 16)
    color: COLORS.text,
    letterSpacing: -0.1,
  },
  backButton: {
    padding: 6,
    borderRadius: 100,
  },
  saveButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primaryContainer,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButton: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 14, // M3 Label Large
    color: COLORS.onPrimaryContainer,
  },
  card: {
    backgroundColor: COLORS.surface,
    margin: 16,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.outline,
  },
  typeSelector: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 10,
    backgroundColor: COLORS.surfaceVariant,
    padding: 4,
    borderRadius: 100,
  },
  typeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 100,
  },
  typeButtonActive: {
    backgroundColor: COLORS.surface,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  typeIcon: {
    marginRight: 4,
  },
  typeButtonText: {
    fontFamily: "GoogleSans-Medium",
    color: COLORS.textLight,
    fontSize: 14, // M3 Label Large
  },
  typeButtonTextActive: {
    color: COLORS.text,
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 16,
    backgroundColor: COLORS.surfaceVariant,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontFamily: "GoogleSans-Medium",
    fontSize: 28, // M3 Headline Medium
    color: COLORS.text,
    marginRight: 4,
  },
  amountInput: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 32, // M3 Headline Large
    color: COLORS.text,
    minWidth: 100,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.outline,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 16,
    backgroundColor: COLORS.surface,
  },
  inputIcon: {
    marginRight: 12,
    marginLeft: 4,
  },
  input: {
    fontFamily: "GoogleSans-Regular",
    flex: 1,
    paddingVertical: 10,
    fontSize: 16, // M3 Body Large (was 15)
    color: COLORS.text,
  },
  sectionTitle: {
    fontFamily: "GoogleSans-Bold",
    fontSize: 16, // M3 Title Medium (was 15)
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  categoryItem: {
    width: "30%", // 3 columns grid
    alignItems: "center",
    marginBottom: 16,
  },
  categoryCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.2,
    borderColor: COLORS.outline,
    backgroundColor: COLORS.surface,
    marginBottom: 6,
  },
  categoryCircleActive: {
    backgroundColor: COLORS.primaryContainer,
    borderColor: COLORS.primary,
  },
  categoryLabel: {
    fontFamily: "GoogleSans-Medium",
    color: COLORS.text,
    fontSize: 11,
    textAlign: "center",
  },
  categoryLabelActive: {
    color: COLORS.primary,
    fontFamily: "GoogleSans-Bold",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
});
