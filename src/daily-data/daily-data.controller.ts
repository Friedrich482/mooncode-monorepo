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
import { CreateDailyDataDto } from "./dto/create-daily-data.dto";
import { DailyDataService } from "./daily-data.service";
import { ExtendedRequest } from "src/types";
import { FindOneDailyDataDto } from "./dto/findOne-daily-data.dto";
import { UpdateDailyDataDto } from "./dto/update-daily-data.dto";

@Controller("daily-data")
export class DailyDataController {
  constructor(private readonly dailyDataService: DailyDataService) {}

  @Post()
  create(@Body() CreateDailyDataDto: CreateDailyDataDto) {
    return this.dailyDataService.createDailyData(CreateDailyDataDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findOne(
    @Request() req: ExtendedRequest,
    @Body() findOneDailyDataDto: FindOneDailyDataDto,
  ) {
    return this.dailyDataService.findOneDailyData(
      req.user.sub,
      findOneDailyDataDto.date,
    );
  }

  @UseGuards(AuthGuard)
  @Get("all")
  findAll() {
    return this.dailyDataService.findAll();
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
