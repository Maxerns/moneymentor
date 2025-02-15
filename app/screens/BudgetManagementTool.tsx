import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";
import { auth, db } from "@/firebase/config";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { PieChart } from "react-native-chart-kit";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

export type IconName = keyof typeof Ionicons.glyphMap;

export const categoryIcons: Record<string, IconName> = {
  Housing: "home",
  Utilities: "flash",
  Food: "restaurant",
  Transport: "car",
  Shopping: "cart",
  Entertainment: "game-controller",
};

const defaultCategories = [
  {
    name: "Housing",
    icon: categoryIcons.Housing,
    color: "#FF6B6B",
    limit: 0,
    spent: 0,
  },
  {
    name: "Utilities",
    icon: categoryIcons.Utilities,
    color: "#4ECDC4",
    limit: 0,
    spent: 0,
  },
  {
    name: "Food",
    icon: categoryIcons.Food,
    color: "#FFD93D",
    limit: 0,
    spent: 0,
  },
  {
    name: "Transport",
    icon: categoryIcons.Transport,
    color: "#6C5CE7",
    limit: 0,
    spent: 0,
  },
  {
    name: "Shopping",
    icon: categoryIcons.Shopping,
    color: "#A8E6CF",
    limit: 0,
    spent: 0,
  },
  {
    name: "Entertainment",
    icon: categoryIcons.Entertainment,
    color: "#FF8B94",
    limit: 0,
    spent: 0,
  },
];

interface Budget {
  id: string;
  userId: string;
  month: string;
  year: number;
  categories: BudgetCategory[];
  totalBudget: number;
  totalSpent: number;
}

interface BudgetCategory {
  id: string;
  name: string;
  limit: number;
  spent: number;
  color: string;
  icon: IconName;
  transactions: Transaction[];
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  type: "income" | "expense";
  category: string;
}

export default function BudgetManagementTool() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [newBudget, setNewBudget] = useState("");
  const [categoryOptionsVisible, setCategoryOptionsVisible] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      marginTop: Platform.OS === "ios" ? 40 : 0,
      backgroundColor: theme.surface,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    overviewContainer: {
      padding: 16,
      backgroundColor: theme.surface,
      marginBottom: 16,
      borderRadius: 8,
    },
    overviewTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    budgetStats: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    stat: {
      alignItems: "center",
    },
    statLabel: {
      fontSize: 14,
      color: theme.secondaryText,
      marginBottom: 4,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
    },
    categoriesContainer: {
      padding: 16,
    },
    categoryCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.surface,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryIcon: {
      marginRight: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
      marginBottom: 4,
    },
    progressBar: {
      height: 4,
      backgroundColor: theme.border,
      borderRadius: 2,
      marginBottom: 4,
    },
    progressFill: {
      height: "100%",
      borderRadius: 2,
    },
    categoryAmount: {
      fontSize: 12,
      color: theme.secondaryText,
    },
    transactionsContainer: {
      padding: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
    },
    transactionCard: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.surface,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    transactionInfo: {
      flex: 1,
    },
    transactionDescription: {
      fontSize: 16,
      color: theme.text,
      marginBottom: 4,
    },
    transactionCategory: {
      fontSize: 12,
      color: theme.secondaryText,
    },
    transactionAmount: {
      fontSize: 16,
      fontWeight: "500",
    },
    fab: {
      position: "absolute",
      bottom: 16,
      right: 16,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.primary,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: "90%",
      padding: 16,
      backgroundColor: theme.surface,
      borderRadius: 8,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 16,
      textAlign: "center",
    },
    input: {
      width: "100%",
      padding: 12,
      backgroundColor: theme.background,
      color: theme.text,
      borderRadius: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    modalButton: {
      flex: 1,
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    cancelButton: {
      backgroundColor: theme.error,
    },
    saveButton: {
      backgroundColor: theme.success,
    },
    buttonText: {
      color: theme.surface,
      textAlign: "center",
      fontWeight: "500",
    },
    transactionActions: {
      flexDirection: "row",
      alignItems: "center",
    },
    deleteIcon: {
      marginLeft: 12,
    },
    overviewHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    formGroup: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      marginBottom: 8,
    },
    picker: {
      height: 50,
      borderRadius: 8,
      marginBottom: 8,
    },
    typeSelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    typeButton: {
      flex: 1,
      padding: 12,
      borderWidth: 1,
      borderRadius: 8,
      marginHorizontal: 4,
      alignItems: "center",
    },
    selectedType: {
      backgroundColor: theme.background,
    },
    typeText: {
      fontSize: 16,
    },
    editOptionsContainer: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    editOptionsContent: {
      backgroundColor: theme.surface,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    editOptionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    editOptionText: {
      marginLeft: 15,
      fontSize: 16,
      color: theme.text,
    },
    categorySelector: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      backgroundColor: theme.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    categoryText: {
      fontSize: 16,
    },
    cancelButtonText: {
      color: theme.text,
      textAlign: "center",
      fontWeight: "bold",
    },
    noTransactions: {
      textAlign: "center",
      fontSize: 16,
      marginTop: 20,
    },
  });

  useEffect(() => {
    loadUserBudget();
  }, []);

  const loadUserBudget = async () => {
    if (!auth.currentUser) return;

    try {
      const currentMonth = getCurrentMonth();
      const budgetRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "budgets",
        currentMonth
      );
      const budgetDoc = await getDoc(budgetRef);

      if (budgetDoc.exists()) {
        const data = budgetDoc.data();
        setCategories(data.categories || defaultCategories);
        setTotalBudget(data.totalBudget || 0);
        setTotalSpent(data.totalSpent || 0);
        // Ensure transactions are sorted by date (most recent first)
        const sortedTransactions = (data.transactions || []).sort(
          (a: Transaction, b: Transaction) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(sortedTransactions);
      } else {
        // Initialize with empty transactions array
        const newBudget = {
          categories: defaultCategories,
          totalBudget: 0,
          totalSpent: 0,
          transactions: [],
          createdAt: new Date().toISOString(),
          month: currentMonth,
        };
        await setDoc(budgetRef, newBudget);
        setCategories(defaultCategories);
        setTotalBudget(0);
        setTotalSpent(0);
        setTransactions([]);
      }
    } catch (error) {
      console.error("Error loading budget:", error);
      Alert.alert("Error", "Failed to load budget data");
    }
  };

  const getCurrentMonth = () => {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
  };

  const updateBudget = async (amount: number) => {
    if (!auth.currentUser) return;

    try {
      const currentMonth = getCurrentMonth();
      const budgetRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "budgets",
        currentMonth
      );

      await updateDoc(budgetRef, {
        totalBudget: amount,
      });

      setTotalBudget(amount);
      setBudgetModalVisible(false);
      setNewBudget("");
    } catch (error) {
      console.error("Error updating budget:", error);
      Alert.alert("Error", "Failed to update budget");
    }
  };

  const saveTransaction = async () => {
    if (!selectedCategory || !amount || !description || !auth.currentUser)
      return;

    try {
      const currentMonth = getCurrentMonth();
      const budgetRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "budgets",
        currentMonth
      );

      const newTransaction: Transaction = {
        id: Date.now().toString(),
        amount: parseFloat(amount),
        description,
        date: new Date().toISOString(),
        type: "expense",
        category: selectedCategory,
      };

      const updatedCategories = categories.map((cat) => {
        if (cat.name === selectedCategory) {
          return {
            ...cat,
            spent: cat.spent + parseFloat(amount),
          };
        }
        return cat;
      });

      const newTotalSpent = totalSpent + parseFloat(amount);

      await updateDoc(budgetRef, {
        categories: updatedCategories,
        totalSpent: newTotalSpent,
        transactions: [...transactions, newTransaction],
      });

      setCategories(updatedCategories);
      setTotalSpent(newTotalSpent);
      setTransactions([...transactions, newTransaction]);
      setModalVisible(false);
      setAmount("");
      setDescription("");
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error saving transaction:", error);
      Alert.alert("Error", "Failed to save transaction");
    }
  };

  const deleteTransaction = async (transaction: Transaction) => {
    if (!auth.currentUser) return;

    try {
      const currentMonth = getCurrentMonth();
      const budgetRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "budgets",
        currentMonth
      );

      // Update category spent amount
      const updatedCategories = categories.map((cat) => {
        if (cat.name === transaction.category) {
          return {
            ...cat,
            spent: cat.spent - transaction.amount,
          };
        }
        return cat;
      });

      // Update total spent
      const newTotalSpent = totalSpent - transaction.amount;

      // Filter out deleted transaction
      const updatedTransactions = transactions.filter(
        (t) => t.id !== transaction.id
      );

      await updateDoc(budgetRef, {
        categories: updatedCategories,
        totalSpent: newTotalSpent,
        transactions: updatedTransactions,
      });

      setCategories(updatedCategories);
      setTotalSpent(newTotalSpent);
      setTransactions(updatedTransactions);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", "Failed to delete transaction");
    }
  };

  // Add edit transaction function
  const editTransaction = async (
    oldTransaction: Transaction,
    newAmount: number,
    newDescription: string
  ) => {
    if (!auth.currentUser) return;

    try {
      const currentMonth = getCurrentMonth();
      const budgetRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        "budgets",
        currentMonth
      );

      // Calculate amount difference
      const amountDiff = newAmount - oldTransaction.amount;

      // Update category spent amount
      const updatedCategories = categories.map((cat) => {
        if (cat.name === oldTransaction.category) {
          return {
            ...cat,
            spent: cat.spent + amountDiff,
          };
        }
        return cat;
      });

      // Update transaction in list
      const updatedTransactions = transactions.map((t) => {
        if (t.id === oldTransaction.id) {
          return {
            ...t,
            amount: newAmount,
            description: newDescription,
          };
        }
        return t;
      });

      const newTotalSpent = totalSpent + amountDiff;

      await updateDoc(budgetRef, {
        categories: updatedCategories,
        totalSpent: newTotalSpent,
        transactions: updatedTransactions,
      });

      setCategories(updatedCategories);
      setTotalSpent(newTotalSpent);
      setTransactions(updatedTransactions);
      setEditModalVisible(false);
      setEditingTransaction(null);
    } catch (error) {
      console.error("Error editing transaction:", error);
      Alert.alert("Error", "Failed to edit transaction");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Budget Manager
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Settings")}
        >
          <Ionicons name="settings-outline" size={32} color={theme.text} />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {/* Budget Overview */}
        <View style={styles.overviewContainer}>
          <View style={styles.overviewHeader}>
            <Text style={[styles.overviewTitle, { color: theme.text }]}>
              Monthly Overview
            </Text>
            <TouchableOpacity onPress={() => setBudgetModalVisible(true)}>
              <Ionicons name="create-outline" size={24} color={theme.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.budgetStats}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Budget
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                £{totalBudget}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Spent
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                £{totalSpent}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
                Remaining
              </Text>
              <Text style={[styles.statValue, { color: theme.text }]}>
                £{(totalBudget - totalSpent).toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Categories
          </Text>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryCard, { backgroundColor: theme.surface }]}
              onPress={() => {
                setSelectedCategory(category.name);
                setModalVisible(true);
              }}
            >
              <View style={styles.categoryIcon}>
                <Ionicons
                  name={category.icon as IconName}
                  size={24}
                  color={category.color}
                />
              </View>
              <View style={styles.categoryInfo}>
                <Text style={[styles.categoryName, { color: theme.text }]}>
                  {category.name}
                </Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        backgroundColor: category.color,
                        width: `${Math.min(
                          (category.spent / category.limit) * 100,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <Text
                  style={[
                    styles.categoryAmount,
                    { color: theme.secondaryText },
                  ]}
                >
                  £{category.spent} / £{category.limit}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Transactions
          </Text>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <View
                key={transaction.id}
                style={[
                  styles.transactionCard,
                  { backgroundColor: theme.surface },
                ]}
              >
                <TouchableOpacity
                  style={styles.transactionInfo}
                  onPress={() => {
                    setEditingTransaction(transaction);
                    setAmount(transaction.amount.toString());
                    setDescription(transaction.description);
                    setEditModalVisible(true);
                  }}
                >
                  <Text
                    style={[
                      styles.transactionDescription,
                      { color: theme.text },
                    ]}
                  >
                    {transaction.description}
                  </Text>
                  <Text
                    style={[
                      styles.transactionCategory,
                      { color: theme.secondaryText },
                    ]}
                  >
                    {transaction.category} •{" "}
                    {new Date(transaction.date).toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <View style={styles.transactionActions}>
                  <Text
                    style={[
                      styles.transactionAmount,
                      {
                        color:
                          transaction.type === "expense"
                            ? "#FF6B6B"
                            : "#4ECDC4",
                      },
                    ]}
                  >
                    {transaction.type === "expense" ? "-" : "+"}£
                    {transaction.amount}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert(
                        "Delete Transaction",
                        "Are you sure you want to delete this transaction?",
                        [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteTransaction(transaction),
                          },
                        ]
                      );
                    }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={theme.error}
                      style={styles.deleteIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <Text
              style={[styles.noTransactions, { color: theme.secondaryText }]}
            >
              No transactions yet
            </Text>
          )}
        </View>{" "}
      </ScrollView>

      {/* Add Transaction Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setModalVisible(false);
          setSelectedCategory(null);
          setAmount("");
          setDescription("");
        }}
      >
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Add Transaction
            </Text>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Category
              </Text>
              <TouchableOpacity
                style={[
                  styles.categorySelector,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => setCategoryOptionsVisible(true)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    {
                      color: selectedCategory
                        ? theme.text
                        : theme.secondaryText,
                    },
                  ]}
                >
                  {selectedCategory || "Select category"}
                </Text>
                <Ionicons name="chevron-down" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>Amount</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Enter amount"
                placeholderTextColor={theme.secondaryText}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                Description
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  },
                ]}
                placeholder="Enter description"
                placeholderTextColor={theme.secondaryText}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setAmount("");
                  setDescription("");
                  setSelectedCategory(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  if (!selectedCategory) {
                    Alert.alert("Error", "Please select a category");
                    return;
                  }
                  if (!amount || isNaN(parseFloat(amount))) {
                    Alert.alert("Error", "Please enter a valid amount");
                    return;
                  }
                  if (!description) {
                    Alert.alert("Error", "Please enter a description");
                    return;
                  }
                  saveTransaction();
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal
        visible={editModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Edit Transaction
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text },
              ]}
              placeholder="Amount"
              placeholderTextColor={theme.secondaryText}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, color: theme.text },
              ]}
              placeholder="Description"
              placeholderTextColor={theme.secondaryText}
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setEditModalVisible(false);
                  setEditingTransaction(null);
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  if (editingTransaction) {
                    editTransaction(
                      editingTransaction,
                      parseFloat(amount),
                      description
                    );
                  }
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Add Budget Modal */}
      <Modal
        visible={budgetModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setBudgetModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.modalTitle, { color: theme.text }]}>
              Set Monthly Budget
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.background,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Enter budget amount"
              placeholderTextColor={theme.secondaryText}
              keyboardType="decimal-pad"
              value={newBudget}
              onChangeText={setNewBudget}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setBudgetModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={() => {
                  const amount = parseFloat(newBudget);
                  if (isNaN(amount) || amount < 0) {
                    Alert.alert("Error", "Please enter a valid amount");
                    return;
                  }
                  updateBudget(amount);
                }}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Options Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryOptionsVisible}
        onRequestClose={() => setCategoryOptionsVisible(false)}
      >
        <View style={styles.editOptionsContainer}>
          <View style={styles.editOptionsContent}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.name}
                style={styles.editOptionButton}
                onPress={() => {
                  setSelectedCategory(category.name);
                  setCategoryOptionsVisible(false);
                  setModalVisible(true);
                }}
              >
                <Ionicons
                  name={category.icon as IconName}
                  size={24}
                  color={category.color}
                />
                <Text style={styles.editOptionText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.cancelButton, { marginTop: 10, padding: 15 }]}
              onPress={() => setCategoryOptionsVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* FAB for adding transaction */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.primary }]}
        onPress={() => setCategoryOptionsVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
