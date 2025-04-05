import { DEFAULT_COLOR } from "@/constants";
import languagesAttributes from "@/colors.json";
import { trpc } from "@/utils/trpc";

const useQueryWeekLangChart = () => {
  const {
    data: pieChart,
    error: pieChartError,
    isLoading: isLoadingPie,
  } = trpc.codingStats.getWeeklyLanguagesTime.useQuery(
    { offset: 0 },
    {
      refetchOnWindowFocus: true,
    },
  );
  const {
    data: barChartData,
    error: barChartError,
    isLoading: isLoadingBar,
  } = trpc.codingStats.getWeeklyLanguagesPerDay.useQuery(
    {
      offset: 0,
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

export default useQueryWeekLangChart;
