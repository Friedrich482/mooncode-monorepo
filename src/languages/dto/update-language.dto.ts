import { CreateLanguageDto } from "./create-language.dto";
import { PickType } from "@nestjs/mapped-types";

export class UpdateLanguageDto extends PickType(CreateLanguageDto, [
  "timeSpent",
] as const) {}
