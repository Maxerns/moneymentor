import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";
import { deleteUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";

export default function Settings() {
  // Navigation hook for screen navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State management for settings toggles
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  // State for delete account modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Theme context
  const { theme, isDark, toggleTheme } = useTheme();

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
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginLeft: 20,
      marginVertical: 10,
    },
    sectionContent: {
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.border,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    settingLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingText: {
      marginLeft: 15,
      fontSize: 16,
      color: theme.text,
    },
    settingRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    settingValue: {
      marginRight: 10,
      color: theme.secondaryText,
      fontSize: 14,
    },
    deleteSection: {
      marginTop: 20,
      marginBottom: 40,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.modalBackground,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1000,
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
    modalText: {
      fontSize: 16,
      color: theme.secondaryText,
      textAlign: "center",
      marginBottom: 20,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    modalButton: {
      padding: 15,
      borderRadius: 10,
      width: "48%",
    },
    deleteButton: {
      backgroundColor: "#FF3B30",
    },
    cancelButton: {
      backgroundColor: theme.border,
    },
    deleteButtonText: {
      color: "#FFFFFF",
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
  });

  // Handler for account deletion
  const handleDeleteAccount = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // Delete user data from Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // Delete the user account
      await deleteUser(user);

      // Navigate to landing page
      navigation.navigate("screens/Landing");
    } catch (error) {
      if (error instanceof Error) {
        setDeleteError(error.message);
      } else {
        setDeleteError("An error occurred while deleting your account");
      }
    }
  };

  // Modal component to confirm account deletion
  const DeleteConfirmModal = () => {
    const closeModal = () => setShowDeleteConfirm(false);

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account? This action cannot
              be undone.
            </Text>
            {deleteError ? (
              <Text style={styles.errorText}>{deleteError}</Text>
            ) : null}
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={closeModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  // Resuable setting row component
  const SettingRow = ({
    icon,
    title,
    value,
    onPress,
    toggle,
    onToggle,
  }: {
    // props definition
    icon: string;
    title: string;
    value?: string;
    onPress?: () => void;
    toggle?: boolean;
    onToggle?: (value: boolean) => void;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      disabled={!onPress && !onToggle}
    >
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#344950" />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <View style={styles.settingRight}>
        {value && <Text style={styles.settingValue}>{value}</Text>}
        {toggle !== undefined && (
          <Switch
            value={toggle}
            onValueChange={onToggle}
            thumbColor={toggle ? "#00c6ff" : "#f4f3f4"}
            trackColor={{ false: "#E0E0E0", true: "#B3E5FC" }}
          />
        )}
        {onPress && (
          <Ionicons name="chevron-forward" size={20} color="#344950" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={36} color="#344950" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.sectionContent}>
            <SettingRow
              icon="person-outline"
              title="Personal Information"
              onPress={() => navigation.navigate("screens/Profile")}
            />
            <SettingRow
              icon="lock-closed-outline"
              title="Security"
              onPress={() => {}}
            />
            <SettingRow
              icon="card-outline"
              title="Payment Methods"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.sectionContent}>
            <SettingRow
              icon="notifications-outline"
              title="Notifications"
              toggle={notifications}
              onToggle={setNotifications}
            />
            <SettingRow
              icon="moon-outline"
              title="Dark Mode"
              toggle={isDark}
              onToggle={toggleTheme}
            />
            <SettingRow
              icon="finger-print-outline"
              title="Biometric Login"
              toggle={biometrics}
              onToggle={setBiometrics}
            />
            <SettingRow
              icon="language-outline"
              title="Language"
              value="English"
              onPress={() => {}}
            />
            <SettingRow
              icon="cash-outline"
              title="Currency"
              value="GBP"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.sectionContent}>
            <SettingRow
              icon="analytics-outline"
              title="Usage Analytics"
              toggle={analytics}
              onToggle={setAnalytics}
            />
            <SettingRow
              icon="shield-outline"
              title="Privacy Policy"
              onPress={() => {}}
            />
            <SettingRow
              icon="document-text-outline"
              title="Terms of Service"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionContent}>
            <SettingRow
              icon="help-circle-outline"
              title="Help Center"
              onPress={() => {}}
            />
            <SettingRow
              icon="mail-outline"
              title="Contact Support"
              onPress={() => {}}
            />
            <SettingRow
              icon="information-circle-outline"
              title="About"
              value="Version 1.0.0"
            />
          </View>
        </View>

        {/* delete Zone */}
        <View style={[styles.section, styles.deleteSection]}>
          <View style={styles.sectionContent}>
            <SettingRow
              icon="trash-outline"
              title="Delete Account"
              onPress={() => setShowDeleteConfirm(true)}
            />
          </View>
        </View>
      </ScrollView>
      <DeleteConfirmModal />
    </View>
  );
}
