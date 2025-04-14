import { PERIODS_CONFIG } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import getLanguageColor from "@/utils/getLanguageColor";
import getLanguageName from "@/utils/getLanguageName";
import { trpc } from "@/utils/trpc";
import { usePeriodStore } from "@/hooks/store/periodStore";

const GeneralStatsChart = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const customRange = usePeriodStore((state) => state.customRange);

  const { data, error, isLoading } =
    trpc.codingStats.getPeriodGeneralStats.useQuery(
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
    );

  if (error) {
    return (
      <span className="text-red-500">An error occurred: {error.message}</span>
    );
  }
  if (isLoading) {
    return <Skeleton className="h-[24rem] w-[45%] max-chart:w-full" />;
  }

  const { avgTime, mostActiveDate, mostUsedLanguage } = data;
  const mostUsedLanguageColor = getLanguageColor(mostUsedLanguage);
  const mostUsedLanguageName = getLanguageName(mostUsedLanguage);

  return (
    <div className="flex min-h-96 w-[45%] flex-col gap-y-3 rounded-md border border-neutral-600/50 p-3 text-2xl max-chart:w-full">
      <div className="text-center text-2xl font-bold">General stats</div>
      <div className="flex w-full flex-1 flex-col justify-center rounded-md border border-neutral-600/50 text-center">
        <p>Average time per {groupBy?.slice(0, -1)}</p>
        <p className="font-bold text-moon/85">{avgTime}</p>
      </div>
      <div className="flex flex-1 flex-row gap-x-4 max-sm:text-xl">
        <div className="flex w-1/2 flex-col justify-center gap-1 rounded-md border border-neutral-600/50 px-2 text-center">
          <p>Most active {groupBy?.slice(0, -1)}</p>
          <p className="font-bold text-moon/85">{mostActiveDate}</p>
        </div>
        <div className="flex w-1/2 flex-col justify-center gap-1 rounded-md border border-neutral-600/50 px-2 text-center">
          <p>Most used language</p>
          <div className="flex items-center justify-center gap-2">
            <div
              className="size-5 shrink-0 rounded-sm max-sm:size-3"
              style={{
                backgroundColor: mostUsedLanguageColor,
              }}
            />
            <p className="font-bold text-moon/85">{mostUsedLanguageName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralStatsChart;
