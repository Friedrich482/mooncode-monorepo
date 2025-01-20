import { IsNumber, IsString } from "class-validator";
import { Language } from "src/drizzle/schema/languages";

export class CreateLanguageDto
  implements Pick<Language, "dailyDataId" | "languageName" | "timeSpent">
{
  @IsNumber()
  readonly dailyDataId!: number;

  @IsNumber()
  readonly timeSpent!: number;

  @IsString()
  readonly languageName!: string;
}
