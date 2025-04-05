import { DEFAULT_COLOR } from "@/constants";
import { Skeleton } from "@/components/ui/skeleton";
import languagesAttributes from "@/colors.json";
import { trpc } from "@/utils/trpc";

const GeneralStatsChart = () => {
  const { data, error, isLoading } =
    trpc.codingStats.getWeeklyGeneralStats.useQuery({ offset: 0 });

  if (error) {
    return (
      <span className="text-red-500">An error occurred: {error.message}</span>
    );
  }
  if (isLoading) {
    return <Skeleton className="h-[24rem] w-[45%] max-chart:w-full" />;
  }

  const { avgTimePerDay, mostActiveDate, mostUsedLanguage } = data;
  const mostUsedLanguageAttributes =
    languagesAttributes[mostUsedLanguage as keyof typeof languagesAttributes];

  const { color: mostUsedLanguageColor, name: mostUsedLanguageName } =
    mostUsedLanguageAttributes;

  return (
    <div className="flex min-h-96 w-[45%] flex-col gap-y-3 rounded-md border border-neutral-600/50 p-3 text-2xl max-chart:w-full">
      <div className="text-center text-2xl font-bold">General stats</div>
      <div className="flex w-full flex-1 flex-col justify-center rounded-md border border-neutral-600/50 text-center">
        <p>Average time per day</p>
        <p className="font-bold text-moon/85">{avgTimePerDay}</p>
      </div>
      <div className="flex flex-1 flex-row gap-x-4 max-sm:text-xl">
        <div className="flex w-1/2 flex-col justify-center gap-1 rounded-md border border-neutral-600/50 px-2 text-center">
          <p className="">Most active day</p>
          <p className="font-bold text-moon/85">{mostActiveDate}</p>
        </div>
        <div className="flex w-1/2 flex-col justify-center gap-1 rounded-md border border-neutral-600/50 px-2 text-center">
          <p className="">Most used language</p>
          <div className="flex items-center justify-center gap-2">
            <div
              className="size-5 shrink-0 rounded-sm max-sm:size-3"
              style={{
                backgroundColor: mostUsedLanguageColor || DEFAULT_COLOR,
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
