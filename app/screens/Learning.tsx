import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function Learning() {
  // navigation, theme hooks and search functionality
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 40,
      marginBottom: 20,
    },
    logo: {
      width: 75,
      height: 75,
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
      textAlign: "center",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 10,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 20,
    },
    searchIcon: {
      marginRight: 10,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
    },
    modulesContainer: {
      paddingBottom: 100,
    },
    moduleCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    moduleInfo: {
      flex: 1,
      marginLeft: 15,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    moduleTitle: {
      fontSize: 16,
      fontWeight: 500,
      color: theme.text,
      opacity: 0.8,
    },
    moduleProgress: {
      fontSize: 14,
      color: theme.secondaryText,
    },
    navBar: {
      position: "absolute",
      bottom: 0,
      width: "115%",
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.surface,
      paddingVertical: 10,
      paddingHorizontal: 40,
    },
    navBarIcon: {
      fontSize: 30,
      color: theme.text,
    },
    navText: {
      fontSize: 12,
      fontWeight: 500,
      color: theme.text,
      marginTop: 5,
    },
  });

  // Interface for module data structure
  interface ModuleType {
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    progress: string;
  }

  // Array of educational modules with their properties
  const modules: ModuleType[] = [
    {
      title: "Interest Rates",
      icon: "chart-line" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/7",
    },
    {
      title: "Financial Term Glossary",
      icon: "book-outline" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/5",
    },
    {
      title: "Investment Basics",
      icon: "scale-balance" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/9",
    },
    {
      title: "Budgeting Fundamentals",
      icon: "bank" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/6",
    },
    {
      title: "Credit & Debt Management",
      icon: "credit-card" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/8",
    },
    {
      title: "Mortgage Essentials",
      icon: "home-outline" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/5",
    },
    {
      title: "Insurance Basics",
      icon: "shield-check" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/6",
    },
    {
      title: "Saving Strategies",
      icon: "piggy-bank" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/7",
    },
    {
      title: "Tax Planning",
      icon: "calculator" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/5",
    },
    {
      title: "Retirement Planning",
      icon: "clock-outline" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/8",
    },
    {
      title: "Stock Market Basics",
      icon: "chart-multiple" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/10",
    },
    {
      title: "Student Finance",
      icon: "school" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/6",
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons
            name="person-circle-outline"
            size={36}
            color="#344950"
            onPress={() => navigation.navigate("screens/Profile")}
          />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/MoneyMentorLogoGradient.png")}
          style={styles.logo}
        />
        <TouchableOpacity>
          <Ionicons
            name="settings-outline"
            size={36}
            color="#344950"
            onPress={() => navigation.navigate("screens/Settings")}
          />
        </TouchableOpacity>
      </View>
      {/* Page Title */}
      <Text style={styles.pageTitle}>Educational Modules</Text>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#B0BEC5"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Module search"
          placeholderTextColor="#B0BEC5"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {/* Scrollable list of modules with search filter */}
      <ScrollView contentContainerStyle={styles.modulesContainer}>
        {modules
          // Filter modules based on search query
          .filter((module) =>
            module.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          // Map filtered modules to UI components
          .map((module, index) => (
            <TouchableOpacity
              key={index}
              style={styles.moduleCard}
              onPress={() =>
                navigation.navigate("screens/ModuleContent", {
                  title: module.title,
                })
              }
            >
              <MaterialCommunityIcons
                name={module.icon}
                size={48}
                color="#344950"
                opacity={0.7}
              />
              <View style={styles.moduleInfo}>
                <Text style={styles.moduleTitle}>{module.title}</Text>
                <Text style={styles.moduleProgress}>{module.progress}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity>
          <Ionicons
            name="home-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/Dashboard")}
          />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="construct-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/TaxEstimatorTool")}
          />
          <Text style={styles.navText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="school-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
