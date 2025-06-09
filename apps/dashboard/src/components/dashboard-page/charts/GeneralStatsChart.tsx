import { PERIODS_CONFIG } from "@/constants";
import { cn } from "@/lib/utils";
import getLanguageColor from "@/utils/getLanguageColor";
import getLanguageName from "@/utils/getLanguageName";
import { usePeriodStore } from "@/hooks/store/periodStore";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";

const StatWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-1/2 flex-col justify-center gap-1 rounded-md border border-neutral-600/50 px-2 text-center max-[28.125rem]:min-w-full">
    {children}
  </div>
);
const TwoStatsWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex min-h-36 flex-row gap-4 text-xl max-[28.125rem]:flex-col max-[28.125rem]:text-base",
      className,
    )}
  >
    {children}
  </div>
);
const GeneralStatsChart = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const customRange = usePeriodStore((state) => state.customRange);

  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.codingStats.getPeriodGeneralStats.queryOptions(
      period === "Custom Range"
        ? {
            start: customRange.start,
            end: customRange.end,
            groupBy,
          }
        : {
            start: PERIODS_CONFIG[period].start,
            end: PERIODS_CONFIG[period].end,
            groupBy,
          },
      { refetchOnWindowFocus: true },
    ),
  );

  const { avgTime, percentageToAvg, mostActiveDate, mostUsedLanguage } = data;
  const mostUsedLanguageColor = getLanguageColor(mostUsedLanguage);
  const mostUsedLanguageName = getLanguageName(mostUsedLanguage);

  return (
    <div className="flex min-h-96 w-[45%] flex-col gap-y-3 rounded-md border border-neutral-600/50 p-3 text-2xl max-chart:w-full max-[28.125rem]:justify-between max-[28.125rem]:gap-0">
      <h2 className="text-center text-2xl font-bold">General stats</h2>
      <TwoStatsWrapper className="max-[28.125rem]:pt-4">
        <StatWrapper>
          <p>Average time per {groupBy?.slice(0, -1)}</p>
          <p className="font-bold text-moon/85">{avgTime}</p>
        </StatWrapper>
        <StatWrapper>
          <p>Percentage to the average</p>
          <p
            className={cn(
              "font-bold",
              percentageToAvg >= 0 && "text-green-600",
              percentageToAvg < 0 && "text-red-600",
            )}
          >
            {percentageToAvg < 0 ? percentageToAvg : `+${percentageToAvg}`}%
          </p>
        </StatWrapper>
      </TwoStatsWrapper>
      <TwoStatsWrapper>
        <StatWrapper>
          <p>Most active {groupBy?.slice(0, -1)}</p>
          <p className="font-bold text-moon/85">{mostActiveDate}</p>
        </StatWrapper>
        <StatWrapper>
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
        </StatWrapper>
      </TwoStatsWrapper>
    </div>
  );
};

export default GeneralStatsChart;
