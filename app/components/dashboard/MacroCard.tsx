import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import type { MacroIndicator } from "../../types/dashboard";
import { formatNumber, macroLabel, prettyPeriod } from "./format";
import { Sparkline } from "./Sparkline";

interface MacroCardProps {
  indicator: MacroIndicator;
}

const CARD_WIDTH = 168;

// A compact tile for one macro series: label, headline value, sparkline of its
// recent history, and the period the value is for. Sits in a horizontal rail.
export function MacroCard({ indicator }: MacroCardProps) {
  const { theme } = useTheme();
  const values = indicator.history.map((point) => point.value);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
          width: CARD_WIDTH,
        },
      ]}
    >
      <Text
        style={[styles.label, { color: theme.secondaryText }]}
        numberOfLines={1}
      >
        {macroLabel(indicator.id, indicator.title)}
      </Text>
      <Text style={[styles.value, { color: theme.text }]}>
        {formatNumber(indicator.latest.value, 2)}
        <Text style={styles.unit}>{indicator.unit}</Text>
      </Text>
      <View style={styles.spark}>
        <Sparkline values={values} color={theme.primary} width={CARD_WIDTH - 28} />
      </View>
      <Text style={[styles.period, { color: theme.secondaryText }]}>
        {prettyPeriod(indicator.latest.period)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 12,
  },
  label: { fontSize: 12, fontWeight: "600" },
  value: { fontSize: 26, fontWeight: "800", marginTop: 6 },
  unit: { fontSize: 15, fontWeight: "700" },
  spark: { height: 44, marginTop: 8, justifyContent: "center" },
  period: { fontSize: 11, marginTop: 6 },
});
