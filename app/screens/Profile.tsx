import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
} from "react-native";
import {
  getAuth,
  onAuthStateChanged,
  User,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";
import { auth } from "@/firebase/config";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [showEditOptions, setShowEditOptions] = useState(false);
  const { theme } = useTheme();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 40,
      paddingBottom: 20,
      backgroundColor: theme.surface,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    profileContainer: {
      alignItems: "center",
      padding: 20,
    },
    profileImage: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
      borderWidth: 3,
      borderColor: theme.primary,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 5,
    },
    email: {
      fontSize: 16,
      color: theme.secondaryText,
      marginBottom: 20,
    },
    detailsContainer: {
      width: "100%",
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 20,
      marginBottom: 20,
    },
    detailItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },
    detailText: {
      marginLeft: 10,
      fontSize: 16,
      color: theme.text,
    },
    editButton: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 15,
      width: "80%",
      alignItems: "center",
      marginBottom: 10,
    },
    editButtonText: {
      color: theme.surface,
      fontSize: 16,
      fontWeight: "bold",
    },
    buttonContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
      marginVertical: 20,
    },
    signOutButton: {
      backgroundColor: theme.surface,
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 15,
      width: "80%",
      alignItems: "center",
      borderWidth: 1.5,
      borderColor: theme.primary,
    },
    signOutButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: "bold",
    },
    message: {
      fontSize: 18,
      color: theme.secondaryText,
      textAlign: "center",
      marginTop: 20,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.modalBackground,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      width: "90%",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    passwordContainer: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 15,
    },
    passwordInput: {
      flex: 1,
      paddingVertical: 15,
      paddingHorizontal: 10,
      color: theme.text,
    },
    passwordSubText: {
      fontSize: 14,
      color: theme.secondaryText,
      textAlign: "center",
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 20,
    },
    saveButton: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      width: "48%",
    },
    cancelButton: {
      backgroundColor: theme.border,
      padding: 15,
      borderRadius: 10,
      width: "48%",
    },
    saveButtonText: {
      color: theme.surface,
      textAlign: "center",
      fontWeight: "bold",
    },
    cancelButtonText: {
      color: theme.text,
      textAlign: "center",
      fontWeight: "bold",
    },
    errorText: {
      color: theme.error,
      marginBottom: 10,
    },
    eyeIcon: {
      paddingHorizontal: 10,
    },
    successIcon: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    successTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.primary,
      marginBottom: 10,
    },
    successText: {
      fontSize: 16,
      color: theme.secondaryText,
      textAlign: "center",
      marginBottom: 20,
    },
    continueButton: {
      backgroundColor: theme.primary,
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 10,
      width: "100%",
    },
    continueButtonText: {
      color: theme.surface,
      textAlign: "center",
      fontWeight: "bold",
    },
    editOptionsContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: theme.modalBackground,
    },
    editOptionsContent: {
      backgroundColor: theme.surface,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    editOptionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    editOptionText: {
      marginLeft: 15,
      fontSize: 16,
      color: theme.text,
    },
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const validatePassword = (password: string): boolean => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!minLength) {
      setError("Password must be at least 8 characters");
      return false;
    }
    if (!hasUpperCase) {
      setError("Password must include an uppercase letter");
      return false;
    }
    if (!hasNumber) {
      setError("Password must include a number");
      return false;
    }
    if (!hasSpecialChar) {
      setError("Password must include a special character");
      return false;
    }

    setError("");
    return true;
  };

  const handlePasswordChange = async () => {
    if (!user) return;

    if (newPassword !== confirmNewPassword) {
      setError("Passwords don't match");
      return;
    }

    if (!validatePassword(newPassword)) {
      return;
    }

    try {
      setLoading(true);

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setPasswordChangeSuccess(true);
      setError("");
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Triggers auth state to change
      navigation.navigate("auth/Login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#00ADB5" />;
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>No user is logged in.</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("screens/Dashboard")}
          >
            <Ionicons name="arrow-back" size={36} color="#344950" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 36 }} /> {/* Spacer for alignment */}
        </View>
        <Text style={styles.message}>No user is logged in.</Text>
      </View>
    );
  }

  const PasswordChangeModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showPasswordModal}
      onRequestClose={() => setShowPasswordModal(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {passwordChangeSuccess ? (
            <>
              <Image
                source={require("../../assets/images/TickShield.png")}
                style={styles.successIcon}
              />
              <Text style={styles.successTitle}>Password Updated!</Text>
              <Text style={styles.successText}>
                Your password has been successfully changed.
              </Text>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  setShowPasswordModal(false);
                  setPasswordChangeSuccess(false);
                }}
              >
                <Text style={styles.continueButtonText}>Continue</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>Change Password</Text>
              <Text style={styles.passwordSubText}>
                The new password must be 8 characters, including 1 uppercase
                letter, 1 number and 1 special character.
              </Text>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Current Password"
                  secureTextEntry={secureTextEntry}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Icon
                    name={secureTextEntry ? "eye-slash" : "eye"}
                    size={20}
                    color="#BDBDBD"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="New Password"
                  secureTextEntry={secureTextEntry}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Icon
                    name={secureTextEntry ? "eye-slash" : "eye"}
                    size={20}
                    color="#BDBDBD"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm New Password"
                  secureTextEntry={secureTextEntry}
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Icon
                    name={secureTextEntry ? "eye-slash" : "eye"}
                    size={20}
                    color="#BDBDBD"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowPasswordModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handlePasswordChange}
                >
                  <Text style={styles.saveButtonText}>Update Password</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );

  const EditOptionsModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showEditOptions}
      onRequestClose={() => setShowEditOptions(false)}
    >
      <View style={styles.editOptionsContainer}>
        <View style={styles.editOptionsContent}>
          <TouchableOpacity
            style={styles.editOptionButton}
            onPress={() => {
              setShowPasswordModal(true);
              setShowEditOptions(false);
            }}
          >
            <Ionicons name="key-outline" size={24} color="#344950" />
            <Text style={styles.editOptionText}>Change Password</Text>
          </TouchableOpacity>

          {/* Add more edit options here */}

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setShowEditOptions(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Dashboard")}
        >
          <Ionicons name="arrow-back" size={36} color="#344950" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} /> {/* Spacer for alignment */}
      </View>

      {/* Profile Content */}
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={{ uri: user.photoURL || "https://via.placeholder.com/150" }}
        />
        <Text style={styles.name}>{user.displayName || "User"}</Text>
        <Text style={styles.email}>{user.email}</Text>

        {/* Profile Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Ionicons name="mail-outline" size={24} color="#344950" />
            <Text style={styles.detailText}>
              {user.emailVerified ? "Email Verified" : "Email Not Verified"}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={24} color="#344950" />
            <Text style={styles.detailText}>
              Member since{" "}
              {new Date(user.metadata.creationTime || "").toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setShowEditOptions(true)}
        >
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <EditOptionsModal />
      <PasswordChangeModal />
    </View>
  );
};

export default Profile;
