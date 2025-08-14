import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { LogIn, UserPlus, Shield } from "lucide-react-native";
import { colors } from "../../utils/colors";
import PrimaryButton from "../../components/ui/PrimaryButton";

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.backgroundPattern} />

      <View style={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Shield size={48} color={colors.primary.green} />
          </View>
          <Text style={styles.title}>Welcome to PSB</Text>
          <Text style={styles.subtitle}>
            Your trusted financial partner for secure banking solutions
          </Text>
        </View>

        <View style={styles.actionSection}>
          <PrimaryButton
            title="Sign In"
            onPress={() => router.push("/(auth)/login")}
            style={styles.primaryButton}
          />

          <PrimaryButton
            title="Create Account"
            onPress={() => router.push("/(auth)/signup")}
            variant="outline"
            style={styles.secondaryButton}
          />
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>
            Secured by industry-leading encryption
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.lightGreen,
  },
  backgroundPattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    backgroundColor: colors.primary.green,
    opacity: 0.05,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  headerSection: {
    alignItems: "center",
    marginTop: 80,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.neutral.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: colors.primary.green,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: colors.primary.darkGreen,
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: colors.neutral.gray600,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 40,
  },
  actionSection: {
    gap: 16,
    marginBottom: 40,
  },
  primaryButton: {
    marginBottom: 8,
  },
  secondaryButton: {
    marginTop: 8,
  },
  footerSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: colors.neutral.gray500,
    textAlign: "center",
  },
});
