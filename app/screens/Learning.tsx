import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";
import { auth } from "@/firebase/config";
import { learningPaths, learningService } from "../services/learningService";
import { UserLearningProgress, ModuleProgress } from "../types/learningTypes";

export default function Learning() {
  // navigation, theme hooks and search functionality
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [userProgress, setUserProgress] = useState<UserLearningProgress | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const isGuest = !auth.currentUser;

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
    pathButton: {
      backgroundColor: "#00ADB5",
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      alignItems: "center",
    },
    pathButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
    },
    currentPath: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#FFFFFF",
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
    },
    currentPathText: {
      color: "#344950",
      fontSize: 16,
    },
    changePath: {
      backgroundColor: "#00ADB5",
      padding: 8,
      borderRadius: 5,
    },
    changePathText: {
      color: "#FFFFFF",
      fontSize: 14,
    },
    lockedModule: {
      opacity: 0.5,
    },
    lockedText: {
      color: "#B0BEC5",
    },
  });

  // Interface for module data structure
  interface ModuleType {
    title: string;
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    progress: string;
    sections: {
      title: string;
      content: string;
      examples?: string[];
    }[];
  }

  // Array of educational modules with their properties
  const modules: ModuleType[] = [
    {
      title: "Interest Rates",
      icon: "chart-line" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/7",
      sections: [
        {
          title: "What are Interest Rates?",
          content: "Introduction to interest rates and their importance...",
        },
        // Add more sections as needed
      ],
    },
    // Update other modules similarly with sections
    {
      title: "Financial Term Glossary",
      icon: "book-outline" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/5",
      sections: [
        {
          title: "Basic Financial Terms",
          content: "Essential financial terminology...",
        },
      ],
    },
    // ...rest of the modules with their sections
  ];

  useEffect(() => {
    const loadUserProgress = async () => {
      if (!auth.currentUser) {
        setLoading(false);
        return;
      }

      try {
        const progress = await learningService.getUserProgress();
        setUserProgress(progress);
      } catch (error) {
        console.error("Error loading progress:", error);
        Alert.alert(
          "Error",
          "Failed to load your learning progress. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    loadUserProgress();
  }, []);

  const getModuleProgress = (moduleId: string): string => {
    if (!userProgress?.progress[moduleId]) return "0/1";
    const moduleProgress = userProgress.progress[moduleId];
    const module = modules.find((m) => m.title === moduleId);
    return `${moduleProgress.sectionsCompleted.length}/${
      module?.sections.length || 1
    }`;
  };

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

      <Text style={styles.pageTitle}>Educational Modules</Text>

      {/* Learning Path Section */}
      {!isGuest && (
        <>
          {!userProgress?.selectedPath ? (
            <TouchableOpacity
              style={styles.pathButton}
              onPress={() => navigation.navigate("screens/LearningPath")}
            >
              <Text style={styles.pathButtonText}>
                Choose Your Learning Path
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.currentPath}>
              <Text style={styles.currentPathText}>
                Current Path:{" "}
                {
                  learningPaths.find((p) => p.id === userProgress.selectedPath)
                    ?.name
                }
              </Text>
              <TouchableOpacity
                style={styles.changePath}
                onPress={() => navigation.navigate("screens/LearningPath")}
              >
                <Text style={styles.changePathText}>Change</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

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

      {/* Module List */}
      <ScrollView contentContainerStyle={styles.modulesContainer}>
        {modules
          .filter((module) =>
            module.title.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((module, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moduleCard,
                isGuest && styles.lockedModule, // Add locked style for guests
              ]}
              onPress={() => {
                if (isGuest) {
                  Alert.alert(
                    "Create Account",
                    "Please create an account to access the educational modules and track your progress!",
                    [
                      {
                        text: "Not Now",
                        style: "cancel",
                      },
                      {
                        text: "Sign Up",
                        onPress: () => navigation.navigate("auth/SignUp"),
                      },
                    ]
                  );
                } else {
                  // authentication check and navigation
                  if (
                    !userProgress?.selectedPath ||
                    userProgress.recommendations.includes(module.title)
                  ) {
                    navigation.navigate("screens/ModuleContent", {
                      title: module.title,
                    });
                  } else {
                    Alert.alert(
                      "Module Locked",
                      "Complete your current learning path modules first"
                    );
                  }
                }
              }}
            >
              <MaterialCommunityIcons
                name={module.icon}
                size={48}
                color="#344950"
                opacity={
                  isGuest
                    ? 0.4
                    : userProgress?.recommendations.includes(module.title)
                    ? 1
                    : 0.4
                }
              />
              <View style={styles.moduleInfo}>
                <Text
                  style={[styles.moduleTitle, isGuest && styles.lockedText]}
                >
                  {module.title}
                </Text>
                <Text style={styles.moduleProgress}>
                  {isGuest ? "Locked" : getModuleProgress(module.title)}
                </Text>
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
