import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut 
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { RootStackParamList } from "../../.expo/types/types";

export default function SignUp() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmailSignUp, setShowEmailSignUp] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError("");

      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Sign out until email is verified
      await signOut(auth);

      setVerificationSent(true);
      setShowEmailSignUp(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#00ADB5" />
      </View>
    );
  }

  if (verificationSent) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="envelope-o" size={50} color="#00ADB5" />
        <Text style={styles.verificationTitle}>Verify your email</Text>
        <Text style={styles.verificationText}>
          We've sent a verification link to:
        </Text>
        <Text style={styles.mainEmailText}>{email}</Text>
        <Text style={styles.verificationInstructions}>
          Please check your email and click the verification link to complete
          your registration.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("auth/Login")}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/MoneyMentorLogoGradient.png")}
        style={styles.logo}
      />

      {!showEmailSignUp && (
        <>
          <TouchableOpacity style={styles.socialButton}>
            <Icon
              name="facebook"
              size={20}
              color="#000000"
              style={styles.icon}
            />
            <Text style={styles.socialText}>Continue with Facebook</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Icon name="google" size={20} color="#000000" style={styles.icon} />
            <Text style={styles.socialText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Icon name="apple" size={20} color="#000000" style={styles.icon} />
            <Text style={styles.socialText}>Continue with Apple</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => setShowEmailSignUp(true)}
          >
            <Text style={styles.mainEmailText}>Sign up with email</Text>
          </TouchableOpacity>
        </>
      )}

      {showEmailSignUp && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity style={styles.emailButton} onPress={handleSignUp}>
            <Text style={styles.mainEmailText}>Sign up with email</Text>
          </TouchableOpacity>
        </>
      )}

      <View style={styles.divider}>
        <Text style={styles.dividerText}>Already have an account?</Text>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate("auth/Login")}
        >
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F9FC",
    paddingHorizontal: 20,
  },
  logo: {
    width: 75,
    height: 75,
    alignItems: "center",
    marginBottom: 100,
  },
  socialButton: {
    width: "100%",
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 15,
    alignItems: "center",
  },
  icon: {
    position: "absolute",
    left: 20,
    top: 15,
    bottom: 15,
  },
  socialText: {
    fontSize: 16,
    color: "#4F4F4F",
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
  emailButton: {
    backgroundColor: "#00ADB5",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  mainEmailText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  divider: {
    alignItems: "center",
    marginTop: 20,
  },
  dividerText: {
    fontSize: 14,
    color: "#828282",
    marginBottom: 10,
  },
  signInButton: {
    backgroundColor: "#B9ECEE",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 15,
    marginBottom: 30,
    width: "100%",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#00ADB5",
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  signInText: {
    fontSize: 16,
    color: "#00c6ff",
    fontWeight: "600",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00ADB5',
    marginTop: 20,
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 16,
    color: '#4F4F4F',
    textAlign: 'center',
    marginBottom: 5,
  },
  emailText: {
    fontSize: 16,
    color: '#00ADB5',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  verificationInstructions: {
    fontSize: 14,
    color: '#4F4F4F',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#00ADB5',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
