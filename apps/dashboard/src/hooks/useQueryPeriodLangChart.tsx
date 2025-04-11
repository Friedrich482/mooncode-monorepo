import { PERIODS_CONFIG } from "@/constants";
import getLanguageColor from "@/utils/getLanguageColor";
import { trpc } from "@/utils/trpc";
import { usePeriodStore } from "./store/periodStore";

const useQueryPeriodLangChart = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);

  const {
    data: pieChart,
    error: pieChartError,
    isLoading: isLoadingPie,
  } = trpc.codingStats.getPeriodLanguagesTime.useQuery(
    {
      start: PERIODS_CONFIG[period].start,
      end: PERIODS_CONFIG[period].end,
    },
    {
      refetchOnWindowFocus: true,
    },
  );
  const {
    data: barChartData,
    error: barChartError,
    isLoading: isLoadingBar,
  } = trpc.codingStats.getPeriodLanguagesPerDay.useQuery(
    {
      start: PERIODS_CONFIG[period].start,
      end: PERIODS_CONFIG[period].end,
      groupBy,
      periodResolution: PERIODS_CONFIG[period].periodResolution,
    },
    { refetchOnWindowFocus: true },
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
