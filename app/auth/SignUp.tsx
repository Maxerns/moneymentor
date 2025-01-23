import React, { useState, useEffect } from "react";
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
  deleteUser,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { RootStackParamList } from "../../.expo/types/types";

export default function SignUp() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showEmailSignUp, setShowEmailSignUp] = useState(false);
  const [showPasswordCreation, setShowPasswordCreation] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        // Force refresh to get latest verification status
        await user.reload();
        if (user.emailVerified) {
          setIsEmailVerified(true);
          setShowPasswordCreation(true);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEmailContinue = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      // Check if email already exists
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        setError("An account with this email already exists");
        return;
      }

      // If email is valid and doesn't exist, proceed with verification
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        "temporary123"
      );
      await sendEmailVerification(userCredential.user);
      setVerificationSent(true);
      setError("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);

      // First sign in with temporary password
      await signInWithEmailAndPassword(auth, email, "temporary123");

      // Delete the temporary account
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }

      // Create new account with permanent password
      await createUserWithEmailAndPassword(auth, email, password);
      navigation.navigate("auth/Login");
    } catch (error: any) {
      setError(error.message);
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

  if (verificationSent && !isEmailVerified) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Image
          source={require("../../assets/images/verification steps.png")}
          style={styles.stepsHeader}
        />
        <Image
          source={require("../../assets/images/illustration.png")}
          style={styles.verificationLogo}
        />
        <Text style={styles.verificationTitle}>Verify your email</Text>
        <Text style={styles.verificationText}>
          We've sent a verification link to:
        </Text>
        <Text style={styles.secondaryEmailText}>{email}</Text>
        <Text style={styles.verificationInstructions}>
          Please check your email and click the verification link to continue
          setting up your account.
        </Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={async () => {
            if (auth.currentUser) {
              await auth.currentUser.reload();
              setIsEmailVerified(auth.currentUser.emailVerified);
              if (auth.currentUser.emailVerified) {
                setShowPasswordCreation(true);
              }
            }
          }}
        >
          <Text style={styles.loginButtonText}>I've verified my email</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showPasswordCreation) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Create your password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={handleCreatePassword}
        >
          <Text style={styles.mainEmailText}>Complete Sign Up</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (showEmailSignUp) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>What's your email?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={handleEmailContinue}
        >
          <Text style={styles.mainEmailText}>Continue</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Initial view with social buttons
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/MoneyMentorLogoGradient.png")}
        style={styles.logo}
      />

      <TouchableOpacity style={styles.socialButton}>
        <Icon name="facebook" size={20} color="#000000" style={styles.icon} />
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#344950",
    marginBottom: 20,
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
  secondaryEmailText: {
    fontSize: 16,
    color: "#000000",
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
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00ADB5",
    marginTop: 20,
    marginBottom: 10,
  },
  verificationText: {
    fontSize: 16,
    color: "#4F4F4F",
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 5,
    margin: 10,
  },
  verificationInstructions: {
    fontSize: 14,
    color: "#4F4F4F",
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 30,
    padding: 10,
    margin: 5,
  },
  loginButton: {
    backgroundColor: "#00ADB5",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginTop: 20,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  verificationLogo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
  stepsHeader: {
    width: 200,
    height: 100,
    marginBottom: 0,
    resizeMode: "contain",
  },
});
