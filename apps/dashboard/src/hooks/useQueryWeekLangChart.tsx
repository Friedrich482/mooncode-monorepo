import { DEFAULT_COLOR } from "@/constants";
import languagesAttributes from "@/colors.json";
import { trpc } from "@/utils/trpc";

const useQueryWeekLangChart = () => {
  const {
    data: pieChart,
    error: pieChartError,
    isLoading: isLoadingPie,
  } = trpc.codingData.getWeekLanguagesTime.useQuery(
    { offset: 0 },
    {
      refetchOnWindowFocus: true,
    },
  );
  const {
    data: barChartData,
    error: barChartError,
    isLoading: isLoadingBar,
  } = trpc.codingData.getLanguagesWeekPerDay.useQuery(
    {
      offset: 0,
    },
    { refetchOnWindowFocus: true },
  );
  //   TODO put a default color
  const pieChartData = pieChart?.map((entry) => ({
    ...entry,
    color:
      languagesAttributes[
        entry.languageName as keyof typeof languagesAttributes
      ].color || DEFAULT_COLOR,
  }));

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
