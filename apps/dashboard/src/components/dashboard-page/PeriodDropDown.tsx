import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PERIODS, WEEK_PERIODS, YEAR_PERIODS } from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import CalendarPopover from "../CalendarPopover";
import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Period } from "@/types-schemas";
import { differenceInDays } from "date-fns";
import { usePeriodStore } from "@/hooks/store/periodStore";

const PeriodDropDown = () => {
  const period = usePeriodStore((state) => state.period);
  const groupBy = usePeriodStore((state) => state.groupBy);
  const setPeriod = usePeriodStore((state) => state.setPeriod);
  const setGroupBy = usePeriodStore((state) => state.setGroupBy);
  const setCustomRange = usePeriodStore((state) => state.setCustomRange);

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
  });
  const start = useMemo(
    () => dateRange.from?.toLocaleDateString(),
    [dateRange.from],
  );
  const end = useMemo(() => dateRange.to?.toLocaleDateString(), [dateRange.to]);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleClick = (item: Period) => {
    if (item === "Custom Range") {
      setIsPopoverOpen((prev) => !prev);
    }
    setPeriod(item);
    // if the period is a week_period, like "Last 7 days" we force the groupBy to be "days"
    if (WEEK_PERIODS.includes(item)) {
      setGroupBy("days");
      return;
    }
    // if the item is not a year period, it is in the middle (2 weeks, one month)
    else if (!YEAR_PERIODS.includes(item) && groupBy === "months") {
      setGroupBy("weeks");
      return;
    }
  };

  useEffect(() => {
    if (period === "Custom Range") {
      if (start && end) {
        const numberOfDays = Math.abs(differenceInDays(start, end));
        const periodResolution =
          numberOfDays < 7 ? "day" : numberOfDays < 31 ? "week" : "month";
        setCustomRange({
          start,
          end,
          periodResolution,
        });
      }
    }
  }, [start, end]);

  return (
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
      <DropdownMenuContent className="w-40 p-2" align="start">
        {PERIODS.map((item) => {
          const isCustomRange = item === "Custom Range";

          if (!isCustomRange) {
            return (
              <DropdownMenuItem
                key={item}
                onClick={() => handleClick(item)}
                className="cursor-pointer rounded-md py-1 text-base"
              >
                {item}
              </DropdownMenuItem>
            );
          }
          return (
            <CalendarPopover
              key={item}
              mode="range"
              className="translate-x-[13.55rem] translate-y-11"
              date={dateRange}
              setDate={setDateRange}
              isPopoverOpen={isPopoverOpen}
              setIsPopoverOpen={setIsPopoverOpen}
              popoverTriggerContent={
                <DropdownMenuItem
                  className="cursor-pointer rounded-md py-1 text-base"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(item);
                  }}
                >
                  {item}
                </DropdownMenuItem>
              }
            />
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PeriodDropDown;
