import { Button } from "@/components/ui/button";
import CalendarPopover from "@/components/ui/CalendarPopover";
import PeriodDropDown from "./PeriodDropDown";
import SuspenseBoundary from "../suspense/SuspenseBoundary";
import TimeSpentOnPeriod from "./TimeSpentOnPeriod";
import { usePeriodStore } from "@/hooks/store/periodStore";
import { useState } from "react";
import useUpdateCustomRangeDates from "@/hooks/useUpdateCustomRangeDates";

const DashboardTitle = () => {
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);

  const [isStartPopoverOpen, setIsStartPopoverOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(customRange.start));
  const [isEndPopoverOpen, setIsEndPopoverOpen] = useState(false);
  const [endDate, setEndDate] = useState(new Date(customRange.end));

  useUpdateCustomRangeDates(startDate, endDate);

  return (
    <h1 className="max-[34.375rem]:flex-col max-[25.625rem]:text-base flex flex-row items-start justify-start gap-4 pt-2 text-2xl">
      <div className="flex flex-wrap items-center gap-2 text-center">
        <PeriodDropDown />{" "}
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
                <Button
                  variant="link"
                  className="max-[25.625rem]:text-base p-0 text-2xl text-moon"
                >
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
                <Button
                  variant="link"
                  className="max-[25.625rem]:text-base p-0 text-2xl text-moon"
                >
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
