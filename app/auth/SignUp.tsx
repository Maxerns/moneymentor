import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  Switch,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  fetchSignInMethodsForEmail,
  updatePassword,
  signInWithEmailAndPassword,
  signOut,
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
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [isTouchIDEnabled, setIsTouchIDEnabled] = useState(false);

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

  const toggleTouchID = () =>
    setIsTouchIDEnabled((previousState) => !previousState);

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

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (!hasUpperCase) {
      setPasswordError("Password must include an uppercase letter");
      return false;
    }
    if (!hasNumber) {
      setPasswordError("Password must include a number");
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError("Password must include a special character");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleCreatePassword = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return false;
    }
    if (!validatePassword(password)) {
      setError(passwordError);
      return;
    }
    

    try {
      setLoading(true);

      // Sign in with temporary password
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        "temporary123"
      );

      // Update password
      await updatePassword(userCredential.user, password);

      // Sign out and redirect to login
      await signOut(auth);
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
          source={require("../../assets/images/verification steps1.png")}
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
        <Image
          source={require("../../assets/images/verification steps2.png")}
          style={styles.stepsHeader}
        />
        <Text style={styles.header}>Create your password</Text>
        <Text style={styles.passwordSubText}>
          The password must be 8 characters, including 1 uppercase letter, 1
          number and 1 special character.
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter password"
            secureTextEntry={secureTextEntry}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              validatePassword(text);
            }}
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <Icon
              style={styles.eyeIcon}
              name={secureTextEntry ? "eye-slash" : "eye"}
              size={20}
              color="#BDBDBD"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.confirmPasswordText}>Confirm password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Confirm password"
            secureTextEntry={secureTextEntry}
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              validatePassword(text);
            }}
          />
          <TouchableOpacity
            onPress={() => setSecureTextEntry(!secureTextEntry)}
          >
            <Icon
              style={styles.eyeIcon}
              name={secureTextEntry ? "eye-slash" : "eye"}
              size={20}
              color="#BDBDBD"
            />
          </TouchableOpacity>
        </View>

        <View style={styles.touchIDContainer}>
          <Text style={styles.touchIDText}>Unlock with Touch ID?</Text>
          <Switch
            value={isTouchIDEnabled}
            onValueChange={toggleTouchID}
            thumbColor={isTouchIDEnabled ? "#00c6ff" : "#f4f3f4"}
            trackColor={{ false: "#E0E0E0", true: "#B3E5FC" }}
          />
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity
          style={styles.emailButton}
          onPress={handleCreatePassword}
        >
          <Text style={styles.mainEmailText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.subText}>
          By registering you accept our Terms & Conditions and Privacy Policy.
          Your data will be security encrypted with TLS
        </Text>
      </View>
    );
  }

  if (showEmailSignUp) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton}>
          <Text
            style={styles.backText}
            onPress={() => setShowEmailSignUp(false)}
          >
            {"<"}
          </Text>
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/verification steps.png")}
          style={styles.stepsHeader}
        />
        <Text style={styles.header}>What's your email?</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.divider}>
          <TouchableOpacity>
            <Text style={styles.loginText}>
              Have an account?{" "}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate("auth/Login")}
              >
                Log in here
              </Text>
            </Text>
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.emailButton}
          onPress={handleEmailContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
        <Text style={styles.subText}>
          By registering you accept our Terms & Conditions and Privacy Policy.
          Your data will be security encrypted with TLS
        </Text>
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#344950",
    marginBottom: 10,
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
  backButton: {
    alignSelf: "flex-start",
    marginTop: 0,
    marginBottom: 100,
  },
  backText: {
    fontSize: 36,
    color: "#00ADB5",
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
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 10,
    color: "#4F4F4F",
  },
  emailButton: {
    backgroundColor: "#00ADB5",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 15,
    marginBottom: 15,
    marginTop: 100,
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
  continueButtonText: {
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
    marginTop: 0,
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
  loginText: {
    fontSize: 14,
    color: "#707070",
    marginBottom: 10,
  },
  loginLink: {
    color: "#00ADB5",
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  confirmPasswordText: {
    alignSelf: "flex-start",
    left: 0,
    fontSize: 12,
    color: "#4F4F4F",
    fontWeight: "600",
    marginBottom: 5,

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
    marginBottom: 30,
    resizeMode: "contain",
  },
  subText: {
    fontSize: 14,
    color: "#4F4F4F",
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 30,
    padding: 10,
    margin: 5,
  },
  passwordSubText: {
    fontSize: 14,
    color: "#4F4F4F",
    fontWeight: "300",
    textAlign: "center",
    marginBottom: 30,
  },
  eyeIcon: {
    paddingHorizontal: 10,
    fontSize: 20,
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
});
