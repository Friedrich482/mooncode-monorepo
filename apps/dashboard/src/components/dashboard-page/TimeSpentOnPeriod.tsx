import { Period } from "@/types-schemas";
import PeriodDropDown from "./PeriodDropDown";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { offsets } from "@/constants";
import { trpc } from "@/utils/trpc";
import { useState } from "react";

const TimeSpentOnPeriod = () => {
  // TODO  this should be an url state
  const [period, setPeriod] = useState<Period>("This week");
  const handleClick = (item: Period) => setPeriod(item);

  // TODO here we don't only want the data for the week but also for any period
  const { isLoading, error, data } =
    trpc.codingStats.getTimeSpentOnWeek.useQuery(
      {
        offset: offsets[period],
      },
      { refetchOnWindowFocus: true },
    );
  return (
    <h1 className="flex flex-row items-start justify-start gap-4 pt-2 text-2xl max-[550px]:flex-col max-[410px]:text-base">
      <PeriodDropDown period={period} handleClick={handleClick} />{" "}
      <div className="flex items-center gap-2 text-center">
        <span className="text-nowrap font-bold">{period}: </span>
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
