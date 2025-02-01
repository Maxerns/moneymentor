import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function Settings() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [analytics, setAnalytics] = useState(true);
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
    dangerSection: {
      marginTop: 20,
      marginBottom: 40,
    },
  });

  const SettingRow = ({
    icon,
    title,
    value,
    onPress,
    toggle,
    onToggle,
  }: {
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

        {/* Danger Zone */}
        <View style={[styles.section, styles.dangerSection]}>
          <View style={styles.sectionContent}>
            <SettingRow
              icon="trash-outline"
              title="Delete Account"
              onPress={() => {}}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
