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

export type RootStackParamList = {
  Landing: undefined;
  SignUp: undefined;
  Login: undefined;
};

export default function Login() {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [isTouchIDEnabled, setIsTouchIDEnabled] = useState(false);

  const toggleTouchID = () =>
    setIsTouchIDEnabled((previousState) => !previousState);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Text
          style={styles.backText}
          onPress={() => navigation.navigate("SignUp")}
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
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#BDBDBD"
          secureTextEntry
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

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>
          Forgot your password? <Text style={styles.linkText}>Click here</Text>
        </Text>
      </TouchableOpacity>

      <View style={styles.touchIDContainer}>
        <Text style={styles.touchIDText}>Unlock with Touch ID?</Text>
        <Switch
          value={isTouchIDEnabled}
          onValueChange={toggleTouchID}
          thumbColor={isTouchIDEnabled ? "#00c6ff" : "#f4f3f4"}
          trackColor={{ false: "#E0E0E0", true: "#B3E5FC" }}
        />
      </View>

      <TouchableOpacity style={styles.signInButton}>
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
});
