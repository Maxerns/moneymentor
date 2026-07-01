import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../../../firebase/config";
import { useTheme } from "../../context/ThemeContext";
import { getCashAmount, saveCashAmount } from "../../services/mentorService";
import { formatMoney } from "./format";

interface MentorCardProps {
  cpiRate: number | null; // headline CPI %, e.g. 2.8
  bankRate: number | null; // BoE Bank Rate %, e.g. 3.75
}

// The "mentor moment": takes a cash figure the user enters and, using the live
// CPI and Bank Rate, shows what inflation does to its purchasing power.
export function MentorCard({ cpiRate, bankRate }: MentorCardProps) {
  const { theme } = useTheme();
  const [cashAmount, setCashAmount] = useState<number | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getCashAmount(uid)
      .then((value) => {
        if (value != null) setCashAmount(value);
      })
      .catch(() => undefined);
  }, []);

  const startEdit = () => {
    setDraft(cashAmount != null ? String(cashAmount) : "");
    setEditing(true);
  };

  const commit = () => {
    const value = parseFloat(draft.replace(/[^0-9.]/g, ""));
    if (Number.isFinite(value) && value >= 0) {
      setCashAmount(value);
      const uid = auth.currentUser?.uid;
      if (uid) saveCashAmount(uid, value).catch(() => undefined);
    }
    setEditing(false);
  };

  const cpi = cpiRate ?? 0;
  const lostPerYear = (cashAmount ?? 0) * (cpi / 100);
  const realReturn = bankRate != null ? bankRate - cpi : null;
  const buyingPower = (years: number) =>
    (cashAmount ?? 0) / Math.pow(1 + cpi / 100, years);

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="shield-outline" size={18} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>
            Your money in real terms
          </Text>
        </View>
        {cashAmount != null && !editing ? (
          <TouchableOpacity onPress={startEdit} hitSlop={8}>
            <Ionicons name="pencil" size={16} color={theme.primary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {editing ? (
        <View style={styles.editRow}>
          <View
            style={[
              styles.inputWrap,
              { borderColor: theme.border, backgroundColor: theme.surface },
            ]}
          >
            <Text style={[styles.currency, { color: theme.secondaryText }]}>£</Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              keyboardType="numeric"
              autoFocus
              placeholder="10000"
              placeholderTextColor={theme.secondaryText}
              onSubmitEditing={commit}
              style={[styles.input, { color: theme.text }]}
            />
          </View>
          <TouchableOpacity
            onPress={commit}
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : cashAmount == null ? (
        <TouchableOpacity onPress={startEdit} style={styles.prompt}>
          <Text style={[styles.promptText, { color: theme.secondaryText }]}>
            Add your cash savings to see how inflation is affecting them.
          </Text>
          <View style={[styles.addBtn, { backgroundColor: theme.primary }]}>
            <Text style={styles.addText}>Add amount</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <>
          <TouchableOpacity onPress={startEdit}>
            <Text style={[styles.amount, { color: theme.text }]}>
              {formatMoney(cashAmount, "GBP")}
              <Text style={[styles.amountLabel, { color: theme.secondaryText }]}>
                {"  "}held as cash
              </Text>
            </Text>
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name="trending-down" size={16} color={theme.error} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>
                Inflation {cpi}%
              </Text>
            </View>
            <Text style={[styles.rowValue, { color: theme.error }]}>
              −{formatMoney(lostPerYear, "GBP")}/yr
            </Text>
          </View>

          {realReturn != null ? (
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <Ionicons
                  name={realReturn >= 0 ? "trending-up" : "trending-down"}
                  size={16}
                  color={realReturn >= 0 ? theme.success : theme.error}
                />
                <Text style={[styles.rowLabel, { color: theme.text }]}>
                  Bank Rate {bankRate}%
                </Text>
              </View>
              <Text
                style={[
                  styles.rowValue,
                  { color: realReturn >= 0 ? theme.success : theme.error },
                ]}
              >
                real {realReturn >= 0 ? "+" : ""}
                {realReturn.toFixed(2)}%
              </Text>
            </View>
          ) : null}

          <Text style={[styles.projection, { color: theme.secondaryText }]}>
            Buying power: 5y ~{formatMoney(buyingPower(5), "GBP")} · 10y ~
            {formatMoney(buyingPower(10), "GBP")}
          </Text>

          <Text style={[styles.takeaway, { color: theme.secondaryText }]}>
            {realReturn != null && realReturn >= 0
              ? "Savings earning the base rate just outpace inflation — cash left idle still loses value."
              : "Even at the base rate, holding cash loses purchasing power. Consider tax-efficient savings or investing."}
          </Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  title: { fontSize: 15, fontWeight: "700" },
  prompt: { marginTop: 12, alignItems: "flex-start", gap: 12 },
  promptText: { fontSize: 14, lineHeight: 20 },
  addBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  addText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  editRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 14 },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  currency: { fontSize: 16, marginRight: 4 },
  input: { flex: 1, fontSize: 16, paddingVertical: 10 },
  saveBtn: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12 },
  saveText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  amount: { fontSize: 28, fontWeight: "800", marginTop: 12 },
  amountLabel: { fontSize: 13, fontWeight: "500" },
  divider: { height: 1, marginVertical: 14 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowLabel: { fontSize: 14, fontWeight: "600" },
  rowValue: { fontSize: 14, fontWeight: "700" },
  projection: { fontSize: 12, marginTop: 2 },
  takeaway: { fontSize: 12, lineHeight: 18, marginTop: 10, fontStyle: "italic" },
});
