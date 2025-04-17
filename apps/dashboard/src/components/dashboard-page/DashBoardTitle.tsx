import { Button } from "../ui/button";
import CalendarPopover from "@/components/ui/CalendarPopover";
import PeriodDropDown from "./PeriodDropDown";
import SuspenseBoundary from "../suspense/SuspenseBoundary";
import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import { usePeriodStore } from "@/hooks/store/periodStore";
import { useState } from "react";
import useUpdateCustomRangeDates from "@/hooks/useUpdateCustomRangeDates";

const DashboardTitle = () => {
  // TODO  this should be an url state
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);

  const [isStartPopoverOpen, setIsStartPopoverOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(customRange.start));
  const [isEndPopoverOpen, setIsEndPopoverOpen] = useState(false);
  const [endDate, setEndDate] = useState(new Date(customRange.end));

  useUpdateCustomRangeDates(startDate, endDate);

  return (
    <h1 className="flex flex-row items-start justify-start gap-4 pt-2 text-2xl max-[550px]:flex-col max-[410px]:text-base">
      <PeriodDropDown />{" "}
      <div className="flex items-center gap-2 text-center">
        <SuspenseBoundary fallBackClassName="h-9 w-44">
          <TimeSpentOnPeriod />
        </SuspenseBoundary>

        {period === "Custom Range" && (
          <>
            on
            <CalendarPopover
              mode="single"
              isPopoverOpen={isStartPopoverOpen}
              setIsPopoverOpen={setIsStartPopoverOpen}
              date={startDate}
              setDate={setStartDate}
              popoverTriggerContent={
                <Button variant="link" className="p-0 text-2xl text-moon">
                  {new Date(customRange.start).toDateString()}
                </Button>
              }
            />
            to
            <CalendarPopover
              mode="single"
              isPopoverOpen={isEndPopoverOpen}
              setIsPopoverOpen={setIsEndPopoverOpen}
              date={endDate}
              setDate={setEndDate}
              popoverTriggerContent={
                <Button variant="link" className="p-0 text-2xl text-moon">
                  {new Date(customRange.end).toDateString()}
                </Button>
              }
            />
          </>
        )}
      </div>
    </h1>
  );
};

export default DashboardTitle;
