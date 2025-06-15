import { Bar, ComposedChart, Line, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PERIODS_CONFIG, chartConfig } from "@/constants";
import CustomChartToolTip from "@/components/ui/custom-chart-tool-tip";
import GroupByDropDown from "@/components/dashboard-page/GroupByDropDown";
import { Payload } from "recharts/types/component/DefaultTooltipContent";
import { ProjectParamsSchema } from "@/types-schemas";
import { formatTickForGroupBy } from "@/utils/formatTickForGroupBy";
import { usePeriodStore } from "@/hooks/store/periodStore";
import useSafeParams from "@/hooks/useSafeParams";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const ProjectTimeOnPeriodChart = () => {
  const { projectName: name } = useSafeParams(ProjectParamsSchema);

  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const customRange = usePeriodStore((state) => state.customRange);

  const trpc = useTRPC();

  const { data: chartData } = useSuspenseQuery(
    trpc.filesStats.getProjectPerDayOfPeriod.queryOptions(
      period === "Custom Range"
        ? {
            start: customRange.start,
            end: customRange.end,
            name,
            groupBy,
          }
        : {
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
            name,
            groupBy,
          },
    ),
  );

  return (
    <div className="relative z-0 flex min-h-96 w-[45%] flex-col rounded-md border border-neutral-600/50 max-chart:w-full">
      <GroupByDropDown />
      <ChartContainer
        config={chartConfig}
        className="h-full flex-1 border-none"
      >
        <ComposedChart data={chartData}>
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => formatTickForGroupBy(value, groupBy)}
          />
          <ChartTooltip
            content={<ChartTooltipContent labelClassName="font-semibold" />}
            labelFormatter={(
              _date: string,
              payload: Payload<string, string>[] = [],
            ) =>
              payload.length ? (
                <div>{payload[0].payload.originalDate}</div>
              ) : null
            }
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
    </div>
  );
};

export default ProjectTimeOnPeriodChart;
