import { Period } from "@/utils/types-schemas";
import PeriodDropDown from "./PeriodDropDown";
import TimeSpentTodaySkeleton from "../ui/skeleton/TimeSpentTodaySkeleton";
import { cn } from "@/lib/utils";
import fetchPeriodTimeSpent from "@/utils/fetchPeriodTimeSpent";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TimeSpentOnPeriod = () => {
  // TODO  this should also be an url state
  const [period, setPeriod] = useState<Period>("Today");
  const handleClick = (item: Period) => setPeriod(item);

  const { isPending, error, data } = useQuery({
    queryKey: [`timeSpent ${period}`],
    queryFn: () => {
      return fetchPeriodTimeSpent(period);
    },
    refetchOnWindowFocus: true,
  });

  const seconds = data!;
  const minutes = Math.floor((seconds % 3600) / 60);
  const hours = Math.floor(seconds / 3600);

  return (
    <h1 className="flex items-center justify-start gap-4 text-2xl">
      <PeriodDropDown period={period} handleClick={handleClick} />{" "}
      <div className="flex gap-2">
        <span className="font-bold">{period}: </span>
        <span className={cn("", error && "text-red-600")}>
          {isPending && <TimeSpentTodaySkeleton />}
          {error && `An error occurred: ${error.message}`}
          {data != null &&
            `${hours ? `${hours} hr${hours !== 1 ? "s" : ""} ` : ""}${minutes} min${minutes !== 1 ? "s" : ""}`}{" "}
        </span>
      </div>
    </h1>
  );
};

export default TimeSpentOnPeriod;
