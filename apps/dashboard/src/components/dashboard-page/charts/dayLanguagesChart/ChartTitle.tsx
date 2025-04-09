import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils";
import { useState } from "react";

const ChartTitle = ({
  displayDate,
  formattedTotalTimeSpent,
  handleChevronLeftClick,
  handleChevronRightClick,
  date,
  setDate,
}: {
  handleChevronLeftClick: () => void;
  handleChevronRightClick: () => void;
  formattedTotalTimeSpent: string;
  displayDate: string;
  date: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const handleClick = () => setIsPopoverOpen((prev) => !prev);

  return (
    <h2 className="flex items-center justify-between gap-4 px-3 text-center text-2xl font-bold">
      <Icon Icon={ChevronLeft} onClick={handleChevronLeftClick} />
      <div className="relative">
        {formattedTotalTimeSpent} -{" "}
        <Popover
          open={isPopoverOpen}
          onOpenChange={setIsPopoverOpen}
          defaultOpen={true}
        >
          <PopoverTrigger asChild>
            <Button
              variant="link"
              onClick={handleClick}
              className="p-0 text-2xl"
            >
              {displayDate}
            </Button>
          </PopoverTrigger>
          <PopoverContent sideOffset={4}>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(e) => {
                setDate(e || date);
                setIsPopoverOpen(false);
              }}
              className="p-2"
              classNames={{
                day_today: cn(
                  "shadow-sm shadow-moon",
                  date.getDate() === new Date().getDate() && "shadow-none",
                ),
              }}
              disabled={{ after: new Date() }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <Icon
        Icon={ChevronRight}
        onClick={handleChevronRightClick}
        // deactivate the next date button if we are "Today"
        disabled={date.getDate() === new Date().getDate()}
      />
    </h2>
  );
};

export default ChartTitle;
