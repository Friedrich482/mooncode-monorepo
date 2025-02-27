import { IsInt, IsOptional, Min } from "class-validator";
import { Type } from "class-transformer";

export class TimeOffsetDto {
  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(0)
  offset = 0;
}
