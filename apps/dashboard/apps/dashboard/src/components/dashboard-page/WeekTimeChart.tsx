import { Period } from "@/utils/types-schemas";
import fetchTimeSpentOnPeriod from "@/utils/fetchTimeSpentOnPeriod";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const WeekTimeChart = () => {
  const [chartPeriod, setchartPeriod] = useState<Period>("This week");
  const { data, error, isPending } = useQuery({
    queryKey: ["weeklyTime"],
    queryFn: () => {
      return fetchTimeSpentOnPeriod(chartPeriod);
    },
    refetchOnWindowFocus: true,
  });
  return <div>WeekTimeChart</div>;
};

export default WeekTimeChart;
