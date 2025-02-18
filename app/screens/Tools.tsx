import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

interface ToolType {
  title: string;
  description: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  route: Extract<
    keyof RootStackParamList,
    | "screens/FinancialTermGlossary"
    | "screens/TaxEstimatorTool"
    | "screens/BudgetManagementTool"
  >;
}

export default function Tools() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

  const tools: ToolType[] = [
    {
      title: "Budget Management",
      description: "Track and manage your monthly budget and expenses",
      icon: "wallet" as keyof typeof MaterialCommunityIcons.glyphMap,
      route: "screens/BudgetManagementTool",
    },
    {
      title: "Financial Term Glossary",
      description: "Comprehensive guide to financial terminology and concepts",
      icon: "book-open-variant" as keyof typeof MaterialCommunityIcons.glyphMap,
      route: "screens/FinancialTermGlossary",
    },
    {
      title: "Tax Estimator",
      description:
        "Calculate your estimated tax obligations and potential savings",
      icon: "calculator" as keyof typeof MaterialCommunityIcons.glyphMap,
      route: "screens/TaxEstimatorTool",
    },
  ];

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
    toolsContainer: {
      paddingBottom: 100,
    },
    toolCard: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 20,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    toolHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    toolIcon: {
      marginRight: 15,
    },
    toolInfo: {
      flex: 1,
    },
    toolTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginBottom: 5,
    },
    toolDescription: {
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
      fontWeight: "500",
      color: theme.text,
      marginTop: 5,
    },
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Profile")}
        >
          <Ionicons name="person-circle-outline" size={36} color="#344950" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/MoneyMentorLogoGradient.png")}
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Settings")}
        >
          <Ionicons name="settings-outline" size={36} color="#344950" />
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>Financial Tools</Text>

      {/* Tools List */}
      <ScrollView contentContainerStyle={styles.toolsContainer}>
        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={styles.toolCard}
            onPress={() => navigation.navigate(tool.route)}
          >
            <View style={styles.toolHeader}>
              <MaterialCommunityIcons
                name={tool.icon}
                size={48}
                color="#344950"
                style={styles.toolIcon}
              />
              <View style={styles.toolInfo}>
                <Text style={styles.toolTitle}>{tool.title}</Text>
                <Text style={styles.toolDescription}>{tool.description}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Dashboard")}
        >
          <Ionicons name="home-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="construct-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="analytics-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/Analytics")}
          />
          <Text style={styles.navText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Learning")}
        >
          <Ionicons name="school-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
