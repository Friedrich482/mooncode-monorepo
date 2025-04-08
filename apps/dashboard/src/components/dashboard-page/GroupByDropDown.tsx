import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { GROUP_BY_DROPDOWN_ITEMS, WEEK_PERIODS } from "@/constants";
import { Group } from "lucide-react";
import Icon from "../ui/Icon";
import { cn } from "@/lib/utils";
import { usePeriodStore } from "@/hooks/store/periodStore";

const GroupByDropDown = () => {
  const period = usePeriodStore((state) => state.period);
  const setGroupBy = usePeriodStore((state) => state.setGroupBy);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Icon
          Icon={Group}
          className={cn(
            "absolute -top-11 left-0 z-0 flex",
            WEEK_PERIODS.includes(period) && "hidden",
          )}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-10 w-40 translate-y-1 cursor-pointer rounded-md border-[1px] border-neutral-700 bg-neutral-100 p-2 dark:bg-neutral-950"
        align="start"
      >
        {GROUP_BY_DROPDOWN_ITEMS.map(({ text, groupBy, Icon }) => (
          <DropdownMenuItem
            key={groupBy}
            className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-base outline-0 hover:bg-neutral-200 hover:text-black dark:text-white dark:hover:bg-accent dark:hover:text-white"
            onClick={() => setGroupBy(groupBy)}
          >
            <Icon />
            {text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GroupByDropDown;
