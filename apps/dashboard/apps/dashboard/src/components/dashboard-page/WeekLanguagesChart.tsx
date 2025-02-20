import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import WeekLanguagesChartSkeleton from "../ui/skeleton/WeekLanguagesChartSkeleton";
import { WeeklyPeriod } from "@/types-schemas";
import { chartConfig } from "@/constants";
import fetchWeekLanguagesData from "@/utils/fetch/fetchWeekLanguagesData";
import formatWeekLangByDayChart from "@/utils/format/formatWeekLangByDayChart";
import formatWeekLanguagesData from "@/utils/format/formatWeekLanguagesChartData";
import languagesColor from "@/colors.json";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const WeekLanguagesChart = () => {
  const [chartPeriod] = useState<WeeklyPeriod>("This week");

  const { data, error, isPending } = useQuery({
    queryKey: ["week Languages"],
    queryFn: () => {
      return fetchWeekLanguagesData(chartPeriod);
    },
    refetchOnWindowFocus: true,
  });
  if (error) {
    return <span>An error occurred: ${error.message}</span>;
  }
  if (isPending) {
    return <WeekLanguagesChartSkeleton />;
  }
  const pieChartData = formatWeekLanguagesData(data);
  const barChartData = formatWeekLangByDayChart(data.daysOfWeekStats);
  return (
    <ChartContainer
      config={chartConfig}
      className="z-0 min-h-96 w-[45%] max-md:w-full"
    >
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend
          content={<ChartLegendContent className="flex-wrap justify-start" />}
        />
        {[...new Set(barChartData.flatMap((day) => Object.keys(day)))]
          .filter(
            (key) =>
              key !== "date" && key !== "timeSpent" && key !== "originalDate",
          )
          .map((language) => {
            return (
              <Bar
                key={language}
                dataKey={language}
                stackId="a"
                fill={languagesColor[language as keyof typeof languagesColor]!}
                className="cursor-pointer"
              />
            );
          })}
      </BarChart>
    </ChartContainer>
  );
};

export default WeekLanguagesChart;
