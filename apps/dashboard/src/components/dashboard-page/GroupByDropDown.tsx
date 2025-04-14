import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GROUP_BY_DROPDOWN_ITEMS, PERIODS_CONFIG } from "@/constants";
import { Button } from "../ui/button";
import { Group } from "lucide-react";
import { useMemo } from "react";
import { usePeriodStore } from "@/hooks/store/periodStore";

const GroupByDropDown = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const setGroupBy = usePeriodStore((state) => state.setGroupBy);
  const customRange = usePeriodStore((state) => state.customRange);
  const periodResolution = useMemo(() => {
    if (period === "Custom Range") {
      return customRange.periodResolution;
    }
    return PERIODS_CONFIG[period].periodResolution;
  }, [period]);

  return (
    periodResolution !== "day" && (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="absolute -top-11 left-0 flex items-center gap-4 bg-neutral-200 dark:bg-accent"
          >
            <Group />
            <span>
              {
                GROUP_BY_DROPDOWN_ITEMS.find(
                  (entry) => entry.groupBy === groupBy,
                )?.text
              }
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 p-2" align="start">
          {GROUP_BY_DROPDOWN_ITEMS.slice(
            0,
            // we show "Months" only if the periodResolution is "year" (typically "This year" or "Last year")
            periodResolution === "year"
              ? undefined
              : periodResolution === "month" || periodResolution === "week"
                ? -1
                : -2,
          ).map(({ text, groupBy }) => (
            <DropdownMenuItem
              key={groupBy}
              className="cursor-pointer rounded-md py-1 text-base"
              onClick={() => setGroupBy(groupBy)}
            >
              {text}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  );
};

export default GroupByDropDown;
