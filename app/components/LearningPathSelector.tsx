import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { learningPaths } from '../services/learningService';
import { useTheme } from '@/app/context/ThemeContext';

export const LearningPathSelector = ({ 
  selectedPath,
  onSelectPath 
}: {
  selectedPath: string;
  onSelectPath: (pathId: string) => void;
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {learningPaths.map(path => (
        <TouchableOpacity
          key={path.id}
          style={[
            styles.pathCard,
            { backgroundColor: theme.surface },
            selectedPath === path.id && styles.selectedCard
          ]}
          onPress={() => onSelectPath(path.id)}
        >
          <Text style={[styles.pathName, { color: theme.text }]}>{path.name}</Text>
          <Text style={[styles.pathDescription, { color: theme.secondaryText }]}>
            {path.description}
          </Text>
          <Text style={[styles.difficulty, { color: theme.primary }]}>
            {path.difficulty}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  pathCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#00ADB5',
  },
  pathName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pathDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  difficulty: {
    fontSize: 12,
    fontWeight: '500',
  }
});