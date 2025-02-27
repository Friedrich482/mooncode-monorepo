import { Bar, BarChart, CartesianGrid, Pie, PieChart, XAxis } from "recharts";
import { BarChartIcon, PieChartIcon } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import CustomChartToolTip from "../../ui/custom-chart-tool-tip";
import Icon from "../../ui/Icon";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { Skeleton } from "@/components/ui/skeleton";
import { WeeklyPeriod } from "@/types-schemas";
import { chartConfig } from "@/constants";
import fetchWeekLanguagesData from "@/utils/fetch/fetchWeekLanguagesData";
import formatWeekLangByDayChart from "@/utils/format/formatWeekLangByDayChart";
import formatWeekLanguagesData from "@/utils/format/formatWeekLanguagesChartData";
import languagesAttributes from "@/colors.json";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const WeekLanguagesChart = () => {
  const [isPieChartVisible, setIsPieChartVisible] = useState(true);
  const handleClick = () => setIsPieChartVisible((prev) => !prev);

  const [chartPeriod] = useState<WeeklyPeriod>("This week");

  const { data, error, isPending } = useQuery({
    queryKey: ["week-full-data", chartPeriod, "languages"],
    queryFn: () => fetchWeekLanguagesData(chartPeriod),
    refetchOnWindowFocus: true,
  });
  if (error) {
    return <span>An error occurred: {error.message}</span>;
  }
  if (isPending) {
    return <Skeleton className="max-chart:w-full h-[24rem] w-[45%]" />;
  }
  const pieChartData = formatWeekLanguagesData(data);
  const barChartData = formatWeekLangByDayChart(data);

  // ! Don't try to refactor the two charts and put them in their own
  // ! component, it is not supported by recharts

  return (
    <div className="max-chart:w-full relative w-[45%]">
      <Icon
        Icon={isPieChartVisible ? PieChartIcon : BarChartIcon}
        className="absolute -top-12 right-0 z-0"
        onClick={handleClick}
      />
      <ChartContainer config={chartConfig} className="min-h-96 w-full">
        {isPieChartVisible ? (
          <PieChart accessibilityLayer>
            <ChartTooltip
              labelFormatter={() => <div className="font-semibold">Time</div>}
              content={<ChartTooltipContent labelClassName="font-semibold" />}
              formatter={(value: string, language, { payload }) =>
                CustomChartToolTip(
                  parseInt(value),
                  payload.fill,
                  language.toString(),
                  payload.percentage,
                )
              }
            />
            <ChartLegend
              content={<ChartLegendContent order="DESC" className="text-xs" />}
              className="flex-wrap justify-end max-small:hidden"
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
            <Pie
              data={pieChartData}
              dataKey="time"
              fill="fill"
              nameKey="languageName"
              className="cursor-pointer"
            />
          </PieChart>
        ) : (
          <BarChart accessibilityLayer data={barChartData}>
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
              labelFormatter={(
                date: string,
                payload: Payload<string, string>[],
              ) => (
                <div>{`${date.slice(0, 3)} ${payload[0].payload.originalDate}`}</div>
              )}
              formatter={(value: string, language) =>
                CustomChartToolTip(
                  parseInt(value),
                  languagesAttributes[
                    language as keyof typeof languagesAttributes
                  ].color,
                  language,
                )
              }
            />
            {[...new Set(barChartData.flatMap((day) => Object.keys(day)))]
              .filter(
                (key) =>
                  key !== "date" &&
                  key !== "timeSpent" &&
                  key !== "originalDate",
              )
              .map((language) => {
                return (
                  <Bar
                    key={language}
                    dataKey={language}
                    stackId="a"
                    fill={
                      languagesAttributes[
                        language as keyof typeof languagesAttributes
                      ].color as string
                    }
                    className="cursor-pointer"
                  />
                );
              })}
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
};

export default WeekLanguagesChart;
