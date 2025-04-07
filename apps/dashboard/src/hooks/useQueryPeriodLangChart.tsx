import { DEFAULT_COLOR, PERIODS_CONFIG } from "@/constants";
import languagesAttributes from "@/colors.json";
import { trpc } from "@/utils/trpc";
import { usePeriodStore } from "./store/periodStore";

const useQueryPeriodLangChart = () => {
  const period = usePeriodStore((state) => state.period);

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
    },
    { refetchOnWindowFocus: true },
  );

  const pieChartData = pieChart?.map((entry) => {
    const color =
      languagesAttributes[
        entry.languageName as keyof typeof languagesAttributes
      ]?.color;
    return {
      ...entry,
      color: color || DEFAULT_COLOR,
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
