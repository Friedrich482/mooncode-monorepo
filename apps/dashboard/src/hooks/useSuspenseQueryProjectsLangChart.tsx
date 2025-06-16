import { PERIODS_CONFIG } from "@/constants";
import { ProjectParamsSchema } from "@/types-schemas";
import getLanguageColor from "@/utils/getLanguageColor";
import { usePeriodStore } from "./store/periodStore";
import useSafeParams from "./useSafeParams";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const useSuspenseQueryProjectsLangChart = () => {
  const { projectName: name } = useSafeParams(ProjectParamsSchema);

  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);

  const trpc = useTRPC();
  const { data: pieChart } = useSuspenseQuery(
    trpc.filesStats.getProjectLanguagesTimeOnPeriod.queryOptions(
      period === "Custom Range"
        ? {
            start: customRange.start,
            end: customRange.end,
            name,
          }
        : {
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
            name,
          },
    ),
  );

  const pieChartData = pieChart.map((entry) => {
    const color = getLanguageColor(entry.languageName);
    return {
      ...entry,
      color: color,
    };
  });

  return { pieChartData };
};

export default useSuspenseQueryProjectsLangChart;
