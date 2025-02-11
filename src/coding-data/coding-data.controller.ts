import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { CodingDataDto } from "./dto/coding-data.dto";
import { CodingDataService } from "./coding-data.service";
import { ExtendedRequest } from "src/types";
import { TimeOffsetDto } from "./dto/time-offset-dto";

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

  @UseGuards(AuthGuard)
  @Get("daily")
  findDaily(@Request() req: ExtendedRequest, @Query() query: TimeOffsetDto) {
    return this.codingDataService.findDaily(req.user.sub, query.offset);
  }

  @UseGuards(AuthGuard)
  @Get("weekly")
  findWeekly(@Request() req: ExtendedRequest, @Query() query: TimeOffsetDto) {
    return this.codingDataService.findWeekly(req.user.sub, query.offset);
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
