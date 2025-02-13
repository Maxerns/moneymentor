import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "@/firebase/config";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

interface TaxEstimate {
  id: string;
  incomeType: string;
  incomeAmount: number;
  deductions: number;
  taxCredits: boolean;
  estimatedTax: number;
  createdAt: string;
  userId: string;
}

export default function TaxEstimatorTool() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [incomeType, setIncomeType] = useState<string>("Salary");
  const [deductions, setDeductions] = useState<string>("");
  const [taxCredits, setTaxCredits] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [incomeAmount, setIncomeAmount] = useState<string>("");
  const [showPreviousEstimates, setShowPreviousEstimates] = useState(false);
  const [previousEstimates, setPreviousEstimates] = useState<TaxEstimate[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.background,
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
      height: 50,
      marginBottom: 20,
      backgroundColor: theme.surface,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
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
      justifyContent: "space-between", // Changed from space-around
      marginHorizontal: 10,
      gap: 10, // Add gap between buttons
    },
    saveButton: {
      backgroundColor: theme.primary, // Changed from theme.success
      padding: 10,
      borderRadius: 5,
      flex: 1, // Make buttons take equal width
    },
    suggestionsButton: {
      backgroundColor: theme.primary,
      padding: 10,
      borderRadius: 5,
      flex: 1, // Make buttons take equal width
    },
    viewHistoryButton: {
      backgroundColor: theme.primary,
      padding: 10,
      borderRadius: 5,
      flex: 1, // Make buttons take equal width
    },
    buttonText: {
      color: theme.surface,
      fontSize: 12,
      textAlign: 'center'
    },
    navBar: {
      position: "absolute",
      bottom: 0,
      width: "100%",
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
    dropdownButton: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 8,
      padding: 15,
      marginBottom: 20,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    dropdownButtonText: {
      color: theme.text,
      fontSize: 16,
    },
    dropdownModal: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    dropdownContent: {
      width: "80%",
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 10,
      maxHeight: "50%",
    },
    dropdownItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    dropdownItemText: {
      color: theme.text,
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
      padding: 20,
    },
    modalContent: {
      backgroundColor: theme.surface,
      borderRadius: 8,
      padding: 20,
      width: "100%",
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
      color: theme.text,
    },
    estimateItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    estimateDate: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "bold",
    },
    estimateAmount: {
      fontSize: 14,
      color: theme.text,
      marginTop: 5,
    },
    suggestionText: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 10,
      lineHeight: 22,
    },
    closeButton: {
      backgroundColor: theme.primary,
      padding: 10,
      borderRadius: 5,
      marginTop: 15,
      alignItems: "center",
    },
  });

  const incomeTypes = ["Salary", "Freelance", "Investment", "Other"];

  const PERSONAL_ALLOWANCE = 12570;
  const BASIC_RATE_THRESHOLD = 50270;
  const HIGHER_RATE_THRESHOLD = 150000;

  // Tax rates
  const BASIC_RATE = 0.2;
  const HIGHER_RATE = 0.4;
  const ADDITIONAL_RATE = 0.45;

  const calculateTax = React.useCallback(() => {
    const income = parseFloat(incomeAmount) || 0;
    const deductionAmount = parseFloat(deductions) || 0;

    if (!incomeAmount) {
      setResult(0);
      return;
    }

    let taxableIncome = income - deductionAmount;
    if (taxCredits) {
      taxableIncome = Math.max(0, taxableIncome - 1000);
    }

    // Calculate tax
    let totalTax = 0;
    if (taxableIncome > PERSONAL_ALLOWANCE) {
      const afterAllowance = taxableIncome - PERSONAL_ALLOWANCE;

      if (afterAllowance <= BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE) {
        totalTax = afterAllowance * BASIC_RATE;
      } else if (afterAllowance <= HIGHER_RATE_THRESHOLD - PERSONAL_ALLOWANCE) {
        totalTax =
          (BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE) * BASIC_RATE +
          (afterAllowance - (BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE)) *
            HIGHER_RATE;
      } else {
        totalTax =
          (BASIC_RATE_THRESHOLD - PERSONAL_ALLOWANCE) * BASIC_RATE +
          (HIGHER_RATE_THRESHOLD - BASIC_RATE_THRESHOLD) * HIGHER_RATE +
          (afterAllowance - (HIGHER_RATE_THRESHOLD - PERSONAL_ALLOWANCE)) *
            ADDITIONAL_RATE;
      }
    }

    setResult(totalTax);
  }, [incomeAmount, deductions, taxCredits]);

  // useEffect to trigger calculations
  useEffect(() => {
    calculateTax();
  }, [incomeAmount, deductions, taxCredits, calculateTax]);

  const saveTaxEstimate = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Please sign in to save your estimate");
      return;
    }

    setIsSaving(true);
    try {
      // Create reference to user's tax estimates collection
      const userTaxEstimatesRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "taxEstimates"
      );

      // Add new document with auto-generated ID
      const newEstimateRef = doc(userTaxEstimatesRef);

      await setDoc(newEstimateRef, {
        incomeType,
        incomeAmount: parseFloat(incomeAmount) || 0,
        deductions: parseFloat(deductions) || 0,
        taxCredits,
        estimatedTax: result,
        createdAt: new Date().toISOString(),
        userId: auth.currentUser.uid,
      });

      Alert.alert("Success", "Tax estimate saved successfully!");
    } catch (error) {
      console.error("Error saving estimate:", error);
      Alert.alert("Error", "Failed to save estimate. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderIncomeTypeDropdown = () => (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setShowDropdown(true)}
      >
        <Text style={styles.dropdownButtonText}>{incomeType}</Text>
        <Ionicons name="chevron-down" size={20} color={theme.text} />
      </TouchableOpacity>

      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.dropdownModal}
          onPress={() => setShowDropdown(false)}
          activeOpacity={1}
        >
          <View style={styles.dropdownContent}>
            <ScrollView>
              {incomeTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setIncomeType(type);
                    setShowDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );

  const fetchPreviousEstimates = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Please sign in to view previous estimates");
      return;
    }

    try {
      const estimatesRef = collection(
        db,
        "users",
        auth.currentUser.uid,
        "taxEstimates"
      );
      const q = query(estimatesRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const estimates: TaxEstimate[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        incomeType: doc.data().incomeType,
        incomeAmount: doc.data().incomeAmount,
        deductions: doc.data().deductions,
        taxCredits: doc.data().taxCredits,
        estimatedTax: doc.data().estimatedTax,
        createdAt: doc.data().createdAt,
        userId: doc.data().userId,
      }));
      setPreviousEstimates(estimates);
      setShowPreviousEstimates(true);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch previous estimates");
    }
  };

  const getSuggestions = () => {
    const income = parseFloat(incomeAmount) || 0;
    const suggestions = [];

    if (income <= PERSONAL_ALLOWANCE) {
      suggestions.push(
        "You're within your Personal Allowance - no tax is due."
      );
      suggestions.push(
        "Consider contributing to an ISA to build tax-free savings."
      );
    } else if (income <= BASIC_RATE_THRESHOLD) {
      suggestions.push("You're in the Basic Rate tax band.");
      suggestions.push(
        "Consider pension contributions to reduce taxable income."
      );
      suggestions.push(
        "Look into Marriage Allowance if your partner earns less."
      );
    } else if (income <= HIGHER_RATE_THRESHOLD) {
      suggestions.push("You're in the Higher Rate tax band.");
      suggestions.push("Maximize your pension contributions for tax relief.");
      suggestions.push(
        "Consider salary sacrifice schemes to reduce taxable income."
      );
    } else {
      suggestions.push("You're in the Additional Rate tax band.");
      suggestions.push(
        "Speak to a tax advisor about tax-efficient investments."
      );
      suggestions.push(
        "Consider spreading income across tax years if possible."
      );
    }

    return suggestions;
  };

  const renderPreviousEstimatesModal = () => (
    <Modal
      visible={showPreviousEstimates}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPreviousEstimates(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Previous Estimates</Text>
          <ScrollView>
            {previousEstimates.map((estimate) => (
              <View key={estimate.id} style={styles.estimateItem}>
                <Text style={styles.estimateDate}>
                  {new Date(estimate.createdAt).toLocaleDateString()}
                </Text>
                <Text style={styles.estimateAmount}>
                  Income: £{estimate.incomeAmount.toFixed(2)}
                </Text>
                <Text style={styles.estimateAmount}>
                  Tax: £{estimate.estimatedTax.toFixed(2)}
                </Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPreviousEstimates(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderSuggestionsModal = () => (
    <Modal
      visible={showSuggestions}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowSuggestions(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Tax Saving Suggestions</Text>
          <ScrollView>
            {getSuggestions().map((suggestion, index) => (
              <Text key={index} style={styles.suggestionText}>
                • {suggestion}
              </Text>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowSuggestions(false)}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
      <View style={styles.container}>
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
        <Text style={styles.title}>Tax Estimator Tool</Text>
        <Text style={styles.subtitle}>
          Get an estimate of your annual tax obligations and discover ways to
          save
        </Text>

        {/* Income Details */}
        <Text style={styles.sectionTitle}>Income Details</Text>
        {renderIncomeTypeDropdown()}
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter your income"
          value={incomeAmount}
          onChangeText={setIncomeAmount}
        />

        {/* Deductions and Tax Credits */}
        <Text style={styles.sectionTitle}>Deductions and Tax Credits</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Retirement Contributions"
          value={deductions}
          onChangeText={(text) => {
            setDeductions(text);
            calculateTax();
          }}
        />
        <View style={styles.switchContainer}>
          <Text>Tax Credits</Text>
          <Switch
            value={taxCredits}
            onValueChange={(value) => {
              setTaxCredits(value);
              calculateTax();
            }}
          />
        </View>

        {/* Results */}
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Results</Text>
          <Text style={styles.resultValue}>£{result.toFixed(2)}</Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, isSaving && { opacity: 0.7 }]}
            onPress={saveTaxEstimate}
            disabled={isSaving}
          >
            <Text style={styles.buttonText}>
              {isSaving ? "Saving..." : "Save Estimate"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionsButton}
            onPress={() => setShowSuggestions(true)}
          >
            <Text style={styles.buttonText}>Suggestions</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewHistoryButton}
            onPress={fetchPreviousEstimates}
          >
            <Text style={styles.buttonText}>View History</Text>
          </TouchableOpacity>
        </View>
      </View>
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
          <Ionicons name="construct-outline" style={styles.navBarIcon} />
          <Text
            style={styles.navText}
            onPress={() => navigation.navigate("screens/Tools")}
          >
            Tools
          </Text>
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
      {renderPreviousEstimatesModal()}
      {renderSuggestionsModal()}
    </>
  );
}
