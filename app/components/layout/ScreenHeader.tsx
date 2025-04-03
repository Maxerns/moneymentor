import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../context/ThemeContext";

interface ScreenHeaderProps {
  title?: string;
  showBackButton?: boolean;
  showLogo?: boolean;
  showProfile?: boolean;
  showSettings?: boolean;
}

export const ScreenHeader = ({
  title,
  showBackButton = false,
  showLogo = true,
  showProfile = true,
  showSettings = true,
}: ScreenHeaderProps) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  return (
    <View style={[styles.header, { marginTop: 40 }]}>
      {showBackButton ? (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={36} color={theme.text} />
        </TouchableOpacity>
      ) : showProfile ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Profile" as never)}
        >
          <Ionicons name="person-circle-outline" size={36} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}

      {showLogo ? (
        <Image
          source={require("../../../assets/images/MoneyMentorLogoGradient.png")}
          style={styles.logo}
        />
      ) : title ? (
        <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      ) : (
        <View />
      )}

      {showSettings ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Settings" as never)}
        >
          <Ionicons name="settings-outline" size={36} color={theme.text} />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 36 }} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 75,
    height: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
