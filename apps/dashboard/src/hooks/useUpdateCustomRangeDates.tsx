import getCustomRangePeriodResolution from "@/utils/getCustomRangePeriodResolution";
import { useEffect } from "react";
import { usePeriodStore } from "./store/periodStore";

const useUpdateCustomRangeDates = (startDate: Date, endDate: Date) => {
  const customRange = usePeriodStore((state) => state.customRange);
  const setCustomRange = usePeriodStore((state) => state.setCustomRange);
  const periodResolution = getCustomRangePeriodResolution(startDate, endDate);

  useEffect(
    () =>
      setCustomRange({
        start: startDate.toLocaleDateString(),
        end: customRange.end,
        periodResolution,
      }),
    [startDate],
  );

  useEffect(
    () =>
      setCustomRange({
        start: customRange.start,
        end: endDate.toLocaleDateString(),
        periodResolution,
      }),
    [endDate],
  );
};

export default useUpdateCustomRangeDates;
