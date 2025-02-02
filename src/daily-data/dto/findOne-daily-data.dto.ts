import { DailyData } from "src/drizzle/schema/dailyData";
import { IsDateString } from "class-validator";

export class FindOneDailyDataDto implements Pick<DailyData, "date"> {
  @IsDateString()
  readonly date!: string;
}
