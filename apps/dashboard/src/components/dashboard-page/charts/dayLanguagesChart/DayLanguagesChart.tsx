import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DEFAULT_COLOR, chartConfig } from "@/constants";
import { useMemo, useState } from "react";
import ChartTitle from "./ChartTitle";
import CustomChartToolTip from "@/components/ui/custom-chart-tool-tip";
import { Skeleton } from "@/components/ui/skeleton";
import getDateOffset from "@/utils/getDateOffset";
import getNextDayDate from "@/utils/getNextDayDate";
import getPrevDayDate from "@/utils/getPreviousDayDate";
import languagesAttributes from "@/colors.json";
import { trpc } from "@/utils/trpc";

const DayLanguagesChart = () => {
  const [date, setDate] = useState(new Date());
  const offset = useMemo(() => getDateOffset(date), [date]);

  const handleChevronLeftClick = () => setDate((prev) => getPrevDayDate(prev));
  const handleChevronRightClick = () => setDate((prev) => getNextDayDate(prev));

  const { data, error, isLoading } =
    trpc.codingStats.getDailyStatsForChart.useQuery(
      {
        offset,
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

  const { finalData, formattedTotalTimeSpent, date: displayDate } = data;

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
        displayDate={displayDate}
        formattedTotalTimeSpent={formattedTotalTimeSpent}
        handleChevronLeftClick={handleChevronLeftClick}
        handleChevronRightClick={handleChevronRightClick}
        offset={offset}
        date={date}
        setDate={setDate}
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
              labelFormatter={() => (
                <div className="font-semibold">{displayDate}</div>
              )}
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
                <Cell
                  fill={entry.color}
                  min={0}
                  key={entry.languageId}
                  className="cursor-pointer"
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      )}
    </div>
  );
};

export default DayLanguagesChart;
