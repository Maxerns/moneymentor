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
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function FinancialTermGlossary() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
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
  });

  const handleLetterPress = (letter: string) => {
    setSelectedLetter(letter === selectedLetter ? null : letter);
  };

  const handleTermPress = (term: string) => {
    alert(`Learn more about: ${term}`);
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
        />
      </View>

      <ScrollView>
        {Object.keys(terms).map((letter) => (
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
