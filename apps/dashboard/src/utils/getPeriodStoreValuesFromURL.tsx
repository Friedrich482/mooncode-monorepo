import { GroupBy, PeriodResolution } from "@repo/utils/types";
import { IsoDateSchema, Period, PeriodSchema } from "@/types-schemas";
import { ZodError, z } from "zod";
import { PERIODS } from "@/constants";
import { formatZodError } from "@/utils/formatZodIssues";
import getCustomRangePeriodResolution from "@/utils/getCustomRangePeriodResolution";

type ReturnType = {
  period: Period;
  groupBy: GroupBy;
  customRange: {
    start: string;
    end: string;
    periodResolution: PeriodResolution;
  };
};
export const getPeriodStoreValuesFromURL = (): ReturnType => {
  // Default values
  const defaults: ReturnType = {
    period: "Last 7 days",
    groupBy: "days",
    customRange: {
      start: new Date().toLocaleDateString(),
      end: new Date().toLocaleDateString(),
      periodResolution: "month",
    },
  };

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const periodParam = searchParams.get("period");
    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const groupByParam = searchParams.get("groupBy");

    // Handle groupBy parameter
    let groupBy = defaults.groupBy;
    if (groupByParam) {
      try {
        const groupBySchema = z.enum(["weeks", "months"]);
        groupBy = groupBySchema.parse(groupByParam);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.error(
          `Invalid groupBy parameter: ${groupByParam}. Defaulting to ${defaults.groupBy}`,
        );
      }
    }

    // Handle period-based parameters
    if (periodParam && PERIODS.includes(periodParam as Period)) {
      try {
        const period = PeriodSchema.parse(periodParam);
        return {
          period,
          customRange: defaults.customRange,
          groupBy,
        };
      } catch (error) {
        console.error(
          `${formatZodError(error as ZodError)}. Defaulting to ${defaults.period}`,
        );
        return {
          period: defaults.period,
          customRange: defaults.customRange,
          groupBy,
        };
      }
    }

    // Handle custom range parameters
    if (startParam && endParam) {
      try {
        const parsedStart = IsoDateSchema.parse(startParam);
        const parsedEnd = IsoDateSchema.parse(endParam);

        const validStartFromUrl = parsedStart.toLocaleDateString();
        const validEndFromUrl = parsedEnd.toLocaleDateString();

        return {
          period: "Custom Range",
          customRange: {
            start: validStartFromUrl,
            end: validEndFromUrl,
            periodResolution: getCustomRangePeriodResolution(
              validStartFromUrl,
              validEndFromUrl,
            ),
          },
          groupBy,
        };
      } catch (error) {
        console.error(
          `Invalid date parameters. Defaulting to ${defaults.period}`,
          error,
        );
        return {
          period: defaults.period,
          customRange: defaults.customRange,
          groupBy,
        };
      }
    }

    // Return defaults if no valid parameters were found
    return defaults;
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
    return defaults;
  }
};

export default getPeriodStoreValuesFromURL;
