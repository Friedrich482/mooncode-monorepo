import { PERIODS_CONFIG } from "@/constants";
import PeriodDropDown from "./PeriodDropDown";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { trpc } from "@/utils/trpc";
import { usePeriodStore } from "@/hooks/store/periodStore";

const TimeSpentOnPeriod = () => {
  // TODO  this should be an url state
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);

  const { isLoading, error, data } =
    trpc.codingStats.getTimeSpentOnPeriod.useQuery(
      period === "Custom Range"
        ? {
            start: customRange.start,
            end: customRange.end,
          }
        : {
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
          },
      { refetchOnWindowFocus: true },
    );

  return (
    <h1 className="flex flex-row items-start justify-start gap-4 pt-2 text-2xl max-[550px]:flex-col max-[410px]:text-base">
      <PeriodDropDown />{" "}
      <div className="flex items-center gap-2 text-center">
        <span
          className={cn(
            "text-nowrap",
            error instanceof Error && "text-red-600",
          )}
        >
          {isLoading && <Skeleton className="h-6 w-28" />}
          {error instanceof Error && `An error occurred: ${error.message}`}
          {data !== undefined && data.formattedTime}
        </span>
      </div>
    </h1>
  );
};

export default TimeSpentOnPeriod;
