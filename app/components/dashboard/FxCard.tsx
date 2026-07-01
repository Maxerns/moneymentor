import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import type { FxSnapshot } from "../../types/dashboard";
import { currencySymbol, formatNumber } from "./format";

interface FxCardProps {
  fx: FxSnapshot;
}

export function FxCard({ fx }: FxCardProps) {
  const { theme } = useTheme();
  const entries = Object.entries(fx.rates);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.header, { color: theme.secondaryText }]}>
        1 {fx.base} =
      </Text>
      {entries.map(([symbol, rate]) => (
        <View key={symbol} style={styles.row}>
          <Text style={[styles.symbol, { color: theme.text }]}>{symbol}</Text>
          <Text style={[styles.rate, { color: theme.text }]}>
            {currencySymbol(symbol)}
            {formatNumber(rate, rate >= 100 ? 2 : 4)}
          </Text>
        </View>
      ))}
      <Text style={[styles.footer, { color: theme.secondaryText }]}>
        ECB reference · {fx.date}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  header: { fontSize: 13, fontWeight: "600", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  symbol: { fontSize: 15, fontWeight: "700" },
  rate: { fontSize: 15, fontWeight: "600" },
  footer: { fontSize: 11, marginTop: 10 },
});
