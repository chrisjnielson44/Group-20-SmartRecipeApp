import React from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  BarChart,
  ResponsiveContainer,
  TooltipProps,
} from "recharts";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { ChartData } from "@/app/types/chat";

interface ChartProps {
  chartData: ChartData;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

// Function to format date as MM/DD/YY
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });
};

// Helper function to parse date strings or return existing Date objects
const parseDate = (value: string | number | Date): Date => {
  if (value instanceof Date) {
    return value;
  }
  if (typeof value === "string" || typeof value === "number") {
    return new Date(value);
  }
  throw new Error("Invalid date value");
};

export const ChartComponent: React.FC<ChartProps> = ({ chartData }) => {
  if (
    !chartData ||
    !chartData.data ||
    !Array.isArray(chartData.data) ||
    chartData.data.length === 0
  ) {
    console.error("Invalid or empty chart data");
    return <div>Error: Invalid or empty chart data</div>;
  }

  const {
    data,
    x_column,
    y_column,
    y_columns,
    chart_type,
    title,
    description,
    footer,
  } = chartData;

  if (!x_column || (!y_column && (!y_columns || y_columns.length === 0))) {
    console.error("Missing x_column or y_column(s)");
    return <div>Error: Missing chart configuration</div>;
  }

  const yColumns = y_columns || (y_column ? [y_column] : []);

  const processedData = data.map((item) => {
    const processedItem: Record<string, number | Date> = {};

    Object.keys(item).forEach((key) => {
      if (key === x_column) {
        processedItem[key] = parseDate(item[key]);
      } else if (yColumns.includes(key)) {
        processedItem[key] =
          typeof item[key] === "number"
            ? item[key]
            : parseFloat(item[key] as string) || 0;
      }
    });

    return processedItem;
  });

  processedData.sort(
    (a, b) => (a[x_column] as Date).getTime() - (b[x_column] as Date).getTime(),
  );

  const startDate = formatDate(processedData[0][x_column] as Date);
  const endDate = formatDate(
    processedData[processedData.length - 1][x_column] as Date,
  );

  const chartConfig: ChartConfig = yColumns.reduce(
    (config, column, index) => ({
      ...config,
      [column]: {
        label: column,
        color: COLORS[index % COLORS.length],
      },
    }),
    {},
  );

  const CustomTooltip: React.FC<TooltipProps<number, string>> = ({
    active,
    payload,
    label,
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-2 border border-border rounded shadow-md">
          <p className="text-sm font-semibold">{formatDate(new Date(label))}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value?.toFixed(2)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const ChartContent =
    chart_type === "line" ? (
      <LineChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={x_column}
          tickFormatter={(value) => formatDate(new Date(value))}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {yColumns.map((column, index) => (
          <Line
            key={column}
            type="monotone"
            dataKey={column}
            stroke={COLORS[index % COLORS.length]}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    ) : (
      <BarChart data={processedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={x_column}
          tickFormatter={(value) => formatDate(new Date(value))}
        />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {yColumns.map((column, index) => (
          <Bar
            key={column}
            dataKey={column}
            fill={COLORS[index % COLORS.length]}
            radius={8}
          />
        ))}
      </BarChart>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>{title || "Data Visualization"}</CardTitle>
          <CardDescription>
            {description || `${startDate} - ${endDate}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="min-h-[200px] h-[800px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              {ChartContent}
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="leading-none text-muted-foreground">
            {footer || ""}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ChartComponent;
