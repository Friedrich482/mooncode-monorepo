import { PERIODS_CONFIG } from "@/constants";
import getLanguageColor from "@/utils/getLanguageColor";
import { usePeriodStore } from "./store/periodStore";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const useQueryPeriodLangChart = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const customRange = usePeriodStore((state) => state.customRange);

  const trpc = useTRPC();
  const {
    data: pieChart,
    error: pieChartError,
    isLoading: isLoadingPie,
  } = useQuery(
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

  const {
    data: barChartData,
    error: barChartError,
    isLoading: isLoadingBar,
  } = useQuery(
    trpc.codingStats.getPeriodLanguagesPerDay.queryOptions(
      period === "Custom Range"
        ? {
            start: customRange.start,
            end: customRange.end,
            groupBy: groupBy,
            periodResolution: customRange.periodResolution,
          }
        : {
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
            groupBy,
            periodResolution: PERIODS_CONFIG[period].periodResolution,
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
    isLoadingPie,
    barChartData,
    barChartError,
    isLoadingBar,
  };
};

export default useQueryPeriodLangChart;
