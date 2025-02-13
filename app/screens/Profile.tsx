import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { signOut, updatePassword } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "@/.expo/types/types";
import { AuthService } from "../services/authService";

export default function Profile() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [passwordError, setPasswordError] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email || "");
    }
  }, []);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate("auth/Login");
    } catch (error) {
      Alert.alert("Error", "Failed to sign out");
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    if (!validatePassword(newPassword)) {
      setError(passwordError);
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) {
        setError("No user logged in");
        return;
      }

      const result = await AuthService.changePassword(
        user,
        currentPassword,
        newPassword
      );

      if (result.success) {
        Alert.alert("Success", "Password updated successfully");
        setShowPasswordModal(false);
        resetForm();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError("Failed to update password");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      if (!auth.currentUser) return;
      await auth.currentUser.delete();
      navigation.navigate("auth/Login");
    } catch (error) {
      Alert.alert("Error", "Failed to delete account");
    }
  };

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

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
    section: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 20,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    lastOption: {
      borderBottomWidth: 0,
    },
    optionText: {
      fontSize: 16,
      color: theme.text,
      marginLeft: 15,
    },
    signOutText: {
      color: theme.error,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 20,
      width: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
      textAlign: "center",
    },
    input: {
      backgroundColor: theme.background,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      color: theme.text,
    },
    errorText: {
      color: theme.error,
      marginBottom: 15,
      textAlign: "center",
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 10,
      marginHorizontal: 5,
    },
    cancelButton: {
      backgroundColor: theme.border,
    },
    saveButton: {
      backgroundColor: theme.primary,
    },
    buttonText: {
      color: theme.surface,
      textAlign: "center",
      fontWeight: "bold",
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
    eyeIcon: {
      paddingHorizontal: 10,
      fontSize: 20,
      color: theme.text,
    },
    scrollContainer: {
      flex: 1,
      paddingBottom: 20,
    },
    welcomeSection: {
      backgroundColor: theme.surface,
      padding: 20,
      marginTop: 20,
      marginHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
    },
    welcomeText: {
      fontSize: 24,
      color: theme.text,
      fontWeight: "600",
    },
    emailText: {
      fontSize: 16,
      color: theme.secondaryText,
      marginTop: 5,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 15,
      marginLeft: 5,
    },
    toggleOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    toggleLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    dangerSection: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 20,
      marginBottom: 40,
    },
    deleteButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    deleteText: {
      color: theme.error,
    },
    deleteConfirmButton: {
      backgroundColor: theme.error,
    },
    modalText: {
      color: theme.text,
      textAlign: "center",
      marginBottom: 20,
    },
    deleteButtonText: {
      color: theme.surface,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={36} color={theme.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* User Info Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setShowPasswordModal(true)}
          >
            <Ionicons name="key-outline" size={24} color={theme.text} />
            <Text style={styles.optionText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="person-outline" size={24} color={theme.text} />
            <Text style={styles.optionText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.toggleOption}>
            <View style={styles.toggleLeft}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.optionText}>Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              thumbColor={notificationsEnabled ? theme.primary : "#f4f3f4"}
              trackColor={{ false: "#767577", true: `${theme.primary}50` }}
            />
          </View>

          <View style={styles.toggleOption}>
            <View style={styles.toggleLeft}>
              <Ionicons
                name="finger-print-outline"
                size={24}
                color={theme.text}
              />
              <Text style={styles.optionText}>Biometric Login</Text>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              thumbColor={biometricEnabled ? theme.primary : "#f4f3f4"}
              trackColor={{ false: "#767577", true: `${theme.primary}50` }}
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <TouchableOpacity style={styles.optionButton}>
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={theme.text}
            />
            <Text style={styles.optionText}>App Information</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={theme.text}
            />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton}>
            <Ionicons name="help-circle-outline" size={24} color={theme.text} />
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => setShowDeleteConfirm(true)}
          >
            <Ionicons name="trash-outline" size={24} color={theme.error} />
            <Text style={[styles.optionText, styles.deleteText]}>
              Delete Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.optionButton, styles.lastOption]}
            onPress={handleSignOut}
          >
            <Ionicons name="log-out-outline" size={24} color={theme.error} />
            <Text style={[styles.optionText, styles.signOutText]}>
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Current Password"
                placeholderTextColor="#B0BEC5"
                secureTextEntry={secureTextEntry}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <Ionicons
                  name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="New Password"
                placeholderTextColor="#B0BEC5"
                secureTextEntry={secureTextEntry}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <Ionicons
                  name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm New Password"
                placeholderTextColor="#B0BEC5"
                secureTextEntry={secureTextEntry}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <Ionicons
                  name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#BDBDBD"
                />
              </TouchableOpacity>
            </View>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setShowPasswordModal(false);
                  resetForm();
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleChangePassword}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.deleteConfirmButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={[styles.buttonText, styles.deleteButtonText]}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
