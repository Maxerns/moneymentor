import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { LearningPathSelector } from "../components/LearningPathSelector";
import { learningService } from "../services/learningService";
import { useTheme } from "../context/ThemeContext";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "@/.expo/types/types";

export default function LearningPath() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [selectedPath, setSelectedPath] = useState<string>("");
  const { theme } = useTheme();

  useEffect(() => {
    const loadUserPath = async () => {
      const progress = await learningService.getUserProgress();
      if (progress?.selectedPath) {
        setSelectedPath(progress.selectedPath);
      }
    };
    loadUserPath();
  }, []);

  const handlePathSelect = async (pathId: string) => {
    try {
      setSelectedPath(pathId);
      await learningService.setLearningPath(pathId);

      // Navigate back to Learning screen after successful path selection
      navigation.navigate("screens/Learning");
    } catch (error) {
      console.error("Error selecting path:", error);
      Alert.alert("Error", "Failed to set learning path. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>
        Choose Your Learning Path
      </Text>
      <LearningPathSelector
        selectedPath={selectedPath}
        onSelectPath={handlePathSelect}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
});
