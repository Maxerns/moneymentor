import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../../.expo/types/types";
import { useTheme } from "../context/ThemeContext";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const TWELVEDATA_API_KEY = "c3d2af68563e4c008f95362cfc934f70";
const TWELVEDATA_BASE = "https://api.twelvedata.com";
const CRYPTOCOMPARE_API_KEY =
  "70942fec99c3819adbc30f5143fd2c6c9721117240198193e1b7479ec948a8a1";
const CRYPTOCOMPARE_API_BASE = "https://min-api.cryptocompare.com/data";

interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  historicalData: {
    [key: string]: number[]; // timeframe -> data
  };
  name?: string;
  marketCap?: number;
  volume?: number;
}

interface TimeFrame {
  label: string;
  value: string;
  days: number;
}

const timeFrames: TimeFrame[] = [
  { label: "1D", value: "1d", days: 1 },
  { label: "1W", value: "1w", days: 7 },
  { label: "1M", value: "1m", days: 30 },
  { label: "3M", value: "3m", days: 90 },
  { label: "1Y", value: "1y", days: 365 },
];

interface ApiResponse {
  c?: number; // Current price
  d?: number; // Change
  dp?: number; // Percent change
  h?: number; // High
  l?: number; // Low
  o?: number; // Open
  pc?: number; // Previous close
}

const CRYPTO_ID_MAP: { [key: string]: string } = {
  bitcoin: "bitcoin",
  ethereum: "ethereum",
  solana: "solana",
  BTC: "bitcoin",
  ETH: "ethereum",
  SOL: "solana",
};

export default function Analytics() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stockData, setStockData] = useState<MarketData[]>([]);
  const [cryptoData, setCryptoData] = useState<MarketData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("1d");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 40,
      marginBottom: 20,
    },
    logo: {
      width: 75,
      height: 75,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "600",
      color: theme.text,
      marginVertical: 10,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: theme.border,
    },
    marketItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    symbol: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
    },
    price: {
      fontSize: 16,
      color: theme.text,
    },
    change: {
      fontSize: 14,
      fontWeight: "500",
    },
    positive: {
      color: theme.success,
    },
    negative: {
      color: theme.error,
    },
    errorText: {
      color: theme.error,
      textAlign: "center",
      marginVertical: 20,
    },
    chartContainer: {
      marginVertical: 15,
      alignItems: "center",
    },
    navBar: {
      position: "absolute",
      bottom: 0,
      width: "115%",
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: theme.surface,
      paddingVertical: 10,
      paddingHorizontal: 40,
    },
    navBarIcon: {
      fontSize: 30,
      color: theme.text,
    },
    navText: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.text,
      marginTop: 5,
    },
    symbolChartContainer: {
      width: "50%",
      padding: 10,
    },
    symbolTitle: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      textAlign: "center",
      marginBottom: 5,
    },
    chartsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    modalContainer: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent: {
      backgroundColor: theme.surface,
      width: "90%",
      borderRadius: 20,
      padding: 20,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: theme.text,
    },
    timeFrameContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    timeFrameButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 15,
      backgroundColor: theme.background,
    },
    selectedTimeFrame: {
      backgroundColor: theme.primary,
    },
    timeFrameText: {
      color: theme.text,
      fontWeight: "600",
    },
    detailsContainer: {
      marginTop: 20,
    },
    detailLabel: {
      color: theme.text,
      opacity: 0.7,
      marginBottom: 5,
    },
    detailValue: {
      color: theme.text,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 15,
    },
    symbolHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 10,
    },
    priceContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 10,
    },
    selectedTimeFrameText: {
      color: theme.surface,
    },
    chart: {
      borderRadius: 16,
    },
    modalChart: {
      borderRadius: 16,
    },
  });

  const fetchHistoricalData = async (
    symbol: string,
    timeframe: TimeFrame,
    assetType: "stock" | "crypto"
  ): Promise<number[]> => {
    try {
      if (assetType === "stock") {
        const interval = timeframe.days <= 1 ? "1h" : "1day";
        const outputsize = timeframe.days <= 1 ? 24 : timeframe.days;

        const response = await fetch(
          `${TWELVEDATA_BASE}/time_series?` +
            `symbol=${symbol}&` +
            `interval=${interval}&` +
            `outputsize=${outputsize}&` +
            `apikey=${TWELVEDATA_API_KEY}`
        );

        if (!response.ok) {
          throw new Error(`Stock API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.values || !Array.isArray(data.values)) {
          throw new Error("Invalid stock data format");
        }

        const prices = data.values
          .map((item: any) => {
            const close = parseFloat(item.close);
            return isNaN(close) ? null : close;
          })
          .filter((price: number | null): price is number => price !== null)
          .reverse();

        if (prices.length === 0) {
          throw new Error("No valid price data");
        }

        return prices;
      } else {
        // Crypto data fetching
        const cryptoSymbol = symbol.toUpperCase();
        const response = await fetch(
          `${CRYPTOCOMPARE_API_BASE}/v2/histoday?` +
            `fsym=${cryptoSymbol}&` +
            `tsym=USD&` +
            `limit=${timeframe.days}`,
          {
            headers: {
              authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`CryptoCompare API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.Data || !data.Data.Data || !Array.isArray(data.Data.Data)) {
          throw new Error("Invalid crypto data format");
        }

        return data.Data.Data.map((item: any) => item.close || 0);
      }
    } catch (error) {
      console.error(`Error fetching ${assetType} data for ${symbol}:`, error);
      return [0];
    }
  };

  // Update the processStockData functions
  const processStockData = async (symbol: string): Promise<MarketData> => {
    try {
      const response = await fetch(
        `${TWELVEDATA_BASE}/quote?` +
          `symbol=${symbol}&` +
          `apikey=${TWELVEDATA_API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Invalid data for ${symbol}`);
      }

      const data = await response.json();

      const historicalData = await fetchHistoricalData(
        symbol,
        timeFrames[0],
        "stock"
      );

      return {
        symbol,
        price: parseFloat(data.close),
        change: parseFloat(data.change),
        changePercent: parseFloat(data.percent_change),
        historicalData: {
          "1d": historicalData,
        },
        volume: parseFloat(data.volume),
        marketCap: parseFloat(data.market_cap || 0),
      };
    } catch (error) {
      console.error(`Error processing stock data for ${symbol}:`, error);
      return {
        symbol,
        price: 0,
        change: 0,
        changePercent: 0,
        historicalData: { "1d": [0] },
        marketCap: 0,
        volume: 0,
      };
    }
  };

  // Add onRefresh function
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchMarketData();
  }, []);

  const updateHistoricalData = async (
    symbol: string,
    timeframe: TimeFrame,
    assetType: "stock" | "crypto"
  ) => {
    try {
      const historicalData = await fetchHistoricalData(
        symbol,
        timeframe,
        assetType
      );

      if (assetType === "stock") {
        setStockData((prevData) =>
          prevData.map((item) =>
            item.symbol === symbol
              ? {
                  ...item,
                  historicalData: {
                    ...item.historicalData,
                    [timeframe.value]: historicalData,
                  },
                }
              : item
          )
        );
      } else {
        setCryptoData((prevData) =>
          prevData.map((item) =>
            item.symbol === symbol
              ? {
                  ...item,
                  historicalData: {
                    ...item.historicalData,
                    [timeframe.value]: historicalData,
                  },
                }
              : item
          )
        );
      }
    } catch (error) {
      console.error("Error updating historical data:", error);
      Alert.alert("Error", "Failed to fetch historical data");
    }
  };

  const fetchMarketData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Stock market data
      const stockSymbols = ["AAPL", "MSFT", "GOOGL"];
      const stockPromises = stockSymbols.map(async (symbol) => {
        // Fetch quote data
        const quoteResponse = await fetch(
          `${TWELVEDATA_BASE}/quote?symbol=${symbol}&apikey=${TWELVEDATA_API_KEY}`
        );

        if (!quoteResponse.ok) throw new Error(`API error for ${symbol}`);
        const quoteData = await quoteResponse.json();

        // Fetch market cap data
        const profileResponse = await fetch(
          `${TWELVEDATA_BASE}/profile?symbol=${symbol}&apikey=${TWELVEDATA_API_KEY}`
        );
        const profileData = await profileResponse.json();

        // Get historical data
        const historicalData = await fetchHistoricalData(
          symbol,
          timeFrames[0],
          "stock"
        );

        return {
          symbol,
          price: parseFloat(quoteData.close),
          change: parseFloat(quoteData.change),
          changePercent: parseFloat(quoteData.percent_change),
          historicalData: {
            "1d": historicalData,
          },
          volume: parseFloat(quoteData.volume),
          marketCap: profileData.market_cap
            ? parseFloat(profileData.market_cap)
            : 0,
        };
      });

      const cryptoSymbols = ["BTC", "ETH", "SOL"];
      const cryptoResponse = await fetch(
        `${CRYPTOCOMPARE_API_BASE}/pricemultifull?fsyms=${cryptoSymbols.join(
          ","
        )}&tsyms=USD`,
        {
          headers: {
            authorization: `Apikey ${CRYPTOCOMPARE_API_KEY}`,
          },
        }
      );

      if (!cryptoResponse.ok) throw new Error("Crypto API error");
      const cryptoData = await cryptoResponse.json();

      if (!cryptoData.RAW) throw new Error("Invalid crypto data structure");

      const processedCryptoData = await Promise.all(
        cryptoSymbols.map(async (symbol) => {
          const symbolData = cryptoData.RAW[symbol]?.USD;
          if (!symbolData) {
            console.error(`No data found for ${symbol}`);
            return {
              symbol,
              price: 0,
              change: 0,
              changePercent: 0,
              historicalData: { "1d": [0] },
              marketCap: 0,
              volume: 0,
            };
          }

          return {
            symbol,
            price: symbolData.PRICE || 0,
            change: symbolData.CHANGE24HOUR || 0,
            changePercent: symbolData.CHANGEPCT24HOUR || 0,
            historicalData: {
              "1d": await fetchHistoricalData(symbol, timeFrames[0], "crypto"),
            },
            marketCap: symbolData.MKTCAP || 0,
            volume: symbolData.VOLUME24HOUR || 0,
          };
        })
      );

      setStockData(await Promise.all(stockPromises));
      setCryptoData(processedCryptoData);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch market data";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const ExpandedChart = ({
    data,
    symbol,
    theme,
    onClose,
    timeFrames,
    selectedTimeFrame,
    onTimeFrameChange,
    marketData,
  }: {
    data: number[];
    symbol: string;
    theme: any;
    onClose: () => void;
    timeFrames: TimeFrame[];
    selectedTimeFrame: string;
    onTimeFrameChange: (timeframe: string) => void;
    marketData: MarketData;
  }) => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={true}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={onClose}>
                <MaterialIcons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{symbol}</Text>
              <View style={{ width: 24 }} />
            </View>

            <View style={styles.timeFrameContainer}>
              {timeFrames.map((tf) => (
                <TouchableOpacity
                  key={tf.value}
                  style={[
                    styles.timeFrameButton,
                    selectedTimeFrame === tf.value && styles.selectedTimeFrame,
                  ]}
                  onPress={() => onTimeFrameChange(tf.value)}
                >
                  <Text style={styles.timeFrameText}>{tf.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <LineChart
              data={{
                labels: [], // Add proper labels based on timeframe
                datasets: [{ data }],
              }}
              width={Dimensions.get("window").width - 40}
              height={220}
              chartConfig={{
                backgroundColor: theme.surface,
                backgroundGradientFrom: theme.surface,
                backgroundGradientTo: theme.surface,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(52, 73, 80, ${opacity})`,
                style: { borderRadius: 16 },
              }}
              bezier
              style={{ borderRadius: 16 }}
            />

            <View style={styles.detailsContainer}>
              <Text style={styles.detailLabel}>Market Cap</Text>
              <Text style={styles.detailValue}>
                ${(marketData.marketCap || 0).toLocaleString()}
              </Text>
              <Text style={styles.detailLabel}>24h Volume</Text>
              <Text style={styles.detailValue}>
                ${(marketData.volume || 0).toLocaleString()}
              </Text>
              <Text style={styles.detailLabel}>24h Change</Text>
              <Text
                style={[
                  styles.detailValue,
                  marketData.change >= 0 ? styles.positive : styles.negative,
                ]}
              >
                {marketData.change >= 0 ? "+" : ""}
                {marketData.changePercent.toFixed(2)}%
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const SymbolChart = ({
    item,
    theme,
    selectedTimeFrame,
    onTimeFrameChange,
    onExpand,
  }: {
    item: MarketData;
    theme: any;
    selectedTimeFrame: string;
    onTimeFrameChange: (timeframe: string) => Promise<void>;
    onExpand: (symbol: string) => void;
  }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const screenWidth = Dimensions.get("window").width;
    const chartHeight = 120;
    const modalChartHeight = 220;

    const chartConfig = {
      backgroundGradientFrom: theme.surface,
      backgroundGradientTo: theme.surface,
      color: (opacity = 1) => `rgba(52, 73, 80, ${opacity})`,
      strokeWidth: 2,
      decimalPlaces: 2,
      labelColor: () => theme.text,
      style: {
        borderRadius: 16,
      },
    };

    const chartData = {
      labels: [],
      datasets: [
        {
          data: item.historicalData[selectedTimeFrame] ||
            item.historicalData["1d"] || [0, 0], // Provide at least 2 points
        },
      ],
    };

    return (
      <View style={styles.symbolChartContainer}>
        <View style={styles.symbolHeader}>
          <Text style={styles.symbolTitle}>{item.symbol}</Text>
          <TouchableOpacity
            onPress={() => {
              setIsExpanded(true);
              onExpand(item.symbol);
            }}
          >
            <MaterialIcons name="chevron-right" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={{ height: chartHeight, width: screenWidth - 40 }}>
          <LineChart
            data={chartData}
            width={screenWidth - 40}
            height={chartHeight}
            chartConfig={chartConfig}
            bezier
            withDots={false}
            withInnerLines={false}
            withOuterLines={true}
            withVerticalLabels={false}
            withHorizontalLabels={false}
            style={styles.chart}
          />
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <Text
            style={[
              styles.change,
              item.changePercent >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {item.changePercent >= 0 ? "+" : ""}
            {item.changePercent.toFixed(2)}%
          </Text>
        </View>

        {isExpanded && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isExpanded}
            onRequestClose={() => setIsExpanded(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setIsExpanded(false)}>
                    <MaterialIcons name="close" size={24} color={theme.text} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>{item.symbol}</Text>
                  <View style={{ width: 24 }} />
                </View>

                <View style={styles.timeFrameContainer}>
                  {timeFrames.map((tf) => (
                    <TouchableOpacity
                      key={tf.value}
                      style={[
                        styles.timeFrameButton,
                        selectedTimeFrame === tf.value &&
                          styles.selectedTimeFrame,
                      ]}
                      onPress={() => onTimeFrameChange(tf.value)}
                    >
                      <Text
                        style={[
                          styles.timeFrameText,
                          selectedTimeFrame === tf.value &&
                            styles.selectedTimeFrameText,
                        ]}
                      >
                        {tf.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={{ height: modalChartHeight }}>
                  <LineChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={modalChartHeight}
                    chartConfig={chartConfig}
                    bezier
                    withHorizontalLabels={true}
                    withVerticalLabels={true}
                    withDots={false}
                    withInnerLines={true}
                    withOuterLines={true}
                    style={styles.modalChart}
                  />
                </View>

                <View style={styles.detailsContainer}>
                  <Text style={styles.detailLabel}>Market Cap</Text>
                  <Text style={styles.detailValue}>
                    ${(item.marketCap || 0).toLocaleString()}
                  </Text>
                  <Text style={styles.detailLabel}>24h Volume</Text>
                  <Text style={styles.detailValue}>
                    ${(item.volume || 0).toLocaleString()}
                  </Text>
                  <Text style={styles.detailLabel}>24h Change</Text>
                  <Text
                    style={[
                      styles.detailValue,
                      item.changePercent >= 0
                        ? styles.positive
                        : styles.negative,
                    ]}
                  >
                    {item.changePercent >= 0 ? "+" : ""}
                    {item.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Profile")}
        >
          <Ionicons name="person-circle-outline" size={36} color="#344950" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/MoneyMentorLogoGradient.png")}
          style={styles.logo}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Settings")}
        >
          <Ionicons name="settings-outline" size={36} color="#344950" />
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.title}>Market Analytics</Text>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.sectionTitle}>Stock Market</Text>
            <View style={styles.card}>
              <View style={styles.chartsGrid}>
                {stockData.map((item, index) => (
                  <View key={index}>
                    <SymbolChart
                      item={item}
                      theme={theme}
                      selectedTimeFrame={selectedTimeFrame}
                      onTimeFrameChange={async (timeframe) => {
                        setSelectedTimeFrame(timeframe);
                        await updateHistoricalData(
                          item.symbol,
                          timeFrames.find((tf) => tf.value === timeframe)!,
                          "stock"
                        );
                      }}
                      onExpand={(symbol) => setSelectedSymbol(symbol)}
                    />
                  </View>
                ))}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Cryptocurrency</Text>
            <View style={styles.card}>
              <View style={styles.chartsGrid}>
                {cryptoData.map((item, index) => (
                  <View key={index}>
                    <SymbolChart
                      item={item}
                      theme={theme}
                      selectedTimeFrame={selectedTimeFrame}
                      onTimeFrameChange={async (timeframe) => {
                        setSelectedTimeFrame(timeframe);
                        await updateHistoricalData(
                          item.symbol,
                          timeFrames.find((tf) => tf.value === timeframe)!,
                          "crypto"
                        );
                      }}
                      onExpand={(symbol) => setSelectedSymbol(symbol)}
                    />
                  </View>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Dashboard")}
        >
          <Ionicons name="home-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("screens/Tools")}>
          <Ionicons name="construct-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Tools</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="analytics-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Analysis</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("screens/Learning")}
        >
          <Ionicons name="school-outline" style={styles.navBarIcon} />
          <Text style={styles.navText}>Learning</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
