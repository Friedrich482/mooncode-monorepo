import {
  CodingStatsDefault,
  CodingStatsDtoType,
  PeriodStatsDtoType,
} from "./coding-stats.dto";
import { DayStatsService } from "./day-stats.service";
import { Injectable } from "@nestjs/common";
import { PeriodStatsService } from "./period-stats.service";

@Injectable()
export class CodingStatsService {
  constructor(
    private readonly dayStatsService: DayStatsService,
    private readonly periodStatsService: PeriodStatsService,
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

  async getTimeSpentOnPeriod({ userId, start, end }: PeriodStatsDtoType) {
    return this.periodStatsService.getTimeSpentOnPeriod({
      userId,
      start,
      end,
    });
  }

  async getDaysOfPeriodStats({ userId, start, end }: PeriodStatsDtoType) {
    return this.periodStatsService.getDaysOfPeriodStats({
      userId,
      start,
      end,
    });
  }

  async getPeriodLanguagesTime({ userId, start, end }: PeriodStatsDtoType) {
    return this.periodStatsService.getPeriodLanguagesTime({
      userId,
      start,
      end,
    });
  }
  async getPeriodLanguagesPerDay({ userId, start, end }: PeriodStatsDtoType) {
    return this.periodStatsService.getPeriodLanguagesPerDay({
      userId,
      start,
      end,
    });
  }

  async getPeriodGeneralStats({ userId, start, end }: PeriodStatsDtoType) {
    return this.periodStatsService.getPeriodGeneralStats({
      userId,
      start,
      end,
    });
  }
}
