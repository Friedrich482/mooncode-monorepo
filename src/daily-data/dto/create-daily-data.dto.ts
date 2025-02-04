import { DailyData } from "src/drizzle/schema/dailyData";
import { IsNumber } from "class-validator";

export class CreateDailyDataDto
  implements Pick<DailyData, "userId" | "timeSpent">
{
  @IsNumber()
  readonly userId!: string;

  @IsNumber()
  readonly timeSpent!: number;
}
