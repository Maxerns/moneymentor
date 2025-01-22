import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/config";
import { RootStackParamList } from "../../.expo/types/types";

export default function Login() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isTouchIDEnabled, setIsTouchIDEnabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetError, setResetError] = useState("");

  const toggleTouchID = () =>
    setIsTouchIDEnabled((previousState) => !previousState);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
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
      alert("Password reset email sent! Please check your inbox.");
      setResetError("");
    } catch (error) {
      if (error instanceof Error) {
        setResetError(error.message);
      } else {
        setResetError("Failed to send reset email");
      }
    }
  };

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

      <TouchableOpacity onPress={handlePasswordReset}>
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

      <Text style={styles.divider}>or continue with</Text>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 20,
  },
  backButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    marginBottom: 10,
  },
  backText: {
    fontSize: 32,
    color: "#00ADB5",
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    color: "#00ADB5",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
  },
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: "#4F4F4F",
  },
  eyeIcon: {
    paddingHorizontal: 10,
    fontSize: 20,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
    fontSize: 14,
    color: "#828282",
  },
  linkText: {
    color: "#00ADB5",
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
    color: "#4F4F4F",
  },
  signInButton: {
    width: "100%",
    backgroundColor: "#00ADB5",
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
    color: "#FFFFFF",
    fontWeight: "600",
  },
  divider: {
    marginVertical: 20,
    fontSize: 14,
    color: "#828282",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  socialButton: {
    width: 50,
    height: 50,
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {},
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
