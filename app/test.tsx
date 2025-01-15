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

export type RootStackParamList = {
  Dashboard: undefined;
  Tools: undefined;
  Analysis: undefined;
  Learning: undefined;
  FinancialTermGlossary: undefined;
};

export default function FinancialTermGlossary() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const handleLetterPress = (letter: string) => {
    setSelectedLetter(letter);
  };

  const terms: { [key: string]: string[] } = {
    A: ["Asset", "Amortization", "Arbitrage"],
    B: [
      "Balanced Scorecard",
      "Bollinger Band",
      "Bond",
      "Break-Even Analysis",
      "Budget",
      "Bull Market",
    ],
    // Add more letters and terms as needed
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Ionicons name="person-circle-outline" size={36} color="#344950" />
        </TouchableOpacity>
        <Image
          source={require("../assets/images/MoneyMentorLogoGradient.png")}
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

      <View>
        {Object.keys(terms).map((letter) => (
          <TouchableOpacity
            key={letter}
            onPress={() => handleLetterPress(letter)}
          >
            <View style={styles.letterSection}>
              <Text style={styles.letter}>{letter}</Text>
              {selectedLetter === letter && (
                <View style={styles.termCard}>
                  {terms[letter].map((term) => (
                    <Text key={term} style={styles.termText}>
                      {term}
                    </Text>
                  ))}
                  <Ionicons
                    name="chevron-forward-outline"
                    size={20}
                    color="#344950"
                    opacity={0.7}
                  />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity>
          <Ionicons
            name="home-outline"
            style={styles.navBarIcon}
            onPress={() => navigation.navigate("Dashboard")}
          />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="construct-outline" style={styles.navBarIcon} />
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
            onPress={() => navigation.navigate("Learning")}
          />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F9FC",
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
    color: "#344950",
    marginBottom: 20,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#344950",
  },
  glossaryContainer: {
    paddingBottom: 100,
  },
  letterSection: {
    marginBottom: 20,
  },
  letter: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#344950",
    marginBottom: 10,
  },
  termCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  termText: {
    fontSize: 16,
    color: "#344950",
    marginBottom: 5,
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
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  navBarIcon: {
    fontSize: 30,
    color: "#344950",
  },
  navText: {
    fontSize: 12,
    fontWeight: 500,
    color: "#344950",
    marginTop: 5,
  },
});
