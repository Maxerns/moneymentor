import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function Login() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isTouchIDEnabled, setIsTouchIDEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetError, setResetError] = useState("");
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [passwordResetEmailSent, setPasswordResetEmailSent] = useState(false);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    backButton: {
      alignSelf: "flex-start",
      marginTop: 20,
      marginBottom: 10,
    },
    backText: {
      fontSize: 32,
      color: theme.primary,
      marginTop: 10,
      margin: 5,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    header: {
      textAlign: "center",
      fontSize: 36,
      fontWeight: "600",
      color: theme.primary,
      marginBottom: 0,
      marginTop: 50,
      padding: 10,
    },
    input: {
      width: "100%",
      paddingVertical: 15,
      paddingHorizontal: 10,
      backgroundColor: theme.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 15,
    },
    passwordContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 10,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: 15,
      paddingHorizontal: 10,
      color: theme.text,
    },
    emailButton: {
      width: "100%",
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 15,
      alignItems: "center",
      shadowColor: "#000000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
      marginTop: 0,
    },
    eyeIcon: {
      paddingHorizontal: 10,
      fontSize: 20,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 20,
      fontSize: 14,
      color: theme.secondaryText,
    },
    linkText: {
      color: theme.primary,
      fontWeight: "600",
    },
    touchIDContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 30,
    },
    touchIDText: {
      fontSize: 16,
      color: theme.text,
    },
    signInButton: {
      width: "100%",
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 15,
      alignItems: "center",
      shadowColor: "#000000",
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 5,
    },
    signInText: {
      fontSize: 16,
      color: theme.surface,
      fontWeight: "600",
    },
    verificationTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primary,
      marginTop: 20,
      marginBottom: 10,
    },
    verificationText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "300",
      textAlign: "center",
      marginBottom: 5,
      margin: 10,
    },
    verificationInstructions: {
      fontSize: 14,
      color: theme.text,
      fontWeight: "300",
      textAlign: "center",
      marginBottom: 30,
      padding: 10,
      margin: 5,
    },
    loginButton: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 15,
      marginTop: 20,
    },
    loginButtonText: {
      color: theme.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    verificationLogo: {
      width: 250,
      height: 250,
      resizeMode: "contain",
    },
    divider: {
      fontSize: 14,
      color: theme.secondaryText,
      marginTop: 10,
    },
    dividerContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 50,
    },
    socialContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: "100%",
      padding: 50,
    },
    socialButton: {
      width: 50,
      height: 50,
      backgroundColor: theme.surface,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: "center",
      alignItems: "center",
    },
    stepsHeader: {
      width: 200,
      height: 100,
      marginBottom: 30,
      resizeMode: "contain",
    },
    continueButtonText: {
      fontSize: 16,
      color: theme.surface,
      fontWeight: "600",
    },
    subText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: "300",
      textAlign: "center",
      marginBottom: 30,
      padding: 10,
      margin: 5,
      marginTop: 10,
    },
    resetSubText: {
      fontSize: 14,
      color: theme.text,
      fontWeight: "300",
      textAlign: "center",
      marginBottom: 30,
    },
    secondaryEmailText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "600",
    },
    icon: {},
    errorText: {
      color: theme.error,
      marginBottom: 10,
    },
  });

  const toggleTouchID = () =>
    setIsTouchIDEnabled((previousState) => !previousState);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await signOut(auth);
        return;
      }

      navigation.navigate("screens/Dashboard");
    } catch (error) {
      setError("Invalid email or password. Please try again.");
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setResetError("Please enter your email address first");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setPasswordResetEmailSent(true);
      setResetError("");
    } catch (error) {
      if (error instanceof Error) {
        setResetError(error.message);
      } else {
        setResetError("Failed to send reset email");
      }
    }
  };

  if (showPasswordReset) {
    if (passwordResetEmailSent) {
      return (
        <View style={[styles.container, styles.centered]}>
          <Image
            source={require("../../assets/images/verification steps1.png")}
            style={styles.stepsHeader}
          />
          <Image
            source={require("../../assets/images/illustration.png")}
            style={styles.verificationLogo}
          />
          <Text style={styles.verificationTitle}>Check your email</Text>
          <Text style={styles.verificationText}>
            We've sent a password reset link to:
          </Text>
          <Text style={styles.secondaryEmailText}>{email}</Text>
          <Text style={styles.verificationInstructions}>
            Please check your email and click the reset link to set a new
            password.
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => {
              setShowPasswordReset(false);
              setPasswordResetEmailSent(false);
              navigation.navigate("auth/Login");
            }}
          >
            <Text style={styles.loginButtonText}>Return to Login</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Text
            style={styles.backText}
            onPress={() => setShowPasswordReset(false)}
          >
            {"<"}
          </Text>
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/verification steps.png")}
          style={styles.stepsHeader}
        />
        <Text style={styles.header}>Password Reset</Text>
        <Text style={styles.resetSubText}>
          Please enter your registered email address to reset your password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {resetError ? <Text style={styles.errorText}>{resetError}</Text> : null}

        <TouchableOpacity
          style={styles.emailButton}
          onPress={handlePasswordReset}
        >
          <Text style={styles.continueButtonText}>Send Reset Link</Text>
        </TouchableOpacity>
        <Text style={styles.subText}>
          By registering you accept our Terms & Conditions and Privacy Policy.
          Your data will be security encrypted with TLS
        </Text>

        <View style={styles.dividerContainer}>
          <Text style={styles.divider}>or continue with</Text>
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Icon
              name="facebook"
              size={20}
              color="#000000"
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="apple" size={20} color="#000000" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="google" size={20} color="#000000" style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text
          style={styles.backText}
          onPress={() => navigation.navigate("auth/SignUp")}
        >
          {"<"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.header}>Login to your Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email address"
        placeholderTextColor="#BDBDBD"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        onSubmitEditing={() => handleLogin()}
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          secureTextEntry={secureTextEntry}
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={() => handleLogin()}
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <Icon
            style={styles.eyeIcon}
            name={secureTextEntry ? "eye-slash" : "eye"}
            size={20}
            color="#BDBDBD"
          />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity onPress={() => setShowPasswordReset(true)}>
        <Text style={styles.forgotPassword}>
          Forgot your password? <Text style={styles.linkText}>Click here</Text>
        </Text>
      </TouchableOpacity>

      {resetError ? <Text style={styles.errorText}>{resetError}</Text> : null}

      <View style={styles.touchIDContainer}>
        <Text style={styles.touchIDText}>Unlock with Touch ID?</Text>
        <Switch
          value={isTouchIDEnabled}
          onValueChange={toggleTouchID}
          thumbColor={isTouchIDEnabled ? "#00c6ff" : "#f4f3f4"}
          trackColor={{ false: "#E0E0E0", true: "#B3E5FC" }}
        />
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
        <Text style={styles.signInText}>Sign in</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <Text style={styles.divider}>or continue with</Text>
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="facebook" size={20} color="#000000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="apple" size={20} color="#000000" style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton}>
          <Icon name="google" size={20} color="#000000" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
