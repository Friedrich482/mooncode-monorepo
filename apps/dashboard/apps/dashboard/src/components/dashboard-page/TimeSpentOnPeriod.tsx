import { Period } from "@/types-schemas";
import PeriodDropDown from "./PeriodDropDown";
import TimeSpentTodaySkeleton from "../ui/skeleton/TimeSpentTodaySkeleton";
import { cn } from "@/lib/utils";
import fetchPeriodTimeSpent from "@/utils/fetch/fetchPeriodTimeSpent";
import formatDuration from "@/utils/formatDuration";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TimeSpentOnPeriod = () => {
  // TODO  this should also be an url state
  const [period, setPeriod] = useState<Period>("This week");
  const handleClick = (item: Period) => setPeriod(item);

  const { isPending, error, data } = useQuery({
    queryKey: [`timeSpent ${period}`],
    queryFn: () => {
      return fetchPeriodTimeSpent(period);
    },
    refetchOnWindowFocus: true,
  });

  return (
    <h1 className="flex items-start justify-start gap-4 pt-2 text-2xl max-[450px]:flex-col">
      <PeriodDropDown period={period} handleClick={handleClick} />{" "}
      <div className="flex gap-2 text-center">
        <span className="font-bold">{period}: </span>
        <span className={cn("", error && "text-red-600")}>
          {isPending && <TimeSpentTodaySkeleton />}
          {error && `An error occurred: ${error.message}`}
          {data != null && formatDuration(data)}
        </span>
      </div>
    </h1>
  );
};

export default TimeSpentOnPeriod;
