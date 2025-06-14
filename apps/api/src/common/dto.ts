import { GroupByEnum } from "@repo/utils/types";
import { INCOHERENT_DATE_RANGE_ERROR_MESSAGE } from "@repo/utils/constants";
import { dateStringDto } from "@repo/utils/schemas";
import getPeriodResolution from "@repo/utils/getPeriodResolution";
import { isAfter } from "date-fns";
import { z } from "zod";

export const BaseSchema = z.object({
  start: dateStringDto,
  end: dateStringDto,
  groupBy: z.enum(GroupByEnum).optional(),
});

export const DatesDto = BaseSchema.refine(
  (input) => !isAfter(input.start, input.end),
  {
    message: INCOHERENT_DATE_RANGE_ERROR_MESSAGE,
  },
)
  //  this prevent the groupBy attribute to be "weeks" for periods like "Last 7 days", "This week" or "Last week"
  .transform((input) => {
    const periodResolution = getPeriodResolution(input.start, input.end);
    if (periodResolution === "day") {
      input.groupBy = "days";
    }
    if (periodResolution === "week" && input.groupBy === "months") {
      input.groupBy = "weeks";
    }
    return { ...input, periodResolution };
  });

export type DatesDtoType = z.infer<typeof DatesDto> & { userId: string };
