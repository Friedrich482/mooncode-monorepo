import fetchWeekTime from "@/utils/fetchWeekTime";
import { useQuery } from "@tanstack/react-query";

const WeekTimeChart = () => {
  const { data, error, isPending } = useQuery({
    queryKey: ["weeklyTime"],
    queryFn: fetchWeekTime,
    refetchOnWindowFocus: true,
  });
  return <div>WeekTimeChart</div>;
};

export default WeekTimeChart;
