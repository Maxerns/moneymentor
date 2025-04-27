import React, { useState, useEffect } from "react";
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
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { useTheme } from "../context/ThemeContext";
import { LineChartComponent } from "../components/charts/LineChartComponent";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { BottomNavBar } from "../components/layout/BottomNavBar";
import { FormInput } from "../components/forms/FormInput";

interface FinancialValue {
  value: number;
  isSet: boolean;
}

interface BudgetHistory {
  amount: number;
  date: string;
}

export default function DashboardPage({
  navigation,
}: {
  navigation: NavigationProp<RootStackParamList>;
}) {
  const [budgetHistory, setBudgetHistory] = useState<BudgetHistory[]>([]);
  const [isGuest, setIsGuest] = useState(true);
  const { theme } = useTheme();
  const [userId, setUserId] = useState<string | null>(null);

  const [budget, setBudget] = useState<FinancialValue>({
    value: 0,
    isSet: false,
  });
  const [savings, setSavings] = useState<FinancialValue>({
    value: 0,
    isSet: false,
  });
  const [debt, setDebt] = useState<FinancialValue>({
    value: 0,
    isSet: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState<
    "budget" | "savings" | "debt" | null
  >(null);
  const [tempValue, setTempValue] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setIsGuest(false);
        loadUserData(user.uid);
      } else {
        setIsGuest(true);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUserData = async (uid: string) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("Loaded data:", data);

        if (data.budget) {
          setBudget({
            value: data.budget.value,
            isSet: data.budget.isSet,
          });
        }

        if (data.savings) {
          setSavings({
            value: data.savings.value,
            isSet: data.savings.isSet,
          });
        }

        if (data.debt) {
          setDebt({
            value: data.debt.value,
            isSet: data.debt.isSet,
          });
        }
        if (data.budgetHistory) {
          setBudgetHistory(data.budgetHistory);
        }
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const saveUserData = async (
    field: "budget" | "savings" | "debt",
    value: number
  ) => {
    if (!userId) return;

    try {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      let updateData = {};
      if (docSnap.exists()) {
        updateData = docSnap.data();
      }

      updateData = {
        ...updateData,
        [field]: {
          value: value,
          isSet: true,
        },
      };

      await setDoc(docRef, updateData);
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

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

  const handleSave = async () => {
    const numValue = parseFloat(tempValue);
    if (isNaN(numValue)) {
      return;
    }

    try {
      if (activeField === "budget") {
        const newHistoryEntry = {
          amount: numValue,
          date: new Date().toISOString().split("T")[0],
        };

        const updatedHistory = [...budgetHistory, newHistoryEntry];
        setBudgetHistory(updatedHistory);

        const docRef = doc(db, "users", userId!);
        await setDoc(
          docRef,
          {
            budget: { value: numValue, isSet: true },
            budgetHistory: updatedHistory,
          },
          { merge: true }
        );
      }
      switch (activeField) {
        case "budget":
          setBudget({ value: numValue, isSet: true });
          await saveUserData("budget", numValue);
          break;
        case "savings":
          setSavings({ value: numValue, isSet: true });
          await saveUserData("savings", numValue);
          break;
        case "debt":
          setDebt({ value: numValue, isSet: true });
          await saveUserData("debt", numValue);
          break;
      }
      setModalVisible(false);
      setTempValue("");
      setActiveField(null);
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  const getMonthName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("default", { month: "short" });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScreenHeader />

      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Card style={styles.budgetContainer}>
          <Text style={[styles.budgetTitle, { color: theme.text }]}>
            Budget
          </Text>
          <View style={styles.valueContainer}>
            {budget.isSet ? (
              <>
                <Text style={[styles.budgetValue, { color: theme.text }]}>
                  £{budget.value.toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => handleEdit("budget")}>
                  <MaterialIcons name="edit" size={24} color={theme.icon} />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[styles.budgetValue, { color: theme.text }]}>
                  £0.00
                </Text>
                <TouchableOpacity onPress={() => handleEdit("budget")}>
                  <MaterialIcons
                    name="add-circle"
                    size={24}
                    color={theme.icon}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          {!isGuest && budgetHistory.length > 0 && (
            <View
              style={[
                styles.chartContainer,
                { backgroundColor: theme.background },
              ]}
            >
              <LineChartComponent
                data={{
                  labels: budgetHistory.map((entry) =>
                    getMonthName(entry.date)
                  ),
                  datasets: [
                    {
                      data: budgetHistory.map((entry) => entry.amount),
                    },
                  ],
                }}
                height={200}
                withDots={false}
                withInnerLines={false}
                withOuterLines={false}
              />
            </View>
          )}
        </Card>

        <View style={styles.cardsContainer}>
          <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Savings
            </Text>
            <View style={styles.valueContainer}>
              {savings.isSet ? (
                <>
                  <Text style={[styles.cardValue, { color: theme.text }]}>
                    £{savings.value.toFixed(2)}
                  </Text>
                  <TouchableOpacity onPress={() => handleEdit("savings")}>
                    <MaterialIcons name="edit" size={24} color={theme.icon} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.cardValue, { color: theme.text }]}>
                    £0.00
                  </Text>
                  <TouchableOpacity onPress={() => handleEdit("savings")}>
                    <MaterialIcons
                      name="add-circle"
                      size={24}
                      color={theme.icon}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Card>

          <Card style={styles.card}>
            <Text style={[styles.cardTitle, { color: theme.text }]}>Debt</Text>
            <View style={styles.valueContainer}>
              {debt.isSet ? (
                <>
                  <Text style={[styles.cardValue, { color: theme.text }]}>
                    £{debt.value.toFixed(2)}
                  </Text>
                  <TouchableOpacity onPress={() => handleEdit("debt")}>
                    <MaterialIcons name="edit" size={24} color={theme.icon} />
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={[styles.cardValue, { color: theme.text }]}>
                    £0.00
                  </Text>
                  <TouchableOpacity onPress={() => handleEdit("debt")}>
                    <MaterialIcons
                      name="add-circle"
                      size={24}
                      color={theme.icon}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </Card>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Learning")}
          style={styles.learningCardContainer}
        >
          <Card style={styles.learningCard}>
            <MaterialIcons name="create" size={24} color={theme.icon} />
            <Text style={[styles.cardTitle, { color: theme.text }]}>
              Learning
            </Text>
          </Card>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              {activeField === "budget"
                ? "Update Budget"
                : activeField === "savings"
                ? "Update Savings"
                : "Update Debt"}
            </Text>

            <FormInput
              keyboardType="decimal-pad"
              value={tempValue}
              onChangeText={setTempValue}
              placeholder="Enter amount"
            />

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              />
              <Button
                title="Save"
                onPress={handleSave}
                style={styles.saveButton}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  budgetContainer: {
    paddingVertical: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  budgetTitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  budgetValue: {
    fontSize: 32,
    fontWeight: "bold",
    marginVertical: 10,
  },
  chartContainer: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginTop: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginVertical: 5,
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "bold",
    opacity: 0.7,
  },
  learningCardContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  learningCard: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
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
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  saveButton: {
    width: "48%",
  },
  cancelButton: {
    width: "48%",
  },
});
