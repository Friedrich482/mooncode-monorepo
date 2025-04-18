import { IsoDateSchema, Period, PeriodSchema } from "@/types-schemas";
import { PERIODS } from "@/constants";
import { PeriodResolution } from "@repo/utils/types";
import { ZodError } from "zod";
import { formatZodError } from "@/utils/formatZodIssues";
import getCustomRangePeriodResolution from "@/utils/getCustomRangePeriodResolution";

export const getPeriodStoreValuesFromURL = () => {
  let period: Period = "Last 7 days";
  let customRange: {
    start: string;
    end: string;
    periodResolution: PeriodResolution;
  } = {
    start: new Date().toLocaleDateString(),
    end: new Date().toLocaleDateString(),
    periodResolution: "month",
  };

  const handleZodError = <T,>(zodError: ZodError<T>) => {
    console.error(`${formatZodError(zodError)}. Defaulting to ${PERIODS[0]}`);
    period = PERIODS[0];
  };

  const [firstKvTuple, secondKvTuple] = new URLSearchParams(
    window.location.search.slice(1),
  );

  if (firstKvTuple) {
    const [firstParamKey, firstParamValue] = firstKvTuple;
    // handle static period
    if (PERIODS.includes(firstParamValue as Period)) {
      const parsedPeriod = PeriodSchema.safeParse(firstParamValue);

      if (!parsedPeriod.success) {
        handleZodError(parsedPeriod.error);
        return {
          period,
          customRange,
        };
      }

      const validPeriodFromURL = parsedPeriod.data;
      period = validPeriodFromURL;
      return {
        period,
        customRange,
      };
    }

    if (secondKvTuple) {
      const [secondParamKey, secondParamValue] = secondKvTuple;
      // handle custom period
      if (firstParamKey === "start" && secondParamKey === "end") {
        const parsedStart = IsoDateSchema.safeParse(firstParamValue);
        const parsedEnd = IsoDateSchema.safeParse(secondParamValue);

        if (!parsedStart.success) {
          handleZodError(parsedStart.error);
          return {
            period,
            customRange,
          };
        }

        if (!parsedEnd.success) {
          handleZodError(parsedEnd.error);
          return {
            period,
            customRange,
          };
        }

        const validStartFromUrl = parsedStart.data.toLocaleDateString();
        const validEndFromUrl = parsedEnd.data.toLocaleDateString();

        period = "Custom Range";
        customRange = {
          start: validStartFromUrl,
          end: validEndFromUrl,
          periodResolution: getCustomRangePeriodResolution(
            validStartFromUrl,
            validEndFromUrl,
          ),
        };
      }
    }
  }

  return {
    period,
    customRange,
  };
};

export default getPeriodStoreValuesFromURL;
