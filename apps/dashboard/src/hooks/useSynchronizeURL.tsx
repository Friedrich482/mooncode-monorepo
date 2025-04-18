import { convertToISOFormat } from "@/utils/dates-conversion";
import { useEffect } from "react";
import { usePeriodStore } from "./store/periodStore";
import { useSearchParams } from "react-router";

const useSynchronizeURL = () => {
  const period = usePeriodStore((state) => state.period);
  const customRange = usePeriodStore((state) => state.customRange);

  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (period !== "Custom Range") {
      setSearchParams({ period });
      return;
    }
    setSearchParams({
      start: convertToISOFormat(customRange.start),
      end: convertToISOFormat(customRange.end),
    });
  }, [period, customRange.start, customRange.end]);
};

export default useSynchronizeURL;
