import { CreateDailyDataDto } from "./create-daily-data.dto";
import { IsString } from "class-validator";

export class UpdateDailyDataDto extends CreateDailyDataDto {
  @IsString()
  readonly date!: string;
}
