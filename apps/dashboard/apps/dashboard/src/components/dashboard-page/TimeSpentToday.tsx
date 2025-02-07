import { Period } from "@/utils/types-schemas";
import PeriodDropDown from "./PeriodDropDown";
import TimeSpentTodaySkeleton from "../ui/skeleton/TimeSpentTodaySkeleton";
import { cn } from "@/lib/utils";
import fetchTimeSpentToday from "@/utils/fetchTimeSpentToday";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TimeSpentToday = () => {
  //   this should also be an url state
  const [period, setPeriod] = useState<Period>("Today");
  const handleClick = (item: Period) => setPeriod(item);

  const { isPending, error, data } = useQuery({
    queryKey: ["timeSpentToday"],
    queryFn: fetchTimeSpentToday,
  });

  const minutes = data!;
  const hours = Math.floor(minutes / 60);

  return (
    <h1 className="flex items-center justify-start gap-4 text-2xl">
      <PeriodDropDown period={period} handleClick={handleClick} />{" "}
      <div>
        <span className="font-bold">{period}: </span>
        <span className={cn("", error && "text-red-600")}>
          {isPending && <TimeSpentTodaySkeleton />}
          {error && `An error occurred: ${error.message}`}
          {data &&
            `${
              hours !== 0 ? `${hours} hr${hours !== 1 ? "s" : ""}` : ""
            } ${minutes} min${minutes !== 1 ? "s" : ""}`}
          {!data && "null"}
        </span>
      </div>
    </h1>
  );
};

export default TimeSpentToday;
