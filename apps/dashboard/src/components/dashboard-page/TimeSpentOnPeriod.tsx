import ErrorBoundary from "../suspense/ErrorBoundary";
import { PERIODS_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";
import { usePeriodStore } from "@/hooks/store/periodStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const TimeSpentOnPeriod = () => {
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);
  const trpc = useTRPC();
  const { error, data } = useSuspenseQuery(
    trpc.codingStats.getTimeSpentOnPeriod.queryOptions(
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
  if (error) {
    return <ErrorBoundary error={error} className="text-red-500" />;
  }

  return <span className={cn("text-nowrap")}>{data.formattedTime}</span>;
};
export default TimeSpentOnPeriod;
