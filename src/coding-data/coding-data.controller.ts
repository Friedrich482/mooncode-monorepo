import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CodingDataDto } from "./dto/coding-data.dto";
import { CodingDataService } from "./coding-data.service";
import { ExtendedRequest } from "src/types";

@Controller("coding-data")
export class CodingDataController {
  constructor(private readonly codingDataService: CodingDataService) {}

  @Post()
  @UseGuards(AuthGuard)
  upsert(
    @Body() updateCodingDataDto: CodingDataDto,
    @Request() req: ExtendedRequest,
  ) {
    return this.codingDataService.upsert(req.user.sub, updateCodingDataDto);
  }

  @Get()
  findAll() {
    return this.codingDataService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.codingDataService.findOne(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.codingDataService.remove(+id);
  }
}
