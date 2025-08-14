import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardTypeOptions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Check,
  CircleAlert as AlertCircle,
  Apple,
} from "lucide-react-native";
import { useDispatch } from "react-redux";
import { sendOtp } from "../redux/services/operations/authServices";
import { setSignUpData } from "../redux/slices/authSlice";
import SecureTextInput from "./SecureTextInput";

const { width, height } = Dimensions.get("window");

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const SignupForm = ({ onSignupSuccess }: { onSignupSuccess?: () => void }) => {
  const dispatch = useDispatch();

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [uiState, setUiState] = useState({
    showPassword: false,
    showConfirmPassword: false,
    agreeToTerms: false,
    loading: false,
    focusedField: null as string | null,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [validationState, setValidationState] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  // Animations
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(password)) return "Include lowercase letters";
    if (!/(?=.*[A-Z])/.test(password)) return "Include uppercase letters";
    if (!/(?=.*\d)/.test(password)) return "Include numbers";
    if (!/(?=.*[~`!@#$%^&*()_+\-={}\[\]|;:'",.<>/?])/.test(password))
      return "Include special characters";

    const commonPasswords = [
      "password",
      "123456",
      "123456789",
      "qwerty",
      "abc123",
    ];
    if (commonPasswords.includes(password.toLowerCase()))
      return "Password is too common";

    const emailUser = formData.email.split("@")[0]?.toLowerCase();
    if (emailUser && password.toLowerCase().includes(emailUser)) {
      return "Password cannot contain your email username";
    }
    return "";
  };

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "firstName":
      case "lastName":
        return value.length < 2 ? `${field} must be at least 2 characters` : "";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Enter a valid email";
      case "password":
        return validatePassword(value);
      case "confirmPassword":
        return value !== formData.password ? "Passwords do not match" : "";
      default:
        return "";
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error }));
    setValidationState((prev) => ({ ...prev, [field]: !error }));

    if (field === "password" && formData.confirmPassword) {
      const confirmError =
        value !== formData.confirmPassword ? "Passwords do not match" : "";
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
      setValidationState((prev) => ({
        ...prev,
        confirmPassword: !confirmError,
      }));
    }
  };

  const handleSendOtp = async () => {
    const newErrors: ValidationErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach((field) => {
      const error = validateField(
        field,
        formData[field as keyof typeof formData]
      );
      if (error) {
        newErrors[field as keyof ValidationErrors] = error;
        hasErrors = true;
      }
    });

    if (!uiState.agreeToTerms) {
      newErrors.terms = "You must agree to the terms";
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) return;

    try {
      setUiState((prev) => ({ ...prev, loading: true }));
      const response = await dispatch(sendOtp(formData.email) as any);

      if (response?.error) {
        console.error(response.error);
        return;
      }

      dispatch(setSignUpData(formData) as any);
      onSignupSuccess?.();
    } finally {
      setUiState((prev) => ({ ...prev, loading: false }));
    }
  };

  const renderInputField = (
    field: keyof typeof formData,
    placeholder: string,
    icon: React.ReactNode,
    secureTextEntry: boolean = false,
    keyboardType: KeyboardTypeOptions = "default"
  ) => {
    const isFocused = uiState.focusedField === field;
    const hasError = !!errors[field];
    const isValid = validationState[field] && !hasError;

    return (
      <View style={styles.inputContainer}>
        <View
          style={[
            styles.inputWrapper,
            isFocused && styles.inputWrapperFocused,
            hasError && styles.inputWrapperError,
            isValid && styles.inputWrapperValid,
          ]}
        >
          <View style={styles.iconContainer}>{icon}</View>
          <SecureTextInput
            style={styles.input}
            placeholder={placeholder}
            value={formData[field]}
            onChangeText={(value) => handleInputChange(field, value)}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={field === "email" ? "none" : "words"}
          />
          {secureTextEntry && (
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() =>
                setUiState((prev) => ({
                  ...prev,
                  [field === "password"
                    ? "showPassword"
                    : "showConfirmPassword"]: !(field === "password"
                    ? prev.showPassword
                    : prev.showConfirmPassword),
                }))
              }
            >
              {field === "password" ? (
                uiState.showPassword ? (
                  <EyeOff size={20} color="#64748B" />
                ) : (
                  <Eye size={20} color="#64748B" />
                )
              ) : uiState.showConfirmPassword ? (
                <EyeOff size={20} color="#64748B" />
              ) : (
                <Eye size={20} color="#64748B" />
              )}
            </TouchableOpacity>
          )}
          {isValid && (
            <View style={styles.validIcon}>
              <Check size={16} color="#10B981" />
            </View>
          )}
        </View>
        {hasError && (
          <View style={styles.errorContainer}>
            <AlertCircle size={14} color="#EF4444" />
            <Text style={styles.errorText}>{errors[field]}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <BlurView tint="light" intensity={20} style={styles.blurContainer}>
            {renderInputField("firstName", "First Name", <User size={20} />)}
            {renderInputField("lastName", "Last Name", <User size={20} />)}
            {renderInputField(
              "email",
              "Email",
              <Mail size={20} />,
              false,
              "email-address"
            )}
            {renderInputField(
              "password",
              "Password",
              <Lock size={20} />,
              !uiState.showPassword
            )}
            {renderInputField(
              "confirmPassword",
              "Confirm Password",
              <Lock size={20} />,
              !uiState.showConfirmPassword
            )}

            <TouchableOpacity
              onPress={handleSendOtp}
              style={styles.submitButton}
            >
              <LinearGradient
                colors={["#10B981", "#059669"]}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>
                  {uiState.loading ? "Sending OTP..." : "Send OTP"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  formContainer: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  blurContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 25,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
    // transition: 'all 0.2s ease',
  },
  inputWrapperFocused: {
    borderColor: "#667eea",
    backgroundColor: "#fff",
    shadowColor: "#667eea",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  inputWrapperError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputWrapperValid: {
    borderColor: "#10B981",
    backgroundColor: "#F0FDF4",
  },
  iconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1E293B",
    paddingVertical: 0,
  },
  eyeButton: {
    padding: 4,
    marginLeft: 8,
  },
  validIcon: {
    marginLeft: 8,
    backgroundColor: "#10B981",
    borderRadius: 12,
    padding: 2,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 13,
    marginLeft: 6,
    flex: 1,
  },
  passwordStrengthContainer: {
    marginTop: 12,
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  passwordStrengthLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 12,
  },
  passwordStrengthValue: {
    fontWeight: "700",
  },
  passwordChecks: {
    gap: 8,
  },
  passwordCheck: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkIconValid: {
    backgroundColor: "#10B981",
  },
  checkLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  checkLabelValid: {
    color: "#10B981",
    fontWeight: "500",
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
    marginRight: 12,
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#10B981",
    borderColor: "#10B981",
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: "#64748B",
    lineHeight: 20,
  },
  termsLink: {
    color: "#667eea",
    fontWeight: "600",
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 16,
    shadowColor: "#10B981",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  submitButtonLoading: {
    shadowOpacity: 0.1,
  },
  submitButtonGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  oauthContainer: {
    marginTop: 32,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  oauthButtons: {
    flexDirection: "row",
    gap: 12,
  },
  oauthButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  oauthButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  googleIcon: {
    width: 24,
    height: 24,
    backgroundColor: "#4285F4",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  googleG: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default SignupForm;
