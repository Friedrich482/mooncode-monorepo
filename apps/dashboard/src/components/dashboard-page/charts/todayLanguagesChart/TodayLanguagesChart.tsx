import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DEFAULT_COLOR, chartConfig } from "@/constants";
import ChartTitle from "./ChartTitle";
import CustomChartToolTip from "@/components/ui/custom-chart-tool-tip";
import { Skeleton } from "@/components/ui/skeleton";
import languagesAttributes from "@/colors.json";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

const TodayLanguagesChart = () => {
  const [offset, setOffset] = useState(0);
  const handleChevronLeftClick = () => setOffset((prev) => prev - 1);
  const handleChevronRightClick = () => setOffset((prev) => prev + 1);

  const { data, error, isLoading } =
    trpc.codingData.getDailyStatsForChart.useQuery({
      offset,
    });

  if (error) {
    return (
      <span className="text-red-500">An error occurred: {error.message}</span>
    );
  }
  if (isLoading) {
    return <Skeleton className="h-[24rem] w-[45%] max-chart:w-full" />;
  }

  const { finalData, formattedTotalTimeSpent, date } = data;

  const chartData = finalData.map((entry) => ({
    ...entry,
    color:
      languagesAttributes[entry.languageId as keyof typeof languagesAttributes]
        .color || DEFAULT_COLOR,
    languageName:
      languagesAttributes[entry.languageId as keyof typeof languagesAttributes]
        .name,
  }));

  return (
    <div className="flex min-h-96 w-[45%] flex-col gap-y-2 rounded-md border border-neutral-600/50 py-2 max-chart:w-full">
      <ChartTitle
        date={date}
        formattedTotalTimeSpent={formattedTotalTimeSpent}
        handleChevronLeftClick={handleChevronLeftClick}
        handleChevronRightClick={handleChevronRightClick}
        offset={offset}
      />{" "}
      {chartData.length === 0 ? (
        <p className="w-full pt-[25%] text-center text-2xl">
          No coding stats for the day
        </p>
      ) : (
        <ChartContainer
          config={chartConfig}
          className="w-full flex-1 border-none"
        >
          <BarChart
            layout="vertical"
            data={chartData}
            margin={{ left: 20 }}
            accessibilityLayer
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="languageName"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="timeSpent" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent labelClassName="font-semibold" />}
              // TODO use the appropriate period
              labelFormatter={() => <div className="font-semibold">Today</div>}
              formatter={(value: string, _, { payload }) => {
                return CustomChartToolTip(
                  parseInt(value),
                  payload.color,
                  payload.languageId,
                  payload.percentage,
                );
              }}
            />
            <Bar dataKey="timeSpent" layout="vertical" radius={5}>
              {chartData.map((entry) => (
                <Cell fill={entry.color} min={0} key={entry.languageId} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default TodayLanguagesChart;
