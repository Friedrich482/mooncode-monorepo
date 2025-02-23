import { Period } from "@/types-schemas";
import PeriodDropDown from "./PeriodDropDown";
import TimeSpentTodaySkeleton from "../ui/skeleton/TimeSpentTodaySkeleton";
import { cn } from "@/lib/utils";
import fetchPeriodTimeSpent from "@/utils/fetch/fetchPeriodTimeSpent";
import formatDuration from "@/utils/formatDuration";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TimeSpentOnPeriod = () => {
  // TODO  this should be an url state
  const [period, setPeriod] = useState<Period>("This week");
  const handleClick = (item: Period) => setPeriod(item);

  const { isPending, error, data } = useQuery({
    queryKey: ["total time", period],
    queryFn: () => fetchPeriodTimeSpent(period),
    refetchOnWindowFocus: true,
  });

  return (
    <h1 className="flex flex-row items-start justify-start gap-4 pt-2 text-2xl max-[550px]:flex-col max-[410px]:text-base">
      <PeriodDropDown period={period} handleClick={handleClick} />{" "}
      <div className="flex gap-2 text-center">
        <span className="text-nowrap font-bold">{period}: </span>
        <span className={cn("text-nowrap", error && "text-red-600")}>
          {isPending && <TimeSpentTodaySkeleton />}
          {error && `An error occurred: ${error.message}`}
          {data !== undefined && formatDuration(data)}
        </span>
      </div>
    </h1>
  );
};

export default TimeSpentOnPeriod;
