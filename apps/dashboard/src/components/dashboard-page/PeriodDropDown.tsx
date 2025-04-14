import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PERIODS,
  PERIODS_CONFIG,
  WEEK_PERIODS,
  YEAR_PERIODS,
} from "@/constants";
import { useEffect, useMemo, useState } from "react";
import { Button } from "../ui/button";
import CalendarPopover from "../CalendarPopover";
import { ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Period } from "@/types-schemas";
import { usePeriodStore } from "@/hooks/store/periodStore";

const PeriodDropDown = () => {
  const period = usePeriodStore((state) => state.period);
  const setPeriod = usePeriodStore((state) => state.setPeriod);
  const setGroupBy = usePeriodStore((state) => state.setGroupBy);

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
    if (item !== "Custom Range") {
      setPeriod(item);
    } else {
      setIsPopoverOpen((prev) => !prev);
      if (start && end) {
        PERIODS_CONFIG["Custom Range"].start = start;
        PERIODS_CONFIG["Custom Range"].end = end;
        setPeriod("Custom Range");
        return;
      }
    }
    // we force that state to avoid inconsistencies in the data fetching and displaying
    // if the period is a week_period, like "Last 7 days" we force the groupBy to be "days"
    if (WEEK_PERIODS.includes(item)) {
      setGroupBy("days");
      return;
    }
    // if the item is not a year period, it is in the middle (2 weeks, one month)
    else if (!YEAR_PERIODS.includes(item)) {
      setGroupBy("weeks");
      return;
    }
  };
  useEffect(() => console.log(start, end), [start, end]);
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
        {PERIODS.map((item, index) => {
          const isLastItem = index === PERIODS.length - 1;

          if (!isLastItem) {
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
