import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CodingDataService } from "./coding-data.service";
import { CreateCodingDataDto } from "./dto/create-coding-data.dto";
import { ExtendedRequest } from "src/types";
import { UpdateCodingDatumDto } from "./dto/update-coding-data.dto";

@Controller("coding-data")
export class CodingDataController {
  constructor(private readonly codingDataService: CodingDataService) {}

  @Post("create")
  @UseGuards(AuthGuard)
  create(
    @Body() CreateCodingDataDto: CreateCodingDataDto,
    @Request() req: ExtendedRequest,
  ) {
    return this.codingDataService.create(req.user.sub, CreateCodingDataDto);
  }

  @Get()
  findAll() {
    return this.codingDataService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.codingDataService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateCodingDatumDto: UpdateCodingDatumDto,
  ) {
    return this.codingDataService.update(+id, updateCodingDatumDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.codingDataService.remove(+id);
  }
}
