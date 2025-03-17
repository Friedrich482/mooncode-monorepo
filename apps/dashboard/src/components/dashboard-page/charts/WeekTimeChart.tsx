import { Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { WeeklyPeriod, offsets } from "@/types-schemas";
import CustomChartToolTip from "../../ui/custom-chart-tool-tip";
import { Skeleton } from "@/components/ui/skeleton";
import { chartConfig } from "@/constants";
import formatWeekChartData from "@/utils/format/formatWeekChartData";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

const WeekTimeChart = () => {
  const [chartPeriod] = useState<WeeklyPeriod>("Past week");

  const { data, error, isLoading } = trpc.codingData.getWeeklyStats.useQuery(
    {
      offset: offsets[chartPeriod],
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  if (error) {
    return <span>An error occurred: {error.message}</span>;
  }
  if (isLoading) {
    return <Skeleton className="h-[24rem] w-[45%] max-chart:w-full" />;
  }

  const chartData = formatWeekChartData(data.daysOfWeekStats);

  return (
    <ChartContainer
      config={chartConfig}
      className="z-0 min-h-96 w-[45%] max-chart:w-full"
    >
      <ComposedChart data={chartData}>
        <CartesianGrid vertical={false} horizontal={false} />
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
            name === "Time"
              ? CustomChartToolTip(parseInt(value), "var(--color-time)")
              : null
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
