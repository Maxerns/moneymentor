import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  const { theme } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity onPress={onAction} hitSlop={8}>
          <Text style={[styles.action, { color: theme.primary }]}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  action: {
    fontSize: 14,
    fontWeight: "600",
  },
});
