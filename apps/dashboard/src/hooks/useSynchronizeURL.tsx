import { useEffect } from "react";
import { usePeriodStore } from "./store/periodStore";
import { useSearchParams } from "react-router";

const useSynchronizeURL = () => {
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);
  const groupBy = usePeriodStore((state) => state.groupBy);

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (period !== "Custom Range") {
      if (groupBy && groupBy !== "days") {
        setSearchParams({ period, groupBy });
        return;
      }
      setSearchParams({ period });
      return;
    }

    if (groupBy && groupBy !== "days") {
      setSearchParams({
        start: customRange.start,
        end: customRange.end,
        groupBy,
      });
      return;
    }
    setSearchParams({
      start: customRange.start,
      end: customRange.end,
    });
  }, [period, customRange.start, customRange.end, groupBy]);
};

export default useSynchronizeURL;
