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
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      alignItems: "center",
    },
    pathButtonText: {
      color: theme.surface,
      fontSize: 16,
      fontWeight: "600",
    },
    currentPath: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.surface,
      padding: 15,
      borderRadius: 10,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    currentPathText: {
      color: theme.text,
      fontSize: 16,
    },
    changePath: {
      backgroundColor: theme.primary,
      padding: 8,
      borderRadius: 5,
    },
    changePathText: {
      color: theme.surface,
      fontSize: 14,
    },
    lockedModule: {
      opacity: 0.5,
    },
    lockedText: {
      color: theme.secondaryText,
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
      ],
    },
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
    {
      title: "Budgeting Fundamentals",
      icon: "bank" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/6",
      sections: [
        {
          title: "Introduction to Budgeting",
          content:
            "Learn the fundamentals of budgeting and its importance in financial planning. Understand how budgeting helps track income, expenses, and achieve financial goals.",
          examples: [
            "Monthly budget template",
            "Income tracking methods",
            "Expense categories",
          ],
        },
        {
          title: "50/30/20 Rule",
          content:
            "Master the popular budgeting technique that allocates 50% to needs, 30% to wants, and 20% to savings and debt repayment.",
          examples: [
            "Essential expenses breakdown",
            "Discretionary spending examples",
            "Savings allocation strategies",
          ],
        },
        {
          title: "Creating Your First Budget",
          content:
            "Step-by-step guide to creating a personalized budget. Learn to categorize expenses, set realistic goals, and maintain financial discipline.",
          examples: [
            "Budget worksheets",
            "Goal-setting templates",
            "Expense tracking tools",
          ],
        },
      ],
    },
    {
      title: "Saving Strategies",
      icon: "piggy-bank" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/7",
      sections: [
        {
          title: "Emergency Fund Basics",
          content:
            "Understanding the importance of emergency funds and how to build one. Learn about recommended fund sizes and optimal saving strategies.",
          examples: [
            "3-6 months expenses calculation",
            "High-yield savings accounts",
            "Automatic saving methods",
          ],
        },
        {
          title: "Smart Saving Techniques",
          content:
            "Discover practical methods to increase savings through automated transfers, spending reduction, and income optimization.",
          examples: [
            "Round-up saving apps",
            "Expense reduction strategies",
            "Side hustle opportunities",
          ],
        },
      ],
    },
    {
      title: "Credit & Debt Management",
      icon: "credit-card" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/8",
      sections: [
        {
          title: "Understanding Credit Scores",
          content:
            "Learn about credit score components, factors affecting your score, and strategies for improvement.",
          examples: [
            "Credit score ranges",
            "Credit report elements",
            "Score improvement tactics",
          ],
        },
        {
          title: "Debt Reduction Strategies",
          content:
            "Explore effective methods for managing and reducing debt, including prioritization and consolidation options.",
          examples: [
            "Debt snowball method",
            "Debt avalanche approach",
            "Consolidation loans",
          ],
        },
      ],
    },
    {
      title: "Investment Basics",
      icon: "chart-line" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/9",
      sections: [
        {
          title: "Investment Fundamentals",
          content:
            "Introduction to basic investment concepts, risk tolerance, and different investment vehicles.",
          examples: [
            "Risk vs. return",
            "Asset classes",
            "Investment timeframes",
          ],
        },
        {
          title: "Building a Portfolio",
          content:
            "Learn about portfolio diversification, asset allocation, and investment strategies.",
          examples: [
            "Diversification methods",
            "Asset allocation models",
            "Rebalancing techniques",
          ],
        },
      ],
    },
    {
      title: "Stock Market Basics",
      icon: "chart-multiple" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/10",
      sections: [
        {
          title: "Stock Market Introduction",
          content:
            "Understanding stock markets, exchanges, and basic trading concepts.",
          examples: ["Market indices", "Trading hours", "Order types"],
        },
        {
          title: "Stock Analysis",
          content:
            "Learn fundamental and technical analysis methods for evaluating stocks.",
          examples: [
            "P/E ratios",
            "Market capitalization",
            "Technical indicators",
          ],
        },
      ],
    },
    {
      title: "Retirement Planning",
      icon: "clock-outline" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/8",
      sections: [
        {
          title: "Retirement Basics",
          content:
            "Understanding retirement accounts, contribution limits, and investment options.",
          examples: ["401(k) plans", "IRA types", "Pension systems"],
        },
        {
          title: "Retirement Strategies",
          content:
            "Learn about retirement planning strategies, withdrawal rates, and Social Security benefits.",
          examples: [
            "4% rule",
            "Social Security claiming",
            "Required minimum distributions",
          ],
        },
      ],
    },
    {
      title: "Tax Planning",
      icon: "calculator" as keyof typeof MaterialCommunityIcons.glyphMap,
      progress: "0/5",
      sections: [
        {
          title: "Tax Fundamentals",
          content: "Understanding tax brackets, deductions, and credits.",
          examples: ["Tax brackets", "Standard deduction", "Common credits"],
        },
        {
          title: "Tax Reduction Strategies",
          content:
            "Learn legal methods to minimize tax liability through deductions and credits.",
          examples: [
            "Tax-advantaged accounts",
            "Charitable giving",
            "Business deductions",
          ],
        },
      ],
    },
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
            onPress={() => navigation.navigate("screens/Tools")}
          />
          <Text style={styles.navText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" style={styles.navBarIcon} 
          onPress={() => navigation.navigate("screens/Analytics")}/>
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
