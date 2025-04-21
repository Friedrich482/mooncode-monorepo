import { PERIODS_CONFIG } from "@/constants";
import getLanguageColor from "@/utils/getLanguageColor";
import { usePeriodStore } from "./store/periodStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const useQueryPeriodLangChart = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const customRange = usePeriodStore((state) => state.customRange);

  const trpc = useTRPC();
  const { data: pieChart, error: pieChartError } = useSuspenseQuery(
    trpc.codingStats.getPeriodLanguagesTime.queryOptions(
      period === "Custom Range"
        ? {
            start: customRange.start,
            end: customRange.end,
          }
        : {
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
          },
      {
        refetchOnWindowFocus: true,
      },
    ),
  );

  const { data: barChartData, error: barChartError } = useSuspenseQuery(
    trpc.codingStats.getPeriodLanguagesPerDay.queryOptions(
      period === "Custom Range"
        ? {
            start: customRange.start,
            end: customRange.end,
            groupBy: groupBy,
          }
        : {
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
            groupBy,
          },
      { refetchOnWindowFocus: true },
    ),
  );

  const pieChartData = pieChart?.map((entry) => {
    const color = getLanguageColor(entry.languageName);
    return {
      ...entry,
      color: color,
    };
  });

  return {
    pieChartData,
    pieChartError,
    barChartData,
    barChartError,
  };
};

export default useQueryPeriodLangChart;
