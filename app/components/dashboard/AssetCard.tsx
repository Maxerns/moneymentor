import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { formatMoney, formatPercent } from "./format";

interface AssetCardProps {
  symbol: string;
  name: string;
  price: number;
  changePct: number | null;
  currency: string;
  image?: string | null;
}

// A single crypto or equity row: identity on the left, price + 24h delta on the
// right. Delta is coloured and carries a direction caret.
export function AssetCard({
  symbol,
  name,
  price,
  changePct,
  currency,
  image,
}: AssetCardProps) {
  const { theme } = useTheme();
  const up = (changePct ?? 0) >= 0;
  const deltaColor =
    changePct == null ? theme.secondaryText : up ? theme.success : theme.error;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.left}>
        {image ? (
          <Image source={{ uri: image }} style={styles.icon} />
        ) : (
          <View style={[styles.badge, { backgroundColor: theme.budget }]}>
            <Text style={[styles.badgeText, { color: theme.primary }]}>
              {symbol.slice(0, 3)}
            </Text>
          </View>
        )}
        <View style={styles.identity}>
          <Text style={[styles.symbol, { color: theme.text }]}>{symbol}</Text>
          <Text
            style={[styles.name, { color: theme.secondaryText }]}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.price, { color: theme.text }]}>
          {formatMoney(price, currency)}
        </Text>
        <View style={styles.deltaRow}>
          {changePct != null ? (
            <Ionicons
              name={up ? "caret-up" : "caret-down"}
              size={12}
              color={deltaColor}
            />
          ) : null}
          <Text style={[styles.delta, { color: deltaColor }]}>
            {changePct == null ? "—" : formatPercent(changePct)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 10,
  },
  left: { flexDirection: "row", alignItems: "center", flex: 1 },
  icon: { width: 36, height: 36, borderRadius: 18, marginRight: 12 },
  badge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 12, fontWeight: "700" },
  identity: { flex: 1 },
  symbol: { fontSize: 15, fontWeight: "700" },
  name: { fontSize: 12, marginTop: 2 },
  right: { alignItems: "flex-end", marginLeft: 8 },
  price: { fontSize: 15, fontWeight: "700" },
  deltaRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  delta: { fontSize: 13, fontWeight: "600", marginLeft: 2 },
});
