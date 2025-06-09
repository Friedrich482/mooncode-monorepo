import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalendarPopover from "@/components/ui/CalendarPopover";
import Icon from "@/components/ui/Icon";
import { isSameDay } from "date-fns";
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

  return (
    <h2 className="flex items-center justify-between gap-4 px-3 text-center text-2xl font-bold">
      <Icon Icon={ChevronLeft} onClick={handleChevronLeftClick} />
      <div className="inline-block max-[26.25rem]:text-lg max-[24.375rem]:text-sm">
        {formattedTotalTimeSpent} -{" "}
        <CalendarPopover
          mode="single"
          isPopoverOpen={isPopoverOpen}
          setIsPopoverOpen={setIsPopoverOpen}
          date={date}
          setDate={setDate}
          popoverTriggerContent={
            <Button
              variant="link"
              className="p-0 text-2xl max-[26.25rem]:text-lg max-[24.375rem]:text-sm"
            >
              {displayDate}
            </Button>
          }
        />
      </div>
      <Icon
        Icon={ChevronRight}
        onClick={handleChevronRightClick}
        // deactivate the next date button if we are "Today"
        disabled={isSameDay(date, new Date())}
      />
    </h2>
  );
};

export default ChartTitle;
