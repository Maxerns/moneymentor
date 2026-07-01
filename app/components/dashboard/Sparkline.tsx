import React from "react";
import { LineChart } from "react-native-gifted-charts";

interface SparklineProps {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}

// A minimal, axis-less area line for macro history. Renders nothing for a series
// too short to draw.
export function Sparkline({
  values,
  color,
  width = 130,
  height = 44,
}: SparklineProps) {
  if (!values || values.length < 2) return null;
  const data = values.map((value) => ({ value }));

  return (
    <LineChart
      data={data}
      width={width}
      height={height}
      thickness={2}
      color={color}
      areaChart
      startFillColor={color}
      endFillColor={color}
      startOpacity={0.2}
      endOpacity={0.02}
      curved
      hideDataPoints
      hideAxesAndRules
      hideYAxisText
      yAxisLabelWidth={0}
      xAxisThickness={0}
      yAxisThickness={0}
      initialSpacing={0}
      endSpacing={0}
      adjustToWidth
      disableScroll
    />
  );
}
