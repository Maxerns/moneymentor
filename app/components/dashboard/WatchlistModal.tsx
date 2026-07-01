import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "../../context/ThemeContext";
import type { Watchlist } from "../../services/watchlistService";

interface WatchlistModalProps {
  visible: boolean;
  watchlist: Watchlist;
  onClose: () => void;
  onSave: (next: Watchlist) => void;
}

// An editable list of chips plus an add field. `transform` normalizes input
// (lower-case ids, upper-case tickers); duplicates and blanks are ignored.
function ChipGroup({
  label,
  items,
  placeholder,
  transform,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  placeholder: string;
  transform: (raw: string) => string;
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  const { theme } = useTheme();
  const [text, setText] = useState("");

  const commit = () => {
    const value = transform(text.trim());
    if (value) onAdd(value);
    setText("");
  };

  return (
    <View style={styles.group}>
      <Text style={[styles.groupLabel, { color: theme.text }]}>{label}</Text>
      <View style={styles.chips}>
        {items.map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.chip, { backgroundColor: theme.budget }]}
            onPress={() => onRemove(item)}
          >
            <Text style={[styles.chipText, { color: theme.primary }]}>
              {item}
            </Text>
            <Ionicons name="close" size={14} color={theme.primary} />
          </TouchableOpacity>
        ))}
        {items.length === 0 ? (
          <Text style={[styles.empty, { color: theme.secondaryText }]}>
            None yet
          </Text>
        ) : null}
      </View>
      <View style={styles.addRow}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          placeholderTextColor={theme.secondaryText}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={commit}
          returnKeyType="done"
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />
        <TouchableOpacity
          onPress={commit}
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function WatchlistModal({
  visible,
  watchlist,
  onClose,
  onSave,
}: WatchlistModalProps) {
  const { theme } = useTheme();
  const [draft, setDraft] = useState<Watchlist>(watchlist);

  // Reset the draft to the latest saved list each time the sheet opens.
  useEffect(() => {
    if (visible) setDraft(watchlist);
  }, [visible, watchlist]);

  const addUnique = (list: string[], value: string) =>
    list.includes(value) ? list : [...list, value];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.backdrop, { backgroundColor: theme.modalBackground }]}>
        <View style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: theme.text }]}>
              Edit watchlist
            </Text>
            <TouchableOpacity onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={26} color={theme.text} />
            </TouchableOpacity>
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            <ChipGroup
              label="Crypto"
              items={draft.crypto}
              placeholder="CoinGecko id, e.g. solana"
              transform={(raw) => raw.toLowerCase()}
              onAdd={(v) =>
                setDraft((d) => ({ ...d, crypto: addUnique(d.crypto, v) }))
              }
              onRemove={(v) =>
                setDraft((d) => ({
                  ...d,
                  crypto: d.crypto.filter((x) => x !== v),
                }))
              }
            />
            <ChipGroup
              label="Stocks"
              items={draft.stocks}
              placeholder="Ticker, e.g. TSLA"
              transform={(raw) => raw.toUpperCase()}
              onAdd={(v) =>
                setDraft((d) => ({ ...d, stocks: addUnique(d.stocks, v) }))
              }
              onRemove={(v) =>
                setDraft((d) => ({
                  ...d,
                  stocks: d.stocks.filter((x) => x !== v),
                }))
              }
            />
            <ChipGroup
              label={`Currencies (per ${draft.fx.base})`}
              items={draft.fx.symbols}
              placeholder="Code, e.g. CAD"
              transform={(raw) => raw.toUpperCase()}
              onAdd={(v) =>
                setDraft((d) => ({
                  ...d,
                  fx: { ...d.fx, symbols: addUnique(d.fx.symbols, v) },
                }))
              }
              onRemove={(v) =>
                setDraft((d) => ({
                  ...d,
                  fx: { ...d.fx, symbols: d.fx.symbols.filter((x) => x !== v) },
                }))
              }
            />
          </ScrollView>

          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: theme.primary }]}
            onPress={() => onSave(draft)}
          >
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end" },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: "85%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sheetTitle: { fontSize: 20, fontWeight: "700" },
  group: { marginTop: 18 },
  groupLabel: { fontSize: 15, fontWeight: "700", marginBottom: 10 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  chipText: { fontSize: 14, fontWeight: "600" },
  empty: { fontSize: 13, fontStyle: "italic" },
  addRow: { flexDirection: "row", marginTop: 12, gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
  },
  addBtn: {
    paddingHorizontal: 18,
    justifyContent: "center",
    borderRadius: 12,
  },
  addBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  saveBtn: {
    marginTop: 16,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
});
