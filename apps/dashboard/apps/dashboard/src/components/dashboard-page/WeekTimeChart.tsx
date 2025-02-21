import { Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import CustomChartToolTip from "../ui/custom-chart-tool-tip";
import WeekTimeChartSkeleton from "../ui/skeleton/WeekTimeChartSkeleton";
import { WeeklyPeriod } from "@/types-schemas";
import { chartConfig } from "@/constants";
import fetchTimeByDayOfWeek from "@/utils/fetch/fetchTimeByDayOfWeek";
import formatWeekChartData from "@/utils/format/formatWeekChartData";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const WeekTimeChart = () => {
  const [chartPeriod] = useState<WeeklyPeriod>("This week");

  const { data, error, isPending } = useQuery({
    queryKey: ["week-full-data", "total time"],
    queryFn: () => fetchTimeByDayOfWeek(chartPeriod),

    refetchOnWindowFocus: true,
  });

  if (error) {
    return <span>An error occurred: {error.message}</span>;
  }
  if (isPending) {
    return <WeekTimeChartSkeleton />;
  }

  const chartData = formatWeekChartData(data);

  return (
    <ChartContainer
      config={chartConfig}
      className="z-0 min-h-96 w-[45%] max-md:w-full"
    >
      <ComposedChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          content={<ChartTooltipContent labelClassName="font-semibold" />}
          formatter={(value: string, name) =>
            name === "Time" ? CustomChartToolTip(parseInt(value)) : null
          }
        />

        <Bar
          dataKey="timeSpentBar"
          fill="var(--color-time)"
          className="cursor-pointer"
          name="Time"
        />

        <Line
          dataKey="timeSpentLine"
          stroke="#dc2626"
          strokeWidth={2}
          dot={{ r: 4 }}
          type="monotone"
          className="cursor-pointer"
        />
      </ComposedChart>
    </ChartContainer>
  );
};

export default WeekTimeChart;
