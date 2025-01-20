import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { DailyDataService } from "./daily-data.service";
import { CreateDailyDataDto } from "./dto/create-daily-data.dto";
import { UpdateDailyDataDto } from "./dto/update-daily-datum.dto";

@Controller("daily-data")
export class DailyDataController {
  constructor(private readonly dailyDataService: DailyDataService) {}

  @Post()
  create(@Body() CreateDailyDataDto: CreateDailyDataDto) {
    return this.dailyDataService.create(CreateDailyDataDto);
  }

  @Get()
  findAll() {
    return this.dailyDataService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.dailyDataService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() UpdateDailyDataDto: UpdateDailyDataDto,
  ) {
    return this.dailyDataService.update(+id, UpdateDailyDataDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.dailyDataService.remove(+id);
  }
}
