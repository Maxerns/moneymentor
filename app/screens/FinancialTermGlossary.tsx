import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function FinancialTermGlossary() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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
    letterSection: {
      marginBottom: 20,
    },
    letter: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    termCard: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },
    termText: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 5,
    },
    definition: {
      fontSize: 14,
      color: theme.text,
      marginBottom: 10,
    },
    learnMoreButton: {
      backgroundColor: theme.primary,
      borderRadius: 5,
      paddingVertical: 5,
      paddingHorizontal: 10,
      alignSelf: "flex-start",
    },
    learnMoreText: {
      fontSize: 14,
      color: theme.surface,
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
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 20,
      width: "90%",
      maxHeight: "80%",
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      paddingBottom: 10,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
    },
    closeButton: {
      padding: 5,
    },
    modalSection: {
      marginBottom: 15,
    },
    modalSectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
    },
    modalText: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 10,
      lineHeight: 22,
    },
    suggestionButton: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.primary,
    },
    suggestionText: {
      fontSize: 14,
      color: theme.primary,
    },
    resourceItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    resourceIcon: {
      marginRight: 10,
    },
    resourceText: {
      fontSize: 14,
      color: theme.text,
    },
  });

  const handleLetterPress = (letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter);
    // Clear search when selecting a letter
    setSearchQuery("");
  };

  const handleTermPress = (term: string) => {
    setSelectedTerm(term);
    setModalVisible(true);
  };

  // Helper function to get all terms from all letters
  const getAllTerms = () => {
    const allTerms: { term: string; definition: string; letter: string }[] = [];

    Object.entries(terms).forEach(([letter, termsList]) => {
      termsList.forEach((termObj) => {
        allTerms.push({
          ...termObj,
          letter,
        });
      });
    });

    return allTerms;
  };

  const termSuggestions: {
    [key: string]: {
      extendedDescription: string;
      relatedTerms: string[];
      resources: { title: string; type: string }[];
      suggestedModules: string[];
    };
  } = {
    "Absolute Advantage": {
      extendedDescription:
        "First described by economist Adam Smith, absolute advantage refers to the ability of a party to produce a greater quantity of a good or service with the same amount of inputs, or the same quantity using fewer inputs.",
      relatedTerms: [
        "Comparative Advantage",
        "Economic Efficiency",
        "Productivity",
      ],
      resources: [
        {
          title:
            "Economics Basics: Trade, Comparative Advantage & Protectionism",
          type: "article",
        },
        { title: "Understanding International Trade Theory", type: "video" },
      ],
      suggestedModules: ["Investment Basics", "Financial Term Glossary"],
    },
    Budget: {
      extendedDescription:
        "A budget helps you track income and expenses over a specific period and is the foundation of personal financial planning. It allows you to allocate resources efficiently and work toward financial goals.",
      relatedTerms: [
        "Expense Tracking",
        "Income",
        "Financial Planning",
        "Emergency Fund",
      ],
      resources: [
        { title: "Creating Your First Budget", type: "guide" },
        { title: "50/30/20 Budgeting Rule", type: "video" },
      ],
      suggestedModules: ["Budgeting Fundamentals", "Saving Strategies"],
    },
    Bond: {
      extendedDescription:
        "Bonds are fixed income securities that represent loans made by investors to borrowers. When you purchase a bond, you are lending money to the issuer for a defined period at a fixed interest rate.",
      relatedTerms: ["Yield", "Maturity", "Coupon Rate", "Fixed Income"],
      resources: [
        { title: "Bond Market Fundamentals", type: "article" },
        { title: "Understanding Bond Yields and Pricing", type: "video" },
      ],
      suggestedModules: ["Investment Basics", "Interest Rates"],
    },
  };

  const defaultSuggestion = {
    extendedDescription:
      "This financial term is part of the fundamental concepts in finance and economics.",
    relatedTerms: ["Financial Literacy", "Economics"],
    resources: [
      { title: "Introduction to Financial Terms", type: "article" },
      { title: "Finance Fundamentals", type: "video" },
    ],
    suggestedModules: ["Financial Term Glossary", "Investment Basics"],
  };

  const navigateToModule = (module: string) => {
    setModalVisible(false);
    if (module === "Budgeting Fundamentals") {
      navigation.navigate("screens/ModuleContent", { moduleName: module });
    } else if (module === "Investment Basics") {
      navigation.navigate("screens/ModuleContent", { moduleName: module });
    } else if (module === "Saving Strategies") {
      navigation.navigate("screens/ModuleContent", { moduleName: module });
    } else if (module === "Interest Rates") {
      navigation.navigate("screens/ModuleContent", { moduleName: module });
    } else {
      navigation.navigate("screens/Learning");
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "article":
        return "document-text-outline";
      case "video":
        return "videocam-outline";
      case "guide":
        return "book-outline";
      default:
        return "link-outline";
    }
  };

  const terms: { [key: string]: { term: string; definition: string }[] } = {
    A: [
      {
        term: "Absolute Advantage",
        definition:
          "Absolute advantage is when a person, company, or country can produce more of a good or service with the same amount of resources (or produce the same amount using fewer resources) compared to others.",
      },
      {
        term: "Accounting Equation",
        definition:
          "The Accounting Equation is the foundation of double-entry bookkeeping and represents the relationship between a company's assets, liabilities, and equity.",
      },
      {
        term: "Acquisition",
        definition:
          "An acquisition is when one company purchases most or all of another company's shares or assets to take control of that company.",
      },
      {
        term: "Accounting Rate of Return (ARR)",
        definition:
          "The Accounting Rate of Return (ARR) is a financial metric used to evaluate the profitability of an investment. It measures the expected annual return as a percentage of the initial investment cost or average investment.",
      },
    ],
    B: [
      {
        term: "Balanced Scorecard",
        definition:
          "A balanced scorecard (BSC) is defined as a management system that provides feedback on both internal business processes and external outcomes to continuously improve strategic performance and results",
      },
      {
        term: "Bond",
        definition:
          "Bonds are issued by governments and corporations when they want to raise money. By buying a bond, you're giving the issuer a loan, and they agree to pay you back the face value of the loan on a specific date, and to pay you periodic interest payments along the way, usually twice a year.",
      },
      {
        term: "Budget",
        definition:
          "A budget is a monthly or annual plan that documents your income, tracks your expenses and leaves room for financial goals.",
      },
      {
        term: "Bull Market",
        definition:
          "A bull market is a financial market in which prices are rising or are expected to rise.",
      },
    ],
    C: [{ term: "Sample Term", definition: "Sample Definition" }],
  };

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
      <Text style={styles.pageTitle}>Financial Term Glossary</Text>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#B0BEC5"
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Term search"
          placeholderTextColor="#B0BEC5"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView>
        {searchQuery
          ? // Show search results
            getAllTerms()
              .filter(({ term }) =>
                term.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(({ term, definition, letter }) => (
                <View key={term} style={styles.termCard}>
                  <Text style={styles.termText}>{term}</Text>
                  <Text style={styles.definition}>{definition}</Text>
                  <TouchableOpacity
                    style={styles.learnMoreButton}
                    onPress={() => handleTermPress(term)}
                  >
                    <Text style={styles.learnMoreText}>Learn More</Text>
                  </TouchableOpacity>
                </View>
              ))
          : // Show alphabetical listing
            Object.keys(terms).map((letter) => (
              <View key={letter} style={styles.letterSection}>
                <TouchableOpacity onPress={() => handleLetterPress(letter)}>
                  <Text style={styles.letter}>{letter}</Text>
                </TouchableOpacity>
                {selectedLetter === letter &&
                  terms[letter].map(({ term, definition }) => (
                    <View key={term} style={styles.termCard}>
                      <Text style={styles.termText}>{term}</Text>
                      <Text style={styles.definition}>{definition}</Text>
                      <TouchableOpacity
                        style={styles.learnMoreButton}
                        onPress={() => handleTermPress(term)}
                      >
                        <Text style={styles.learnMoreText}>Learn More</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
              </View>
            ))}
      </ScrollView>

      {/* Term Details Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTerm}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {/* Extended Description */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Description</Text>
                <Text style={styles.modalText}>
                  {selectedTerm && termSuggestions[selectedTerm]
                    ? termSuggestions[selectedTerm].extendedDescription
                    : defaultSuggestion.extendedDescription}
                </Text>
              </View>

              {/* Related Terms */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Related Terms</Text>
                {selectedTerm && termSuggestions[selectedTerm]
                  ? termSuggestions[selectedTerm].relatedTerms.map((term) => (
                      <TouchableOpacity
                        key={term}
                        style={styles.suggestionButton}
                        onPress={() => {
                          setSelectedTerm(term);
                        }}
                      >
                        <Text style={styles.suggestionText}>{term}</Text>
                      </TouchableOpacity>
                    ))
                  : defaultSuggestion.relatedTerms.map((term) => (
                      <TouchableOpacity
                        key={term}
                        style={styles.suggestionButton}
                      >
                        <Text style={styles.suggestionText}>{term}</Text>
                      </TouchableOpacity>
                    ))}
              </View>

              {/* Learning Resources */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Learning Resources</Text>
                {selectedTerm && termSuggestions[selectedTerm]
                  ? termSuggestions[selectedTerm].resources.map((resource) => (
                      <View key={resource.title} style={styles.resourceItem}>
                        <Ionicons
                          name={getResourceIcon(resource.type)}
                          size={16}
                          color={theme.primary}
                          style={styles.resourceIcon}
                        />
                        <Text style={styles.resourceText}>
                          {resource.title}
                        </Text>
                      </View>
                    ))
                  : defaultSuggestion.resources.map((resource) => (
                      <View key={resource.title} style={styles.resourceItem}>
                        <Ionicons
                          name={getResourceIcon(resource.type)}
                          size={16}
                          color={theme.primary}
                          style={styles.resourceIcon}
                        />
                        <Text style={styles.resourceText}>
                          {resource.title}
                        </Text>
                      </View>
                    ))}
              </View>

              {/* Suggested Learning Modules */}
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>
                  Recommended Learning
                </Text>
                {selectedTerm && termSuggestions[selectedTerm]
                  ? termSuggestions[selectedTerm].suggestedModules.map(
                      (module) => (
                        <TouchableOpacity
                          key={module}
                          style={styles.suggestionButton}
                          onPress={() => navigateToModule(module)}
                        >
                          <Text style={styles.suggestionText}>{module}</Text>
                        </TouchableOpacity>
                      )
                    )
                  : defaultSuggestion.suggestedModules.map((module) => (
                      <TouchableOpacity
                        key={module}
                        style={styles.suggestionButton}
                        onPress={() => navigateToModule(module)}
                      >
                        <Text style={styles.suggestionText}>{module}</Text>
                      </TouchableOpacity>
                    ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

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
          <Ionicons
            name="analytics-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/Analytics")}
          />
          <Text style={styles.navText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="school-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("screens/Learning")}
          />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
