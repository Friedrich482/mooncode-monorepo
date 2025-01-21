import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from "@nestjs/common";
import { CreateDailyDataDto } from "./dto/create-daily-data.dto";
import { DailyDataService } from "./daily-data.service";
import { ExtendedRequest } from "src/types";
import { UpdateDailyDataDto } from "./dto/update-daily-data.dto";

@Controller("daily-data")
export class DailyDataController {
  constructor(private readonly dailyDataService: DailyDataService) {}

  @Post()
  create(@Body() CreateDailyDataDto: CreateDailyDataDto) {
    return this.dailyDataService.createDailyData(CreateDailyDataDto);
  }

  @Get()
  findAll() {
    return this.dailyDataService.findAll();
  }

  @Get(":id")
  findOne(@Request() req: ExtendedRequest) {
    return this.dailyDataService.findOneDailyData(req.user.sub);
  }

  @Patch(":id")
  update(@Body() updateDailyDataDto: UpdateDailyDataDto) {
    return this.dailyDataService.updateDailyData(updateDailyDataDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dailyDataService.remove(+id);
  }
}
