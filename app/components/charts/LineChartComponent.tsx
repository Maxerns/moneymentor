import React from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { useTheme } from "../../context/ThemeContext";

interface LineChartProps {
  data: {
    labels: string[];
    datasets: { data: number[] }[];
  };
  height?: number;
  withDots?: boolean;
  withInnerLines?: boolean;
  withOuterLines?: boolean;
  withHorizontalLabels?: boolean;
  withVerticalLabels?: boolean;
}

export const LineChartComponent = ({
  data,
  height = 220,
  withDots = true,
  withInnerLines = true,
  withOuterLines = true,
  withHorizontalLabels = true,
  withVerticalLabels = true,
}: LineChartProps) => {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width - 40;

  const chartConfig = {
    backgroundColor: theme.surface,
    backgroundGradientFrom: theme.surface,
    backgroundGradientTo: theme.surface,
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(52, 73, 80, ${opacity})`,
    labelColor: (opacity = 1) => theme.text,
    style: { borderRadius: 16 },
  };

  return (
    <View style={styles.container}>
      <LineChart
        data={data}
        width={screenWidth}
        height={height}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
        withDots={withDots}
        withInnerLines={withInnerLines}
        withOuterLines={withOuterLines}
        withHorizontalLabels={withHorizontalLabels}
        withVerticalLabels={withVerticalLabels}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 8,
  },
  chart: {
    borderRadius: 16,
  },
});
