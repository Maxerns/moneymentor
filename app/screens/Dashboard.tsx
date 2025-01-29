import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";

interface FinancialValue {
  value: number | null;
  isSet: boolean;
}

export default function DashboardPage() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // State for financial values
  const [budget, setBudget] = useState<FinancialValue>({
    value: null,
    isSet: false,
  });
  const [savings, setSavings] = useState<FinancialValue>({
    value: null,
    isSet: false,
  });
  const [debt, setDebt] = useState<FinancialValue>({
    value: null,
    isSet: false,
  });

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<
    "budget" | "savings" | "debt" | null
  >(null);
  const [tempValue, setTempValue] = useState("");

  const handleEdit = (field: "budget" | "savings" | "debt") => {
    setActiveField(field);
    setTempValue(
      field === "budget"
        ? budget.value?.toString() || ""
        : field === "savings"
        ? savings.value?.toString() || ""
        : debt.value?.toString() || ""
    );
    setModalVisible(true);
  };

  const handleSave = () => {
    const numValue = parseFloat(tempValue);
    if (isNaN(numValue)) return;

    switch (activeField) {
      case "budget":
        setBudget({ value: numValue, isSet: true });
        break;
      case "savings":
        setSavings({ value: numValue, isSet: true });
        break;
      case "debt":
        setDebt({ value: numValue, isSet: true });
        break;
    }
    setModalVisible(false);
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
          <Ionicons name="settings-outline" size={36} color="#344950" />
        </TouchableOpacity>
      </View>

      {/* Budget Section */}
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetTitle}>Budget</Text>
        <View style={styles.valueContainer}>
          {budget.isSet ? (
            <>
              <Text style={styles.budgetValue}>
                £{budget.value?.toFixed(2)}
              </Text>
              <TouchableOpacity onPress={() => handleEdit("budget")}>
                <MaterialIcons name="edit" size={24} color="#344950" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => handleEdit("budget")}>
              <MaterialIcons name="add-circle" size={24} color="#344950" />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>[Chart Placeholder]</Text>
        </View>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <MaterialIcons name="savings" size={24} color="#344950" />
          <Text style={styles.cardTitle}>Savings</Text>
          <View style={styles.valueContainer}>
            {savings.isSet ? (
              <>
                <Text style={styles.cardValue}>
                  £{savings.value?.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => handleEdit("savings")}>
                  <MaterialIcons name="edit" size={20} color="#344950" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => handleEdit("savings")}>
                <MaterialIcons name="add-circle" size={24} color="#344950" />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View style={styles.card}>
          <MaterialIcons name="credit-card" size={24} color="#344950" />
          <Text style={styles.cardTitle}>Debts</Text>
          <View style={styles.valueContainer}>
            {debt.isSet ? (
              <>
                <Text style={styles.cardValue}>£{debt.value?.toFixed(2)}</Text>
                <TouchableOpacity onPress={() => handleEdit("debt")}>
                  <MaterialIcons name="edit" size={20} color="#344950" />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity onPress={() => handleEdit("debt")}>
                <MaterialIcons name="add-circle" size={24} color="#344950" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {activeField
                ? `Enter ${
                    activeField.charAt(0).toUpperCase() + activeField.slice(1)
                  } Amount`
                : ""}
            </Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="decimal-pad"
              value={tempValue}
              onChangeText={setTempValue}
              placeholder="Enter amount"
              placeholderTextColor="#B0BEC5"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSave}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Learning Card */}
      <View style={styles.learningCardContainer}>
        <View style={styles.learningCard}>
          <MaterialIcons name="create" size={24} color="#344950" />
          <Text style={styles.cardTitle}>Learning</Text>
        </View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity>
          <Ionicons name="home-outline" style={styles.navBarIcon} />
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
    alignItems: "center",
    marginBottom: 0,
  },
  budgetContainer: {
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: 500,
    color: "#344950",
  },
  budgetValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#344950",
    marginVertical: 10,
  },
  chartPlaceholder: {
    width: "100%",
    height: 100,
    backgroundColor: "#B3E5FC",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  chartText: {
    color: "#4F4F4F",
    fontSize: 14,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 25,
    margin: 50,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  learningCardContainer: {
    alignItems: "center",
  },
  learningCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 500,
    color: "#344950",
    marginVertical: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#344950",
    opacity: 0.7,
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
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    width: "40%",
  },
  saveButton: {
    backgroundColor: "#00ADB5",
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
  },
  modalButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
});
