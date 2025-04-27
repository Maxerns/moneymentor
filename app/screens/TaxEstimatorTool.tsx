import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function TaxEstimatorTool() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [incomeField, setIncomeField] = useState<string>("Technology");
  const [incomeType, setIncomeType] = useState<string>("Full-time");
  const [incomeAmount, setIncomeAmount] = useState<string>("");
  const [deductions, setDeductions] = useState<string>("");
  const [taxCredits, setTaxCredits] = useState<boolean>(false);
  const [result, setResult] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },
    mainContainer: {
      flex: 1,
      position: "relative",
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
      paddingBottom: 150, // Increased padding to ensure content doesn't get hidden behind navbar
    },
    scrollContainer: {
      flexGrow: 1,
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
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 10,
      color: theme.text,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: theme.text,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 10,
      color: theme.text,
    },
    picker: {
      height: 80, // Increased height for better visibility
      fontSize: 18, // Larger font size
      fontWeight: "500", // Make text more prominent
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 10,
      marginBottom: 20,
      color: theme.text,
    },
    switchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    resultContainer: {
      alignItems: "center",
      marginVertical: 20,
      backgroundColor: theme.success + "20",
      padding: 20,
      borderRadius: 8,
    },
    resultTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    resultValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginTop: 10,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    calculateButton: {
      backgroundColor: theme.primary,
      padding: 12,
      borderRadius: 5,
      width: "100%",
      alignItems: "center",
      marginBottom: 20,
    },
    saveButton: {
      backgroundColor: theme.success,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: "center",
      marginRight: 10,
    },
    suggestionsButton: {
      backgroundColor: theme.primary,
      padding: 10,
      borderRadius: 5,
      flex: 1,
      alignItems: "center",
      marginLeft: 10,
    },
    buttonText: {
      color: theme.surface,
      fontSize: 16,
      fontWeight: "500",
    },
    navBar: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.surface,
      paddingVertical: 10,
      paddingHorizontal: 40,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      elevation: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
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
    suggestionPanel: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: theme.border,
    },
    suggestionHeader: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 10,
    },
    suggestionItem: {
      flexDirection: "row",
      marginBottom: 10,
      alignItems: "flex-start",
    },
    suggestionIcon: {
      marginRight: 10,
      marginTop: 2,
    },
    suggestionText: {
      color: theme.text,
      flex: 1,
    },
    errorText: {
      color: theme.error,
      marginBottom: 10,
      textAlign: "center",
    },
    pickerContainer: {
      backgroundColor: theme.surface,
      borderWidth: 2, // Increased border width
      borderColor: theme.border,
      borderRadius: 10, // Slightly larger border radius
      marginBottom: 24, // More space between elements
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 3, // Add elevation on Android
    },
    pickerItem: {
      fontSize: 18, // Larger font size for better readability
      height: 60, // Taller items for easier selection
    },
    labelText: {
      color: theme.text,
      marginBottom: 8, // Slightly increased from 5 to 8
      fontWeight: "500",
      fontSize: 16, // Add font size for consistency
    },
  });

  // Available income fields (job sectors)
  const incomeFields = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Retail",
    "Manufacturing",
    "Hospitality",
    "Media",
    "Construction",
    "Government",
    "Other",
  ];

  // Employment types
  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Freelancer",
    "Contract",
    "Self-employed",
    "Temporary",
    "Seasonal",
    "Other",
  ];

  const calculateTax = () => {
    // Reset error state
    setError(null);

    // Validate inputs
    if (!incomeAmount || parseFloat(incomeAmount) <= 0) {
      setError("Please enter a valid income amount.");
      return;
    }

    setIsCalculating(true);

    // Simulate API call or complex calculation
    setTimeout(() => {
      try {
        const income = parseFloat(incomeAmount) || 0;
        const deductionAmount = parseFloat(deductions) || 0;

        // Progressive tax rate simulation (UK-like)
        let taxableIncome = income - deductionAmount;
        let tax = 0;

        // Apply additional adjustment based on employment type
        if (incomeType === "Freelancer" || incomeType === "Self-employed") {
          // Self-employed people might have different tax rules, like National Insurance
          taxableIncome = taxableIncome * 0.95; // Example adjustment
        }

        if (taxableIncome > 0) {
          // Personal allowance (first £12,570 tax-free)
          const personalAllowance = 12570;

          // Basic rate: 20% on income between £12,571 to £50,270
          const basicRateMax = 50270;

          // Higher rate: 40% on income between £50,271 to £150,000
          const higherRateMax = 150000;

          // Additional rate: 45% on income over £150,000

          // Account for tax credits if enabled
          if (taxCredits) {
            taxableIncome -= 1000; // Example tax credit amount
          }

          // Calculate tax based on bands
          if (taxableIncome > personalAllowance) {
            // Basic rate
            const basicRateAmount =
              Math.min(taxableIncome, basicRateMax) - personalAllowance;
            tax += basicRateAmount > 0 ? basicRateAmount * 0.2 : 0;

            // Higher rate
            if (taxableIncome > basicRateMax) {
              const higherRateAmount =
                Math.min(taxableIncome, higherRateMax) - basicRateMax;
              tax += higherRateAmount > 0 ? higherRateAmount * 0.4 : 0;

              // Additional rate
              if (taxableIncome > higherRateMax) {
                const additionalRateAmount = taxableIncome - higherRateMax;
                tax += additionalRateAmount * 0.45;
              }
            }
          }
        }

        setResult(tax > 0 ? tax : 0);
        setIsCalculating(false);
      } catch (err) {
        setError("An error occurred during calculation. Please try again.");
        setIsCalculating(false);
      }
    }, 1000);
  };

  const getSuggestions = () => {
    const income = parseFloat(incomeAmount) || 0;

    const suggestions = [
      {
        id: 1,
        text: "Consider maximizing your pension contributions to reduce taxable income.",
        icon: "wallet-outline",
      },
      {
        id: 2,
        text: "Check if you're eligible for Working from Home tax relief.",
        icon: "home-outline",
      },
      {
        id: 3,
        text: "Explore ISA investments for tax-free savings and returns.",
        icon: "trending-up-outline",
      },
    ];

    if (income > 50000) {
      suggestions.push({
        id: 4,
        text: "You're in a higher tax bracket. Consider salary sacrifice schemes to reduce your taxable income.",
        icon: "analytics-outline",
      });
    }

    // Specific suggestions based on employment type
    if (incomeType === "Freelancer" || incomeType === "Self-employed") {
      suggestions.push({
        id: 5,
        text: "Don't forget to claim expenses for your home office, equipment, and travel.",
        icon: "briefcase-outline",
      });
    }

    // Specific suggestions based on job field
    if (incomeField === "Technology") {
      suggestions.push({
        id: 6,
        text: "Check if your professional subscriptions or certifications qualify for tax relief.",
        icon: "code-slash-outline",
      });
    }

    return suggestions;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.mainContainer}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 80 }} // Added more padding at bottom
          showsVerticalScrollIndicator={true}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.navigate("screens/Profile")}
            >
              <Ionicons
                name="person-circle-outline"
                size={36}
                color="#344950"
              />
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

          <Text style={styles.title}>Tax Estimator Tool</Text>
          <Text style={styles.subtitle}>
            Get an estimate of your annual tax obligations and discover ways to
            save
          </Text>

          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Income Details */}
          <Text style={styles.sectionTitle}>Income Details</Text>

          {/* Income Field Dropdown (Job Sectors) */}
          <Text style={styles.labelText}>Income Field</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={incomeField}
              onValueChange={(itemValue: string) => setIncomeField(itemValue)}
              style={[styles.picker, { color: theme.text }]}
              itemStyle={styles.pickerItem} // Apply the pickerItem style
              dropdownIconColor={theme.primary} // Make dropdown icon more visible
            >
              {incomeFields.map((field) => (
                <Picker.Item
                  key={field}
                  label={field}
                  value={field}
                  color={theme.isDarkMode ? "#FFFFFF" : "#000000"}
                />
              ))}
            </Picker>
          </View>

          {/* Income Type Dropdown (Employment Types) */}
          <Text style={styles.labelText}>Income Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={incomeType}
              onValueChange={(itemValue: string) => setIncomeType(itemValue)}
              style={[styles.picker, { color: theme.text }]}
              itemStyle={styles.pickerItem} // Apply the pickerItem style
              dropdownIconColor={theme.primary} // Make dropdown icon more visible
            >
              {employmentTypes.map((type) => (
                <Picker.Item
                  key={type}
                  label={type}
                  value={type}
                  color={theme.isDarkMode ? "#FFFFFF" : "#000000"}
                />
              ))}
            </Picker>
          </View>

          {/* Income Amount Input */}
          <Text style={styles.labelText}>Income Amount (£)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter your income amount"
            placeholderTextColor="#888888"
            value={incomeAmount}
            onChangeText={(text) =>
              setIncomeAmount(text.replace(/[^0-9.]/g, ""))
            }
          />

          {/* Deductions and Tax Credits */}
          <Text style={styles.sectionTitle}>Deductions and Tax Credits</Text>
          <Text style={styles.labelText}>Deductions Amount (£)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter deductions amount"
            placeholderTextColor="#888888"
            value={deductions}
            onChangeText={(text) => setDeductions(text.replace(/[^0-9.]/g, ""))}
          />
          <View style={styles.switchContainer}>
            <Text style={{ color: theme.text, fontWeight: "500" }}>
              Apply Standard Tax Credits
            </Text>
            <Switch
              value={taxCredits}
              onValueChange={(value) => setTaxCredits(value)}
              trackColor={{ false: "#767577", true: theme.primary }}
            />
          </View>

          {/* Calculate Button */}
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={calculateTax}
            disabled={isCalculating}
          >
            {isCalculating ? (
              <ActivityIndicator color={theme.surface} />
            ) : (
              <Text style={styles.buttonText}>Calculate Tax</Text>
            )}
          </TouchableOpacity>

          {/* Results */}
          {result !== null && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Estimated Annual Tax</Text>
              <Text style={styles.resultValue}>£{result.toFixed(2)}</Text>
            </View>
          )}

          {/* Suggestions Panel */}
          {showSuggestions && result !== null && (
            <View style={styles.suggestionPanel}>
              <Text style={styles.suggestionHeader}>
                Tax-Saving Suggestions
              </Text>
              {getSuggestions().map((suggestion) => (
                <View key={suggestion.id} style={styles.suggestionItem}>
                  <Ionicons
                    name={suggestion.icon}
                    size={20}
                    color={theme.primary}
                    style={styles.suggestionIcon}
                  />
                  <Text style={styles.suggestionText}>{suggestion.text}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Buttons */}
          {result !== null && (
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => alert("Estimate Saved!")}
              >
                <Text style={styles.buttonText}>Save Estimate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.suggestionsButton}
                onPress={() => setShowSuggestions(!showSuggestions)}
              >
                <Text style={styles.buttonText}>
                  {showSuggestions ? "Hide Suggestions" : "View Suggestions"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.navBar}>
          <TouchableOpacity
            onPress={() => navigation.navigate("screens/Dashboard")}
          >
            <Ionicons name="home-outline" style={styles.navBarIcon} />
            <Text style={styles.navText}>Dashboard</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("screens/Tools")}
          >
            <Ionicons name="construct-outline" style={styles.navBarIcon} />
            <Text style={styles.navText}>Tools</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("screens/Analytics")}
          >
            <Ionicons name="analytics-outline" style={styles.navBarIcon} />
            <Text style={styles.navText}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("screens/Learning")}
          >
            <Ionicons name="school-outline" style={styles.navBarIcon} />
            <Text style={styles.navText}>Learning</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
