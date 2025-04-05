import { CodingStatsDefault, CodingStatsDtoType } from "./coding-stats.dto";
import { DayStatsService } from "./day-stats.service";
import { Injectable } from "@nestjs/common";
import { WeekStatsService } from "./week-stats.service";

@Injectable()
export class CodingStatsService {
  constructor(
    private readonly dayStatsService: DayStatsService,
    private readonly weekStatsService: WeekStatsService,
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

  async getTimeSpentOnWeek({ userId, offset = 0 }: CodingStatsDefault) {
    return this.weekStatsService.getTimeSpentOnWeek({ userId, offset });
  }

  async getDaysOfWeekStats({ userId, offset = 0 }: CodingStatsDefault) {
    return this.weekStatsService.getDaysOfWeekStats({ userId, offset });
  }

  async getWeekLanguagesTime({ userId, offset = 0 }: CodingStatsDefault) {
    return this.weekStatsService.getWeekLanguagesTime({ userId, offset });
  }
  async getLanguagesWeekPerDay({ userId, offset = 0 }: CodingStatsDefault) {
    return this.weekStatsService.getLanguagesWeekPerDay({ userId, offset });
  }

  async getGeneralStatsPerWeek({ userId, offset = 0 }: CodingStatsDefault) {
    return this.weekStatsService.getGeneralStatsPerWeek({ userId, offset });
  }
}
