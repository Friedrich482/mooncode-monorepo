import { Bar, CartesianGrid, ComposedChart, Line, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PERIODS_CONFIG, chartConfig } from "@/constants";
import CustomChartToolTip from "../../ui/custom-chart-tool-tip";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { Skeleton } from "@/components/ui/skeleton";
import { trpc } from "@/utils/trpc";
import { usePeriodStore } from "@/hooks/store/periodStore";

const WeeklyPeriodTimeChart = () => {
  const period = usePeriodStore((state) => state.period);

  const {
    data: chartData,
    error,
    isLoading,
  } = trpc.codingStats.getDaysOfWeeklyPeriodStats.useQuery(
    {
      start: PERIODS_CONFIG[period].start,
      end: PERIODS_CONFIG[period].end,
    },
    {
      refetchOnWindowFocus: true,
    },
  );

  if (error) {
    return (
      <span className="text-red-500">An error occurred: {error.message}</span>
    );
  }
  if (isLoading) {
    return <Skeleton className="h-[24rem] w-[45%] max-chart:w-full" />;
  }

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
          tickFormatter={(date) => date.slice(0, 3)}
        />
        <ChartTooltip
          content={<ChartTooltipContent labelClassName="font-semibold" />}
          labelFormatter={(
            _date: string,
            payload: Payload<string, string>[],
          ) => <div>{payload[0].payload.originalDate}</div>}
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

export default WeeklyPeriodTimeChart;
