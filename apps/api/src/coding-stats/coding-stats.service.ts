import {
  CodingStatsDefault,
  CodingStatsDtoType,
  WeeklyStatsDtoType,
} from "./coding-stats.dto";
import { CommonMethodsService } from "./common-methods.service";
import { DayStatsService } from "./day-stats.service";
import { Injectable } from "@nestjs/common";
import { WeeklyStatsService } from "./weekly-stats.service";

@Injectable()
export class CodingStatsService {
  constructor(
    private readonly dayStatsService: DayStatsService,
    private readonly weeklyStatsService: WeeklyStatsService,
    private readonly commonMethodsService: CommonMethodsService,
  ) {}
  async getDailyStats({ userId, offset = 0 }: CodingStatsDefault) {
    return this.dayStatsService.getDailyStats({ userId, offset });
  }
  async getDailyStatsForChart({ userId, offset = 0 }: CodingStatsDefault) {
    return this.dayStatsService.getDailyStatsForChart({ userId, offset });
  }

  async upsert({
    id,
    updateCodingStatsDto,
  }: {
    id: string;
    updateCodingStatsDto: CodingStatsDtoType;
  }) {
    return this.dayStatsService.upsert({ id, updateCodingStatsDto });
  }

  async getTimeSpentOnPeriod({ userId, start, end }: WeeklyStatsDtoType) {
    return this.commonMethodsService.getTimeSpentOnPeriod({
      userId,
      start,
      end,
    });
  }

  async getDaysOfWeeklyPeriodStats({ userId, start, end }: WeeklyStatsDtoType) {
    return this.weeklyStatsService.getDaysOfWeeklyPeriodStats({
      userId,
      start,
      end,
    });
  }

  async getWeeklyLanguagesTime({ userId, start, end }: WeeklyStatsDtoType) {
    return this.weeklyStatsService.getWeeklyLanguagesTime({
      userId,
      start,
      end,
    });
  }
  async getWeeklyLanguagesPerDay({ userId, start, end }: WeeklyStatsDtoType) {
    return this.weeklyStatsService.getWeeklyLanguagesPerDay({
      userId,
      start,
      end,
    });
  }

  async getWeeklyGeneralStats({ userId, start, end }: WeeklyStatsDtoType) {
    return this.weeklyStatsService.getWeeklyGeneralStats({
      userId,
      start,
      end,
    });
  }
}
