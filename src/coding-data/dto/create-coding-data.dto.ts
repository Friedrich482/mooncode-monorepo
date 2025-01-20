import { IsNotEmpty, IsNumber, IsObject } from "class-validator";
import { codingData } from "src/types";

export class CreateCodingDataDto implements codingData {
  @IsNotEmpty()
  @IsNumber()
  readonly timeSpentToday!: number;

  @IsObject()
  readonly timeSpentPerLanguage!: Record<string, number>;
}
