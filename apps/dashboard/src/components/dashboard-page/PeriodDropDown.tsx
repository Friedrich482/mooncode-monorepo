import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { PERIODS } from "@/constants";
import { usePeriodStore } from "@/hooks/store/periodStore";

const PeriodDropDown = () => {
  const period = usePeriodStore((state) => state.period);
  const setPeriod = usePeriodStore((state) => state.setPeriod);

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
      <DropdownMenuContent
        className="z-10 w-40 translate-y-3 cursor-pointer rounded-md border-[1px] border-neutral-700 bg-neutral-100 p-2 dark:bg-neutral-950"
        align="start"
      >
        {PERIODS.map((item) => (
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
  );
};

export default PeriodDropDown;
