import { DEFAULT_COLOR, WEEKLY_PERIODS_CONFIG } from "@/constants";
import { WeeklyPeriod } from "@/types-schemas";
import languagesAttributes from "@/colors.json";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

const useQueryWeeklyLangChart = () => {
  const [chartPeriod] = useState<WeeklyPeriod>("Last 7 days");

  const {
    data: pieChart,
    error: pieChartError,
    isLoading: isLoadingPie,
  } = trpc.codingStats.getWeeklyLanguagesTime.useQuery(
    {
      start: WEEKLY_PERIODS_CONFIG[chartPeriod].start,
      end: WEEKLY_PERIODS_CONFIG[chartPeriod].end,
    },
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
      start: WEEKLY_PERIODS_CONFIG[chartPeriod].start,
      end: WEEKLY_PERIODS_CONFIG[chartPeriod].end,
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

export default useQueryWeeklyLangChart;
