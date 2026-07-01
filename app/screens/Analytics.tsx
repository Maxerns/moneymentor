import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AssetCard } from "../components/dashboard/AssetCard";
import { formatTime } from "../components/dashboard/format";
import { FxCard } from "../components/dashboard/FxCard";
import { MacroCard } from "../components/dashboard/MacroCard";
import { MentorCard } from "../components/dashboard/MentorCard";
import { SectionHeader } from "../components/dashboard/SectionHeader";
import { WatchlistModal } from "../components/dashboard/WatchlistModal";
import { BottomNavBar } from "../components/layout/BottomNavBar";
import { ScreenHeader } from "../components/layout/ScreenHeader";
import { useTheme } from "../context/ThemeContext";
import { useDashboard } from "../hooks/useDashboard";

// Dashed placeholder used wherever a section has nothing to show yet.
function EmptyHint({ text }: { text: string }) {
  const { theme } = useTheme();
  return (
    <View
      style={[
        styles.emptyHint,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.emptyHintText, { color: theme.secondaryText }]}>
        {text}
      </Text>
    </View>
  );
}

// The financial-pulse dashboard: a personalized watchlist (crypto, stocks, FX)
// plus a shared UK macro strip, all served by the edge Worker.
export default function Analytics() {
  const { theme } = useTheme();
  const {
    watchlist,
    data,
    loading,
    refreshing,
    error,
    refresh,
    updateWatchlist,
  } = useDashboard();
  const [editing, setEditing] = useState(false);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safePadded, { backgroundColor: theme.background }]}>
        <ScreenHeader title="Markets" showBackButton showLogo={false} />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.muted, { color: theme.secondaryText }]}>
            Loading market data…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !data) {
    const isConfig = error.includes("EXPO_PUBLIC_WORKER_URL");
    return (
      <SafeAreaView style={[styles.safePadded, { backgroundColor: theme.background }]}>
        <ScreenHeader title="Markets" showBackButton showLogo={false} />
        <View style={styles.center}>
          <Ionicons
            name="cloud-offline-outline"
            size={48}
            color={theme.secondaryText}
          />
          <Text style={[styles.errorTitle, { color: theme.text }]}>
            Couldn&apos;t load the dashboard
          </Text>
          <Text style={[styles.muted, styles.centerText, { color: theme.secondaryText }]}>
            {isConfig
              ? "The market data service isn't configured yet — set EXPO_PUBLIC_WORKER_URL to your Worker's URL."
              : error}
          </Text>
          <TouchableOpacity
            style={[styles.retry, { backgroundColor: theme.primary }]}
            onPress={refresh}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const crypto = data?.crypto ?? [];
  const markets = data?.markets;
  const macro = data?.macro ?? [];
  const fx = data?.fx;
  const partialErrors = data?.errors ?? [];
  const cpiRate = macro.find((m) => m.id === "uk-cpi")?.latest.value ?? null;
  const bankRate =
    macro.find((m) => m.id === "uk-base-rate")?.latest.value ?? null;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.primary}
          />
        }
      >
        <ScreenHeader title="Markets" showBackButton showLogo={false} />

        <View style={styles.metaRow}>
          <Text style={[styles.muted, { color: theme.secondaryText }]}>
            {data ? `Updated ${formatTime(data.generatedAt)}` : ""}
          </Text>
          <TouchableOpacity
            onPress={() => setEditing(true)}
            hitSlop={8}
            style={styles.editBtn}
          >
            <Ionicons name="options-outline" size={16} color={theme.primary} />
            <Text style={[styles.editText, { color: theme.primary }]}>
              Edit watchlist
            </Text>
          </TouchableOpacity>
        </View>

        {partialErrors.length > 0 ? (
          <View style={[styles.banner, { backgroundColor: theme.budget }]}>
            <Ionicons name="warning-outline" size={16} color={theme.primary} />
            <Text style={[styles.bannerText, { color: theme.text }]}>
              Some data is unavailable:{" "}
              {partialErrors.map((e) => e.source).join(", ")}
            </Text>
          </View>
        ) : null}

        {cpiRate != null ? (
          <MentorCard cpiRate={cpiRate} bankRate={bankRate} />
        ) : null}

        {macro.length > 0 ? (
          <>
            <SectionHeader title="UK economy" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.rail}
            >
              {macro.map((indicator) => (
                <MacroCard key={indicator.id} indicator={indicator} />
              ))}
            </ScrollView>
          </>
        ) : null}

        <SectionHeader
          title="Crypto"
          actionLabel="Edit"
          onAction={() => setEditing(true)}
        />
        {crypto.length > 0 ? (
          crypto.map((asset) => (
            <AssetCard
              key={asset.id}
              symbol={asset.symbol}
              name={asset.name}
              price={asset.price}
              changePct={asset.change24hPct}
              currency={asset.currency}
              image={asset.image}
            />
          ))
        ) : (
          <EmptyHint text="No crypto in your watchlist." />
        )}

        <SectionHeader title="Stocks" />
        {markets && markets.length > 0 ? (
          markets.map((stock) => (
            <AssetCard
              key={stock.symbol}
              symbol={stock.symbol}
              name={stock.name}
              price={stock.price}
              changePct={stock.changePct}
              currency={stock.currency}
            />
          ))
        ) : markets ? (
          <EmptyHint text="No stocks in your watchlist." />
        ) : (
          <EmptyHint text="Stocks appear once the TwelveData key is configured on the Worker." />
        )}

        {fx ? (
          <>
            <SectionHeader title="Currencies" />
            <FxCard fx={fx} />
          </>
        ) : null}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <WatchlistModal
        visible={editing}
        watchlist={watchlist}
        onClose={() => setEditing(false)}
        onSave={(next) => {
          setEditing(false);
          updateWatchlist(next);
        }}
      />

      <BottomNavBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  safePadded: { flex: 1, paddingHorizontal: 20 },
  content: { paddingHorizontal: 20, paddingBottom: 20 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  centerText: { textAlign: "center" },
  muted: { fontSize: 14 },
  errorTitle: { fontSize: 18, fontWeight: "700", marginTop: 8 },
  retry: {
    marginTop: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  editBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  editText: { fontSize: 14, fontWeight: "600" },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  bannerText: { fontSize: 13, flex: 1 },
  rail: { paddingVertical: 4, paddingRight: 8 },
  emptyHint: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
  },
  emptyHintText: { fontSize: 13 },
  bottomSpacer: { height: 90 },
});
