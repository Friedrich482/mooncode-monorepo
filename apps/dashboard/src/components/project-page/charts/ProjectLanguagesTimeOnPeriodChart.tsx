import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";
import { Cell } from "recharts";
import CustomChartToolTip from "@/components/ui/custom-chart-tool-tip";
import { chartConfig } from "@/constants";
import useSuspenseQueryProjectsLangChart from "@/hooks/useSuspenseQueryProjectsLangChart";

const ProjectLanguagesTimeOnPeriodChart = () => {
  const { pieChartData } = useSuspenseQueryProjectsLangChart();

  return (
    <div className="relative w-[45%] max-chart:w-full">
      <div className="flex min-h-96 flex-col rounded-md border border-neutral-600/50">
        <h2 className="text-center text-2xl font-bold">Languages</h2>
        <ChartContainer
          config={chartConfig}
          className="w-full flex-1 border-none"
        >
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
        </ChartContainer>
      </div>
    </div>
  );
};

export default ProjectLanguagesTimeOnPeriodChart;
