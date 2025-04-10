import {
  DayStatsDtoType,
  PeriodStatsDtoType,
  UpsertLanguagesDtoType,
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
  async getDailyStatsForExtension({ userId, dateString }: DayStatsDtoType) {
    return this.dayStatsService.getDailyStatsForExtension({
      userId,
      dateString,
    });
  }
  async getDailyStatsForChart({ userId, dateString }: DayStatsDtoType) {
    return this.dayStatsService.getDailyStatsForChart({ userId, dateString });
  }

  async upsert({
    id,
    updateUpsertLanguagesDto,
  }: {
    id: string;
    updateUpsertLanguagesDto: UpsertLanguagesDtoType;
  }) {
    return this.dayStatsService.upsert({ id, updateUpsertLanguagesDto });
  }

  async getTimeSpentOnPeriod({ userId, start, end }: PeriodStatsDtoType) {
    return this.periodStatsService.getTimeSpentOnPeriod({
      userId,
      start,
      end,
    });
  }

  async getDaysOfPeriodStats({
    userId,
    start,
    end,
    groupBy,
    periodResolution,
  }: PeriodStatsDtoType) {
    return this.periodStatsService.getDaysOfPeriodStats({
      userId,
      start,
      end,
      groupBy,
      periodResolution,
    });
  }

  async getPeriodLanguagesTime({ userId, start, end }: PeriodStatsDtoType) {
    return this.periodStatsService.getPeriodLanguagesTime({
      userId,
      start,
      end,
    });
  }
  async getPeriodLanguagesPerDay({
    userId,
    start,
    end,
    groupBy,
    periodResolution,
  }: PeriodStatsDtoType) {
    return this.periodStatsService.getPeriodLanguagesPerDay({
      userId,
      start,
      end,
      groupBy,
      periodResolution,
    });
  }

  async getPeriodGeneralStats({
    userId,
    start,
    end,
    groupBy,
    periodResolution,
  }: PeriodStatsDtoType) {
    return this.periodStatsService.getPeriodGeneralStats({
      userId,
      start,
      end,
      groupBy,
      periodResolution,
    });
  }
}
