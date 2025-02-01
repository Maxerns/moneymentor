import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Switch,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";

export default function TaxEstimatorTool() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [incomeType, setIncomeType] = useState<string>("Salary");
  const [incomeAmount, setIncomeAmount] = useState<string>("0");
  const [deductions, setDeductions] = useState<string>("");
  const [taxCredits, setTaxCredits] = useState<boolean>(false);
  const [result, setResult] = useState<number>(0);
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
      justifyContent: "space-around",
    },
    saveButton: {
      backgroundColor: theme.success,
      padding: 10,
      borderRadius: 5,
    },
    suggestionsButton: {
      backgroundColor: theme.primary,
      padding: 10,
      borderRadius: 5,
    },
    buttonText: {
      color: theme.surface,
      fontSize: 16,
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
  });

  const calculateTax = () => {
    // Mock calculation
    const income = parseFloat(incomeAmount) || 0;
    const deductionAmount = parseFloat(deductions) || 0;
    const taxRate = 0.2; // Example: 20% tax rate

    let taxableIncome = income - deductionAmount;
    if (taxCredits) {
      taxableIncome -= 1000; // Example: flat tax credit
    }
    const tax = taxableIncome * taxRate;
    setResult(tax > 0 ? tax : 0);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="person-circle-outline" size={36} color="#344950" onPress={() => navigation.navigate("screens/Profile")} />
          </TouchableOpacity>
          <Image
            source={require("../../assets/images/MoneyMentorLogoGradient.png")}
            style={styles.logo}
          />
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={36} color="#344950" onPress={() => navigation.navigate("screens/Settings")} />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Tax Estimator Tool</Text>
        <Text style={styles.subtitle}>
          Get an estimate of your annual tax obligations and discover ways to
          save
        </Text>

        {/* Income Details */}
        <Text style={styles.sectionTitle}>Income Details</Text>
        <Picker
          selectedValue={incomeType}
          style={styles.picker}
          onValueChange={(itemValue: string) => setIncomeType(itemValue)}
        >
          <Picker.Item label="Salary" value="Salary" />
          <Picker.Item label="Freelance" value="Freelance" />
          <Picker.Item label="Investment" value="Investment" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Income Amount"
          value={incomeAmount}
          onChangeText={(text) => setIncomeAmount(text)}
        />

        {/* Deductions and Tax Credits */}
        <Text style={styles.sectionTitle}>Deductions and Tax Credits</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Retirement Contributions"
          value={deductions}
          onChangeText={(text) => setDeductions(text)}
        />
        <View style={styles.switchContainer}>
          <Text>Tax Credits</Text>
          <Switch
            value={taxCredits}
            onValueChange={(value) => setTaxCredits(value)}
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
            style={styles.saveButton}
            onPress={() => alert("Estimate Saved!")}
          >
            <Text style={styles.buttonText}>Save Estimate</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.suggestionsButton}
            onPress={() => alert("Viewing Suggestions!")}
          >
            <Text style={styles.buttonText}>Suggestions</Text>
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
            onPress={() => navigation.navigate("screens/TaxEstimatorTool")}
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
    </>
  );
}
