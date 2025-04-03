import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";

export const BottomNavBar = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.navBar, { backgroundColor: theme.surface }]}>
      <TouchableOpacity
        onPress={() => navigation.navigate("screens/Dashboard" as never)}
      >
        <Ionicons
          name="home-outline"
          style={[styles.navBarIcon, { color: theme.text }]}
        />
        <Text style={[styles.navText, { color: theme.text }]}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("screens/Tools" as never)}
      >
        <Ionicons
          name="construct-outline"
          style={[styles.navBarIcon, { color: theme.text }]}
        />
        <Text style={[styles.navText, { color: theme.text }]}>Tools</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("screens/Analytics" as never)}
      >
        <Ionicons
          name="analytics-outline"
          style={[styles.navBarIcon, { color: theme.text }]}
        />
        <Text style={[styles.navText, { color: theme.text }]}>Analysis</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("screens/Learning" as never)}
      >
        <Ionicons
          name="school-outline"
          style={[styles.navBarIcon, { color: theme.text }]}
        />
        <Text style={[styles.navText, { color: theme.text }]}>Learning</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: "absolute",
    bottom: 0,
    width: "115%",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 40,
  },
  navBarIcon: {
    fontSize: 30,
    alignSelf: "center",
  },
  navText: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 5,
  },
});
