import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";

export default function DashboardPage() {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

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

      {/* Budget Section */}
      <View style={styles.budgetContainer}>
        <Text style={styles.budgetTitle}>Budget</Text>
        <Text style={styles.budgetValue}>£2,040.48</Text>
        <View style={styles.chartPlaceholder}>
          <Text style={styles.chartText}>[Chart Placeholder]</Text>
        </View>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsContainer}>
        <View style={styles.card}>
          <MaterialIcons name="savings" size={24} color="#344950" />
          <Text style={styles.cardTitle}>Savings</Text>
          <Text style={styles.cardValue}>£433.29</Text>
        </View>
        <View style={styles.card}>
          <MaterialIcons name="credit-card" size={24} color="#344950" />
          <Text style={styles.cardTitle}>Debts</Text>
          <Text style={styles.cardValue}>£234.73</Text>
        </View>
      </View>
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
          <Ionicons name="construct-outline" style={styles.navBarIcon} onPress={() => navigation.navigate("screens/TaxEstimatorTool")}/>
          <Text style={styles.navText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="school-outline" style={styles.navBarIcon} onPress={() => navigation.navigate('screens/Learning')} />
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
});
