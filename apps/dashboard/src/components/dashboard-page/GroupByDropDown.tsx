import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { GROUP_BY_DROPDOWN_ITEMS, PERIODS_CONFIG } from "@/constants";
import { Button } from "../ui/button";
import { Group } from "lucide-react";
import { useMemo } from "react";
import { usePeriodStore } from "@/hooks/store/periodStore";

const GroupByDropDown = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const setGroupBy = usePeriodStore((state) => state.setGroupBy);
  const periodResolution = useMemo(
    () => PERIODS_CONFIG[period].periodResolution,
    [period],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="absolute -top-11 left-0 flex items-center gap-4 bg-neutral-200 dark:bg-accent"
        >
          <Group />
          <span>
            {
              GROUP_BY_DROPDOWN_ITEMS.find((entry) => entry.groupBy === groupBy)
                ?.text
            }
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-10 w-40 translate-y-1 cursor-pointer rounded-md border-[1px] border-neutral-700 bg-neutral-100 p-2 dark:bg-neutral-950"
        align="start"
      >
        {GROUP_BY_DROPDOWN_ITEMS.slice(
          0,
          // we show "Months only if the periodResolution is "year" (typically "This year" or "Last year")
          periodResolution === "year" ? undefined : -1,
        ).map(({ text, groupBy }) => (
          <DropdownMenuItem
            key={groupBy}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-base outline-0 hover:bg-neutral-200 hover:text-black dark:text-white dark:hover:bg-accent dark:hover:text-white"
            onClick={() => setGroupBy(groupBy)}
          >
            {text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupByDropDown;
