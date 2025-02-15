import { Bar, BarChart, CartesianGrid, LineChart, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import WeekTimeChartSkeleton from "../ui/skeleton/WeekTimeChartSkeleton";
import { WeeklyPeriod } from "@/utils/types-schemas";
import { chartConfig } from "@/utils/constants";
import fetchTimeByDayOfWeek from "@/utils/fetchTimeByDayOfWeek";
import formatWeekChartData from "@/utils/formatWeekChartData";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const WeekTimeChart = () => {
  const [chartPeriod] = useState<WeeklyPeriod>("This week");

  const { data, error, isPending } = useQuery({
    queryKey: ["weeklyTime"],
    queryFn: () => {
      return fetchTimeByDayOfWeek(chartPeriod);
    },
    refetchOnWindowFocus: true,
  });

  const chartData = formatWeekChartData(data);

  if (error) {
    return <span>An error occurred: ${error.message}</span>;
  }
  if (isPending) {
    return <WeekTimeChartSkeleton />;
  }

  return (
    <ChartContainer
      config={chartConfig}
      className="max-md:w-full z-0 min-h-96 w-[45%]"
    >
      <BarChart data={chartData} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <LineChart accessibilityLayer />
        <Bar
          dataKey="timeSpent"
          fill="var(--color-desktop)"
          radius={4}
          className="cursor-pointer"
        />
      </BarChart>
    </ChartContainer>
  );
};

export default WeekTimeChart;
