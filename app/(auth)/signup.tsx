import React from "react";
import { View, StyleSheet, Text, Image, Dimensions } from "react-native";
import { StatusBar } from "expo-status-bar";
import SignupForm from "../../components/SignupForm";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function SignupScreen() {
  const handleSignupSuccess = () => {
    router.push("/(auth)/OTPVerification");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://cdn.jsdelivr.net/gh/Nishant-Manocha/FineduGuard_StaticFiles@main/FinEduGuardWhiteLogo.png",
          }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.appSubtitle}>Create Your Account</Text>
      </View>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1b8a5a", // Same rich green as LoginScreen
  },
  header: {
    alignItems: "center",
    paddingTop: 35,
    paddingBottom: 30,
  },
  logo: {
    width: width * 0.8,
    height: width * 0.5,
    marginBottom: 6,
  },
  appSubtitle: {
    fontSize: 16,
    color: "#f1d28f", // Gold tone for elegance
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingTop: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 8,
    elevation: 5,
  },
});
