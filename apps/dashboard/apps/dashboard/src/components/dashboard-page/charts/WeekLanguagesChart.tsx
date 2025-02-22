import {
  Bar,
  BarChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { BarChartIcon, PieChartIcon } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../ui/chart";
import CustomChartToolTip from "../../ui/custom-chart-tool-tip";
import Icon from "../../ui/Icon";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import WeekLanguagesChartSkeleton from "../../ui/skeleton/WeekLanguagesChartSkeleton";
import { WeeklyPeriod } from "@/types-schemas";
import { chartConfig } from "@/constants";
import fetchWeekLanguagesData from "@/utils/fetch/fetchWeekLanguagesData";
import formatWeekLangByDayChart from "@/utils/format/formatWeekLangByDayChart";
import formatWeekLanguagesData from "@/utils/format/formatWeekLanguagesChartData";
import languagesColor from "@/colors.json";
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
    return <WeekLanguagesChartSkeleton />;
  }
  const pieChartData = formatWeekLanguagesData(data);
  const barChartData = formatWeekLangByDayChart(data.daysOfWeekStats);

  return (
    <div className="relative w-[45%] max-md:w-full">
      <Icon
        Icon={isPieChartVisible ? PieChartIcon : BarChartIcon}
        className="absolute -top-12 right-0 z-50"
        onClick={handleClick}
      />
      <ChartContainer config={chartConfig} className="z-0 min-h-96 w-full">
        {isPieChartVisible ? (
          <ResponsiveContainer>
            <PieChart accessibilityLayer>
              <ChartTooltip
                content={<ChartTooltipContent labelClassName="font-semibold" />}
                labelFormatter={() => <div className="font-semibold">Time</div>}
                formatter={(value: string, language, { payload }) =>
                  CustomChartToolTip(
                    parseInt(value),
                    payload.fill,
                    language.toString(),
                  )
                }
              />
              <Pie
                data={pieChartData}
                dataKey="time"
                fill="fill"
                nameKey="languageName"
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <BarChart accessibilityLayer data={barChartData}>
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
              labelFormatter={(
                date: string,
                payload: Payload<string, string>[],
              ) => (
                <div>{`${date.slice(0, 3)} ${payload[0].payload.originalDate}`}</div>
              )}
              formatter={(value: string, language) =>
                CustomChartToolTip(
                  parseInt(value),
                  languagesColor[language as keyof typeof languagesColor],
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
                      languagesColor[
                        language as keyof typeof languagesColor
                      ] as string
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
