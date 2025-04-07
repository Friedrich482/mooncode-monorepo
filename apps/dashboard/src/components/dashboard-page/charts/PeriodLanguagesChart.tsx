import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
} from "recharts";
import { BarChartIcon, PieChartIcon } from "lucide-react";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DEFAULT_COLOR, chartConfig } from "@/constants";
import CustomChartToolTip from "@/components/ui/custom-chart-tool-tip";
import Icon from "@/components/ui/Icon";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { Skeleton } from "@/components/ui/skeleton";
import languagesAttributes from "@/colors.json";
import useQueryPeriodLangChart from "@/hooks/useQueryPeriodLangChart";
import { useState } from "react";

const PeriodLanguagesChart = () => {
  const [isPieChartVisible, setIsPieChartVisible] = useState(true);
  const handleClick = () => setIsPieChartVisible((prev) => !prev);

  const {
    pieChartError,
    barChartError,
    isLoadingBar,
    isLoadingPie,
    pieChartData,
    barChartData,
  } = useQueryPeriodLangChart();

  if (pieChartError || barChartError) {
    const error = pieChartError || barChartError;
    return (
      <span className="text-red-500">An error occurred: {error?.message}</span>
    );
  }

  if (isLoadingPie || isLoadingBar) {
    return <Skeleton className="h-[24rem] w-[45%] max-chart:w-full" />;
  }

  // ! Don't try to refactor the two charts and put them in their own
  // ! component, it is not supported by recharts

  return (
    <div className="relative w-[45%] max-chart:w-full">
      <Icon
        Icon={isPieChartVisible ? BarChartIcon : PieChartIcon}
        className="absolute -top-12 right-0 z-0"
        onClick={handleClick}
      />
      <div className="flex min-h-96 flex-col rounded-md border border-neutral-600/50">
        <h2 className="text-center text-2xl font-bold">Languages</h2>
        <ChartContainer
          config={chartConfig}
          className="w-full flex-1 border-none"
        >
          {isPieChartVisible ? (
            <PieChart accessibilityLayer>
              <ChartTooltip
                labelFormatter={() => <div className="font-semibold">Time</div>}
                content={<ChartTooltipContent labelClassName="font-semibold" />}
                formatter={(value: string, language, { payload }) =>
                  CustomChartToolTip(
                    parseInt(value),
                    payload.color,
                    language.toString(),
                    payload.percentage,
                  )
                }
              />
              <ChartLegend
                content={
                  <ChartLegendContent
                    order="DESC"
                    className="text-xs"
                    limit={20}
                  />
                }
                className="flex-wrap justify-end pr-2 max-small:hidden"
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
              <Pie
                data={pieChartData}
                dataKey="time"
                nameKey="languageName"
                className="cursor-pointer"
              >
                {pieChartData?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
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
                  _date: string,
                  payload: Payload<string, string>[],
                ) => <div>{payload[0].payload.originalDate}</div>}
                formatter={(value: string, language) =>
                  CustomChartToolTip(
                    parseInt(value),
                    languagesAttributes[
                      language as keyof typeof languagesAttributes
                    ].color || DEFAULT_COLOR,
                    language,
                  )
                }
              />
              {[...new Set(barChartData?.flatMap((day) => Object.keys(day)))]
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
                        (languagesAttributes[
                          language as keyof typeof languagesAttributes
                        ].color as string) || DEFAULT_COLOR
                      }
                      className="cursor-pointer"
                    />
                  );
                })}
            </BarChart>
          )}
        </ChartContainer>
      </div>
    </div>
  );
};

export default PeriodLanguagesChart;
