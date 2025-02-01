import React from "react";
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();

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

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={36} color="#344950" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/MoneyMentorLogoGradient.png")}
          style={styles.logo}
        />
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={36} color="#344950" />
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
        />
      </View>

      {/* Module List */}
      <ScrollView contentContainerStyle={styles.modulesContainer}>
        <View style={styles.moduleCard}>
          <MaterialCommunityIcons
            name="chart-line"
            size={48}
            color="#344950"
            opacity={0.7}
          />
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>Interest Rates</Text>
            <Text style={styles.moduleProgress}>3/7</Text>
          </View>
        </View>

        <View style={styles.moduleCard}>
          <MaterialCommunityIcons
            name="book-outline"
            size={48}
            color="#344950"
            opacity={0.7}
          />
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>Financial Term Glossary</Text>
            <Ionicons
              name="chevron-forward-outline"
              size={20}
              color="#344950"
              opacity={0.7}
              onPress={() =>
                navigation.navigate("screens/FinancialTermGlossary")
              }
            />
          </View>
        </View>

        <View style={styles.moduleCard}>
          <MaterialCommunityIcons
            name="scale-balance"
            size={48}
            color="#344950"
            opacity={0.7}
          />
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>Investment Basics</Text>
            <Text style={styles.moduleProgress}>1/9</Text>
          </View>
        </View>
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
