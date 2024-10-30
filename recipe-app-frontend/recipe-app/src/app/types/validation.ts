// types/validation.ts

import { ChartData } from "./chat";

export function isValidChartData(data: unknown): data is ChartData {
  if (!data || typeof data !== "object") return false;

  const chart = data as Partial<ChartData>;

  // Check required properties exist and have correct types
  if (!Array.isArray(chart.data)) return false;
  if (typeof chart.x_column !== "string") return false;
  if (chart.chart_type !== "line" && chart.chart_type !== "bar") return false;

  // Check if either y_column or y_columns is properly defined
  if (typeof chart.y_column !== "string" && !Array.isArray(chart.y_columns)) {
    return false;
  }

  // If y_columns exists, validate it's an array of strings
  if (
    chart.y_columns &&
    !chart.y_columns.every((col) => typeof col === "string")
  ) {
    return false;
  }

  // Optional properties type check
  if (chart.title !== undefined && typeof chart.title !== "string")
    return false;
  if (chart.description !== undefined && typeof chart.description !== "string")
    return false;
  if (chart.footer !== undefined && typeof chart.footer !== "string")
    return false;

  return true;
}

export function validateChartData(data: unknown): ChartData {
  if (!isValidChartData(data)) {
    throw new Error("Invalid chart data received from API");
  }
  return data;
}
