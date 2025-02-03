import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Period } from "@/utils/types-schemas";
import TimeSpentTodaySkeleton from "../ui/skeleton/TimeSpentTodaySkeleton";
import fetchTimeSpentToday from "@/utils/fetchTimeSpentToday";
import { periodDropDownItems } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const TimeSpentToday = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["timeSpentToday"],
    queryFn: fetchTimeSpentToday,
  });
  const [period, setPeriod] = useState<Period>("Today");
  return (
    <h1 className="flex items-center justify-start gap-4 text-2xl">
      <span className="font-bold">{period}:</span>
      {isPending && <TimeSpentTodaySkeleton />}
      {error && (
        <span className="text-red-600">An error occurred: {error.message}</span>
      )}
      {data && `${data} seconds`}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2 bg-neutral-200 dark:bg-accent"
          >
            <span>{period}</span>
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-40 translate-y-3 cursor-pointer rounded-md border-[1px] border-neutral-700 bg-neutral-100 p-2 dark:bg-neutral-950"
          align="end"
        >
          {periodDropDownItems.map((item) => (
            <DropdownMenuItem
              key={item}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-base outline-0 hover:bg-neutral-200 hover:text-black dark:text-white dark:hover:bg-accent dark:hover:text-white"
              onClick={() => setPeriod(item)}
            >
              {item}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </h1>
  );
};

export default TimeSpentToday;
