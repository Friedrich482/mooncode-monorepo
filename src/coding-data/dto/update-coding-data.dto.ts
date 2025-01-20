import { CreateCodingDataDto } from "./create-coding-data.dto";
import { PartialType } from "@nestjs/mapped-types";

export class UpdateCodingDatumDto extends PartialType(CreateCodingDataDto) {}
